import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    DollarSign,
    Filter,
    Gift,
    Percent,
    Target,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finance',
        href: '/finance',
    },
];

interface FinanceProps {
    metrics: {
        totalLent: number;
        totalInterest: number;
        totalRebate: number;
        totalPenalties: number;
        expectedTotalReturn: number;
        totalPaid: number;
        totalPayables: number;
        netProfit: number;
        collectionRate: number;
        averageLoanSize: number;
        activeLoanCount: number;
    };
    monthlyData: Array<{
        month: string;
        payables: number;
        actualPaid: number;
    }>;
    payablesBreakdown: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    loanStatusDistribution: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    topBorrowers: Array<{
        name: string;
        amount: number;
    }>;
    filters: {
        date_from: string;
        date_to: string;
    };
}

export default function Finance({
    metrics,
    monthlyData,
    payablesBreakdown,
    loanStatusDistribution,
    topBorrowers,
    filters,
}: FinanceProps) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleFilterSubmit = () => {
        router.get(
            '/finance',
            {
                date_from: dateFrom,
                date_to: dateTo,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleResetFilters = () => {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);

        const from = startOfYear.toISOString().split('T')[0];
        const to = endOfYear.toISOString().split('T')[0];

        setDateFrom(from);
        setDateTo(to);

        router.get(
            '/finance',
            {
                date_from: from,
                date_to: to,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Finance" />

            <div className="flex-1 space-y-4 md:space-y-8 p-4 pt-6 sm:p-8">
                {/* Header Section */}
                
                <div className="space-y-2 md:space-y-4">
                       <PageHeader title="Finance Analytics" subtitle="Real-time tracking of profit margins and
                                collection cycles.">
                                    <div></div>
                                </PageHeader>

                    {/* Date Filter Section */}
                    <Card className="border-slate-200 bg-slate-50 shadow-none">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">
                                        Filter Period:
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) =>
                                            setDateFrom(e.target.value)
                                        }
                                        className="w-full min-w-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:w-auto"
                                    />
                                    <span className="text-sm text-slate-500">
                                        to
                                    </span>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) =>
                                            setDateTo(e.target.value)
                                        }
                                        className="w-full min-w-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:w-auto"
                                    />
                                </div>
                                <div className="ml-auto flex w-full gap-2 sm:w-auto">
                                    <Button
                                        size="sm"
                                        className="w-full bg-emerald-600 shadow-none hover:bg-emerald-700 sm:w-auto"
                                        onClick={handleFilterSubmit}
                                    >
                                        <Filter className="mr-2 h-3 w-3" />
                                        Apply
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full shadow-none sm:w-auto"
                                        onClick={handleResetFilters}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Primary Metrics Row */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    <FinanceMetricCard
                        title="Total Lent"
                        value={formatCurrency(metrics.totalLent)}
                        description="Principal amount disbursed"
                        icon={
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        }
                        trend="neutral"
                    />
                    <FinanceMetricCard
                        title="Total Interest"
                        value={formatCurrency(metrics.totalInterest)}
                        description="Interest income earned"
                        icon={<Percent className="h-4 w-4 text-purple-600" />}
                        trend="neutral"
                    />

                    <FinanceMetricCard
                        title="Total Penalties"
                        value={formatCurrency(metrics.totalPenalties)}
                        description="Late payment fees"
                        icon={<AlertCircle className="h-4 w-4 text-red-600" />}
                        trend="neutral"
                    />

                    <FinanceMetricCard
                        title="Collection Rate"
                        value={metrics.collectionRate.toFixed(1) + '%'}
                        description="Paid / Expected return ratio"
                        icon={<Gift className="h-4 w-4 text-blue-600" />}
                        trend="neutral"
                        negative={false}
                    />
                </div>

                {/* Secondary Metrics Row */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    <FinanceMetricCard
                        title="Expected Return"
                        value={formatCurrency(metrics.expectedTotalReturn)}
                        description="Lent + Interest + Penalties"
                        icon={<Target className="h-4 w-4 text-blue-600" />}
                        trend="neutral"
                        highlight={true}
                    />
                    <FinanceMetricCard
                        title="Collected Payments"
                        value={formatCurrency(metrics.totalPaid)}
                        description={`${metrics.collectionRate.toFixed(1)}% collection rate`}
                        icon={<TrendingUp className="h-4 w-4 text-green-600" />}
                        trend="up"
                    />
                    <FinanceMetricCard
                        title="Total Payables"
                        value={formatCurrency(metrics.totalPayables)}
                        description="Outstanding balance"
                        icon={
                            <TrendingDown className="h-4 w-4 text-orange-600" />
                        }
                        trend="neutral"
                    />
                    <FinanceMetricCard
                        title="Net Profit"
                        value={formatCurrency(metrics.netProfit)}
                        description={
                            metrics.netProfit >= 0
                                ? 'Positive cash flow'
                                : 'Negative cash flow'
                        }
                        icon={
                            metrics.netProfit >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )
                        }
                        trend={metrics.netProfit >= 0 ? 'up' : 'down'}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                    {/* Scheduled Due vs Actual Paid Chart */}
                    <Card className="col-span-4 border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">
                                Scheduled Due vs Actual Paid
                            </CardTitle>
                            <CardDescription>
                                Monthly scheduled amounts (including
                                rebates/penalties) vs total payments received.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-56 w-full sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} barGap={8}>
                                        <XAxis
                                            dataKey="month"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                `₱${value / 1000}k`
                                            }
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            wrapperStyle={{
                                                paddingTop: '20px',
                                            }}
                                            formatter={(value) => {
                                                if (value === 'payables')
                                                    return 'Scheduled Due';
                                                if (value === 'actualPaid')
                                                    return 'Total Paid';
                                                return value;
                                            }}
                                        />
                                        <Bar
                                            dataKey="payables"
                                            fill="#f59e0b"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={60}
                                        />
                                        <Bar
                                            dataKey="actualPaid"
                                            fill="#10b981"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={60}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payables Breakdown */}
                    <Card className="col-span-3 border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">
                                Payables Summary
                            </CardTitle>
                            <CardDescription>
                                Breakdown of pending and overdue amounts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 w-full sm:h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={payablesBreakdown}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {payablesBreakdown.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip content={<PieTooltip />} />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {payablesBreakdown.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex min-w-0 items-center gap-2 font-medium text-slate-600">
                                            <div
                                                className="h-2 w-2 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="truncate">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {formatCurrency(item.value)}
                                        </span>
                                    </div>
                                ))}
                                <div className="mt-3 flex items-center justify-between border-t pt-2 text-sm font-bold">
                                    <span className="text-slate-700">
                                        Total
                                    </span>
                                    <span className="text-slate-900">
                                        {formatCurrency(
                                            payablesBreakdown.reduce(
                                                (sum, item) => sum + item.value,
                                                0,
                                            ),
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row - Loan Status & Top Borrowers */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Loan Status Distribution */}
                    <Card className="border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">
                                Loan Portfolio by Status
                            </CardTitle>
                            <CardDescription>
                                Distribution of loans across different statuses.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 w-full sm:h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={loanStatusDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {loanStatusDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip content={<StatusTooltip />} />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {loanStatusDistribution.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex min-w-0 items-center gap-2 font-medium text-slate-600">
                                            <div
                                                className="h-2 w-2 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="truncate">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {item.value} loans
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Helper Components ---

function FinanceMetricCard({
    title,
    value,
    description,
    icon,
    trend,
    highlight = false,
    negative = false,
}: any) {
    return (
        <Card
            className={`relative overflow-hidden border-slate-200 shadow-none ${
                highlight ? 'ring-2 ring-blue-500/20' : ''
            }`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    {title}
                </CardTitle>
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                        highlight
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-slate-100 bg-slate-50'
                    }`}
                >
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className={`font-mono text-2xl font-bold tracking-tight ${
                        negative ? 'text-orange-600' : 'text-slate-900'
                    }`}
                >
                    {value}
                </div>
                <div className="mt-1 flex items-center">
                    {trend === 'up' && (
                        <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                    )}
                    {trend === 'down' && (
                        <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <p className="text-xs font-medium text-slate-500">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5">
                <p className="mb-2 text-[10px] font-bold text-slate-400 uppercase">
                    {label}
                </p>
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-4 text-xs">
                        <span className="font-bold text-orange-600">
                            Scheduled Due:
                        </span>
                        <span className="font-mono">
                            {new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(payload[0].value)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t pt-1 text-xs">
                        <span className="font-bold text-emerald-600">
                            Total Paid:
                        </span>
                        <span className="font-mono">
                            {new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(payload[1].value)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5">
                <p
                    className="mb-1 text-xs font-bold"
                    style={{ color: payload[0].payload.color }}
                >
                    {payload[0].name}
                </p>
                <p className="font-mono text-sm font-bold text-slate-900">
                    {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                    }).format(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const StatusTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5">
                <p
                    className="mb-1 text-xs font-bold"
                    style={{ color: payload[0].payload.color }}
                >
                    {payload[0].name}
                </p>
                <p className="font-mono text-sm font-bold text-slate-900">
                    {payload[0].value} loans
                </p>
            </div>
        );
    }
    return null;
};
