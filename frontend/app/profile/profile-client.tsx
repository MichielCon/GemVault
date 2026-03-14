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
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function ProfileClient({ profile, sessions }: Props) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account settings and security</p>
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
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Email</p>
            <p className="text-slate-800 font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Role</p>
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${roleBadgeClass(profile.role)}`}>
              {profile.role}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Member Since</p>
            <p className="text-slate-700">{formatDate(profile.joinedAt)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Display Name</p>
            <p className="text-slate-700">
              {profile.displayName ? profile.displayName : <span className="text-slate-400 italic">Not set</span>}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Gems</p>
            <p className="text-slate-700">{profile.gemCount}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Parcels</p>
            <p className="text-slate-700">{profile.parcelCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DisplayNameCard({ currentDisplayName }: { currentDisplayName: string | null }) {
  const [state, action, isPending] = useActionState(updateDisplayName, { error: null });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Name</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
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
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <p className="text-xs text-slate-500">
            You will be signed out after changing your email.
          </p>
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
  // Use a submission counter to track whether the form has ever been submitted.
  // After a successful submit (no error), we show a success message.
  const [submitCount, setSubmitCount] = useState(0);
  const [state, action, isPending] = useActionState(changePassword, { error: null });

  const showSuccess = submitCount > 0 && state.error === null && !isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
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
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {showSuccess && (
            <p className="text-sm text-green-600">Password changed successfully.</p>
          )}
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
      if (result.error) {
        setError(result.error);
      }
      setRevoking(null);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <p className="px-6 py-3 text-sm text-destructive">{error}</p>
        )}
        {sessions.length === 0 ? (
          <p className="px-6 py-4 text-sm text-slate-500">No active sessions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Created</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Expires</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3 text-slate-600">{formatDate(s.createdAt)}</td>
                  <td className="px-6 py-3 text-slate-600">{formatDate(s.expiresAt)}</td>
                  <td className="px-6 py-3">
                    {s.isExpired ? (
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 border-slate-200">
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border-green-200">
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
    <Card className="border-red-200 bg-red-50/40">
      <CardHeader>
        <CardTitle className="text-red-700">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        {!confirmed ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmed(true)}
            >
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
              />
            </div>
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmed(false)}
              >
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
