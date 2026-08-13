import type { WorkflowDocument } from "@burner-io/workflow";

/**
 * A representative app-owned workflow. Hermes is only one executable node kind.
 * The entry node receives the workflow input directly, so a caller can start the
 * graph with a plain request string/object without inventing a separate target.
 */
export const sampleWorkflow: WorkflowDocument = {
  workflow: {
    id: "request-orchestration",
    version: "1.0.0",
    name: "Request orchestration",
    description: "Start with Hermes, fan out to an API and another Hermes profile, then gate completion.",
    entryNodeIds: ["discussion"],
    nodes: [
      {
        id: "discussion",
        type: "hermes.run",
        name: "Discussion",
        description: "Default Hermes run. Receives the workflow input directly.",
        config: {
          instructions: "Understand the request, clarify the objective internally, and produce a precise handoff.",
          streamEvents: true,
        },
      },
      {
        id: "metadata-api",
        type: "http.request",
        name: "Metadata API",
        description: "Pure functional/API step that can run in parallel.",
        config: {
          method: "POST",
          url: "/api/workflow/metadata",
          body: {
            request: { $from: "nodes.discussion.output.output", $required: true },
          },
        },
      },
      {
        id: "specialist",
        type: "hermes.run",
        name: "Specialist",
        description: "Delegates the handoff to another registered Hermes API Server connection.",
        config: {
          connection: "specialist",
          instructions: "Take the handoff and perform the specialist analysis. Return an actionable result.",
          streamEvents: true,
        },
      },
      {
        id: "quality-gate",
        type: "condition",
        name: "Quality gate",
        description: "Routes the graph through explicit true/false handles.",
        config: {
          predicate: {
            op: "equals",
            left: { $from: "nodes.specialist.output.status" },
            right: "completed",
          },
        },
      },
      {
        id: "approval",
        type: "human",
        name: "Human approval",
        description: "Persists a waiting state that the application can render and resume later.",
        input: {
          specialist: { $from: "nodes.specialist.output" },
          metadata: { $from: "nodes.metadata-api.output" },
        },
        config: {
          mode: "approval",
          prompt: "Approve the assembled result?",
          schema: {
            type: "object",
            properties: { approved: { type: "boolean" } },
            required: ["approved"],
          },
        },
      },
      {
        id: "complete",
        type: "output",
        name: "Complete",
        description: "Successful terminal output.",
        config: {},
      },
      {
        id: "rejected",
        type: "transform",
        name: "Needs review",
        description: "Fallback terminal result for the false path.",
        config: {
          value: {
            status: "needs-review",
            specialist: { $from: "nodes.specialist.output" },
            metadata: { $from: "nodes.metadata-api.output" },
          },
        },
      },
    ],
    edges: [
      {
        id: "discussion-metadata",
        source: "discussion",
        target: "metadata-api",
        map: { request: { $from: "nodes.discussion.output.output" } },
      },
      {
        id: "discussion-specialist",
        source: "discussion",
        target: "specialist",
        map: { $from: "nodes.discussion.output.output", $required: true },
      },
      { id: "metadata-quality", source: "metadata-api", target: "quality-gate", targetHandle: "metadata" },
      { id: "specialist-quality", source: "specialist", target: "quality-gate", targetHandle: "specialist" },
      { id: "quality-approve", source: "quality-gate", target: "approval", sourceHandle: "true" },
      { id: "quality-reject", source: "quality-gate", target: "rejected", sourceHandle: "false" },
      {
        id: "approval-complete",
        source: "approval",
        target: "complete",
        map: {
          approval: { $from: "nodes.approval.output" },
          specialist: { $from: "nodes.specialist.output" },
          metadata: { $from: "nodes.metadata-api.output" },
        },
      },
    ],
  },
  layout: {
    positions: {
      discussion: { x: 0, y: 120 },
      "metadata-api": { x: 430, y: -40 },
      specialist: { x: 430, y: 280 },
      "quality-gate": { x: 880, y: 120 },
      approval: { x: 1300, y: 20 },
      rejected: { x: 1300, y: 320 },
      complete: { x: 1720, y: 20 },
    },
  },
};
