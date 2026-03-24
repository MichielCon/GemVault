import { adminApi } from "@/lib/api";

export default async function AdminOverviewPage() {
  const stats = await adminApi.stats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cross-user system statistics</p>
      </div>

      {/* Row 1: Main KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.activeUsers}</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Gems</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalGems}</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Parcels</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalParcels}</p>
        </div>
      </div>

      {/* Row 2: Secondary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">New This Month</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.newUsersThisMonth}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stats.deletedUsers} deactivated</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active Scan Links</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.activePublicTokens}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stats.totalPublicTokens} total</p>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Photos &amp; Certs</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalPhotos + stats.totalCertificates}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stats.totalPhotos} photos · {stats.totalCertificates} certs</p>
        </div>
      </div>

      {/* Row 3: Role breakdown */}
      <div className="rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="mb-3 text-sm font-semibold">Role Breakdown</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="text-muted-foreground">Admin: <strong className="text-foreground">{stats.adminCount}</strong></span>
          <span className="text-muted-foreground">Business: <strong className="text-foreground">{stats.businessCount}</strong></span>
          <span className="text-muted-foreground">Collector: <strong className="text-foreground">{stats.collectorCount}</strong></span>
        </div>
      </div>

      {/* Row 4: Recent registrations */}
      <div className="rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="border-b border-zinc-100 px-5 py-4">
          <p className="text-sm font-semibold">Recent Registrations</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {stats.recentUsers.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50">
                <td className="px-5 py-3 text-foreground">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.role === "Admin" ? "bg-violet-100 text-violet-700" :
                    u.role === "Business" ? "bg-blue-100 text-blue-700" :
                    "bg-zinc-100 text-zinc-600"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
