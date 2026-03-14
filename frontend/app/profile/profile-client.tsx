"use client";

import { useActionState, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileDto, ProfileSessionDto } from "@/lib/types";
import {
  updateDisplayName,
  changeEmail,
  changePassword,
  revokeMySession,
  deleteAccount,
} from "@/lib/profile-actions";

interface Props {
  profile: ProfileDto;
  sessions: ProfileSessionDto[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function roleBadgeClass(role: string) {
  if (role === "Admin") return "bg-violet-100 text-violet-700 border-violet-200";
  if (role === "Business") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-zinc-100 text-zinc-600 border-zinc-200";
}

export default function ProfileClient({ profile, sessions }: Props) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-0.5 text-sm text-zinc-500">Manage your account settings and security</p>
      </div>

      <AccountOverviewCard profile={profile} />
      <DisplayNameCard currentDisplayName={profile.displayName} />
      <ChangeEmailCard />
      <ChangePasswordCard />
      <ActiveSessionsCard sessions={sessions} />
      <DangerZoneCard />
    </div>
  );
}

function AccountOverviewCard({ profile }: { profile: ProfileDto }) {
  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Account Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Email</p>
            <p className="text-zinc-800 font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Role</p>
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${roleBadgeClass(profile.role)}`}>
              {profile.role}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Member Since</p>
            <p className="text-zinc-700">{formatDate(profile.joinedAt)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Display Name</p>
            <p className="text-zinc-700">
              {profile.displayName ? profile.displayName : <span className="text-zinc-400 italic">Not set</span>}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Gems</p>
            <p className="text-zinc-700 font-medium">{profile.gemCount}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Parcels</p>
            <p className="text-zinc-700 font-medium">{profile.parcelCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DisplayNameCard({ currentDisplayName }: { currentDisplayName: string | null }) {
  const [state, action, isPending] = useActionState(updateDisplayName, { error: null });

  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Display Name</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={currentDisplayName ?? ""}
              placeholder="Your name (optional)"
              maxLength={100}
              className="border-zinc-200"
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <div>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangeEmailCard() {
  const [state, action, isPending] = useActionState(changeEmail, { error: null });

  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Change Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="newEmail">New email address</Label>
            <Input
              id="newEmail"
              name="newEmail"
              type="email"
              placeholder="new@example.com"
              required
              className="border-zinc-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emailCurrentPassword">Current password</Label>
            <Input
              id="emailCurrentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              required
              className="border-zinc-200"
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <p className="text-xs text-zinc-400">You will be signed out after changing your email.</p>
          <div>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Updating…" : "Update Email"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const [submitCount, setSubmitCount] = useState(0);
  const [state, action, isPending] = useActionState(changePassword, { error: null });
  const showSuccess = submitCount > 0 && state.error === null && !isPending;

  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={action}
          onSubmit={() => setSubmitCount((c) => c + 1)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              required
              className="border-zinc-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              required
              className="border-zinc-200"
            />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          {showSuccess && <p className="text-sm text-green-600">Password changed successfully.</p>}
          <div>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Changing…" : "Change Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ActiveSessionsCard({ sessions }: { sessions: ProfileSessionDto[] }) {
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleRevoke(id: string) {
    setRevoking(id);
    setError(null);
    startTransition(async () => {
      const result = await revokeMySession(id);
      if (result.error) setError(result.error);
      setRevoking(null);
    });
  }

  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Active Sessions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {error && <p className="px-6 py-3 text-sm text-destructive">{error}</p>}
        {sessions.length === 0 ? (
          <p className="px-6 py-4 text-sm text-zinc-400">No active sessions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                <th className="px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Created</th>
                <th className="px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Expires</th>
                <th className="px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Status</th>
                <th className="px-6 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-3 text-zinc-600">{formatDate(s.createdAt)}</td>
                  <td className="px-6 py-3 text-zinc-600">{formatDate(s.expiresAt)}</td>
                  <td className="px-6 py-3">
                    {s.isExpired ? (
                      <span className="inline-flex items-center rounded-md border border-zinc-200 px-2 py-0.5 text-xs font-medium bg-zinc-100 text-zinc-500">
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md border border-green-200 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevoke(s.id)}
                      disabled={revoking === s.id}
                    >
                      {revoking === s.id ? "Revoking…" : "Revoke"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

function DangerZoneCard() {
  const [state, action, isPending] = useActionState(deleteAccount, { error: null });
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Card className="border-red-200/80 bg-red-50/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-red-600 uppercase tracking-wide">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        {!confirmed ? (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm" onClick={() => setConfirmed(true)}>
              Delete My Account
            </Button>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-4">
            <p className="text-sm font-medium text-red-700">
              Are you sure? Enter your password to confirm permanent deletion.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="deletePassword">Current password</Label>
              <Input
                id="deletePassword"
                name="currentPassword"
                type="password"
                placeholder="Enter password to confirm"
                required
                className="border-red-200"
              />
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setConfirmed(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
                {isPending ? "Deleting…" : "Confirm Delete"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
