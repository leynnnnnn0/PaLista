import ModuleHeading from '@/components/module-heading';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Loan } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Ban,
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Edit,
    FileText,
    History,
    QrCode,
    TimerIcon,
    TrendingUp,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    loan: Loan;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Loans',
        href: '/my-pautang',
    },
];

interface PaymentHistoryWithSchedule {
    id: number;
    payment_schedule_id: number;
    amount_paid: string | number;
    payment_method: string;
    reference_number?: string | null;
    receipt_number?: string | null;
    payment_date: string;
    schedule_number: number;
    due_date: string;
}

export default function Show({ loan }: PageProps) {
    const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
    const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const [selectedPaymentHistory, setSelectedPaymentHistory] =
        useState<PaymentHistoryWithSchedule | null>(null);

    const penaltyForm = useForm({
        payment_schedule_id: '',
        penalty_amount: '',
        remarks: '',
    });

    const paymentForm = useForm({
        payment_schedule_id: '',
        amount_paid: '',
        payment_method: 'cash',
        reference_number: '',
        receipt_number: '',
        payment_date: new Date().toISOString().split('T')[0],
    });

    const editPaymentForm = useForm({
        amount_paid: '',
        payment_method: 'cash',
        reference_number: '',
        receipt_number: '',
        payment_date: '',
    });

    const voidForm = useForm({
        void_reason: '',
    });

    const handleOpenVoidModal = () => {
        setIsVoidModalOpen(true);
    };

    const handleSubmitVoid = (e: React.FormEvent) => {
        e.preventDefault();
        voidForm.put(`/my-pautang/${loan.id}/void`, {
            onSuccess: () => {
                toast.success('Loan voided successfully');
                setIsVoidModalOpen(false);
                voidForm.reset();
            },
            onError: () => {
                toast.error('Failed to void loan');
            },
        });
    };

    const handleCloseVoidModal = () => {
        setIsVoidModalOpen(false);
        voidForm.reset();
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
        const statusConfig = {
            pending: { variant: 'outline', label: 'Pending' },
            paid: { variant: 'default', label: 'Paid' },
            overdue: { variant: 'destructive', label: 'Overdue' },
            partial: { variant: 'outline', label: 'Partial' },
        };
        const config =
            statusConfig[status.toLowerCase()] || statusConfig.pending;
        return (
            <Badge
                variant={config.variant as any}
                className="flex w-fit items-center gap-1"
            >
                <Clock className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    // Calculate total paid from all payment schedules
    const totalPaid =
        loan.payment_schedules?.reduce((sum, schedule) => {
            const schedulePaid =
                schedule.payment_histories?.reduce(
                    (scheduleSum, history) =>
                        scheduleSum + parseFloat(history.amount_paid || 0),
                    0,
                ) || 0;
            return sum + schedulePaid;
        }, 0) || 0;

    const paymentProgress =
        loan.total_amount > 0 ? (totalPaid / loan.total_amount) * 100 : 0;

    const handleRowClick = (schedule: any) => {
        // Don't open modal if already paid
        if (schedule.status.toLowerCase() === 'paid') {
            return;
        }
        setSelectedSchedule(schedule);
        // Check if penalty exists and is greater than 0
        const hasPenalty =
            schedule.penalty_amount && parseFloat(schedule.penalty_amount) > 0;
        setIsEditMode(hasPenalty);
        penaltyForm.setData({
            payment_schedule_id: schedule.id,
            penalty_amount: schedule.penalty_amount || '',
            remarks: '',
        });
        setIsPenaltyModalOpen(true);
    };

    const handleSubmitPenalty = (e: React.FormEvent) => {
        e.preventDefault();
        const route = `/payment-schedules/${penaltyForm.data.payment_schedule_id}/penalty`;
        penaltyForm.put(route, {
            onSuccess: () => {
                toast.success(
                    isEditMode
                        ? 'Penalty updated successfully'
                        : 'Penalty added successfully',
                );
                setIsPenaltyModalOpen(false);
                penaltyForm.reset();
                setSelectedSchedule(null);
                setIsEditMode(false);
            },
            onError: () => {
                toast.error(
                    isEditMode
                        ? 'Failed to update penalty'
                        : 'Failed to add penalty',
                );
            },
        });
    };

    const handleClosePenaltyModal = () => {
        setIsPenaltyModalOpen(false);
        penaltyForm.reset();
        setSelectedSchedule(null);
        setIsEditMode(false);
    };

    const handleOpenPaymentModal = (schedule: any) => {
        if (schedule.status.toLowerCase() === 'paid') {
            return;
        }
        setSelectedSchedule(schedule);
        const amountPaid =
            schedule.payment_histories?.reduce(
                (sum, history) => sum + parseFloat(history.amount_paid || 0),
                0,
            ) || 0;
        const remaining = parseFloat(schedule.total_due) - amountPaid;

        paymentForm.setData({
            payment_schedule_id: schedule.id,
            amount_paid: remaining.toFixed(2),
            payment_method: 'cash',
            reference_number: '',
            receipt_number: '',
            payment_date: new Date().toISOString().split('T')[0],
        });
        setIsPaymentModalOpen(true);
    };

    const handleSubmitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post('/payment-histories', {
            onSuccess: () => {
                toast.success('Payment recorded successfully');
                setIsPaymentModalOpen(false);
                paymentForm.reset();
                setSelectedSchedule(null);
            },
            onError: () => {
                toast.error('Failed to record payment');
            },
        });
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        paymentForm.reset();
        setSelectedSchedule(null);
    };

    const handleOpenEditPaymentModal = (
        history: PaymentHistoryWithSchedule,
    ) => {
        if (!history || !history.id) {
            toast.error('Invalid payment record');
            return;
        }

        setSelectedPaymentHistory(history);
        editPaymentForm.setData({
            amount_paid: String(history.amount_paid),
            payment_method: history.payment_method,
            reference_number: history.reference_number || '',
            receipt_number: history.receipt_number || '',
            payment_date: history.payment_date,
        });
        setIsEditPaymentModalOpen(true);
    };

    const handleSubmitEditPayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPaymentHistory?.id) {
            toast.error('Invalid payment record');
            return;
        }

        editPaymentForm.put(`/payment-histories/${selectedPaymentHistory.id}`, {
            onSuccess: () => {
                toast.success('Payment updated successfully');
                setIsEditPaymentModalOpen(false);
                editPaymentForm.reset();
                setSelectedPaymentHistory(null);
            },
            onError: () => {
                toast.error('Failed to update payment');
            },
        });
    };

    const handleCloseEditPaymentModal = () => {
        setIsEditPaymentModalOpen(false);
        editPaymentForm.reset();
        setSelectedPaymentHistory(null);
    };

    const handleDeletePayment = (historyId: number | undefined) => {
        if (!historyId) {
            toast.error('Invalid payment record');
            return;
        }

        if (confirm('Are you sure you want to delete this payment record?')) {
            editPaymentForm.delete(`/payment-histories/${historyId}`, {
                onSuccess: () => {
                    toast.success('Payment deleted successfully');
                    setIsEditPaymentModalOpen(false);
                    editPaymentForm.reset();
                    setSelectedPaymentHistory(null);
                },
                onError: () => {
                    toast.error('Failed to delete payment');
                },
            });
        }
    };

    // Get all payment histories from all schedules
    const allPaymentHistories: PaymentHistoryWithSchedule[] =
        loan.payment_schedules?.flatMap((schedule) =>
            (schedule.payment_histories || [])
                .filter((history) => history && history.id) // Filter out invalid entries
                .map((history) => ({
                    id: history.id,
                    payment_schedule_id: history.payment_schedule_id,
                    amount_paid: history.amount_paid,
                    payment_method: history.payment_method,
                    reference_number: history.reference_number,
                    receipt_number: history.receipt_number,
                    payment_date: history.payment_date,
                    schedule_number:
                        loan.payment_schedules.findIndex(
                            (s) => s.id === schedule.id,
                        ) + 1,
                    due_date: schedule.due_date,
                })),
        ) || [];

    // Sort by payment date, newest first
    const sortedPaymentHistories = allPaymentHistories.sort(
        (a, b) =>
            new Date(b.payment_date).getTime() -
            new Date(a.payment_date).getTime(),
    );

    return (
        <AppLayout>
            <Head title="My Pautang Details" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content - Left Side */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                            <ModuleHeading
                                title="My Pautang Details"
                                description="Installment order details and payment schedule"
                            />
                            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                                {!loan.is_voided && (
                                    <Button
                                        variant="destructive"
                                        className="cursor-pointer"
                                        onClick={() => handleOpenVoidModal()}
                                    >
                                        <Ban className="mr-2 h-4 w-4" />
                                        Void Loan
                                    </Button>
                                )}
                                {!loan.is_voided && (
                                    <Button variant="outline" asChild>
                                        <a
                                            target="_blank"
                                            href={`/my-pautang/${loan.id}/promissory-note/download`}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Promissory Note
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    className="hidden sm:flex"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/my-pautang">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to List
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {loan.is_voided ? (
                            <Alert variant="destructive" className="py-3">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="ml-2">
                                    <span className="font-semibold">
                                        This order has been voided
                                    </span>{' '}
                                    on{' '}
                                    {loan.voided_at
                                        ? formatDate(loan.voided_at)
                                        : 'N/A'}
                                    {loan.void_reason &&
                                        ` - ${loan.void_reason}`}
                                </AlertDescription>
                            </Alert>
                        ) : (
                            ''
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Borrower Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Name
                                        </p>
                                        <p className="font-medium">
                                            {loan.borrower?.full_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Address
                                        </p>
                                        <p className="font-medium">
                                            {loan.borrower?.address ?? 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Phone Number
                                        </p>
                                        <p className="font-medium">
                                            {loan.borrower?.contact_number ??
                                                'N/A'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Transaction Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Transaction Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Loan Number
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <QrCode className="h-4 w-4" />
                                            {loan.loan_number}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Transaction Date
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <Calendar className="h-4 w-4" />
                                            {loan.transaction_date}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Status
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <TimerIcon className="h-4 w-4" />
                                            {loan.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Interest Type
                                        </span>
                                        <span className="font-medium">
                                            {loan.interest_type}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Interest Period
                                        </span>
                                        <span className="font-medium">
                                            {loan.frequency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Loan Duration
                                        </span>
                                        <span className="font-medium">
                                            {loan.duration}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Payment Frequency
                                        </span>
                                        <span className="font-medium">
                                            {loan.payment_frequency}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Financial Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Financial Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Principal Amount
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(loan.amount)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Interest
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {loan.interest_type === 'fixed'
                                                ? formatCurrency(
                                                      loan.interest_value,
                                                  )
                                                : `${loan.interest_value}%`}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Total Amount
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(loan.total_amount)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Remaining Balance
                                        </p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {formatCurrency(
                                                loan.remaining_balance,
                                            )}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Total Penalties
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(
                                                loan.total_penalties,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Payment Progress
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(totalPaid)} of{' '}
                                            {formatCurrency(loan.total_amount)}
                                        </span>
                                    </div>
                                    <div className="h-3 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-3 rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${Math.min(paymentProgress, 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-right text-xs text-muted-foreground">
                                        {paymentProgress.toFixed(1)}% completed
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Schedule */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Payment Schedule
                                        </CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Complete payment history and
                                            schedule. Click on a row to add/edit
                                            penalty.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Mobile: collapsible schedule list for cleaner view */}
                                <div className="p-2 sm:hidden">
                                    <Accordion type="single" collapsible>
                                        {loan.payment_schedules?.map(
                                            (schedule, index) => {
                                                const amountPaid =
                                                    schedule.payment_histories?.reduce(
                                                        (sum, history) =>
                                                            sum +
                                                            parseFloat(
                                                                history.amount_paid ||
                                                                    0,
                                                            ),
                                                        0,
                                                    ) || 0;
                                                const remaining =
                                                    parseFloat(
                                                        schedule.total_due,
                                                    ) - amountPaid;
                                                const lastPaymentDate =
                                                    schedule
                                                        .payment_histories?.[
                                                        schedule
                                                            .payment_histories
                                                            .length - 1
                                                    ]?.payment_date;
                                                const isPaid =
                                                    schedule.status.toLowerCase() ===
                                                    'paid';
                                                const hasPenalty =
                                                    schedule.penalty_amount &&
                                                    parseFloat(
                                                        schedule.penalty_amount,
                                                    ) > 0;
                                                const isOverdue =
                                                    new Date()
                                                        .toISOString()
                                                        .split('T')[0] >
                                                        schedule.due_date &&
                                                    schedule.status.toLowerCase() ===
                                                        'pending';

                                                return (
                                                    <AccordionItem
                                                        key={schedule.id}
                                                        value={`schedule-${schedule.id}`}
                                                        className={`border-b last:border-b-0 ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
                                                    >
                                                        <AccordionTrigger
                                                            className={`px-3 py-3 ${!isPaid ? 'hover:bg-muted/50' : 'opacity-60'}`}
                                                        >
                                                            <div className="flex w-full items-center justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <p className="truncate text-sm font-medium">
                                                                        #
                                                                        {index +
                                                                            1}{' '}
                                                                        •{' '}
                                                                        {formatDate(
                                                                            schedule.due_date,
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div className="flex shrink-0 items-center gap-3">
                                                                    <span className="text-sm font-bold text-orange-600">
                                                                        {formatCurrency(
                                                                            remaining,
                                                                        )}
                                                                    </span>
                                                                    <div className="shrink-0">
                                                                        {isOverdue
                                                                            ? getStatusBadge(
                                                                                  'overdue',
                                                                              )
                                                                            : getStatusBadge(
                                                                                  schedule.status,
                                                                              )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>

                                                        <AccordionContent>
                                                            <div className="rounded bg-muted/10 p-3">
                                                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                                    <div className="">
                                                                        Amount
                                                                        Paid
                                                                    </div>
                                                                    <div className="text-right font-medium">
                                                                        {amountPaid >
                                                                        0
                                                                            ? formatCurrency(
                                                                                  amountPaid,
                                                                              )
                                                                            : '-'}
                                                                    </div>

                                                                    <div>
                                                                        Penalty
                                                                    </div>
                                                                    <div className="text-right font-medium">
                                                                        {schedule.penalty_amount
                                                                            ? formatCurrency(
                                                                                  parseFloat(
                                                                                      schedule.penalty_amount,
                                                                                  ),
                                                                              )
                                                                            : '-'}
                                                                    </div>

                                                                    <div>
                                                                        Payment
                                                                        Date
                                                                    </div>
                                                                    <div className="text-right font-medium">
                                                                        {lastPaymentDate
                                                                            ? formatDate(
                                                                                  lastPaymentDate,
                                                                              )
                                                                            : '-'}
                                                                    </div>
                                                                </div>

                                                                <Separator className="my-3" />

                                                                <div className="flex flex-col gap-2">
                                                                    {!isPaid && (
                                                                        <Button
                                                                            className="w-full"
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() =>
                                                                                handleOpenPaymentModal(
                                                                                    schedule,
                                                                                )
                                                                            }
                                                                        >
                                                                            Pay
                                                                        </Button>
                                                                    )}

                                                                    {!isPaid && (
                                                                        <Button
                                                                            className="w-full"
                                                                            size="sm"
                                                                            variant={
                                                                                hasPenalty
                                                                                    ? 'default'
                                                                                    : 'destructive'
                                                                            }
                                                                            onClick={() =>
                                                                                handleRowClick(
                                                                                    schedule,
                                                                                )
                                                                            }
                                                                        >
                                                                            {hasPenalty
                                                                                ? 'Edit Penalty'
                                                                                : 'Add Penalty'}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                );
                                            },
                                        )}
                                    </Accordion>
                                </div>

                                {/* Desktop table - hidden on small screens */}
                                <div className="hidden sm:block sm:overflow-x-auto">
                                    <table className="w-full text-sm sm:text-base">
                                        <thead className="border-b bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                                    #
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">
                                                    Due Date
                                                </th>
                                                <th className="hidden px-4 py-3 text-right text-sm font-semibold sm:table-cell">
                                                    Amount Due
                                                </th>
                                                <th className="hidden px-4 py-3 text-right text-sm font-semibold sm:table-cell">
                                                    Amount Paid
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold">
                                                    Remaining
                                                </th>
                                                <th className="hidden px-4 py-3 text-right text-sm font-semibold sm:table-cell">
                                                    Penalty
                                                </th>
                                                <th className="hidden px-4 py-3 text-center text-sm font-semibold sm:table-cell">
                                                    Payment Date
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {loan.payment_schedules?.map(
                                                (schedule, index) => {
                                                    const amountPaid =
                                                        schedule.payment_histories?.reduce(
                                                            (sum, history) =>
                                                                sum +
                                                                parseFloat(
                                                                    history.amount_paid ||
                                                                        0,
                                                                ),
                                                            0,
                                                        ) || 0;
                                                    const remaining =
                                                        parseFloat(
                                                            schedule.total_due,
                                                        ) - amountPaid;
                                                    const lastPaymentDate =
                                                        schedule
                                                            .payment_histories?.[
                                                            schedule
                                                                .payment_histories
                                                                .length - 1
                                                        ]?.payment_date;
                                                    const isPaid =
                                                        schedule.status.toLowerCase() ===
                                                        'paid';
                                                    const hasPenalty =
                                                        schedule.penalty_amount &&
                                                        parseFloat(
                                                            schedule.penalty_amount,
                                                        ) > 0;
                                                    return (
                                                        <tr
                                                            key={schedule.id}
                                                            onClick={() =>
                                                                handleRowClick(
                                                                    schedule,
                                                                )
                                                            }
                                                            className={`transition-colors ${
                                                                !isPaid
                                                                    ? 'cursor-pointer hover:bg-muted/50'
                                                                    : 'cursor-not-allowed opacity-60'
                                                            }`}
                                                        >
                                                            <td className="px-4 py-4 text-sm font-medium">
                                                                #{index + 1}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm">
                                                                {formatDate(
                                                                    schedule.due_date,
                                                                )}
                                                            </td>
                                                            <td className="hidden px-4 py-4 text-right text-sm font-medium sm:table-cell">
                                                                {formatCurrency(
                                                                    parseFloat(
                                                                        schedule.total_due,
                                                                    ),
                                                                )}
                                                            </td>
                                                            <td className="hidden px-4 py-4 text-right text-sm sm:table-cell">
                                                                {amountPaid > 0
                                                                    ? formatCurrency(
                                                                          amountPaid,
                                                                      )
                                                                    : '-'}
                                                            </td>
                                                            <td className="px-4 py-4 text-right text-sm font-medium text-orange-600">
                                                                {formatCurrency(
                                                                    remaining,
                                                                )}
                                                            </td>
                                                            <td className="hidden px-4 py-4 text-right sm:table-cell">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <span className="text-sm font-medium text-red-600">
                                                                        {schedule.penalty_amount
                                                                            ? formatCurrency(
                                                                                  parseFloat(
                                                                                      schedule.penalty_amount,
                                                                                  ),
                                                                              )
                                                                            : '-'}
                                                                    </span>
                                                                    {hasPenalty &&
                                                                        !isPaid && (
                                                                            <Edit className="h-3 w-3 text-muted-foreground" />
                                                                        )}
                                                                </div>
                                                            </td>
                                                            <td className="hidden px-4 py-4 text-center text-sm sm:table-cell">
                                                                {lastPaymentDate
                                                                    ? formatDate(
                                                                          lastPaymentDate,
                                                                      )
                                                                    : '-'}
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                {new Date()
                                                                    .toISOString()
                                                                    .split(
                                                                        'T',
                                                                    )[0] >
                                                                    schedule.due_date &&
                                                                schedule.status.toLowerCase() ===
                                                                    'pending'
                                                                    ? getStatusBadge(
                                                                          'overdue',
                                                                      )
                                                                    : getStatusBadge(
                                                                          schedule.status,
                                                                      )}
                                                            </td>
                                                        </tr>
                                                    );
                                                },
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar - Record Payment & Payment History */}
                    <div className="space-y-6">
                        {/* Record Payment Card */}
                        {loan.is_voided ? (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <XCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                    <h3 className="mb-2 text-xl font-bold">
                                        No Payments Available
                                    </h3>
                                    <p className="text-muted-foreground">
                                        This order cannot accept payments.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Record Payment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <Label>Select Payment Schedule</Label>
                                        <div className="space-y-2">
                                            {loan.payment_schedules
                                                ?.filter(
                                                    (schedule) =>
                                                        schedule.status.toLowerCase() !==
                                                        'paid',
                                                )
                                                .map((schedule, index) => {
                                                    const amountPaid =
                                                        schedule.payment_histories?.reduce(
                                                            (sum, history) =>
                                                                sum +
                                                                parseFloat(
                                                                    history.amount_paid ||
                                                                        0,
                                                                ),
                                                            0,
                                                        ) || 0;
                                                    const remaining =
                                                        parseFloat(
                                                            schedule.total_due,
                                                        ) - amountPaid;
                                                    return (
                                                        <Button
                                                            key={schedule.id}
                                                            variant="outline"
                                                            className="h-auto w-full cursor-pointer justify-between py-3"
                                                            onClick={() =>
                                                                handleOpenPaymentModal(
                                                                    schedule,
                                                                )
                                                            }
                                                        >
                                                            <div className="flex flex-col items-start gap-1">
                                                                <span className="text-sm font-medium">
                                                                    Payment #
                                                                    {loan.payment_schedules.findIndex(
                                                                        (s) =>
                                                                            s.id ===
                                                                            schedule.id,
                                                                    ) + 1}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    Due:{' '}
                                                                    {formatDate(
                                                                        schedule.due_date,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-sm font-bold text-orange-600">
                                                                    {formatCurrency(
                                                                        remaining,
                                                                    )}
                                                                </span>
                                                                {getStatusBadge(
                                                                    schedule.status,
                                                                )}
                                                            </div>
                                                        </Button>
                                                    );
                                                })}
                                            {!loan.payment_schedules?.some(
                                                (schedule) =>
                                                    schedule.status.toLowerCase() !==
                                                    'paid',
                                            ) && (
                                                <p className="py-4 text-center text-sm text-muted-foreground">
                                                    All payments completed
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Payment History Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Payment History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-[600px] space-y-3 overflow-y-auto">
                                    {sortedPaymentHistories.length > 0 ? (
                                        sortedPaymentHistories.map(
                                            (history, index) => (
                                                <div
                                                    key={index}
                                                    className="space-y-2 rounded-lg border p-3 transition-colors hover:border-primary"
                                                >
                                                    <div className="flex min-w-0 items-start justify-between">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium">
                                                                Payment #
                                                                {
                                                                    history.schedule_number
                                                                }
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                {formatDate(
                                                                    history.payment_date,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-2">
                                                            <p className="text-sm font-bold text-green-600">
                                                                {formatCurrency(
                                                                    parseFloat(
                                                                        history.amount_paid,
                                                                    ),
                                                                )}
                                                            </p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0"
                                                                onClick={() =>
                                                                    handleOpenEditPaymentModal(
                                                                        history,
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">
                                                                Method:
                                                            </span>
                                                            <span className="font-medium capitalize">
                                                                {
                                                                    history.payment_method
                                                                }
                                                            </span>
                                                        </div>
                                                        {history.reference_number && (
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">
                                                                    Ref #:
                                                                </span>
                                                                <span className="font-medium">
                                                                    {
                                                                        history.reference_number
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {history.receipt_number && (
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">
                                                                    Receipt #:
                                                                </span>
                                                                <span className="font-medium">
                                                                    {
                                                                        history.receipt_number
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="py-8 text-center text-sm text-muted-foreground">
                                            No payment history yet
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Void Loan Modal */}
            <Dialog open={isVoidModalOpen} onOpenChange={setIsVoidModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmitVoid}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Ban className="h-5 w-5 text-red-600" />
                                Void Loan
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to void this loan? This
                                action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                                <p className="font-medium">Warning!</p>
                                <p>
                                    Voiding this loan will permanently mark it
                                    as cancelled.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="void_reason">
                                    Reason for Voiding *
                                </Label>
                                <Textarea
                                    id="void_reason"
                                    placeholder="Please provide a reason for voiding this loan..."
                                    className="min-h-[100px]"
                                    value={voidForm.data.void_reason}
                                    onChange={(e) =>
                                        voidForm.setData(
                                            'void_reason',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {voidForm.errors.void_reason && (
                                    <p className="text-sm text-red-500">
                                        {voidForm.errors.void_reason}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseVoidModal}
                                disabled={voidForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={voidForm.processing}
                            >
                                {voidForm.processing
                                    ? 'Voiding...'
                                    : 'Void Loan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Penalty Modal */}
            <Dialog
                open={isPenaltyModalOpen}
                onOpenChange={setIsPenaltyModalOpen}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmitPenalty}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {isEditMode ? (
                                    <>
                                        <Edit className="h-5 w-5 text-orange-600" />
                                        Edit Penalty
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                        Add Penalty
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditMode ? 'Update the' : 'Add a'} penalty
                                for payment #{' '}
                                {selectedSchedule &&
                                    loan.payment_schedules?.findIndex(
                                        (s) => s.id === selectedSchedule.id,
                                    ) + 1}
                                {selectedSchedule && (
                                    <span className="ml-1 font-medium">
                                        (Due:{' '}
                                        {formatDate(selectedSchedule.due_date)})
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {isEditMode && (
                                <div className="rounded-md bg-orange-50 p-3 text-sm text-orange-800">
                                    <p className="font-medium">
                                        Current Penalty:
                                    </p>
                                    <p className="text-lg font-bold">
                                        {formatCurrency(
                                            parseFloat(
                                                selectedSchedule?.penalty_amount ||
                                                    0,
                                            ),
                                        )}
                                    </p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="penalty_amount">
                                    {isEditMode
                                        ? 'New Penalty Amount *'
                                        : 'Penalty Amount *'}
                                </Label>
                                <div className="relative">
                                    <span className="absolute top-2.5 left-3 text-sm text-muted-foreground">
                                        ₱
                                    </span>
                                    <Input
                                        id="penalty_amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-7"
                                        value={penaltyForm.data.penalty_amount}
                                        onChange={(e) =>
                                            penaltyForm.setData(
                                                'penalty_amount',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                {penaltyForm.errors.penalty_amount && (
                                    <p className="text-sm text-red-500">
                                        {penaltyForm.errors.penalty_amount}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="remarks">
                                    Remarks (Optional)
                                </Label>
                                <Textarea
                                    id="remarks"
                                    placeholder={
                                        isEditMode
                                            ? 'Add any notes about this penalty update...'
                                            : 'Add any notes or remarks about this penalty...'
                                    }
                                    className="min-h-[100px]"
                                    value={penaltyForm.data.remarks}
                                    onChange={(e) =>
                                        penaltyForm.setData(
                                            'remarks',
                                            e.target.value,
                                        )
                                    }
                                />
                                {penaltyForm.errors.remarks && (
                                    <p className="text-sm text-red-500">
                                        {penaltyForm.errors.remarks}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClosePenaltyModal}
                                disabled={penaltyForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={penaltyForm.processing}
                                variant={isEditMode ? 'default' : 'destructive'}
                            >
                                {penaltyForm.processing
                                    ? isEditMode
                                        ? 'Updating...'
                                        : 'Adding...'
                                    : isEditMode
                                      ? 'Update Penalty'
                                      : 'Add Penalty'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Record Payment Modal */}
            <Dialog
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmitPayment}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Record Payment
                            </DialogTitle>
                            <DialogDescription>
                                Record payment for Payment #
                                {selectedSchedule &&
                                    loan.payment_schedules?.findIndex(
                                        (s) => s.id === selectedSchedule.id,
                                    ) + 1}
                                {selectedSchedule && (
                                    <span className="ml-1 font-medium">
                                        (Due:{' '}
                                        {formatDate(selectedSchedule.due_date)})
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount_paid">
                                    Amount Paid *
                                </Label>
                                <div className="relative">
                                    <span className="absolute top-2.5 left-3 text-sm text-muted-foreground">
                                        ₱
                                    </span>
                                    <Input
                                        id="amount_paid"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-7"
                                        value={paymentForm.data.amount_paid}
                                        onChange={(e) =>
                                            paymentForm.setData(
                                                'amount_paid',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                {paymentForm.errors.amount_paid && (
                                    <p className="text-sm text-red-500">
                                        {paymentForm.errors.amount_paid}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment_method">
                                    Payment Method *
                                </Label>
                                <select
                                    id="payment_method"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                    value={paymentForm.data.payment_method}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'payment_method',
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">
                                        Bank Transfer
                                    </option>
                                    <option value="gcash">GCash</option>
                                    <option value="paymaya">PayMaya</option>
                                    <option value="check">Check</option>
                                </select>
                                {paymentForm.errors.payment_method && (
                                    <p className="text-sm text-red-500">
                                        {paymentForm.errors.payment_method}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment_date">
                                    Payment Date *
                                </Label>
                                <Input
                                    id="payment_date"
                                    type="date"
                                    value={paymentForm.data.payment_date}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'payment_date',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {paymentForm.errors.payment_date && (
                                    <p className="text-sm text-red-500">
                                        {paymentForm.errors.payment_date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reference_number">
                                    Reference Number
                                </Label>
                                <Input
                                    id="reference_number"
                                    type="text"
                                    placeholder="Enter reference number"
                                    value={paymentForm.data.reference_number}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'reference_number',
                                            e.target.value,
                                        )
                                    }
                                />
                                {paymentForm.errors.reference_number && (
                                    <p className="text-sm text-red-500">
                                        {paymentForm.errors.reference_number}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="receipt_number">
                                    Receipt Number
                                </Label>
                                <Input
                                    id="receipt_number"
                                    type="text"
                                    placeholder="Enter receipt number"
                                    value={paymentForm.data.receipt_number}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'receipt_number',
                                            e.target.value,
                                        )
                                    }
                                />
                                {paymentForm.errors.receipt_number && (
                                    <p className="text-sm text-red-500">
                                        {paymentForm.errors.receipt_number}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClosePaymentModal}
                                disabled={paymentForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={paymentForm.processing}
                            >
                                {paymentForm.processing
                                    ? 'Recording...'
                                    : 'Record Payment'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Payment Modal */}
            <Dialog
                open={isEditPaymentModalOpen}
                onOpenChange={setIsEditPaymentModalOpen}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmitEditPayment}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Edit Payment
                            </DialogTitle>
                            <DialogDescription>
                                Edit payment details for Payment #
                                {selectedPaymentHistory?.schedule_number}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_amount_paid">
                                    Amount Paid *
                                </Label>
                                <div className="relative">
                                    <span className="absolute top-2.5 left-3 text-sm text-muted-foreground">
                                        ₱
                                    </span>
                                    <Input
                                        id="edit_amount_paid"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-7"
                                        value={editPaymentForm.data.amount_paid}
                                        onChange={(e) =>
                                            editPaymentForm.setData(
                                                'amount_paid',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                {editPaymentForm.errors.amount_paid && (
                                    <p className="text-sm text-red-500">
                                        {editPaymentForm.errors.amount_paid}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_payment_method">
                                    Payment Method *
                                </Label>
                                <select
                                    id="edit_payment_method"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                    value={editPaymentForm.data.payment_method}
                                    onChange={(e) =>
                                        editPaymentForm.setData(
                                            'payment_method',
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">
                                        Bank Transfer
                                    </option>
                                    <option value="gcash">GCash</option>
                                    <option value="paymaya">PayMaya</option>
                                    <option value="check">Check</option>
                                </select>
                                {editPaymentForm.errors.payment_method && (
                                    <p className="text-sm text-red-500">
                                        {editPaymentForm.errors.payment_method}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_payment_date">
                                    Payment Date *
                                </Label>
                                <Input
                                    id="edit_payment_date"
                                    type="date"
                                    value={editPaymentForm.data.payment_date}
                                    onChange={(e) =>
                                        editPaymentForm.setData(
                                            'payment_date',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {editPaymentForm.errors.payment_date && (
                                    <p className="text-sm text-red-500">
                                        {editPaymentForm.errors.payment_date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_reference_number">
                                    Reference Number
                                </Label>
                                <Input
                                    id="edit_reference_number"
                                    type="text"
                                    placeholder="Enter reference number"
                                    value={
                                        editPaymentForm.data.reference_number
                                    }
                                    onChange={(e) =>
                                        editPaymentForm.setData(
                                            'reference_number',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editPaymentForm.errors.reference_number && (
                                    <p className="text-sm text-red-500">
                                        {
                                            editPaymentForm.errors
                                                .reference_number
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_receipt_number">
                                    Receipt Number
                                </Label>
                                <Input
                                    id="edit_receipt_number"
                                    type="text"
                                    placeholder="Enter receipt number"
                                    value={editPaymentForm.data.receipt_number}
                                    onChange={(e) =>
                                        editPaymentForm.setData(
                                            'receipt_number',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editPaymentForm.errors.receipt_number && (
                                    <p className="text-sm text-red-500">
                                        {editPaymentForm.errors.receipt_number}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() =>
                                    handleDeletePayment(
                                        selectedPaymentHistory?.id,
                                    )
                                }
                                disabled={
                                    editPaymentForm.processing ||
                                    !selectedPaymentHistory
                                }
                            >
                                Delete Payment
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseEditPaymentModal}
                                    disabled={editPaymentForm.processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editPaymentForm.processing}
                                >
                                    {editPaymentForm.processing
                                        ? 'Updating...'
                                        : 'Update Payment'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
