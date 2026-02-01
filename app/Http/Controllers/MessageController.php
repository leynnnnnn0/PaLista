<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmitted;
use App\Models\Message;

class MessageController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        // Rate limiting: 3 submissions per hour per IP
        $key = 'contact-form:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = ceil($seconds / 60);

            throw ValidationException::withMessages([
                'error' => "Too many contact form submissions. Please try again in {$minutes} minutes.",
            ]);
        }

        // Validate the input with comprehensive rules
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[a-zA-Z\s\-\.\']+$/', // Only letters, spaces, hyphens, dots, apostrophes
            ],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
            ],
            'subject' => [
                'required',
                'string',
                'min:5',
                'max:200',
                'regex:/^[a-zA-Z0-9\s\-\.\,\!\?\'\(\)]+$/', // Alphanumeric + common punctuation
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:2000',
            ],
        ], [
            // Custom error messages
            'name.required' => 'Please enter your name.',
            'name.min' => 'Name must be at least 2 characters.',
            'name.max' => 'Name cannot exceed 100 characters.',
            'name.regex' => 'Name contains invalid characters.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'subject.required' => 'Please enter a subject.',
            'subject.min' => 'Subject must be at least 5 characters.',
            'subject.max' => 'Subject cannot exceed 200 characters.',
            'subject.regex' => 'Subject contains invalid characters.',
            'message.required' => 'Please enter a message.',
            'message.min' => 'Message must be at least 10 characters.',
            'message.max' => 'Message cannot exceed 2000 characters.',
        ]);

        // Spam detection - Check for suspicious patterns
        if ($this->isSpam($validated)) {
            RateLimiter::hit($key, 3600); // Hit rate limiter

            throw ValidationException::withMessages([
                'error' => 'Your message was flagged as spam. Please contact us directly via email.',
            ]);
        }

        // Check for duplicate submissions (same email + message in last hour)
        $recentDuplicate = Message::where('email', $validated['email'])
            ->where('message', $validated['message'])
            ->where('created_at', '>', now()->subHour())
            ->exists();

        if ($recentDuplicate) {
            throw ValidationException::withMessages([
                'error' => 'You have already submitted this message recently.',
            ]);
        }

        // Increment rate limiter
        RateLimiter::hit($key, 3600); // 1 hour

        // Store the message in database
        $contactMessage = Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Optional: Send email notification to admin
        // Mail::to(config('mail.admin_email'))->send(new ContactFormSubmitted($contactMessage));

        return back()->with('success', 'Message sent successfully!');
    }

    /**
     * Check if the message is spam
     */
    private function isSpam(array $data): bool
    {
        $message = strtolower($data['message']);
        $subject = strtolower($data['subject']);
        $combined = $message . ' ' . $subject;

        // Common spam keywords
        $spamKeywords = [
            'viagra',
            'cialis',
            'crypto',
            'bitcoin',
            'lottery',
            'winner',
            'click here',
            'buy now',
            'limited time',
            'act now',
            'casino',
            'porn',
            'xxx',
            'sex',
            'dating',
            'forex',
            'investment opportunity',
            'make money fast',
            'work from home',
            'free money',
            'guarantee',
            'congratulations',
            'you won',
            'claim your prize',
            'nigerian prince',
        ];

        foreach ($spamKeywords as $keyword) {
            if (str_contains($combined, $keyword)) {
                return true;
            }
        }

        // Check for excessive URLs
        $urlCount = preg_match_all('/https?:\/\//', $combined);
        if ($urlCount > 3) {
            return true;
        }

        // Check for excessive repetition
        $words = str_word_count($message, 1);
        if (count($words) > 10) {
            $wordFrequency = array_count_values($words);
            $maxFrequency = max($wordFrequency);
            if ($maxFrequency > count($words) * 0.3) { // Same word used more than 30%
                return true;
            }
        }

        // Check for excessive caps
        $capsPercentage = 0;
        if (strlen($message) > 0) {
            $capsCount = preg_match_all('/[A-Z]/', $data['message']);
            $capsPercentage = $capsCount / strlen($data['message']);
            if ($capsPercentage > 0.5 && strlen($data['message']) > 20) {
                return true;
            }
        }

        return false;
    }
}
