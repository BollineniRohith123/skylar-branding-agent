import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';

interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
  blockedUsers: number;
  totalImages: number;
  todayUsers: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    pendingUsers: 0,
    blockedUsers: 0,
    totalImages: 0,
    todayUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users data
      const usersResponse = await fetch('/api/admin/users');
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();
      const users = usersData.users || [];

      // Calculate stats
      const verified = users.filter((u: any) => u.is_verified || u.status === 'verified').length;
      const pending = users.filter((u: any) => !u.is_verified && u.status === 'pending').length;
      const blocked = users.filter((u: any) => u.status === 'blocked').length;

      // Get today's users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayUsers = users.filter((u: any) => {
        const createdAt = new Date(u.created_at);
        return createdAt >= today;
      }).length;

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard-stats');
      let totalImages = 0;
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        totalImages = statsData.totalImages || 0;
      }

      setStats({
        totalUsers: users.length,
        verifiedUsers: verified,
        pendingUsers: pending,
        blockedUsers: blocked,
        totalImages,
        todayUsers,
      });

      // Get recent 5 users
      setRecentUsers(users.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified || status === 'verified') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">Verified</span>;
    }
    if (status === 'blocked') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">Blocked</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">Pending</span>;
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {localStorage.getItem('adminEmail') || 'Admin'}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Users */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</p>
                  </div>
                  <div className="p-3 bg-indigo-500/30 rounded-lg">
                    <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Verified Users */}
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Verified Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.verifiedUsers}</p>
                  </div>
                  <div className="p-3 bg-green-500/30 rounded-lg">
                    <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pending Users */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Pending Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.pendingUsers}</p>
                  </div>
                  <div className="p-3 bg-yellow-500/30 rounded-lg">
                    <svg className="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Images */}
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Images</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalImages}</p>
                  </div>
                  <div className="p-3 bg-purple-500/30 rounded-lg">
                    <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Today's Users */}
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Today's Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.todayUsers}</p>
                  </div>
                  <div className="p-3 bg-blue-500/30 rounded-lg">
                    <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Blocked Users */}
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Blocked Users</p>
                    <p className="text-4xl font-bold text-white mt-2">{stats.blockedUsers}</p>
                  </div>
                  <div className="p-3 bg-red-500/30 rounded-lg">
                    <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Recent Users</h2>
                  <a href="/admin" className="text-indigo-400 hover:text-indigo-300 text-sm">View All →</a>
                </div>
              </div>
              {recentUsers.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No users yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status, user.is_verified)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.created_at)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <a
                              href={`/admin/user/${user.id}/${encodeURIComponent(user.email)}`}
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
