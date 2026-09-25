import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield, ShieldAlert, Sparkles } from 'lucide-react';
import * as api from '../../lib/api';
import { User } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminUsers: React.FC = () => {
  const { showToast } = useMarketplace();
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedUsers, fetchedPurchases, fetchedMessages] = await Promise.all([
          api.fetchUsers(),
          api.fetchPurchases(),
          api.fetchMessages(),
        ]);
        setUsers(fetchedUsers || []);
        setPurchases(fetchedPurchases || []);
        setMessages(fetchedMessages || []);
      } catch (error) {
        console.error('Failed to load users data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-neutral-200 border-t-[#111111] rounded-full"></div>
      </div>
    );
  }

  const handleToggleStatus = (targetUser: User) => {
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    const updated = users.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus as any } : u));
    setUsers(updated);
    api.saveUser({ ...targetUser, status: newStatus as any });
    showToast(`User ${targetUser.full_name} is now ${newStatus}`, 'info');
  };

  const handleToggleRole = (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const updated = users.map((u) => (u.id === targetUser.id ? { ...u, role: newRole as any } : u));
    setUsers(updated);
    api.saveUser({ ...targetUser, role: newRole as any });
    showToast(`Changed role for ${targetUser.full_name} to ${newRole}`, 'success');
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const newMessagesCount = messages.filter((m) => m.status === 'new').length;

  const mockVisitors = {
    daily: 1243,
    weekly: 8942,
    monthly: 38412,
    yearly: 421095,
    allTime: 654210,
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            User Directory
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Users & Roles ({users.length})
          </h1>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      {/* Analytics KPI Section */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-[#8A8A8A]">Daily Visitors</div>
          <div className="text-xl font-bold tabular-nums text-[#111111]">{mockVisitors.daily.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-[#8A8A8A]">7 Days Visitors</div>
          <div className="text-xl font-bold tabular-nums text-[#111111]">{mockVisitors.weekly.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-[#8A8A8A]">Monthly Visitors</div>
          <div className="text-xl font-bold tabular-nums text-[#111111]">{mockVisitors.monthly.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-[#8A8A8A]">Yearly Visitors</div>
          <div className="text-xl font-bold tabular-nums text-[#111111]">{mockVisitors.yearly.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-[#8A8A8A]">All-Time Visitors</div>
          <div className="text-xl font-bold tabular-nums text-[#111111]">{mockVisitors.allTime.toLocaleString()}</div>
        </div>
        
        <div className="p-4 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1 col-span-2 sm:col-span-1 cursor-pointer hover:border-[#111111] transition-colors">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <span className="text-xs font-medium">New Inquiries</span>
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            </div>
          </div>
          <span className="text-xl font-bold tabular-nums text-[#111111]">
            {newMessagesCount}
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold">Plan</th>
                <th className="py-3 px-3 font-semibold">Joined</th>
                <th className="py-3 px-3 font-semibold">Purchases</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7E3]">
              {filtered.map((u) => {
                const userPurchases = purchases.filter((p) => p.user_id === u.id);
                return (
                  <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                          alt={u.full_name}
                          className="w-8 h-8 rounded-full bg-neutral-100 object-cover border border-[#E7E7E3]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-neutral-900">{u.full_name}</p>
                          <p className="text-[11px] text-[#8A8A8A] font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-[#111111] text-[#B8FF3D]'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                        title="Click to toggle Admin / User role"
                      >
                        {u.role === 'admin' && <Shield className="w-3 h-3" />}
                        <span className="capitalize">{u.role}</span>
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 capitalize font-medium text-neutral-800">
                        {u.plan}
                        {u.plan === 'pro' && <Sparkles className="w-3 h-3 text-[#B8FF3D] fill-current" />}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-neutral-500 tabular-nums">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3 tabular-nums font-semibold font-mono text-neutral-900">
                      {userPurchases.length}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status || 'active'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          u.status === 'active'
                            ? 'text-red-700 bg-red-50 hover:bg-red-100'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
