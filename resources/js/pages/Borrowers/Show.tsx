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
import { Briefcase, Home, User, Users } from 'lucide-react';

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

interface ShowProps {
    borrower: Borrower;
}

export default function Show({ borrower }: ShowProps) {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrower Details" />

            <div className="px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Borrower Details
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Complete information about the borrower
                    </p>
                </div>
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
                                <CardContent className="grid grid-cols-3 gap-5">
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
                                {borrower.loans.map((loan, index) => (
                                    <Card
                                        key={loan.id}
                                        className="overflow-hidden"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        Loan #{index + 1}
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
