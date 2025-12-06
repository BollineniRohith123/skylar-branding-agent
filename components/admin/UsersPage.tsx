import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';

interface User {
  id: number;
  email: string;
  is_verified: boolean;
  status: string;
  regeneration_count: number;
  max_regenerations: number;
  created_at: string;
  updated_at: string;
  attempt_count: number;
  max_attempts: number;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user "${userEmail}"? This will delete all their images and data permanently.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      const result = await response.json();
      alert(`✅ Successfully deleted user and ${result.deletedFiles || 0} image(s)`);
      
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : 'Failed to delete user'}`);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Users Management</h1>
            <p className="text-gray-400 mt-1">Manage and monitor registered users</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="bg-gray-800 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm font-medium">Total Users</div>
            <div className="text-3xl font-bold text-white mt-2">{users.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm font-medium">Verified</div>
            <div className="text-3xl font-bold text-green-400 mt-2">
              {users.filter(u => u.is_verified || u.status === 'verified').length}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm font-medium">Pending</div>
            <div className="text-3xl font-bold text-yellow-400 mt-2">
              {users.filter(u => !u.is_verified && u.status === 'pending').length}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm font-medium">Blocked</div>
            <div className="text-3xl font-bold text-red-400 mt-2">
              {users.filter(u => u.status === 'blocked').length}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              {searchQuery ? 'No users found matching your search' : 'No users yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Regenerations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Attempts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status, user.is_verified)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.regeneration_count} / {user.max_regenerations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.attempt_count} / {user.max_attempts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`/admin/user/${user.id}/${encodeURIComponent(user.email)}`}
                          className="text-indigo-400 hover:text-indigo-300 mr-3"
                        >
                          View
                        </a>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
