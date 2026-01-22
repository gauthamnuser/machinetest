<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\LeadController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('leads');
    }
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');    
    Route::get('leads', [LeadController::class, 'index'])
        ->name('leads.index');
    Route::get('leads/create', [LeadController::class, 'create'])
        ->name('leads.create');
    Route::post('leads', [LeadController::class, 'store'])
        ->name('leads.store');
    Route::get('leads/{lead}/edit', [LeadController::class, 'edit'])
        ->name('leads.edit');
    Route::put('leads/{lead}', [LeadController::class, 'update'])
        ->name('leads.update');
    Route::delete('leads/{lead}', [LeadController::class, 'destroy'])
        ->name('leads.destroy');
});

require __DIR__.'/settings.php';
