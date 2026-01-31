import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Icons
import {
    Banknote,
    CalendarDays,
    FilePlus,
    FileText,
    Plus,
    Search,
    Trash2,
    Upload,
    User,
    Users,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

import axios from 'axios';
import { BreadcrumbItem } from '@/types';

const breadcrumbs:  BreadcrumbItem[] = [
    {
        title: 'Loans',
        href: '/my-pautang',
    },
];

export default function Create() {
    const [payments, setPayments] = useState([{ date: '', amount: '' }]);
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [paymentTerms, setPaymentTerms] = useState('');
    const [firstPaymentDate, setFirstPaymentDate] = useState('');
    const [isExistingBorrower, setIsExistingBorrower] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const debouncedSearch = useDebouncedCallback(async (searchTerm) => {
        if (searchTerm.trim().length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get('/api/borrowers', {
                params: { search: searchTerm },
            });
            setSearchResults(response.data.data || response.data);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching borrowers:', error);
            toast.error('Failed to search borrowers');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, 500); // 500ms delay

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleSelectBorrower = (borrower) => {
        console.log(borrower);
        setIsExistingBorrower(borrower.id);
        setData({
            ...data,
            is_existing_borrower: true,
            first_name: borrower.first_name,
            last_name: borrower.last_name,
            contact_number: borrower.contact_number,
            email: borrower.email || '',
            address: borrower.address,
            city: borrower.city,
            province: borrower.province,
            zip_code: borrower.zip_code,
            country: borrower.country,
            reference_name: borrower.references?.name || '',
            reference_contact: borrower.references?.contact_number || '',
        });

        setSearchQuery(`${borrower.first_name} ${borrower.last_name}`);
        setShowResults(false);
        toast.success('Borrower information loaded');
    };

    // Clear search and form
    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
        setIsExistingBorrower(0);
        setData({
            ...data,
            is_existing_borrower: false,
            first_name: '',
            last_name: '',
            contact_number: '',
            email: '',
            address: '',
            city: '',
            province: '',
            zip_code: '',
            country: 'PHILIPPINES',
            reference_name: '',
            reference_contact: '',
        });
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        contact_number: '',
        email: '',
        address: '',
        city: '',
        province: '',
        zip_code: '',
        country: 'PHILIPPINES',
        reference_name: '',
        reference_contact: '',
        principal_amount: '',
        interest_type: 'percentage',
        interest_value: '',
        interest_period: 'per_month',
        loan_duration: '',
        payment_frequency: 'monthly',
        duration_unit: 'months',
        transaction_date: getTodayDate(),
        documents: [],
        payment_schedule: [],
        is_existing_borrower: false,
    });

    const addPaymentRow = () => {
        setPayments([...payments, { date: '', amount: '' }]);
    };

    const removePaymentRow = (index) => {
        if (payments.length === 1) return;
        const updated = [...payments];
        updated.splice(index, 1);
        setPayments(updated);
    };

    const updatePaymentRow = (index, field, value) => {
        const updated = [...payments];
        updated[index][field] = value;
        setPayments(updated);
        setData('payment_schedule', updated);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files).map((file) => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                file: file,
            }));
            setUploadedFiles([...uploadedFiles, ...newFiles]);
        }
    };

    const removeFile = (id: string) => {
        setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const calculateTotalInterest = () => {
        const principal = parseFloat(data.principal_amount) || 0;
        const interestValue = parseFloat(data.interest_value) || 0;
        const duration = parseFloat(data.loan_duration) || 0;

        if (data.interest_period === 'total') {
            // Original calculation - interest for entire loan
            if (data.interest_type === 'percentage') {
                return (principal * interestValue) / 100;
            } else {
                return interestValue;
            }
        } else {
            // Per-period interest calculation
            let periods = 0;

            // Convert duration to the interest period unit
            if (data.interest_period === 'per_day') {
                if (data.duration_unit === 'days') periods = duration;
                else if (data.duration_unit === 'weeks') periods = duration * 7;
                else if (data.duration_unit === 'months')
                    periods = duration * 30;
            } else if (data.interest_period === 'per_week') {
                if (data.duration_unit === 'days') periods = duration / 7;
                else if (data.duration_unit === 'weeks') periods = duration;
                else if (data.duration_unit === 'months')
                    periods = duration * 4;
            } else if (data.interest_period === 'per_month') {
                if (data.duration_unit === 'days') periods = duration / 30;
                else if (data.duration_unit === 'weeks') periods = duration / 4;
                else if (data.duration_unit === 'months') periods = duration;
            }

            if (data.interest_type === 'percentage') {
                return (principal * interestValue * periods) / 100;
            } else {
                return interestValue * periods;
            }
        }
    };

    const calculateTotal = () => {
        const principal = parseFloat(data.principal_amount) || 0;
        const totalInterest = calculateTotalInterest();
        return principal + totalInterest;
    };

    const handleAutoCalculate = () => {
        const terms = parseInt(paymentTerms) || 0;
        if (terms <= 0) {
            toast.info('Please enter a valid number of payment terms');
            return;
        }

        const total = calculateTotal();
        const amountPerPayment = total / terms;

        const newPayments = Array.from({ length: terms }, () => ({
            date: '',
            amount: amountPerPayment.toFixed(2),
        }));

        setPayments(newPayments);
        setData({ ...data, payment_schedule: newPayments });
    };

    const calculateTotalFromSchedule = () => {
        return payments.reduce((sum, payment) => {
            return sum + (parseFloat(payment.amount) || 0);
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validSchedule = payments.every((p) => 
            p.date && p.amount
        );
        if (!validSchedule) {
            toast.error(
                'Please fill in all payment schedule dates and amounts',
            );
            return;
        }

        post('/my-pautang', {
            onSuccess: () => {
                toast.success('Loan registered successfully');
                reset();
                setPayments([{ date: '', amount: '' }]);
                setUploadedFiles([]);
            },
            onError: (e) => {
                toast.error('Failed to register loan. Please check the form.');
                console.log(e);
            },
        });
    };

    const total = calculateTotal();
    const totalInterest = calculateTotalInterest();
    const scheduleTotal = calculateTotalFromSchedule();

    const getInterestPeriodLabel = () => {
        if (data.interest_period === 'per_day')
            return data.interest_type === 'percentage'
                ? '% per day'
                : '₱ per day';
        if (data.interest_period === 'per_week')
            return data.interest_type === 'percentage'
                ? '% per week'
                : '₱ per week';
        if (data.interest_period === 'per_month')
            return data.interest_type === 'percentage'
                ? '% per month'
                : '₱ per month';
        return data.interest_type === 'percentage' ? '%' : '₱';
    };

    const handleAutoGenerateSchedule = () => {
        if (!firstPaymentDate) {
            toast.info('Please select the first payment date');
            return;
        }

        const total = calculateTotal();
        if (total <= 0) {
            toast.info('Please configure loan amount and interest first');
            return;
        }

        const duration = parseFloat(data.loan_duration) || 0;
        const durationUnit = data.duration_unit;

        let numberOfPayments = 0;
        let daysBetweenPayments = 0;

        // Calculate number of payments based on frequency and duration
        switch (data.payment_frequency) {
            case 'daily':
                if (durationUnit === 'days') numberOfPayments = duration;
                else if (durationUnit === 'weeks')
                    numberOfPayments = duration * 7;
                else if (durationUnit === 'months')
                    numberOfPayments = duration * 30;
                daysBetweenPayments = 1;
                break;
            case 'weekly':
                if (durationUnit === 'days')
                    numberOfPayments = Math.ceil(duration / 7);
                else if (durationUnit === 'weeks') numberOfPayments = duration;
                else if (durationUnit === 'months')
                    numberOfPayments = duration * 4;
                daysBetweenPayments = 7;
                break;
            case 'twice_monthly':
                if (durationUnit === 'days')
                    numberOfPayments = Math.ceil(duration / 15);
                else if (durationUnit === 'weeks')
                    numberOfPayments = Math.ceil(duration / 2);
                else if (durationUnit === 'months')
                    numberOfPayments = duration * 2;
                daysBetweenPayments = 15;
                break;
            case 'monthly':
                if (durationUnit === 'days')
                    numberOfPayments = Math.ceil(duration / 30);
                else if (durationUnit === 'weeks')
                    numberOfPayments = Math.ceil(duration / 4);
                else if (durationUnit === 'months') numberOfPayments = duration;
                daysBetweenPayments = 30;
                break;
        }

        if (numberOfPayments <= 0) {
            alert('Invalid loan duration or payment frequency');
            return;
        }

        const amountPerPayment = total / numberOfPayments;
        const newPayments = [];
        const startDate = new Date(firstPaymentDate);

        for (let i = 0; i < numberOfPayments; i++) {
            const paymentDate = new Date(startDate);

            if (data.payment_frequency === 'twice_monthly') {
                // For twice monthly: 1st and 16th of each month
                const monthsToAdd = Math.floor(i / 2);
                paymentDate.setMonth(startDate.getMonth() + monthsToAdd);
                paymentDate.setDate(i % 2 === 0 ? startDate.getDate() : 16);
            } else {
                paymentDate.setDate(
                    startDate.getDate() + i * daysBetweenPayments,
                );
            }

            newPayments.push({
                date: paymentDate.toISOString().split('T')[0],
                amount: amountPerPayment.toFixed(2),
            });
        }

        setPayments(newPayments);
        setData({ ...data, payment_schedule: newPayments });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrower & Loan Registration" />

            <div className="min-h-screen space-y-4 bg-slate-50/30 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                        New Loan Registration
                    </h2>
                </div>

                {/* LOAN & TUBO SECTION */}
                <Card className="overflow-hidden shadow-md">
                    <CardHeader className="border-b pb-3 sm:pb-4">
                        <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 sm:h-5 sm:w-5" />
                            <CardTitle className="text-base sm:text-lg">
                                Loan & Tubo (Interest) Configuration
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Principal Amount{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute top-2 left-3 text-sm text-slate-400 sm:top-2.5">
                                        ₱
                                    </span>
                                    <Input
                                        type="number"
                                        className="pl-7 font-mono text-base sm:text-lg"
                                        placeholder="0.00"
                                        value={data.principal_amount}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                principal_amount:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Loan Duration
                                    <span className="text-red-500"> *</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="e.g. 3"
                                        className="text-sm"
                                        value={data.loan_duration}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                loan_duration: e.target.value,
                                            })
                                        }
                                    />
                                    <Select
                                        value={data.duration_unit}
                                        onValueChange={(value) =>
                                            setData({
                                                ...data,
                                                duration_unit: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-32 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="days">
                                                Days
                                            </SelectItem>
                                            <SelectItem value="weeks">
                                                Weeks
                                            </SelectItem>
                                            <SelectItem value="months">
                                                Months
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Transaction Date
                                </Label>
                                <Input
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            transaction_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Interest Type
                                </Label>
                                <Select
                                    value={data.interest_type}
                                    onValueChange={(value) =>
                                        setData({
                                            ...data,
                                            interest_type: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="text-sm">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">
                                            Fixed Amount (₱)
                                        </SelectItem>
                                        <SelectItem value="percentage">
                                            Percentage (%)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Interest Period
                                </Label>
                                <Select
                                    value={data.interest_period}
                                    onValueChange={(value) =>
                                        setData({
                                            ...data,
                                            interest_period: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="total">
                                            Total (One-time)
                                        </SelectItem>
                                        <SelectItem value="per_day">
                                            Per Day
                                        </SelectItem>
                                        <SelectItem value="per_week">
                                            Per Week
                                        </SelectItem>
                                        <SelectItem value="per_month">
                                            Per Month
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Interest Value{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    {data.interest_type === 'fixed' && (
                                        <span className="absolute top-2 left-3 text-sm text-slate-400 sm:top-2.5">
                                            ₱
                                        </span>
                                    )}
                                    <Input
                                        type="number"
                                        placeholder={
                                            data.interest_type === 'percentage'
                                                ? 'e.g. 5'
                                                : 'e.g. 50'
                                        }
                                        className={`font-mono text-sm ${data.interest_type === 'fixed' ? 'pl-7' : ''}`}
                                        value={data.interest_value}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                interest_value: e.target.value,
                                            })
                                        }
                                    />
                                    <div className="absolute top-2 right-3 text-sm text-slate-400 sm:top-2.5">
                                        {data.interest_period === 'per_day' &&
                                            (data.interest_type === 'percentage'
                                                ? '% /day'
                                                : '₱ /day')}
                                        {data.interest_period === 'per_week' &&
                                            (data.interest_type === 'percentage'
                                                ? '% /week'
                                                : '₱ /week')}
                                        {data.interest_period === 'per_month' &&
                                            (data.interest_type === 'percentage'
                                                ? '% /month'
                                                : '₱ /month')}
                                        {data.interest_period === 'total' &&
                                            (data.interest_type === 'percentage'
                                                ? '%'
                                                : '₱')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Calculation Display */}
                        <div className="mt-4 rounded-lg border-2 border-blue-100 bg-blue-50/50 p-3 sm:mt-6 sm:p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-600 sm:text-sm">
                                        Total Amount (Principal + Interest)
                                    </p>
                                    <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                                        Principal: ₱
                                        {parseFloat(
                                            data.principal_amount || 0,
                                        ).toFixed(2)}{' '}
                                        + Interest: ₱{totalInterest.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="font-mono text-2xl font-black text-blue-600 sm:text-3xl">
                                        ₱ {total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* REPAYMENT SCHEDULE SECTION */}
                {/* REPAYMENT SCHEDULE SECTION */}
                <Card className="border-slate-200 shadow-md">
                    <CardHeader className="border-b pb-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                            <div>
                                <CardTitle className="text-base sm:text-lg">
                                    Settlement Schedule
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Auto-generate payment schedule or manually
                                    define payments.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Auto-Generate Controls */}
                    <div className="border-b bg-slate-50/50 p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    First Payment Date
                                </Label>
                                <Input
                                    type="date"
                                    value={firstPaymentDate}
                                    onChange={(e) =>
                                        setFirstPaymentDate(e.target.value)
                                    }
                                    className="text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Payment Frequency
                                </Label>
                                <Select
                                    value={data.payment_frequency}
                                    onValueChange={(value) =>
                                        setData({
                                            ...data,
                                            payment_frequency: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">
                                            Daily
                                        </SelectItem>
                                        <SelectItem value="weekly">
                                            Weekly
                                        </SelectItem>
                                        <SelectItem value="twice_monthly">
                                            Twice a Month (Every 15 days)
                                        </SelectItem>
                                        <SelectItem value="monthly">
                                            Monthly
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    onClick={handleAutoGenerateSchedule}
                                    className="w-full bg-blue-600 text-xs hover:bg-blue-700 sm:text-sm"
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    Auto-Generate Schedule
                                </Button>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        {/* Add Payment Button - moved inside */}
                        <div className="flex justify-end border-b bg-white p-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPaymentRow}
                                className="border-blue-200 text-xs hover:bg-blue-50 sm:text-sm"
                            >
                                <Plus className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />{' '}
                                Add Payment
                            </Button>
                        </div>

                        {/* Mobile view - Card layout */}
                        <div className="block divide-y divide-slate-100 sm:hidden">
                            {payments.map((payment, index) => (
                                <div key={index} className="space-y-3 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400">
                                            Payment #{index + 1}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-slate-300 hover:text-red-500"
                                            onClick={() =>
                                                removePaymentRow(index)
                                            }
                                            disabled={payments.length === 1}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">
                                            Due Date
                                        </Label>
                                        <Input
                                            type="date"
                                            className="text-sm"
                                            value={payment.date}
                                            onChange={(e) =>
                                                updatePaymentRow(
                                                    index,
                                                    'date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">
                                            Amount to Collect
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-sm text-slate-400">
                                                ₱
                                            </span>
                                            <Input
                                                type="number"
                                                className="pl-7 font-mono text-sm"
                                                placeholder="0.00"
                                                value={payment.amount}
                                                onChange={(e) =>
                                                    updatePaymentRow(
                                                        index,
                                                        'amount',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop view - Table layout */}
                        <table className="hidden w-full text-left sm:table">
                            <thead className="bg-slate-50 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Payment No.</th>
                                    <th className="px-6 py-3">Due Date</th>
                                    <th className="px-6 py-3">
                                        Amount to Collect
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payments.map((payment, index) => (
                                    <tr
                                        key={index}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <td className="px-6 py-4 text-sm font-bold text-slate-400">
                                            #{index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Input
                                                type="date"
                                                className="max-w-[180px]"
                                                value={payment.date}
                                                onChange={(e) =>
                                                    updatePaymentRow(
                                                        index,
                                                        'date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative max-w-[200px]">
                                                <span className="absolute top-2.5 left-3 text-sm text-slate-400">
                                                    ₱
                                                </span>
                                                <Input
                                                    type="number"
                                                    className="pl-7 font-mono"
                                                    placeholder="0.00"
                                                    value={payment.amount}
                                                    onChange={(e) =>
                                                        updatePaymentRow(
                                                            index,
                                                            'amount',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-300 hover:text-red-500"
                                                onClick={() =>
                                                    removePaymentRow(index)
                                                }
                                                disabled={payments.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex flex-col gap-2 border-t p-4 sm:flex-row sm:justify-between">
                            <div className="flex items-center gap-2">
                                {scheduleTotal !== total && total > 0 && (
                                    <p className="text-[10px] text-amber-600 sm:text-xs">
                                        ⚠️ Schedule total doesn't match loan
                                        total
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-3 sm:gap-4">
                                <span className="text-[10px] font-bold tracking-tighter text-slate-500 uppercase sm:text-xs">
                                    Total to Collect:
                                </span>
                                <span className="font-mono text-lg font-black text-slate-900 sm:text-xl">
                                    ₱ {scheduleTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 items-start gap-4 sm:gap-6">
                    {/* LEFT COLUMN: Borrower Information */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="mb-2 flex flex-row items-center gap-2 border-b pb-3 sm:mb-4 sm:pb-4">
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                            <CardTitle className="text-base sm:text-lg">
                                Borrower Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold">
                                    Search Existing Borrower
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400 sm:top-3" />
                                    <Input
                                        placeholder="Type Borrower name..."
                                        className="pl-10 text-sm"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() =>
                                            searchResults.length > 0 &&
                                            setShowResults(true)
                                        }
                                    />
                                    {searchQuery && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-1 right-1 h-8 w-8"
                                            onClick={handleClearSearch}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {/* Search Results Dropdown */}
                                    {showResults && (
                                        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                                            {isSearching ? (
                                                <div className="p-4 text-center text-sm text-slate-500">
                                                    Searching...
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <div className="max-h-60 overflow-y-auto">
                                                    {searchResults.map(
                                                        (borrower) => (
                                                            <button
                                                                key={
                                                                    borrower.id
                                                                }
                                                                type="button"
                                                                className="w-full border-b border-slate-100 p-3 text-left transition-colors last:border-b-0 hover:bg-slate-50"
                                                                onClick={() =>
                                                                    handleSelectBorrower(
                                                                        borrower,
                                                                    )
                                                                }
                                                            >
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        borrower.first_name
                                                                    }{' '}
                                                                    {
                                                                        borrower.last_name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {
                                                                        borrower.contact_number
                                                                    }
                                                                </p>
                                                                {borrower.address && (
                                                                    <p className="mt-1 text-xs text-slate-400">
                                                                        {
                                                                            borrower.city
                                                                        }
                                                                        ,{' '}
                                                                        {
                                                                            borrower.province
                                                                        }
                                                                    </p>
                                                                )}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-sm text-slate-500">
                                                    No borrowers found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm">
                                        First Name{' '}
                                        <span className="text-xs text-red-500">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        placeholder="Juan"
                                        className="text-sm"
                                        disabled={isExistingBorrower}
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.first_name && (
                                        <p className="text-xs text-red-500">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">
                                        Last Name{' '}
                                        <span className="text-xs text-red-500">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        placeholder="Dela Cruz"
                                        className="text-sm"
                                        disabled={isExistingBorrower}
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                    />
                                    {errors.last_name && (
                                        <p className="text-xs text-red-500">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">
                                    Contact Number
                                </Label>
                                <Input
                                    placeholder="0912 345 6789"
                                    className="text-sm"
                                    disabled={isExistingBorrower}
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            'contact_number',
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.contact_number && (
                                    <p className="text-xs text-red-500">
                                        {errors.contact_number}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    className="text-sm"
                                    disabled={isExistingBorrower}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">
                                    Complete Address *
                                </Label>
                                <Textarea
                                    placeholder="Street, Barangay, City, Province"
                                    className="min-h-[70px] text-sm sm:min-h-[80px]"
                                    disabled={isExistingBorrower}
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                                {errors.address && (
                                    <p className="text-xs text-red-500">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm">City *</Label>
                                    <Input
                                        className="text-sm"
                                        disabled={isExistingBorrower}
                                        value={data.city}
                                        onChange={(e) =>
                                            setData('city', e.target.value)
                                        }
                                    />
                                    {errors.city && (
                                        <p className="text-xs text-red-500">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">
                                        Province *
                                    </Label>
                                    <Input
                                        className="text-sm"
                                        disabled={isExistingBorrower}
                                        value={data.province}
                                        onChange={(e) =>
                                            setData('province', e.target.value)
                                        }
                                    />
                                    {errors.province && (
                                        <p className="text-xs text-red-500">
                                            {errors.province}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm">Zip Code</Label>
                                    <Input
                                        className="text-sm"
                                        disabled={isExistingBorrower}
                                        value={data.zip_code}
                                        onChange={(e) =>
                                            setData('zip_code', e.target.value)
                                        }
                                    />
                                    {errors.zip_code && (
                                        <p className="text-xs text-red-500">
                                            {errors.zip_code}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Country *</Label>
                                    <Input
                                        disabled={isExistingBorrower}
                                        className="bg-slate-50 text-sm"
                                        value={data.country}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RIGHT COLUMN: Reference & Documents */}
                    <div className="space-y-4 sm:space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="mb-2 flex flex-row items-center gap-2 border-b pb-3 sm:mb-4 sm:pb-4">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                <CardTitle className="text-base sm:text-lg">
                                    Reference
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm">Name</Label>
                                    <Input
                                        placeholder="Full name"
                                        className="text-sm"
                                        disabled={isExistingBorrower}
                                        value={data.reference_name}
                                        onChange={(e) =>
                                            setData(
                                                'reference_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.reference_name && (
                                        <p className="text-xs text-red-500">
                                            {errors.reference_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Contact</Label>
                                    <Input
                                        placeholder="09XX XXX XXXX"
                                        className="text-sm"
                                        disabled={isExistingBorrower}
                                        value={data.reference_contact}
                                        onChange={(e) =>
                                            setData(
                                                'reference_contact',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.reference_contact && (
                                        <p className="text-xs text-red-500">
                                            {errors.reference_contact}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                <FilePlus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <CardTitle className="text-base sm:text-lg">
                                    Additional Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/30 p-6 transition-all hover:bg-slate-50 sm:p-10">
                                    <input
                                        type="file"
                                        multiple
                                        accept=".png,.jpg,.jpeg,.pdf"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <Upload className="mb-2 h-6 w-6 text-slate-400 group-hover:text-blue-500 sm:h-8 sm:w-8" />
                                    <p className="text-xs font-bold sm:text-sm">
                                        Click to upload documents
                                    </p>
                                    <p className="mt-1 text-center text-[9px] text-slate-500 uppercase sm:text-[10px]">
                                        PNG, JPG, PDF up to 10MB each
                                    </p>
                                </label>

                                {uploadedFiles.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>
                                            Uploaded Files (
                                            {uploadedFiles.length})
                                        </Label>
                                        <div className="space-y-2">
                                            {uploadedFiles.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="flex items-center justify-between rounded-lg border p-3"
                                                >
                                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                                        <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium">
                                                                {file.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatFileSize(
                                                                    file.size,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeFile(file.id)
                                                        }
                                                        className="shrink-0"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {errors.documents && (
                                    <p className="text-xs text-red-500">
                                        {errors.documents}
                                    </p>
                                )}
                            </CardContent>
                        </Card> */}
                    </div>
                </div>

                <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor:pointer w-full px-6 shadow-none sm:w-auto sm:px-8"
                        onClick={() => {
                            reset();
                            setPayments([{ date: '', amount: '' }]);
                            setFiles([]);
                            router.get('/my-pautang');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 px-6 shadow-md hover:bg-blue-700 sm:w-auto sm:px-8"
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : 'Complete Registration'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
