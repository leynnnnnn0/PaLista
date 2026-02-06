import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    Briefcase,
    Info,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';


interface PaymentHistory {
    id: number;
    amount_paid: number;
    payment_method: string;
    reference_number: string | null;
    receipt_number: string | null;
    payment_date: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Borrowers',
        href: '/borrowers/edit',
    },
];

interface PaymentSchedule {
    id: number;
    due_date: string;
    amount_due: number;
    rebate_amount: number;
    penalty_amount: number;
    rebate_remarks: string | null;
    penalty_remarks: string | null;
    status: string;
    total_due: number;
    payment_histories: PaymentHistory[];
}

interface Loan {
    id: number;
    loan_number?: string;
    amount: number;
    interest_type: string;
    interest_value: number;
    interest_period: string;
    loan_duration: number;
    duration_unit: string;
    payment_frequency: string;
    transaction_date: string;
    status: string;
    total_amount: number;
    interest: number;
    remaining_balance: number;
    duration: string;
    frequency: string;
    total_penalties: number;
    total_rebates: number;
    payment_schedules: PaymentSchedule[];
}

interface BorrowerReference {
    id: number;
    name: string;
    contact_number: string;
}

interface BorrowerDocument {
    id: number;
    file_name: string;
    file_path: string;
    document_type: string;
    uploaded_at: string;
}

interface Borrower {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    contact_number: string;
    address: string;
    city: string;
    province: string;
    zip_code: string;
    country: string;
    loans?: Loan[];
    documents?: BorrowerDocument[];
    references?: BorrowerReference;
}

interface CreditScore {
    score: number;
    rating: string;
    factors: {
        payment_history: number;
        credit_utilization: number;
        loan_performance: number;
        account_age: number;
    };
    insights: Array<{
        type: string;
        title: string;
        message: string;
    }>;
}

interface ShowProps {
    borrower: Borrower;
    creditScore: CreditScore;
}

export default function Show({ borrower, creditScore }: ShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<
            string,
            {
                variant: 'default' | 'secondary' | 'destructive' | 'outline';
                label: string;
            }
        > = {
            active: { variant: 'default', label: 'Active' },
            paid: { variant: 'secondary', label: 'Paid' },
            overdue: { variant: 'destructive', label: 'Overdue' },
            pending: { variant: 'outline', label: 'Pending' },
        };

        const config = statusConfig[status.toLowerCase()] || {
            variant: 'outline' as const,
            label: status,
        };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        if (score >= 45) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return 'bg-green-50 border-green-200';
        if (score >= 75) return 'bg-blue-50 border-blue-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        if (score >= 45) return 'bg-orange-50 border-orange-200';
        return 'bg-red-50 border-red-200';
    };

    const getBorderColor = (score: number) => {
        if (score >= 90) return 'border-green-500';
        if (score >= 75) return 'border-blue-500';
        if (score >= 60) return 'border-yellow-500';
        if (score >= 45) return 'border-orange-500';
        return 'border-red-500';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrower Details" />

            <div className="p-5 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Borrower Details
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Complete information about the borrower
                    </p>
                </div>

                {/* Modern Credit Score Dashboard */}
                {/* Credit Score Section */}
                {borrower.loans?.length > 0 && creditScore.score > 0 && (
                    <TooltipProvider delayDuration={200}>
                        <Card className="mb-6 overflow-hidden border-none bg-slate-50/50 shadow-2xl backdrop-blur-md">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                                            Credit Analysis
                                        </CardTitle>
                                        <CardDescription className="font-medium text-slate-500">
                                            Based on real-time performance
                                            metrics
                                        </CardDescription>
                                    </div>
                                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                        <Award className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 pt-6">
                                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                                    {/* LEFT: HERO SCORE GAUGE */}
                                    <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white p-10 shadow-sm ring-1 ring-slate-200/60 lg:col-span-5">
                                        <div className="relative flex items-center justify-center">
                                            {/* Score Glow Effect */}
                                            <div
                                                className={`absolute h-32 w-32 animate-pulse rounded-full opacity-20 blur-[60px] ${getScoreBgColor(creditScore.score)}`}
                                            />

                                            <svg className="h-52 w-52 -rotate-90">
                                                <circle
                                                    cx="104"
                                                    cy="104"
                                                    r="94"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="12"
                                                    className="text-slate-100"
                                                />
                                                <circle
                                                    cx="104"
                                                    cy="104"
                                                    r="94"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="12"
                                                    strokeDasharray={590}
                                                    strokeDashoffset={
                                                        590 -
                                                        (590 *
                                                            creditScore.score) /
                                                            100
                                                    }
                                                    strokeLinecap="round"
                                                    className={`transition-all duration-1000 ease-out ${getScoreColor(creditScore.score)}`}
                                                />
                                            </svg>

                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-6xl leading-none font-black tracking-tighter text-slate-900">
                                                    {creditScore.score}
                                                </span>
                                                <span className="mt-1 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                    Trust Score
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full px-6 py-1.5 text-sm font-black shadow-sm ring-1 ring-inset ${getScoreBgColor(creditScore.score)} ${getScoreColor(creditScore.score)}`}
                                            >
                                                <div
                                                    className={`h-2 w-2 animate-pulse rounded-full bg-current`}
                                                />
                                                {creditScore.rating?.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT: FACTOR PROGRESS */}
                                    <div className="flex flex-col justify-center space-y-6 lg:col-span-7">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                Key Indicators
                                            </h4>
                                            <span className="text-xs font-medium text-slate-400">
                                                Weightage
                                            </span>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {[
                                                {
                                                    label: 'Payments',
                                                    key: 'payment_history',
                                                    max: 40,
                                                    tip: 'Measures on-time payments and overall reliability.',
                                                },
                                                {
                                                    label: 'Utilization',
                                                    key: 'credit_utilization',
                                                    max: 25,
                                                    tip: 'Ratio of current debt to your total borrowed limit.',
                                                },
                                                {
                                                    label: 'Performance',
                                                    key: 'loan_performance',
                                                    max: 25,
                                                    tip: 'Based on successful loan completions and lack of penalties.',
                                                },
                                                {
                                                    label: 'History',
                                                    key: 'account_age',
                                                    max: 10,
                                                    tip: 'The length of time your credit accounts have been active.',
                                                },
                                            ].map((f) => (
                                                <div
                                                    key={f.key}
                                                    className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md hover:ring-indigo-100"
                                                >
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-slate-700">
                                                                {f.label}
                                                            </span>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <div className="cursor-help text-slate-300 transition-colors hover:text-indigo-500">
                                                                        <Info className="h-4 w-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent
                                                                    side="top"
                                                                    className="border-none bg-slate-900 px-3 py-2 text-white shadow-xl"
                                                                >
                                                                    <p className="text-[11px] leading-relaxed">
                                                                        {f.tip}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <span className="rounded-md bg-slate-50 px-2 py-0.5 text-xs font-black text-slate-900">
                                                            {
                                                                creditScore
                                                                    .factors[
                                                                    f.key
                                                                ]
                                                            }{' '}
                                                            / {f.max}
                                                        </span>
                                                    </div>

                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full bg-indigo-500 transition-all duration-1000 group-hover:bg-indigo-400"
                                                            style={{
                                                                width: `${(creditScore.factors[f.key] / f.max) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER: INSIGHT CHIPS */}
                                {creditScore.insights?.length > 0 && (
                                    <div className="pt-6">
                                        <Separator className="mb-6 opacity-50" />
                                        <div className="flex flex-wrap gap-3">
                                            {creditScore.insights.map(
                                                (insight, i) => {
                                                    const isWarning =
                                                        insight.type ===
                                                        'warning';
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 ${
                                                                isWarning
                                                                    ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200'
                                                                    : 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200'
                                                            }`}
                                                        >
                                                            <div
                                                                className={`rounded-full p-1 ${isWarning ? 'bg-amber-200' : 'bg-emerald-200'}`}
                                                            >
                                                                {isWarning ? (
                                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                                ) : (
                                                                    <TrendingUp className="h-3.5 w-3.5" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row sm:gap-1.5">
                                                                <span>
                                                                    {
                                                                        insight.title
                                                                    }
                                                                    :
                                                                </span>
                                                                <span className="font-normal opacity-80">
                                                                    {
                                                                        insight.message
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TooltipProvider>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        First Name
                                    </p>
                                    <p className="font-medium">
                                        {borrower.first_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        Last Name
                                    </p>
                                    <p className="font-medium">
                                        {borrower.last_name}
                                    </p>
                                </div>
                                {borrower.email && (
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Email
                                        </p>
                                        <p className="font-medium">
                                            {borrower.email}
                                        </p>
                                    </div>
                                )}
                                {borrower.contact_number && (
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Contact Number
                                        </p>
                                        <p className="font-medium">
                                            {borrower.contact_number}
                                        </p>
                                    </div>
                                )}

                                <Separator />
                                {borrower.address && (
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Street Address
                                        </p>
                                        <p className="font-medium">
                                            {borrower.address}
                                        </p>
                                    </div>
                                )}
                                {borrower.city && (
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            City
                                        </p>
                                        <p className="font-medium">
                                            {borrower.city}
                                        </p>
                                    </div>
                                )}
                                {borrower.province && (
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Province
                                        </p>
                                        <p className="font-medium">
                                            {borrower.province}
                                        </p>
                                    </div>
                                )}
                                {borrower.zip_code && (
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Zip Code
                                        </p>
                                        <p className="font-medium">
                                            {borrower.zip_code}
                                        </p>
                                    </div>
                                )}
                                {borrower.country && (
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Country
                                        </p>
                                        <p className="font-medium">
                                            {borrower.country}
                                        </p>
                                    </div>
                                )}
                                {!borrower.address &&
                                    !borrower.city &&
                                    !borrower.province && (
                                        <p className="text-sm text-muted-foreground">
                                            No address information provided
                                        </p>
                                    )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Reference
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {borrower.references ? (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-1 text-xs text-muted-foreground">
                                                Name
                                            </p>
                                            <p className="font-medium">
                                                {borrower.references.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs text-muted-foreground">
                                                Contact Number
                                            </p>
                                            <p className="font-medium">
                                                {
                                                    borrower.references
                                                        .contact_number
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No reference provided
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:col-span-2">
                        {borrower.loans && borrower.loans.length > 0 && (
                            <Card className="bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        Loan Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-5 md:grid-cols-3">
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Total Loans
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {borrower.loans.length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Active Loans
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {
                                                borrower.loans.filter(
                                                    (l) =>
                                                        l.status === 'active',
                                                ).length
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Total Outstanding
                                        </p>
                                        <p className="text-xl font-bold text-orange-600">
                                            {formatCurrency(
                                                borrower.loans.reduce(
                                                    (sum, loan) =>
                                                        sum +
                                                        loan.remaining_balance,
                                                    0,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {borrower.loans && borrower.loans.length > 0 ? (
                            <div className="space-y-4">
                                {borrower.loans.map((loan) => (
                                    <Card
                                        key={loan.id}
                                        className="overflow-hidden"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        <a
                                                            className="cursor-pointer underline"
                                                            href={`/my-pautang/${loan.id}`}
                                                            target="_blank"
                                                        >
                                                            {loan.loan_number}
                                                        </a>
                                                    </CardTitle>
                                                    <CardDescription className="mt-1">
                                                        {formatDate(
                                                            loan.transaction_date,
                                                        )}
                                                    </CardDescription>
                                                </div>
                                                {getStatusBadge(loan.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                                <div className="space-y-1">
                                                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                                                        Principal
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {formatCurrency(
                                                            loan.amount,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                                                        Interest
                                                    </p>
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {formatCurrency(
                                                            loan.interest,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {loan.interest_type ===
                                                        'percentage'
                                                            ? `${loan.interest_value}%`
                                                            : formatCurrency(
                                                                  loan.interest_value,
                                                              )}{' '}
                                                        {loan.frequency}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs tracking-wide text-muted-foreground uppercase">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(
                                                            loan.total_amount,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator className="my-4" />

                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                <div>
                                                    <p className="mb-1 text-xs text-muted-foreground">
                                                        Duration
                                                    </p>
                                                    <p className="font-semibold">
                                                        {loan.duration}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs text-muted-foreground">
                                                        Frequency
                                                    </p>
                                                    <p className="font-semibold capitalize">
                                                        {loan.payment_frequency?.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs text-muted-foreground">
                                                        Remaining
                                                    </p>
                                                    <p className="font-semibold text-orange-600">
                                                        {formatCurrency(
                                                            loan.remaining_balance,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs text-muted-foreground">
                                                        Status
                                                    </p>
                                                    <p className="font-semibold capitalize">
                                                        {loan.status}
                                                    </p>
                                                </div>
                                            </div>

                                            {(loan.total_penalties > 0 ||
                                                loan.total_rebates > 0) && (
                                                <>
                                                    <Separator className="my-4" />
                                                    <div className="flex gap-6">
                                                        {loan.total_penalties >
                                                            0 && (
                                                            <div>
                                                                <p className="mb-1 text-xs text-muted-foreground">
                                                                    Penalties
                                                                </p>
                                                                <p className="font-semibold text-red-600">
                                                                    {formatCurrency(
                                                                        loan.total_penalties,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {loan.total_rebates >
                                                            0 && (
                                                            <div>
                                                                <p className="mb-1 text-xs text-muted-foreground">
                                                                    Rebates
                                                                </p>
                                                                <p className="font-semibold text-green-600">
                                                                    -
                                                                    {formatCurrency(
                                                                        loan.total_rebates,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12">
                                    <div className="text-center text-muted-foreground">
                                        <Briefcase className="mx-auto mb-3 h-12 w-12 opacity-20" />
                                        <p>No loans found for this borrower</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
