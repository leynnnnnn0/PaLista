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
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    Plus,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
interface DashboardProps {
    stats: {
        totalBorrowers: number;
        activeAccounts: number;
        totalPayables: number;
        overdueLoans: number;
    };
    paymentSchedules: Array<{
        id: number;
        borrower_name: string;
        loan_id: number;
        due_date: string;
        amount_due: number;
        total_due: number;
        paid_amount: number;
        remaining_amount: number;
        status: string;
        penalty_amount: number;
        rebate_amount: number;
    }>;
    calendarData: Array<{
        date: string;
        count: number;
        total_amount: number;
    }>;
    filters: {
        date_from: string;
        date_to: string;
    };
}

export default function Dashboard({
    stats,
    paymentSchedules,
    calendarData,
    filters,
}: DashboardProps) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleFilterSubmit = () => {
        setCurrentPage(1); // Reset to first page when filtering
        router.get(
            '/dashboard',
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
        const today = new Date().toISOString().split('T')[0];
        setDateFrom(today);
        setDateTo(today);
        setCurrentPage(1); // Reset to first page
        router.get(
            '/dashboard',
            {
                date_from: today,
                date_to: today,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Pagination logic
    const totalPages = Math.ceil(paymentSchedules.length / itemsPerPage);
    const paginatedSchedules = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return paymentSchedules.slice(startIndex, endIndex);
    }, [paymentSchedules, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getCalendarDataForDate = (date: string) => {
        return calendarData.find((item) => item.date === date);
    };

    const { daysInMonth, startingDayOfWeek, year, month } =
        getDaysInMonth(currentMonth);

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
        );
    };

    const prevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen space-y-8 bg-slate-50/50 p-6 lg:p-10">
                {/* Header */}
                <PageHeader
                    title="Portfolio Overview"
                    subtitle={`Monitoring ${stats.activeAccounts} active loans
                            across ${stats.totalBorrowers} borrowers.`}
                >
                    <Button
                        className="mt-2 w-full cursor-pointer md:mt-0 md:w-auto"
                        size="sm"
                        onClick={() => router.get('/my-pautang/create')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Loan
                    </Button>
                </PageHeader>


                {/* Stat Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Borrowers"
                        value={stats.totalBorrowers.toString()}
                        icon={<Users className="text-blue-600" size={20} />}
                    />
                    <StatCard
                        title="Active Accounts"
                        value={stats.activeAccounts.toString()}
                        icon={
                            <CheckCircle
                                className="text-emerald-600"
                                size={20}
                            />
                        }
                    />
                    <StatCard
                        title="Total Payables"
                        value={formatCurrency(stats.totalPayables)}
                        icon={<Clock className="text-orange-500" size={20} />}
                    />
                    <StatCard
                        title="Overdue Loans"
                        value={stats.overdueLoans.toString()}
                        icon={
                            <AlertCircle className="text-red-500" size={20} />
                        }
                        isAlert={stats.overdueLoans > 0}
                    />
                </div>

                {/* Date Filter */}
                <Card className="border-slate-200 bg-slate-50 shadow-none">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">
                                    Filter Period:
                                </span>
                            </div>

                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) =>
                                        setDateFrom(e.target.value)
                                    }
                                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:w-auto"
                                />
                                <span className="text-sm text-slate-500">
                                    to
                                </span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:w-auto"
                                />
                            </div>

                            <div className="flex w-full gap-2 sm:w-auto">
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

                <div className="grid grid-cols-1">
                    {/* Payment Schedules Table */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">
                                Payment Schedules
                            </CardTitle>
                            <CardDescription>
                                Scheduled payments for the selected period
                                {paymentSchedules.length > 0 && (
                                    <span className="ml-2 text-slate-600">
                                        ({paymentSchedules.length} total)
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-slate-200 bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                                    Borrower
                                                </th>
                                                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                                    Due Date
                                                </th>
                                                <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                                    Amount Due
                                                </th>
                                                <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                                    Paid
                                                </th>
                                                <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                                    Remaining
                                                </th>
                                                <th className="px-4 py-3 text-center font-semibold text-slate-600">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {paginatedSchedules.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="px-4 py-8 text-center text-slate-500"
                                                    >
                                                        No payment schedules
                                                        found for this period
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedSchedules.map(
                                                    (schedule) => (
                                                        <tr
                                                            key={schedule.id}
                                                            className="hover:bg-slate-50"
                                                        >
                                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                                {
                                                                    schedule.borrower_name
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-600">
                                                                {formatDate(
                                                                    schedule.due_date,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-slate-900">
                                                                {formatCurrency(
                                                                    schedule.total_due,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-emerald-600">
                                                                {formatCurrency(
                                                                    schedule.paid_amount,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-medium text-orange-600">
                                                                {formatCurrency(
                                                                    schedule.remaining_amount,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span
                                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                        schedule.status ===
                                                                        'paid'
                                                                            ? 'bg-emerald-50 text-emerald-700'
                                                                            : schedule.status ===
                                                                                'overdue'
                                                                              ? 'bg-red-50 text-red-700'
                                                                              : 'bg-blue-50 text-blue-700'
                                                                    }`}
                                                                >
                                                                    {schedule.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="block md:hidden">
                                {paginatedSchedules.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-slate-500">
                                        No payment schedules found for this
                                        period
                                    </div>
                                ) : (
                                    paginatedSchedules.map((schedule) => (
                                        <Card
                                            key={schedule.id}
                                            className="mb-3 border-none shadow-sm ring-1 ring-slate-200"
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium text-slate-900">
                                                            {
                                                                schedule.borrower_name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {formatDate(
                                                                schedule.due_date,
                                                            )}
                                                        </p>
                                                        <div className="mt-2 flex flex-col flex-wrap items-start gap-2 text-sm text-slate-600 sm:flex-row">
                                                            <div>Due:</div>
                                                            <div className="font-medium text-slate-900">
                                                                {formatCurrency(
                                                                    schedule.total_due,
                                                                )}
                                                            </div>
                                                            <div>Paid:</div>
                                                            <div className="font-medium text-emerald-600">
                                                                {formatCurrency(
                                                                    schedule.paid_amount,
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-orange-600">
                                                            {formatCurrency(
                                                                schedule.remaining_amount,
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${schedule.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : schedule.status === 'overdue' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}
                                                        >
                                                            {schedule.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {paymentSchedules.length > itemsPerPage && (
                                <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-center text-sm text-slate-600 sm:text-left">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {(currentPage - 1) * itemsPerPage +
                                                1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {Math.min(
                                                currentPage * itemsPerPage,
                                                paymentSchedules.length,
                                            )}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">
                                            {paymentSchedules.length}
                                        </span>{' '}
                                        results
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1,
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="flex-shrink-0 shadow-none"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                Previous
                                            </span>
                                        </Button>

                                        {/* Full page buttons on sm+ */}
                                        <div className="hidden max-w-[40vw] items-center gap-1 overflow-x-auto sm:flex lg:max-w-none">
                                            {Array.from(
                                                { length: totalPages },
                                                (_, i) => i + 1,
                                            ).map((page) => (
                                                <Button
                                                    key={page}
                                                    size="sm"
                                                    variant={
                                                        currentPage === page
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    className={`shadow-none ${
                                                        currentPage === page
                                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                                            : ''
                                                    }`}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Compact view on mobile */}
                                        <div className="flex items-center gap-2 text-sm text-slate-600 sm:hidden">
                                            <span>Page</span>
                                            <span className="font-medium">
                                                {currentPage}
                                            </span>
                                            <span>of</span>
                                            <span className="font-medium">
                                                {totalPages}
                                            </span>
                                        </div>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1,
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="flex-shrink-0 shadow-none"
                                            aria-label="Next page"
                                        >
                                            <span className="hidden sm:inline">
                                                Next
                                            </span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Sub-components ---
function StatCard({ title, value, icon, isAlert = false }: any) {
    return (
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-3">
                <div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <p className="truncate text-xs font-semibold tracking-widest text-slate-500 uppercase">
                                {title}
                            </p>
                            <div className="rounded-xl bg-slate-50 p-2.5 shadow-sm ring-1 ring-slate-100">
                                {icon}
                            </div>
                        </div>
                    </div>

                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}
