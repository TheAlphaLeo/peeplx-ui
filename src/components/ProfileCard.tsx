import * as React from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";
import type { ProfileCardData } from "../types";

export interface ProfileCardProps {
  profile: ProfileCardData;
  onPay?: (username: string) => void;
  onViewProfile?: (username: string) => void;
}

export function ProfileCard({ profile, onPay, onViewProfile }: ProfileCardProps) {
  return (
    <Card className="max-w-md overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc,#eef2ff)]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle>{profile.displayName}</CardTitle>
            <p className="truncate text-sm text-slate-500">@{profile.username}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="success">{profile.trustScore.badge}</Badge>
              {profile.isVerified ? <Badge variant="outline">Verified</Badge> : null}
              {profile.isBusinessAccount ? <Badge variant="secondary">Business</Badge> : null}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {profile.bio ? <p className="text-sm leading-6 text-slate-600">{profile.bio}</p> : null}
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Trust" value={String(profile.trustScore.overall)} />
          <Metric label="Buyer" value={String(profile.stats.asBuyer)} />
          <Metric label="Seller" value={String(profile.stats.asSeller)} />
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Joined {new Date(profile.joinedAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="flex-1" onClick={() => onPay?.(profile.username)}>
          Pay @{profile.username}
        </Button>
        <Button className="flex-1" variant="outline" onClick={() => onViewProfile?.(profile.username)}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 text-center">
      <div className="text-lg font-semibold text-slate-900">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

