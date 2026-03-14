import { adminApi } from "@/lib/api";

export default async function AdminOverviewPage() {
  const stats = await adminApi.stats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Cross-user system statistics</p>
      </div>

      {/* Row 1: Main KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{stats.activeUsers}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Gems</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{stats.totalGems}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Parcels</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{stats.totalParcels}</p>
        </div>
      </div>

      {/* Row 2: Secondary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">New This Month</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{stats.newUsersThisMonth}</p>
          <p className="mt-1 text-xs text-slate-400">{stats.deletedUsers} deactivated</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active Scan Links</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{stats.activePublicTokens}</p>
          <p className="mt-1 text-xs text-slate-400">{stats.totalPublicTokens} total</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Photos &amp; Certs</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{stats.totalPhotos + stats.totalCertificates}</p>
          <p className="mt-1 text-xs text-slate-400">{stats.totalPhotos} photos · {stats.totalCertificates} certs</p>
        </div>
      </div>

      {/* Row 3: Role breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-700">Role Breakdown</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="text-slate-500">Admin: <strong className="text-slate-800">{stats.adminCount}</strong></span>
          <span className="text-slate-500">Business: <strong className="text-slate-800">{stats.businessCount}</strong></span>
          <span className="text-slate-500">Collector: <strong className="text-slate-800">{stats.collectorCount}</strong></span>
        </div>
      </div>

      {/* Row 4: Recent registrations */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-semibold text-slate-700">Recent Registrations</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentUsers.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 text-slate-700">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.role === "Admin" ? "bg-violet-100 text-violet-700" :
                    u.role === "Business" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400">
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
