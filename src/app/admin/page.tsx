"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  CircleAlert,
  PackageCheck,
  Plus,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartColors, money, useAdminDashboard, type Period } from "@/hooks/useAdminDashboard";

const kpiIcons = [PackageCheck, ShoppingBag, Users, Box];

export default function AdminDashboardPage() {
  const {
    period,
    setPeriod,
    trend,
    topProducts,
    categorySales,
    statusData,
    fulfillmentRate,
    kpis,
  } = useAdminDashboard();

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
            Wednesday, September 3, 2026
          </p>
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Good morning.
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            A clear view of how MyBag is moving today.
          </p>
        </div>
        <Link
          href="/admin/create-product"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          <Plus className="size-4" /> Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, note, color, spark }, index) => {
          const Icon = kpiIcons[index];
          return (
            <div key={label} className="border border-zinc-200 bg-white p-5">
              <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">{label}</p><Icon className="size-5" style={{ color }} strokeWidth={1.6} /></div>
              <div className="mt-5 flex items-end justify-between gap-3"><div><p className="text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-zinc-500">{note}</p></div><div className="h-10 w-20"><ResponsiveContainer width="100%" height="100%"><LineChart data={spark}><Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></div>
            </div>
          );
        })}
      </div>

      <section className="border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h2 className="font-headline text-2xl font-semibold">Revenue &amp; sales</h2><p className="mt-1 text-xs text-zinc-500">Revenue trend, order volume, and previous-period comparison</p></div><div className="flex w-fit border border-zinc-200 p-1">{(["7d", "30d", "12m"] as Period[]).map((option) => <button key={option} onClick={() => setPeriod(option)} className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${period === option ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900"}`}>{option}</button>)}</div></div>
        <div className="mt-6 h-72 w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={trend}><CartesianGrid vertical={false} stroke="#e4e4e7" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} minTickGap={20} /><YAxis yAxisId="revenue" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(value) => `${Math.round(value / 1000000)}m`} width={32} /><YAxis yAxisId="orders" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} width={28} /><Tooltip formatter={(value, name) => [name === "orders" ? value : money(Number(value)), name === "orders" ? "Orders" : name === "previous" ? "Previous" : "Revenue"]} /><Area yAxisId="revenue" type="monotone" dataKey="revenue" fill="#e2725b" fillOpacity={0.12} stroke="#e2725b" strokeWidth={2} /><Line yAxisId="revenue" type="monotone" dataKey="previous" stroke="#a1a1aa" strokeDasharray="5 5" dot={false} /><Line yAxisId="orders" type="monotone" dataKey="orders" stroke="#263238" strokeWidth={2} dot={false} /></ComposedChart></ResponsiveContainer></div>
        <div className="flex flex-wrap gap-5 text-xs text-zinc-500"><span><i className="mr-2 inline-block size-2 rounded-full bg-tertiary" />Revenue</span><span><i className="mr-2 inline-block size-2 rounded-full bg-zinc-800" />Orders</span><span><i className="mr-2 inline-block size-2 rounded-full bg-zinc-400" />Previous period</span></div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="border border-zinc-200 bg-white p-5 sm:p-6"><h2 className="font-headline text-2xl font-semibold">Top products</h2><p className="mt-1 text-xs text-zinc-500">Catalog value until item-level sales data is available</p><div className="mt-6 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={topProducts} layout="vertical" margin={{ left: 8, right: 8 }}><CartesianGrid horizontal={false} stroke="#e4e4e7" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fill: "#52525b", fontSize: 11 }} tickFormatter={(value) => value.length > 18 ? `${value.slice(0, 18)}...` : value} /><Tooltip formatter={(value) => [money(Number(value)), "Value"]} /><Bar dataKey="value" fill="#263238" radius={[0, 3, 3, 0]} maxBarSize={22} /></BarChart></ResponsiveContainer></div></section>
        <section className="border border-zinc-200 bg-white p-5 sm:p-6"><h2 className="font-headline text-2xl font-semibold">Sales share</h2><p className="mt-1 text-xs text-zinc-500">Category mix across the current catalog</p><div className="mt-3 flex items-center gap-4"><div className="h-52 w-1/2"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categorySales} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>{categorySales.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip formatter={(value) => money(Number(value))} /></PieChart></ResponsiveContainer></div><div className="space-y-2 text-xs">{categorySales.map((entry, index) => <div key={entry.name} className="flex items-center gap-2"><i className="size-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} /><span className="text-zinc-500">{entry.name}</span></div>)}</div></div></section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><section className="border border-zinc-200 bg-white p-5 sm:p-6"><h2 className="font-headline text-2xl font-semibold">Order status</h2><p className="mt-1 text-xs text-zinc-500">Current fulfilment workload by status</p><div className="mt-6 h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={statusData}><CartesianGrid vertical={false} stroke="#e4e4e7" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#77917c" radius={[3, 3, 0, 0]} maxBarSize={42} /></BarChart></ResponsiveContainer></div></section><section className="border border-zinc-200 bg-zinc-900 p-5 text-white sm:p-6"><div className="flex items-start justify-between"><div><h2 className="font-headline text-2xl font-semibold">Fulfilment rate</h2><p className="mt-1 text-xs text-zinc-400">Shipped or completed orders</p></div><CircleAlert className="size-5 text-tertiary" /></div><div className="relative mx-auto mt-2 h-52 max-w-xs"><ResponsiveContainer width="100%" height="100%"><RadialBarChart innerRadius="72%" outerRadius="100%" startAngle={90} endAngle={-270} data={[{ value: fulfillmentRate }]} barSize={16}><PolarAngleAxis type="number" domain={[0, 100]} tick={false} /><RadialBar background={{ fill: "#3f3f46" }} dataKey="value" cornerRadius={8} fill="#e2725b" /></RadialBarChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-semibold">{fulfillmentRate}%</span><span className="text-xs text-zinc-400">on track</span></div></div><Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-tertiary">Review orders <ArrowUpRight className="size-3.5" /></Link></section></div>
    </div>
  );
}
