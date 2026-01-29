import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
// Shadcn UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
// Icons
import Pagination from '@/components/pagination';
import { Loan, Paginated } from '@/types';
import { Eye, Filter, Plus, Search } from 'lucide-react';

interface PageProps {
    loans: Paginated<Loan>;
    filters: {
        search?: string;
        status?: string;
        aging?: string;
    };
}

export default function Index({ loans, filters }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [aging, setAging] = useState(filters.aging || 'aging');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Debounced search function
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            '/my-pautang',
            {
                search: value,
                status: status !== 'all' ? status : undefined,
                aging: aging !== 'aging' ? aging : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }, 500);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Handle status filter change
    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(
            '/my-pautang',
            {
                search: searchTerm || undefined,
                status: value !== 'all' ? value : undefined,
                aging: aging !== 'aging' ? aging : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Handle aging filter change
    const handleAgingChange = (value: string) => {
        setAging(value);
        router.get(
            '/my-pautang',
            {
                search: searchTerm || undefined,
                status: status !== 'all' ? status : undefined,
                aging: value !== 'aging' ? value : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Handle reset filters
    const handleReset = () => {
        setSearchTerm('');
        setStatus('all');
        setAging('aging');
        router.get(
            '/my-pautang',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title="My Pautangs" />
            <div className="flex-1 space-y-8 p-8 pt-6">
                {/* Page Header */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            My Pautangs
                        </h2>
                        <p className="text-muted-foreground">
                            Manage your lending portfolio and track collection
                            aging.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => router.get('/my-pautang/create')}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Loan
                        </Button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Borrowers..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select
                            value={status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="voided">Voided</SelectItem>
                                <SelectItem value="completed">
                                    Fully Paid
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={aging} onValueChange={handleAgingChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Aging" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aging">
                                    Filter by Aging
                                </SelectItem>
                                <SelectItem value="soon">
                                    Due in 7 days
                                </SelectItem>
                                <SelectItem value="late">Past Due</SelectItem>
                                <SelectItem value="critical">
                                    30+ Days Late
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={handleReset}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[250px]">
                                <Button
                                    variant="ghost"
                                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                                >
                                    Borrower
                                </Button>
                            </TableHead>
                            <TableHead>Principal Amount</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Interest Value
                            </TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Balance
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loans.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    No loans found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            loans.data.map((loan) => (
                                <TableRow
                                    key={loan.id}
                                    className="transition-colors hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium">
                                        {loan.borrower}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {formatCurrency(loan.amount)}
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground md:table-cell">
                                        {loan.interest_type === 'fixed'
                                            ? formatCurrency(
                                                  loan.interest_value,
                                              )
                                            : `${loan.interest_value}%`}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(loan.total_amount)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {formatCurrency(
                                                loan.remaining_balance,
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={loan.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer"
                                            onClick={() =>
                                                router.get(
                                                    `/my-pautang/${loan.id}`,
                                                )
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Pagination data={loans} />
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'active':
            return (
                <Badge
                    variant="secondary"
                    className="border-none bg-blue-100 text-blue-700 shadow-none hover:bg-blue-100"
                >
                    Active
                </Badge>
            );
        case 'overdue':
            return (
                <Badge variant="destructive" className="shadow-none">
                    Overdue
                </Badge>
            );
        case 'completed':
            return (
                <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none"
                >
                    Paid
                </Badge>
            );
        case 'voided':
            return (
                <Badge
                    variant="outline"
                    className="text-white shadow-none bg-orange-500"
                >
                    Voided
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
