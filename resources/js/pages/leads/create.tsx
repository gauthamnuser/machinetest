import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import type { BreadcrumbItem } from '@/types';
import { Head , Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Leads',
        href: leads.create().url,
    },
];

type LeadFormData = {
    name: string;
    email: string;
    phone: string;
    lead_status: 'new' | 'contacted' | 'converted';
};

type Props = {
    onSuccess?: () => void;
};

export default function CreateLeadForm({ onSuccess }: Props) {
    const form = useForm<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    lead_status: 'new',
  });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(leads.store().url, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                    type="text"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className="mt-1 block w-full rounded border p-2"
                    />
                    {form.errors.name && <p className="text-red-500 text-sm">{form.errors.name}</p>}
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    className="mt-1 block w-full rounded border p-2"
                    />
                    {form.errors.email && <p className="text-red-500 text-sm">{form.errors.email}</p>}
                </div>

                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                    type="text"
                    value={form.data.phone}
                    onChange={(e) => form.setData('phone', e.target.value)}
                    className="mt-1 block w-full rounded border p-2"
                    />
                    {form.errors.phone && <p className="text-red-500 text-sm">{form.errors.phone}</p>}
                </div>

                <div>
                    <label className="block font-medium">Status</label>
                    <select
                    value={form.data.lead_status}
                    onChange={(e) => form.setData('lead_status', e.target.value as LeadFormData['lead_status'])}
                    className="mt-1 block w-full rounded border p-2"
                    >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    </select>
                    {form.errors.lead_status && <p className="text-red-500 text-sm">{form.errors.lead_status}</p>}
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Create Lead
                </button>
                </form>
            </div>
        </AppLayout>
    );
}
