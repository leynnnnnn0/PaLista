import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Promissory Note',
        href: '/promissory-note',
    },
];

interface PromissoryNoteData {
    id: number;
    lender: string;
    penalty_percentage: string;
}

interface PageProps {
    promissoryNote: PromissoryNoteData;
}

export default function Index({ promissoryNote }: PageProps) {

    const { data, setData, put, processing, errors } =
        useForm<PromissoryNoteData>({
            id: promissoryNote.id,
            lender: promissoryNote.lender,
            penalty_percentage: promissoryNote.penalty_percentage,
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/promissory-note/${promissoryNote.id}`, {
            onSuccess: () => {
                toast.success('Saved Successfully.');
            },
            onError: () => {
                toast.error('Something went wrong.');
            },
        });
    };

    // Fake data for preview
    const fakeData = {
        loan_number: 'LN00000001',
        transaction_date: 'January 15, 2024',
        borrower: {
            name: 'JUAN DELA CRUZ',
            address:
                '123 Sample Street, Barangay San Jose, Manila City, Metro Manila',
        },
        total_amount_words: 'SIXTEEN THOUSAND',
        total_amount: 16000,
        principal_amount: 10000,
        interest_value: '6',
        interest_type: 'percentage',
        interest_period: 'per_month',
        payment_frequency_text: '6 Semi Monthly',
        payment_frequency: 'twice_monthly',
        first_payment_date: 'February 5, 2024',
        maturity_date: 'April 15, 2024',
        penalty_period: 'Semi Monthly',
        payment_amount: 2666.67,
        payment_schedules: [
            { due_date: 'February 5, 2024', amount_due: 2666.67 },
            { due_date: 'February 20, 2024', amount_due: 2666.67 },
            { due_date: 'March 5, 2024', amount_due: 2666.67 },
            { due_date: 'March 20, 2024', amount_due: 2666.67 },
            { due_date: 'April 5, 2024', amount_due: 2666.67 },
            { due_date: 'April 15, 2024', amount_due: 2666.65 },
        ],
    };

    const outerRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
        const compute = () => {
            if (!outerRef.current || !innerRef.current) return;
            const outerWidth =
                outerRef.current.clientWidth || window.innerWidth;
            const innerWidth = innerRef.current.getBoundingClientRect().width;
            let newScale = outerWidth / innerWidth;
            newScale = Math.min(1, Math.max(0.35, newScale));
            setScale(newScale);
        };

        compute();
        const ro = new ResizeObserver(compute);
        if (outerRef.current) ro.observe(outerRef.current);
        if (innerRef.current) ro.observe(innerRef.current);
        window.addEventListener('resize', compute);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', compute);
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Promissory Note" />

            <div className="space-y-2 md:space-y-5 p-6">
                <PageHeader title="Promissory Note" subtitle=" Configure your promissory note details.">
                    <div></div>
                </PageHeader>
                {/* Editable Fields Form */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Promissory Note Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="lenderFullName">
                                        Lender Full Name
                                    </Label>
                                    <Input
                                        id="lenderFullName"
                                        type="text"
                                        value={data.lender}
                                        onChange={(e) =>
                                            setData('lender', e.target.value)
                                        }
                                        placeholder="Enter lender's full name"
                                        required
                                    />
                                    {errors.lender && (
                                        <span className="text-xs text-red-500">
                                            {errors.lender}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="penaltyPercentage">
                                        Penalty Percentage (%)
                                    </Label>
                                    <Input
                                        id="penaltyPercentage"
                                        type="number"
                                        step="0.01"
                                        value={data.penalty_percentage}
                                        onChange={(e) =>
                                            setData(
                                                'penalty_percentage',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter penalty percentage"
                                        required
                                    />
                                    {errors.penalty_charge && (
                                        <span className="text-xs text-red-500">
                                            {errors.penalty_charge}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview Document */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div ref={outerRef} className="w-full p-4">
                            <div className="flex justify-center">
                                <div
                                    ref={innerRef}
                                    className="inline-block w-[210mm] bg-white p-[20mm] font-serif text-[9pt] leading-relaxed"
                                    style={{
                                        transform: `scale(${scale})`,
                                        transformOrigin: 'top left',
                                    }}
                                >
                                    {/* Header */}
                                    <div className="mb-8 border-b-2 border-black pb-3 text-center">
                                        <h1 className="mb-1 text-[14pt] font-bold tracking-[2px]">
                                            PROMISSORY NOTE
                                        </h1>
                                    </div>

                                    {/* Info Section */}
                                    <div className="mb-6">
                                        <div className="mb-2 flex">
                                            <span className="w-[100px] flex-shrink-0 font-bold">
                                                Date:
                                            </span>
                                            <span className="flex-grow border-b border-black pl-3">
                                                {fakeData.transaction_date}
                                            </span>
                                        </div>
                                        <div className="mb-2 flex">
                                            <span className="w-[100px] flex-shrink-0 font-bold">
                                                Place:
                                            </span>
                                            <span className="flex-grow border-b border-black pl-3">
                                                {fakeData.borrower.address}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Promise Text */}
                                    <div className="my-6 border-2 border-black p-4 text-justify leading-[1.8]">
                                        I,{' '}
                                        <strong>
                                            {fakeData.borrower.name}
                                        </strong>
                                        , of legal age, with residence at{' '}
                                        <strong>
                                            {fakeData.borrower.address}
                                        </strong>
                                        , hereby promise to pay, the sum of{' '}
                                        <strong>
                                            {fakeData.total_amount_words}
                                        </strong>{' '}
                                        (
                                        <strong>
                                            ₱
                                            {fakeData.total_amount.toLocaleString(
                                                'en-US',
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}
                                        </strong>
                                        ), payable under the following terms and
                                        conditions:
                                    </div>

                                    {/* Terms Section */}
                                    <div className="my-6">
                                        <div className="mb-3 flex text-justify">
                                            <span className="w-[150px] flex-shrink-0 font-bold">
                                                1. Loan Amount:
                                            </span>
                                            <span className="flex-grow">
                                                ₱
                                                {fakeData.principal_amount.toLocaleString(
                                                    'en-US',
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </span>
                                        </div>

                                        <div className="mb-3 flex text-justify">
                                            <span className="w-[150px] flex-shrink-0 font-bold">
                                                2. Interest Rate:
                                            </span>
                                            <span className="flex-grow">
                                                {fakeData.interest_value}% per
                                                month payable in{' '}
                                                {
                                                    fakeData.payment_frequency_text
                                                }{' '}
                                                installments
                                            </span>
                                        </div>

                                        <div className="mb-3 flex text-justify">
                                            <span className="w-[150px] flex-shrink-0 font-bold">
                                                3. Payment Schedule:
                                            </span>
                                            <span className="flex-grow">
                                                Payments shall be made every 21
                                                of the month (twice monthly)
                                                starting on{' '}
                                                {fakeData.first_payment_date},
                                                until full settlement on or
                                                before {fakeData.maturity_date}.
                                            </span>
                                        </div>

                                        <div className="mb-3 flex text-justify">
                                            <span className="w-[150px] flex-shrink-0 font-bold">
                                                4. Maturity Date:
                                            </span>
                                            <span className="flex-grow">
                                                The loan shall be fully paid on
                                                or before{' '}
                                                <strong>
                                                    {fakeData.maturity_date}
                                                </strong>
                                                .
                                            </span>
                                        </div>

                                        <div className="mb-3 flex text-justify">
                                            <span className="w-[150px] flex-shrink-0 font-bold">
                                                5. Penalty:
                                            </span>
                                            <span className="flex-grow">
                                                A penalty of{' '}
                                                {data.penalty_percentage || '2'}
                                                % per {fakeData.penalty_period}{' '}
                                                shall be charged on overdue
                                                payments.
                                            </span>
                                        </div>
                                    </div>

                                    {/* Legal Text */}
                                    <div className="my-6 text-justify leading-[1.8]">
                                        In case of default, I authorize the
                                        lender to take necessary legal action
                                        for the collection of the balance,
                                        including penalties and expenses
                                        incurred.
                                    </div>

                                    <div className="my-6 text-justify leading-[1.8]">
                                        This Promissory Note is signed
                                        voluntarily and with full understanding
                                        of its terms.
                                    </div>

                                    {/* Signature Section */}
                                    <div className="mt-10 mb-10">
                                        <div className="mb-8">
                                            <div className="mb-1 font-bold">
                                                Borrower's Signature:
                                            </div>
                                            <div className="mt-10 mb-1 w-[300px] border-t border-black"></div>
                                            <div className="mb-1 font-bold">
                                                Printed Name:
                                            </div>
                                            <div>{fakeData.borrower.name}</div>
                                        </div>

                                        <div className="mb-8">
                                            <div className="mb-1 font-bold">
                                                Lender's Signature:
                                            </div>
                                            <div className="mt-10 mb-1 w-[300px] border-t border-black"></div>
                                            <div className="mb-1 font-bold">
                                                Printed Name:
                                            </div>
                                            <div>
                                                {data.lender ||
                                                    '_____________________________'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Page Break Indicator */}
                                    <div className="my-10 border-t-4 border-dashed border-gray-400"></div>

                                    {/* SCHEDULE OF PAYMENTS PAGE */}
                                    <div className="my-10 border-t-2 border-b-2 border-black py-4 text-center">
                                        <h2 className="text-[12pt] font-bold tracking-[2px]">
                                            SCHEDULE OF PAYMENTS
                                        </h2>
                                    </div>

                                    {/* Schedule Info */}
                                    <div className="mb-5 border border-gray-300 bg-gray-100 p-4">
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Name:
                                            </span>
                                            <span className="flex-grow">
                                                {fakeData.borrower.name}
                                            </span>
                                        </div>
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Loan Date:
                                            </span>
                                            <span className="flex-grow">
                                                {fakeData.transaction_date}
                                            </span>
                                        </div>
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Loan Number:
                                            </span>
                                            <span className="flex-grow">
                                                {fakeData.loan_number}
                                            </span>
                                        </div>
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Loan Amount:
                                            </span>
                                            <span className="flex-grow">
                                                ₱
                                                {fakeData.principal_amount.toLocaleString(
                                                    'en-US',
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Loan Payable:
                                            </span>
                                            <span className="flex-grow">
                                                ₱
                                                {fakeData.total_amount.toLocaleString(
                                                    'en-US',
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Payable:
                                            </span>
                                            <span className="flex-grow">
                                                Semi Monthly
                                            </span>
                                        </div>
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Number of Payments:
                                            </span>
                                            <span className="flex-grow">
                                                {
                                                    fakeData.payment_schedules
                                                        .length
                                                }
                                            </span>
                                        </div>
                                        <div className="flex py-1">
                                            <span className="w-[180px] font-bold">
                                                Due (Semi Monthly):
                                            </span>
                                            <span className="flex-grow">
                                                ₱
                                                {fakeData.payment_amount.toLocaleString(
                                                    'en-US',
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Payment Table */}
                                    <table className="mt-5 w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border border-black bg-gray-800 p-3 text-center font-bold text-white">
                                                    Date
                                                </th>
                                                <th className="border border-black bg-gray-800 p-3 text-center font-bold text-white">
                                                    Amount Due
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fakeData.payment_schedules.map(
                                                (payment, index) => (
                                                    <tr
                                                        key={index}
                                                        className={
                                                            index % 2 === 0
                                                                ? 'bg-gray-50'
                                                                : 'bg-white'
                                                        }
                                                    >
                                                        <td className="border border-black p-2 text-center">
                                                            {payment.due_date}
                                                        </td>
                                                        <td className="border border-black p-2 text-right font-bold">
                                                            ₱
                                                            {payment.amount_due.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
