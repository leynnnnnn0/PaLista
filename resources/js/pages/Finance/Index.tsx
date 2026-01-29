import { Button } from '@/components/ui/button';
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
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    DollarSign,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Cell,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function Finance() {
    // Mock Data for Finance
    const revenueData = [
        { month: 'Jul', revenue: 42000, expenses: 31000 },
        { month: 'Aug', revenue: 45000, expenses: 32000 },
        { month: 'Sep', revenue: 52000, expenses: 34000 },
        { month: 'Oct', revenue: 48000, expenses: 33000 },
        { month: 'Nov', revenue: 61000, expenses: 38000 },
        { month: 'Dec', revenue: 55000, expenses: 35000 },
    ];

    const distributionData = [
        { name: 'Net Profit', value: 35000, color: '#10b981' },
        { name: 'Operating Costs', value: 15000, color: '#3b82f6' },
        { name: 'Bad Debt (Loss)', value: 5000, color: '#ef4444' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Finance" />

            <div className="flex-1 space-y-8 p-8 pt-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Finance Analytics
                        </h2>
                        <p className="text-sm font-medium text-muted-foreground">
                            Real-time tracking of profit margins and collection
                            cycles.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="shadow-none">
                            <Calendar className="mr-2 h-4 w-4" />
                            Jan 2026
                        </Button>
                        <Button className="bg-emerald-600 shadow-none hover:bg-emerald-700">
                            Generate Report
                        </Button>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <FinanceMetricCard
                        title="Net Profit"
                        value={formatCurrency(245000)}
                        description="+18% from last month"
                        icon={
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                        }
                        trend="up"
                    />
                    <FinanceMetricCard
                        title="Total Payables"
                        value={formatCurrency(120500)}
                        description="Due in next 30 days"
                        icon={
                            <TrendingDown className="h-4 w-4 text-orange-600" />
                        }
                        trend="neutral"
                    />
                    <FinanceMetricCard
                        title="Collected Interest"
                        value={formatCurrency(45200)}
                        description="+12% ROI"
                        icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
                        trend="up"
                    />
                    <FinanceMetricCard
                        title="Est. Loss (Bad Debt)"
                        value={formatCurrency(8400)}
                        description="3% of total portfolio"
                        icon={<TrendingDown className="h-4 w-4 text-red-600" />}
                        trend="down"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Revenue/Expense Chart */}
                    <Card className="col-span-4 border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">
                                Revenue vs. Expenses
                            </CardTitle>
                            <CardDescription>
                                Monthly growth trend of interest earned vs
                                operating costs.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient
                                                id="colorRev"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.1}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
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
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRev)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="expenses"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            fill="transparent"
                                            strokeDasharray="5 5"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profit Distribution */}
                    <Card className="col-span-3 border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">
                                Profit Breakdown
                            </CardTitle>
                            <CardDescription>
                                Allocation of gross collections.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={distributionData}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {distributionData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {distributionData.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2 font-medium text-slate-600">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            {item.name}
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {formatCurrency(item.value)}
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

function FinanceMetricCard({ title, value, description, icon, trend }: any) {
    return (
        <Card className="relative overflow-hidden border-slate-200 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    {title}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="font-mono text-2xl font-bold tracking-tight text-slate-900">
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
                        <span className="font-bold text-emerald-600">
                            Revenue:
                        </span>
                        <span className="font-mono">
                            {new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(payload[0].value)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t pt-1 text-xs">
                        <span className="font-bold text-red-500">
                            Expenses:
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
