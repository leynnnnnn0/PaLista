import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// Shadcn UI Components
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Icons
import {
    ExternalLink,
    Eye,
    History,
    Mail,
    MoreHorizontal,
    Pencil,
    Phone,
    Search,
    ShieldAlert,
    ShieldCheck,
    UserPlus,
} from 'lucide-react';
import { Borrower, Paginated } from '@/types';

interface PageProps {
    borrowers: Paginated<Borrower>;
}

export default function BorrowersIndex({borrowers}: PageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Borrowers" />

            <div className="flex-1 space-y-8 p-8 pt-6">
                {/* Page Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Borrower Directory
                        </h2>
                        <p className="font-medium text-muted-foreground">
                            Manage your client database and review credit
                            reputations.
                        </p>
                    </div>
                    <Button
                        className="h-10 cursor-pointer bg-primary px-4 shadow-sm hover:bg-blue-700"
                        onClick={() => router.get('/borrowers/create')}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New Borrower
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or phone..."
                            className="h-10 border-slate-200 pl-9 shadow-none ring-offset-transparent focus-visible:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Borrowers Table */}
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[300px]">
                                Borrower
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Contact Number
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Emamil
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Total Loans
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Completed Loans
                            </TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {borrowers.data.map((person) => (
                            <TableRow
                                key={person.id}
                                className="group transition-colors hover:bg-slate-50/50"
                            >
                                <TableCell>{person.full_name}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {person.contact_number ?? 'N/A'}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {person.email ?? 'N/A'}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <div className="flex items-center gap-2 font-medium text-slate-600">
                                        <History
                                            size={14}
                                            className="text-slate-400"
                                        />
                                        {person.total_loans}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <div className="flex items-center gap-2 font-medium text-slate-600">
                                        <History
                                            size={14}
                                            className="text-slate-400"
                                        />
                                        {person.completed_loans}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer"
                                            onClick={() =>
                                                router.get(
                                                    `/borrowers/${person.id}`,
                                                )
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer"
                                            onClick={() =>
                                                router.get(
                                                    `/borrowers/${person.id}/edit`,
                                                )
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}

/** * Custom Badge for Borrower Reputation
 */
function ReputationBadge({ status }: { status: string }) {
    if (status === 'Good Standing') {
        return (
            <Badge
                variant="outline"
                className="flex w-fit items-center gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none"
            >
                <ShieldCheck size={12} />
                Good
            </Badge>
        );
    }
    if (status === 'At Risk') {
        return (
            <Badge
                variant="outline"
                className="flex w-fit items-center gap-1 border-amber-200 bg-amber-50 text-amber-700 shadow-none"
            >
                <ShieldAlert size={12} />
                At Risk
            </Badge>
        );
    }
    return (
        <Badge
            variant="destructive"
            className="flex w-fit items-center gap-1 border-none bg-red-600 shadow-none"
        >
            Blacklisted
        </Badge>
    );
}
