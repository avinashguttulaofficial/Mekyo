import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  ShoppingBag,
  DollarSign,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Star,
  Eye,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import * as api from '../../lib/api';
import { Prompt } from '../../types';

interface AdminDashboardProps {
  onNavigateSection: (section: string) => void;
  onEditPrompt: (prompt: Prompt) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateSection,
  onEditPrompt,
}) => {
  const { prompts, siteSettings } = useMarketplace();
  
  const [users, setUsers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedUsers, fetchedPurchases, fetchedSubs, fetchedReviews] = await Promise.all([
          api.fetchUsers(),
          api.fetchPurchases(),
          api.fetchSubscriptions(),
          api.fetchReviews(),
        ]);
        setUsers(fetchedUsers || []);
        setPurchases(fetchedPurchases || []);
        setSubscriptions(fetchedSubs || []);
        setReviews(fetchedReviews || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
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

  // Metrics calculations
  const totalUsers = users.length;
  const totalPrompts = prompts.length;
  const totalOrders = purchases.length;
  const promptRevenue = purchases.reduce((sum, p) => (p.status === 'paid' ? sum + p.amount : sum), 0);
  const subscriptionRevenue = subscriptions.reduce(
    (sum, s) => (s.status === 'active' ? sum + s.amount : sum),
    0
  );
  const totalRevenue = promptRevenue + subscriptionRevenue;

  const freePromptsCount = prompts.filter((p) => p.access_type === 'free' || p.price === 0).length;
  const paidPromptsCount = prompts.filter((p) => p.access_type === 'paid').length;
  const proPromptsCount = prompts.filter((p) => p.access_type === 'pro').length;
  // Calculate Pro Subscribers based on User Profile 'plan' status for accuracy with the Users table
  const proSubscribersCount = users.filter((u) => u.plan === 'pro' && u.status === 'active').length;

  // Popular prompts
  const popularPrompts = [...prompts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // Recent orders
  const recentOrders = purchases.slice(0, 5);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Executive Dashboard
          </h1>
          <p className="text-xs text-[#666666]">
            Real-time catalog performance, transactions, and user activations.
          </p>
        </div>

        <button
          onClick={() => onNavigateSection('create-prompt')}
          className="px-4 py-2 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-xl transition-colors self-start sm:self-auto shadow-xs"
        >
          Create New Prompt
        </button>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <span className="text-xs font-medium">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[#111111]">
            ${totalRevenue.toFixed(2)}
          </span>
          <span className="text-[11px] text-emerald-700 block font-medium">
            Verified via Razorpay
          </span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <span className="text-xs font-medium">Completed Orders</span>
            <ShoppingBag className="w-4 h-4 text-neutral-600" />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[#111111]">
            {totalOrders}
          </span>
          <span className="text-[11px] text-[#8A8A8A] block">
            Digital prompt licenses
          </span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <span className="text-xs font-medium">Total Library Prompts</span>
            <FileText className="w-4 h-4 text-neutral-600" />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[#111111]">
            {totalPrompts}
          </span>
          <span className="text-[11px] text-[#8A8A8A] block">
            {paidPromptsCount} Paid · {proPromptsCount} Pro · {freePromptsCount} Free
          </span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8A8A8A]">
            <span className="text-xs font-medium">Active Pro Subscribers</span>
            <Sparkles className="w-4 h-4 text-[#B8FF3D] fill-current" />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[#111111]">
            {proSubscribersCount}
          </span>
          <span className="text-[11px] text-[#8A8A8A] block">
            ${siteSettings?.pro_monthly_price || 29}/mo recurring
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Popular Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Recent Orders Table */}
        <div className="lg:col-span-7 bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#111111]">Recent Orders</h2>
            <button
              onClick={() => onNavigateSection('orders')}
              className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="pb-2 font-semibold">Order ID</th>
                  <th className="pb-2 font-semibold">Target Prompt</th>
                  <th className="pb-2 font-semibold">Amount</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E3]">
                {recentOrders.map((order) => {
                  const p = prompts.find((item) => item.id === order.prompt_id);
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 font-mono text-neutral-500">{order.id.slice(0, 12)}...</td>
                      <td className="py-3 font-medium text-neutral-900 truncate max-w-[160px]">
                        {p?.title || 'Direct License'}
                      </td>
                      <td className="py-3 font-bold tabular-nums text-neutral-900">
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-500 tabular-nums">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <ShoppingBag className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                      <p className="text-xs text-neutral-500">No recent orders found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Popular Prompts List */}
        <div className="lg:col-span-5 bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#111111]">Popular Prompts</h2>
            <button
              onClick={() => onNavigateSection('prompts')}
              className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
            >
              <span>Manage catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {popularPrompts.map((p) => (
              <div
                key={p.id}
                onClick={() => onEditPrompt(p)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-[#E7E7E3] cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0 border border-[#E7E7E3]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-[#111111] truncate">{p.title}</h4>
                    <span className="text-[11px] text-[#8A8A8A] font-mono">{p.ai_tool}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-neutral-600">
                    <Eye className="w-3 h-3 text-neutral-400" />
                    <span className="font-mono tabular-nums">{p.views || 0}</span>
                  </div>
                  <span className="text-[11px] font-bold tabular-nums text-neutral-900">
                    {p.sales_count || 0} sales
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
