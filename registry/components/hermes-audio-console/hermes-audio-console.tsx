"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useHermesSpeak, useHermesVoices } from "@/hooks/use-hermes";

export function HermesAudioConsole({ profile }: { profile?: string }) {
  const voices = useHermesVoices(profile);
  const speak = useHermesSpeak();
  const [text, setText] = useState("Hello from Hermes.");
  const audio = speak.data;
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Volume2 className="size-4" />Audio</CardTitle><p className="mt-1 text-sm text-muted-foreground">Native Hermes text-to-speech and ElevenLabs voice availability.</p></CardHeader><CardContent className="space-y-4">{voices.isPending ? <Skeleton className="h-12 w-full" /> : voices.data ? <div className="flex flex-wrap gap-2"><Badge variant={voices.data.available ? "secondary" : "outline"}>{voices.data.available ? "ElevenLabs available" : "ElevenLabs unavailable"}</Badge><Badge variant="outline">{voices.data.voices.length} voices</Badge></div> : null}<Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to speak…" /><Button disabled={!text.trim() || speak.isPending} onClick={() => speak.mutate({ text: text.trim(), ...(profile ? { profile } : {}) })}>{speak.isPending ? "Generating…" : "Speak"}</Button>{speak.error ? <p className="text-sm text-destructive">{speak.error.message}</p> : null}{audio?.data_url ? <audio className="w-full" controls src={audio.data_url}>Audio playback is not supported by this browser.</audio> : null}</CardContent></Card>;
}
