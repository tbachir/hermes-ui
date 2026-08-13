"use client";

import "@xyflow/react/dist/style.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Handle,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection as ReactFlowConnection,
  type Edge as ReactFlowEdge,
  type Node as ReactFlowNode,
  type NodeProps,
} from "@xyflow/react";

import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Edge } from "@/components/ai-elements/edge";
import {
  Node as WorkflowCard,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Panel } from "@/components/ai-elements/panel";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type {
  WorkflowDocument,
  WorkflowNode,
  WorkflowRun,
} from "@burner-io/workflow";
import {
  applyReactFlowLayout,
  workflowEdgeFromConnection,
  workflowToReactFlow,
  type WorkflowReactFlowNodeData,
} from "@burner-io/workflow/react-flow";

import { sampleWorkflow } from "@/lib/hermes/sample-workflow";

type EditorNodeData = WorkflowReactFlowNodeData & {
  onDelete?: (id: string) => void;
} & Record<string, unknown>;

type EditorNode = ReactFlowNode<EditorNodeData, "workflow">;
type EditorEdge = ReactFlowEdge<{
  workflowEdgeId: string;
  on: "success" | "error" | "always";
  runtime?: unknown;
}>;

function routeHandles(node: WorkflowNode): string[] {
  if (node.type === "condition") return ["true", "false"];
  if (node.type !== "router") return [];
  const values = node.config.routes.map((route) => route.handle);
  if (node.config.fallbackHandle && !values.includes(node.config.fallbackHandle)) {
    values.push(node.config.fallbackHandle);
  }
  return values;
}

function nodeSummary(node: WorkflowNode): string {
  switch (node.type) {
    case "hermes.run":
      return `Hermes Run · ${node.config.connection ?? "default connection"}`;
    case "http.request":
      return `${node.config.method ?? "GET"} · ${typeof node.config.url === "string" ? node.config.url : "bound URL"}`;
    case "function":
      return `Action · ${node.config.action}`;
    case "human":
      return `Human · ${node.config.mode ?? "input"}`;
    case "condition":
      return "Routes through true / false";
    case "router":
      return `Router · ${node.config.mode ?? "first"} match`;
    case "subworkflow":
      return `Subworkflow · ${node.config.workflowId}`;
    default:
      return node.type;
  }
}

function WorkflowNodeCard({ id, data, selected }: NodeProps<EditorNode>) {
  const handles = routeHandles(data.workflowNode);
  const runtimeStatus = data.runtime?.status ?? "idle";

  return (
    <>
      <Toolbar isVisible={selected}>
        <Button size="sm" variant="destructive" onClick={() => data.onDelete?.(id)}>
          Delete
        </Button>
      </Toolbar>
      <WorkflowCard
        className="min-w-72"
        handles={{
          target: data.handles.target,
          source: data.handles.source && handles.length === 0,
        }}
      >
        <NodeHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <NodeTitle>{data.label}</NodeTitle>
              {data.description ? <NodeDescription>{data.description}</NodeDescription> : null}
            </div>
            <Badge variant="secondary">{data.kind}</Badge>
          </div>
        </NodeHeader>
        <NodeContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{nodeSummary(data.workflowNode)}</p>
          {handles.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {handles.map((handle) => (
                <Badge key={handle} variant="outline">{handle}</Badge>
              ))}
            </div>
          ) : null}
        </NodeContent>
        <NodeFooter className="justify-between">
          <span className="text-xs text-muted-foreground">{runtimeStatus}</span>
          {data.runtime?.attempts ? (
            <span className="text-xs text-muted-foreground">attempt {data.runtime.attempts}</span>
          ) : null}
        </NodeFooter>
      </WorkflowCard>

      {handles.map((handle, index) => (
        <Handle
          id={handle}
          key={handle}
          type="source"
          position={Position.Right}
          style={{ top: `${((index + 1) / (handles.length + 1)) * 100}%` }}
        />
      ))}
    </>
  );
}

const nodeTypes = { workflow: WorkflowNodeCard };
const edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary };

function defaultNode(type: WorkflowNode["type"], id: string): WorkflowNode {
  switch (type) {
    case "hermes.run":
      return { id, type, name: "Hermes run", config: { streamEvents: true } };
    case "http.request":
      return { id, type, name: "HTTP request", config: { method: "GET", url: "/api/example" } };
    case "condition":
      return { id, type, name: "Condition", config: { predicate: { op: "truthy", value: { $from: "input" } } } };
    case "human":
      return { id, type, name: "Human gate", config: { mode: "approval", prompt: "Approve?" } };
    case "transform":
      return { id, type, name: "Transform", config: { value: { $from: "incoming" } } };
    case "function":
      return { id, type, name: "Function", config: { action: "my-action" } };
    case "router":
      return { id, type, name: "Router", config: { routes: [], mode: "first", fallbackHandle: "default" } };
    case "subworkflow":
      return { id, type, name: "Subworkflow", config: { workflowId: "another-workflow" } };
    case "output":
      return { id, type, name: "Output", config: {} };
    case "input":
      return { id, type, name: "Input", config: {} };
  }
}

export interface WorkflowBuilderProps {
  initialDocument?: WorkflowDocument;
  run?: WorkflowRun;
  onChange?: (document: WorkflowDocument) => void;
  onRun?: (document: WorkflowDocument) => void | Promise<void>;
}

export function WorkflowBuilder({
  initialDocument = sampleWorkflow,
  run,
  onChange,
  onRun,
}: WorkflowBuilderProps) {
  const [document, setDocument] = useState<WorkflowDocument>(initialDocument);
  const initialFlow = useMemo(
    () => workflowToReactFlow(initialDocument.workflow, { ...(initialDocument.layout ? { layout: initialDocument.layout } : {}), ...(run ? { run } : {}) }),
    // `initialDocument` is intentionally an initializer. App-level controlled state can wrap this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState<EditorNode>(initialFlow.nodes as EditorNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EditorEdge>(initialFlow.edges as EditorEdge[]);

  const commit = useCallback((next: WorkflowDocument) => {
    setDocument(next);
    onChange?.(next);
  }, [onChange]);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((current) => current.filter((node) => node.id !== nodeId));
    setEdges((current) => current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setDocument((current) => {
      const positions = { ...(current.layout?.positions ?? {}) };
      delete positions[nodeId];
      const next: WorkflowDocument = {
        workflow: {
          ...current.workflow,
          nodes: current.workflow.nodes.filter((node) => node.id !== nodeId),
          edges: current.workflow.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
          ...(current.workflow.entryNodeIds
            ? { entryNodeIds: current.workflow.entryNodeIds.filter((id) => id !== nodeId) }
            : {}),
        },
        layout: { ...(current.layout ?? { positions: {} }), positions },
      };
      onChange?.(next);
      return next;
    });
  }, [onChange, setEdges, setNodes]);

  useEffect(() => {
    const flow = workflowToReactFlow(document.workflow, { ...(document.layout ? { layout: document.layout } : {}), ...(run ? { run } : {}) });
    setNodes(flow.nodes.map((node) => ({
      ...node,
      data: { ...node.data, onDelete: removeNode },
    })) as EditorNode[]);
    setEdges(flow.edges as EditorEdge[]);
  }, [document, removeNode, run, setEdges, setNodes]);

  const onConnect = useCallback((connection: ReactFlowConnection) => {
    const id = `edge_${crypto.randomUUID()}`;
    const workflowEdge = workflowEdgeFromConnection(connection, id);
    setEdges((current) => addEdge({
      ...workflowEdge,
      type: "temporary",
      data: { workflowEdgeId: id, on: "success" },
    }, current));
    setDocument((current) => {
      const next = {
        ...current,
        workflow: { ...current.workflow, edges: [...current.workflow.edges, workflowEdge] },
      };
      onChange?.(next);
      return next;
    });
  }, [onChange, setEdges]);

  const addNode = useCallback((type: WorkflowNode["type"]) => {
    const id = `${type.replaceAll(".", "-")}_${crypto.randomUUID().slice(0, 8)}`;
    setDocument((current) => {
      const index = current.workflow.nodes.length;
      const next: WorkflowDocument = {
        workflow: {
          ...current.workflow,
          nodes: [...current.workflow.nodes, defaultNode(type, id)],
        },
        layout: {
          ...(current.layout ?? { positions: {} }),
          positions: {
            ...(current.layout?.positions ?? {}),
            [id]: { x: 240 + (index % 4) * 360, y: 560 + Math.floor(index / 4) * 220 },
          },
        },
      };
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  return (
    <div className="h-[760px] w-full overflow-hidden rounded-xl border bg-background">
      <Canvas
        connectionLineComponent={Connection}
        edges={edges}
        edgeTypes={edgeTypes}
        fitView
        nodes={nodes}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onNodeDragStop={(_, movedNode) => {
          const positioned = nodes.map((node) => (
            node.id === movedNode.id ? { ...node, position: movedNode.position } : node
          ));
          commit(applyReactFlowLayout(document, positioned));
        }}
      >
        <Panel position="top-left" className="gap-2">
          <Button size="sm" variant="outline" onClick={() => addNode("hermes.run")}>+ Hermes</Button>
          <Button size="sm" variant="outline" onClick={() => addNode("http.request")}>+ API</Button>
          <Button size="sm" variant="outline" onClick={() => addNode("condition")}>+ Condition</Button>
          <Button size="sm" variant="outline" onClick={() => addNode("human")}>+ Human</Button>
          <Button size="sm" variant="outline" onClick={() => addNode("function")}>+ Function</Button>
        </Panel>
        <Panel position="top-right" className="gap-2">
          <Badge variant="outline">{document.workflow.nodes.length} nodes</Badge>
          {onRun ? (
            <Button size="sm" onClick={() => void onRun(document)}>Run workflow</Button>
          ) : null}
        </Panel>
      </Canvas>
    </div>
  );
}
