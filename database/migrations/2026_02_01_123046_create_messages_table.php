<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 255);
            $table->string('subject', 200);
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('is_read')->default(false);
            $table->boolean('is_spam')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            // Indexes for better query performance
            $table->index('email');
            $table->index('created_at');
            $table->index(['is_read', 'is_spam']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
