import React, { useState } from 'react';
import { Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import * as api from '../../lib/api';
import { Subscription } from '../../types';

export const AdminSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedSubs, fetchedUsers] = await Promise.all([
          api.fetchSubscriptions(),
          api.fetchUsers()
        ]);
        setSubscriptions(fetchedSubs || []);
        setUsers(fetchedUsers || []);
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-16">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Recurring Revenue
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          Mekyo Pro Subscriptions ({subscriptions.length})
        </h1>
        <p className="text-xs text-[#666666]">
          Track active memberships, automated billing cycles, and renewal statuses.
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Subscriber</th>
              <th className="py-3 px-3 font-semibold">Plan Tier</th>
              <th className="py-3 px-3 font-semibold">Recurring Amount</th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-3 font-semibold">Start Date</th>
              <th className="py-3 px-3 font-semibold">Next Renewal</th>
              <th className="py-3 px-4 font-semibold text-right">Gateway Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E7E3]">
            {subscriptions.map((sub) => {
              const user = users.find((u) => u.id === sub.user_id);
              return (
                <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-neutral-900">{user?.full_name || 'Subscriber'}</p>
                    <span className="text-[11px] text-[#8A8A8A] font-mono">{user?.email}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-neutral-900">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8FF3D] fill-current" />
                      <span>{sub.plan.toUpperCase()}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold tabular-nums text-neutral-900">
                    ${sub.amount.toFixed(2)} / mo
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        sub.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-600">
                    {new Date(sub.start_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-600">
                    {new Date(sub.renewal_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-neutral-500">
                    {sub.razorpay_subscription_id || sub.razorpay_payment_id || 'sub_razorpay_verified'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
