<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lead;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::query()->where('status', 0);
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($request->filled('status')) {
            $query->where('lead_status', $request->input('status'));
        }
        $sortOrder = $request->input('sort', 'desc');
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }
        $query->orderBy('created_at', $sortOrder);
        $leads = $query->paginate(10)->withQueryString();
        return Inertia::render('leads/index', [
            'paginatedLeads' => $leads,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortOrder,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('leads/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email',
            'phone' => 'required|string|max:20',
            'lead_status' => 'required|in:new,contacted,converted',
            'status' => 'sometimes|integer',
        ]);
        $validated['user_id'] = $request->user()->id;
        Lead::create($validated);
        return redirect()->route('leads.index')->with('success', 'Lead created successfully.');
    }

    public function edit(Lead $lead)
    {
        return Inertia::render('leads/edit', [
            'lead' => $lead
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'lead_status' => 'required|in:new,contacted,converted',
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:leads,email,' . $lead->id,
            'phone' => 'sometimes|string|max:20',
        ]);
        $lead->update($validated);
        return redirect()->route('leads.index')->with('success', 'Lead updated successfully.');
    }

    public function destroy(Lead $lead)
    {
        $lead->update(['status' => 1]);
        return redirect()->route('leads.index')->with('success', 'Lead deleted successfully.');
    }
}
