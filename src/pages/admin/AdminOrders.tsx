import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, CheckCircle2 } from 'lucide-react';
import * as api from '../../lib/api';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AdminOrders: React.FC = () => {
  const { prompts } = useMarketplace();
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedUsers, fetchedPurchases] = await Promise.all([
          api.fetchUsers(),
          api.fetchPurchases(),
        ]);
        setUsers(fetchedUsers || []);
        setOrders(fetchedPurchases || []);
      } catch (error) {
        console.error('Failed to load orders data:', error);
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

  const filtered = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const prompt = prompts.find((p) => p.id === o.prompt_id);
    const user = users.find((u) => u.id === o.user_id);
    return (
      o.id.toLowerCase().includes(q) ||
      o.razorpay_payment_id?.toLowerCase().includes(q) ||
      prompt?.title.toLowerCase().includes(q) ||
      user?.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Financial Ledger
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Orders & Transactions ({orders.length})
          </h1>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, user, payment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-3 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">Licensed Prompt</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold">Payment Provider</th>
                <th className="py-3 px-3 font-semibold">Payment ID</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7E3]">
              {filtered.map((order) => {
                const prompt = prompts.find((p) => p.id === order.prompt_id);
                const user = users.find((u) => u.id === order.user_id);
                return (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-neutral-800">
                      {order.id.slice(0, 14)}...
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-neutral-900">{user?.full_name || 'Customer'}</p>
                      <span className="text-[11px] text-[#8A8A8A] font-mono">{user?.email}</span>
                    </td>
                    <td className="py-3 px-3 max-w-[200px] truncate text-neutral-800 font-medium">
                      {prompt?.title || 'Direct Digital License'}
                    </td>
                    <td className="py-3 px-3 font-bold tabular-nums text-neutral-900">
                      ${order.amount.toFixed(2)} {order.currency}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-neutral-600">
                      Razorpay
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-neutral-500">
                      {order.razorpay_payment_id || 'pay_verified'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-neutral-500">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-neutral-900">No Transactions Found</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {search ? 'Try adjusting your search criteria.' : 'No orders have been placed yet.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
