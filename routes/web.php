<?php

use App\Http\Controllers\BorrowerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\MyPautangController;
use App\Http\Controllers\PromissoryNoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/pricing', function () {
    return Inertia::render('pricing');
})->name('pricing');
Route::get('/about-us', function () {
    return Inertia::render('aboutus');
})->name('about-us');
Route::get('contact', function () {
    return Inertia::render('contact');
})->name('contact');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('my-pautang', MyPautangController::class);
    Route::resource('borrowers', BorrowerController::class);
    Route::resource('finance', FinanceController::class);
    Route::resource('promissory-note', PromissoryNoteController::class);

    Route::put('payment-schedules/{id}/penalty', [MyPautangController::class, 'penalty'])->name('payment-schedules.add-penalty');

    Route::post('/payment-histories', [MyPautangController::class, 'recordPayment'])->name('payment-histories.store');
    Route::put('/payment-histories/{id}', [MyPautangController::class, 'updatePayment'])->name('payment-histories.update');
    Route::delete('/payment-histories/{id}', [MyPautangController::class, 'deletePayment'])->name('payment-histories.destroy');

    // Route to preview promissory note in browser
    Route::get('/my-pautang/{loan}/promissory-note/preview', [PromissoryNoteController::class, 'preview'])
        ->name('loans.promissory-note.preview');

    // Route to download promissory note as PDF
    Route::get('/my-pautang/{loan}/promissory-note/download', [PromissoryNoteController::class, 'generate'])
        ->name('loans.promissory-note.download');
    Route::put('/my-pautang/{loan}/void', [MyPautangController::class, 'void']);
});

require __DIR__.'/settings.php';
