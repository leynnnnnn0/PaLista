import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import {useForm} from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Create()
{
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
        });


    const handleSubmit = () => {
        post('/borrowers', {
            onSuccess: () => {
                toast.success("Created Successfully.");
            },
            onError: (e) => {
                toast.error("Something went wrong.");
            }
        })
    }
    return (
        <AppLayout>
            <Head title="Add New Borrower" />

            <div className="p-6 space-y-5">
                {/* LEFT COLUMN: Borrower Information */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="mb-2 flex flex-row items-center gap-2 border-b pb-3 sm:mb-4 sm:pb-4">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        <CardTitle className="text-base sm:text-lg">
                            Borrower Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">


                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">First Name *</Label>
                                <Input
                                    placeholder="Juan"
                                    className="text-sm"
                       
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                />
                                {errors.first_name && (
                                    <p className="text-xs text-red-500">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Last Name *</Label>
                                <Input
                                    placeholder="Dela Cruz"
                                    className="text-sm"
                       
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
                            <Label className="text-sm">Contact Number</Label>
                            <Input
                                placeholder="0912 345 6789"
                                className="text-sm"
                   
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData('contact_number', e.target.value)
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
                                <Label className="text-sm">Province *</Label>
                                <Input
                                    className="text-sm"
                       
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
                                <Label className="text-sm">ZipCode</Label>
                                <Input
                                    className="text-sm"
                       
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

                   
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Button className="cursor-pointer w-full bg-blue-600 px-6 shadow-md hover:bg-blue-700 sm:w-auto sm:px-8"
                    onClick={() => handleSubmit()}
                        disabled={processing}>
                            Save
                        </Button>
                </div>
            </div>
        </AppLayout>
    );
}