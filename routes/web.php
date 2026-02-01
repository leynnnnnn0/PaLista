<?php

use App\Http\Controllers\BorrowerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MyPautangController;
use App\Http\Controllers\PromissoryNoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

 
// Sitemap route with corrected structure
Route::get('/sitemap.xml', function () {
    $pages = [
        [
            'loc' => url('/'),
            'priority' => '1.0',
            'changefreq' => 'weekly',
            'lastmod' => now()->toAtomString()
        ],
        [
            'loc' => url('/features'),
            'priority' => '0.9', // Changed from '2.0' (max is 1.0)
            'changefreq' => 'monthly',
            'lastmod' => now()->toAtomString()
        ],
        [
            'loc' => url('/pricing'),
            'priority' => '0.8', // Changed from '2.0' (max is 1.0)
            'changefreq' => 'monthly',
            'lastmod' => now()->toAtomString()
        ],

        [
            'loc' => url('/about-us'),
            'priority' => '0.7',
            'changefreq' => 'monthly',
            'lastmod' => now()->toAtomString()
        ],
        [
            'loc' => url('/contact'), // Fixed typo
            'priority' => '0.6',
            'changefreq' => 'monthly',
            'lastmod' => now()->toAtomString()
        ],
    ];

    return response()->view('sitemap', compact('pages'))
        ->header('Content-Type', 'text/xml');
});

// Robots.txt route
Route::get('/robots.txt', function () {
    $content = "User-agent: *\n";
    $content .= "Allow: /\n";
    $content .= "Disallow: /dashboard\n";
    $content .= "Disallow: /features\n";
    $content .= "Disallow: /my-pautang\n";
    $content .= "Disallow: /borrowers\n";
    $content .= "Disallow: /finance\n";
    $content .= "Disallow: /promissory-note\n";
    $content .= "Disallow: /user/\n";
    $content .= "Disallow: /login\n";
    $content .= "Disallow: /register\n";
    $content .= "\n";
    $content .= "Sitemap: " . url('/sitemap.xml') . "\n";

    return response($content, 200)
        ->header('Content-Type', 'text/plain');
});

// Public routes with SEO meta data
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/pricing', function () {
    return Inertia::render('pricing');
})->name('pricing');

Route::get('/about-us', function () {
    return Inertia::render('aboutus');
})->name('about-us');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/features', function () {
    return Inertia::render('features');
})->name('features');

Route::post('/contact', [MessageController::class, 'store'])
    ->name('contact.store');

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/borrowers/search', [App\Http\Controllers\Api\BorrowerController::class, 'search'])
        ->name('borrowers.search');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('my-pautang', MyPautangController::class);
    Route::resource('borrowers', BorrowerController::class);
    Route::resource('finance', FinanceController::class);
    Route::resource('promissory-note', PromissoryNoteController::class);

    Route::put('payment-schedules/{id}/penalty', [MyPautangController::class, 'penalty'])
        ->name('payment-schedules.add-penalty');

    Route::post('/payment-histories', [MyPautangController::class, 'recordPayment'])
        ->name('payment-histories.store');

    Route::put('/payment-histories/{id}', [MyPautangController::class, 'updatePayment'])
        ->name('payment-histories.update');

    Route::delete('/payment-histories/{id}', [MyPautangController::class, 'deletePayment'])
        ->name('payment-histories.destroy');

    // Promissory note routes
    Route::get('/my-pautang/{loan}/promissory-note/preview', [PromissoryNoteController::class, 'preview'])
        ->name('loans.promissory-note.preview');

    Route::get('/my-pautang/{loan}/promissory-note/download', [PromissoryNoteController::class, 'generate'])
        ->name('loans.promissory-note.download');

    Route::put('/my-pautang/{loan}/void', [MyPautangController::class, 'void']);


});

require __DIR__ . '/settings.php';
