import { useState,useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import type { BreadcrumbItem } from '@/types';
import { Head , Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircleIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: leads.index().url,
    },
];

type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    lead_status: 'new' | 'contacted' | 'converted';
    created_at: string;
};

type PaginatedLeads = {
    data: Lead[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    paginatedLeads: PaginatedLeads;
};

export default function Lead({ paginatedLeads }: Props) {
    const [successMessage, setSuccessMessage] = useState('');
    const [resetFilters, setResetFilters] = useState(false);

    const statusForm = useForm<{ lead_status: 'new' | 'contacted' | 'converted' }>({ lead_status: 'new' });

    const updateLeadStatus = (leadId: number, newStatus: 'new' | 'contacted' | 'converted') => {
        statusForm.setData('lead_status', newStatus);

        statusForm.put(leads.update(leadId).url, {
            preserveScroll: true,
            onSuccess: () => setSuccessMessage('Status updated successfully!'),
            onError: (errors) => console.error(errors),
        });

        paginatedLeads.data = paginatedLeads.data.map(lead =>
            lead.id === leadId ? { ...lead, lead_status: newStatus } : lead
        );
    };



    useEffect(() => {
    if (resetFilters) {
            applyFilters();
            setResetFilters(false);
        }
    }, [resetFilters]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 1500);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const form = useForm({
        search: '',
        status: '',
        sort: 'desc',
    });

    const applyFilters = () => {
    form.get(leads.index().url, {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex gap-2 p-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={form.data.search}
                    onChange={(e) => form.setData('search', e.target.value)}
                    className="px-3 py-1 border rounded"
                />

                <select
                    value={form.data.status}
                    onChange={(e) => form.setData('status', e.target.value)}
                    className="px-3 py-1 border rounded"
                >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                </select>

                <select
                    value={form.data.sort}
                    onChange={(e) => form.setData('sort', e.target.value as 'asc' | 'desc')}
                    className="px-3 py-1 border rounded"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>


                <button
                    onClick={applyFilters}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Apply
                </button>

                <button
                    onClick={() => {
                        form.setData({
                            search: '',
                            status: '',
                            sort: 'desc',
                        });
                        setResetFilters(true);
                    }}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                    Clear
                </button>


            </div>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {successMessage && (
                    <Alert variant="default">
                        <CheckCircleIcon />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">SL No</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Phone</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Created At</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Edit</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedLeads.data.map((lead, index) => (
                            <tr key={lead.id}>
                                <td className="px-4 py-2">{(paginatedLeads.current_page - 1) * 10 + index + 1}</td>
                                <td className="px-4 py-2">{lead.name}</td>
                                <td className="px-4 py-2">{lead.email}</td>
                                <td className="px-4 py-2">{lead.phone}</td>
                                <td className="px-4 py-2">
                                    <select
                                        value={lead.lead_status}
                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as 'new' | 'contacted' | 'converted')}
                                        className="px-2 py-1 border rounded"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="converted">Converted</option>
                                    </select>
                                </td>

                                <td className="px-4 py-2">{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-2"><Link href={leads.edit(lead.id).url} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            >Edit</Link>
                                </td>
                                <td className="px-4 py-2"><button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this lead?')) {
                                                form.delete(leads.destroy(lead.id).url, {
                                                    onSuccess: () => {
                                                        setSuccessMessage('Lead deleted successfully!');
                                                    },
                                                });
                                            }
                                        }}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                 <div className="flex justify-between mt-4">
                    {paginatedLeads.prev_page_url && (
                        <Link
                            href={paginatedLeads.prev_page_url}
                            className="px-4 py-2 bg-gray-200 rounded dark:bg-gray-700"
                        >
                        Previous
                        </Link>
                    )}
                    {paginatedLeads.next_page_url && (
                        <Link
                            href={paginatedLeads.next_page_url}
                            className="px-4 py-2 bg-gray-200 rounded dark:bg-gray-700"
                        >
                        Next
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
