import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle,
    Clock,
    MoreHorizontal,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function Dashboard() {
    // --- Data ---
    const stats = {
        activeLoans: 12,
        totalLent: 285000,
        totalCollected: 165000,
        outstanding: 120000,
        overdueLoans: 3,
        clientsCount: 8,
        expectedProfit: 24500,
        collectedProfit: 12300,
    };

    const recentLoans = [
        {
            id: 1,
            client: 'Maria Santos',
            amount: 15000,
            dueDate: '2026-01-28',
            status: 'active',
            paid: 5000,
        },
        {
            id: 2,
            client: 'Juan Dela Cruz',
            amount: 25000,
            dueDate: '2026-01-26',
            status: 'overdue',
            paid: 10000,
        },
        {
            id: 3,
            client: 'Rosa Garcia',
            amount: 10000,
            dueDate: '2026-02-05',
            status: 'active',
            paid: 3000,
        },
        {
            id: 4,
            client: 'Pedro Reyes',
            amount: 20000,
            dueDate: '2026-01-30',
            status: 'active',
            paid: 8000,
        },
        {
            id: 5,
            client: 'Ana Lopez',
            amount: 12000,
            dueDate: '2026-01-24',
            status: 'overdue',
            paid: 2000,
        },
    ];

    const monthlyData = [
        { month: 'Aug', lent: 45000, collected: 28000 },
        { month: 'Sep', lent: 52000, collected: 35000 },
        { month: 'Oct', lent: 48000, collected: 42000 },
        { month: 'Nov', lent: 58000, collected: 38000 },
        { month: 'Dec', lent: 42000, collected: 32000 },
        { month: 'Jan', lent: 40000, collected: 30000 },
    ];

    const paymentStatusData = [
        { name: 'Collected', value: stats.totalCollected, color: '#10b981' },
        {
            name: 'Pending',
            value: stats.outstanding - stats.overdueLoans * 5000,
            color: '#3b82f6',
        },
        { name: 'Overdue', value: stats.overdueLoans * 5000, color: '#ef4444' },
    ];

    // --- Helpers ---
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen space-y-8 bg-slate-50/50 p-6 lg:p-10">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Portfolio Overview
                        </h1>
                        <p className="font-medium text-slate-500">
                            Monitoring {stats.activeLoans} active loans across{' '}
                            {stats.clientsCount} clients.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Lent"
                        value={formatCurrency(stats.totalLent)}
                        icon={<Wallet className="text-blue-600" size={20} />}
                        trend="+12.5%"
                        trendUp
                    />
                    <StatCard
                        title="Total Collected"
                        value={formatCurrency(stats.totalCollected)}
                        icon={
                            <CheckCircle
                                className="text-emerald-600"
                                size={20}
                            />
                        }
                        trend="+15.2%"
                        trendUp
                    />
                    <StatCard
                        title="Awaiting Payment"
                        value={formatCurrency(stats.outstanding)}
                        icon={<Clock className="text-orange-500" size={20} />}
                        trend="-2.4%"
                        trendUp={false}
                    />
                    <StatCard
                        title="Overdue Loans"
                        value={stats.overdueLoans.toString()}
                        icon={
                            <AlertCircle className="text-red-500" size={20} />
                        }
                        trend="Requires Action"
                        trendUp={false}
                        isAlert
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Chart */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    Lending vs Collections
                                </CardTitle>
                                <CardDescription>
                                    Performance trends for the last 6 months
                                </CardDescription>
                            </div>
                            <TrendingUp className="text-slate-300" />
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyData}>
                                        <defs>
                                            <linearGradient
                                                id="colorLent"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#3b82f6"
                                                    stopOpacity={0.1}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#3b82f6"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#f1f5f9"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#94a3b8',
                                                fontSize: 12,
                                            }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#94a3b8',
                                                fontSize: 12,
                                            }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="lent"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorLent)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="collected"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fill="transparent"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">
                                Loan Distribution
                            </CardTitle>
                            <CardDescription>
                                By collection status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentStatusData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {paymentStatusData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {paymentStatusData.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="text-slate-600">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-slate-900">
                                            {formatCurrency(item.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Section */}
                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">
                                Recent Loan Activities
                            </CardTitle>
                            <CardDescription>
                                A list of recent disbursements and their current
                                status.
                            </CardDescription>
                        </div>
                        <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                            View All <ArrowRight size={14} />
                        </button>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-y border-slate-100 bg-slate-50">
                                    <th className="px-6 py-3 font-semibold text-slate-600">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-slate-600">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-slate-600">
                                        Paid
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-slate-600">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-slate-600">
                                        Status
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentLoans.map((loan) => (
                                    <tr
                                        key={loan.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {loan.client}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {formatCurrency(loan.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {formatCurrency(loan.paid)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {loan.dueDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    loan.status === 'overdue'
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-emerald-50 text-emerald-700'
                                                }`}
                                            >
                                                {loan.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

// --- Sub-components ---

function StatCard({
    title,
    value,
    icon,
    trend,
    trendUp,
    isAlert = false,
}: any) {
    return (
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-slate-50 p-2.5 shadow-sm ring-1 ring-slate-100">
                        {icon}
                    </div>
                    <span
                        className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${
                            isAlert
                                ? 'bg-red-100 text-red-700'
                                : trendUp
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                        {trend}
                    </span>
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                        {title}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5">
                <p className="mb-2 text-[10px] font-bold tracking-tight text-slate-400 uppercase">
                    {label}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 text-sm font-bold"
                        style={{ color: entry.color }}
                    >
                        <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        {entry.name}:{' '}
                        {new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 0,
                        }).format(entry.value)}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
