"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useHermesProfiles,
  useSetHermesProfile,
} from "@/hooks/use-hermes";

export function HermesProfileSwitcher() {
  const profiles = useHermesProfiles();
  const setActive = useSetHermesProfile();

  if (profiles.isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (profiles.error || !profiles.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profiles</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-destructive">
          Unable to load Hermes profiles.
        </CardContent>
      </Card>
    );
  }

  const data = profiles.data;
  const active = data.profiles.find(
    (profile) => profile.name === data.active,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">Profile</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Native Hermes profile
          </p>
        </div>
        {active?.is_default ? <Badge variant="secondary">default</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <Select
          value={data.active}
          disabled={setActive.isPending}
          onValueChange={(name) => setActive.mutate(name)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a profile" />
          </SelectTrigger>
          <SelectContent>
            {data.profiles.map((profile) => (
              <SelectItem key={profile.name} value={profile.name}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{active?.provider ?? "provider: inherited"}</span>
          <span>·</span>
          <span>{active?.model ?? "model: inherited"}</span>
          <span>·</span>
          <span>{active?.skill_count ?? 0} skills</span>
        </div>
      </CardContent>
    </Card>
  );
}
