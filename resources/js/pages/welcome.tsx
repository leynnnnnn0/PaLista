import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { login } from '@/routes';
import { Link } from '@inertiajs/react';
import LOGO from '../../images/logo.png';

export default function Welcome() {
    const faqs = [
        {
            question: 'What is MyPautangLog?',
            answer: 'MyPautangLog is a secure digital ledger designed to help you track personal and business loans. It is a private record-keeping tool, not a lending service.',
        },
        {
            question: 'Who can use MyPautangLog?',
            answer: 'Anyone who wants to organize their personal or business loan records. Ideal for small business owners, friends sharing expenses, or individuals tracking personal debts.',
        },
        {
            question: 'How is it different from a banking app?',
            answer: 'Unlike banks, we focus on informal or personal loan records. You can log any transaction and set custom reminders without involving bank accounts.',
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes. We use bank-grade encryption and ISO 27001 standards to ensure your private records remain private. Your data is never shared with third parties.',
        },
        {
            question: 'What are your fees?',
            answer: 'We offer a Free plan for basic tracking. Premium and Pro plans provide additional features like advanced reminders, multiple users, and reporting tools.',
        },
        {
            question: 'How do I get started?',
            answer: 'Sign up with your email or Google account and start logging your first transactions immediately.',
        },
    ];
    return (
        <div className="min-h-screen bg-white font-sans text-[#1e293b]">
            {/* Navigation */}
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <div className="flex items-center space-x-10">
                    <div className="flex items-center space-x-2">
                        <img src={LOGO} alt="Logo" className="h-10" />
                    </div>
                    {/* <div className="hidden space-x-6 text-sm font-semibold text-gray-600 md:flex">
                        <a
                            href="#features"
                            className="transition hover:text-blue-700"
                        >
                            Features
                        </a>
                        <a
                            href="#security"
                            className="transition hover:text-blue-700"
                        >
                            Security
                        </a>
                        <a
                            href="#faq"
                            className="transition hover:text-blue-700"
                        >
                            FAQ
                        </a>
                        <a
                            href="#contact"
                            className="transition hover:text-blue-700"
                        >
                            Contact
                        </a>
                    </div> */}
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        href={login.url()}
                        className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-800"
                    >
                        Login
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="mx-auto grid max-w-7xl items-center gap-12 px-6 pt-12 pb-24 md:grid-cols-2">
                {/* Left Column: Copy */}
                <div className="space-y-8">
                    <div className="inline-flex items-center space-x-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1">
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                            🛡️ Private & Secure Ledger
                        </span>
                    </div>

                    <h1 className="text-6xl leading-[1.1] font-extrabold tracking-tighter text-gray-900 md:text-7xl">
                        Clear records,
                        <br />
                        <span className="text-blue-700">zero stress.</span>
                    </h1>

                    <p className="max-w-md text-lg leading-relaxed text-gray-500">
                        Keep all your personal and business loan records in one
                        secure place with automated reminders and a private
                        ledger accessible only to you.
                    </p>

                    <div className="flex items-center space-x-4">
                        <button className="rounded-xl bg-blue-700 px-8 py-4 font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-blue-200">
                            Learn More
                        </button>
                        <button className="rounded-xl border border-gray-200 bg-white px-8 py-4 font-bold text-gray-900 transition hover:bg-gray-50">
                            Get Started
                        </button>
                    </div>

                    <div className="flex space-x-6 pt-4 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                        <span>No hidden fees</span>
                        <span>•</span>
                        <span>Private Ledger</span>
                        <span>•</span>
                        <span>SECURE </span>
                    </div>
                </div>

                {/* Right Column: Visual Mockup */}
                <div className="group relative">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-blue-900 shadow-2xl">
                        {/* Background Image Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-80 mix-blend-multiply" />
                        <img
                            src="https://images.unsplash.com/photo-1573163231162-8067345742a4?auto=format&fit=crop&q=80&w=800"
                            alt="Person managing finances"
                            className="h-full w-full object-cover"
                        />

                        {/* Dashboard Overlay (Matching the "Invoices" look) */}
                        <div className="absolute inset-0 flex items-end justify-center px-8 pb-12">
                            <div className="w-full transform rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-transform group-hover:scale-[1.02]">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xs font-black text-gray-400 uppercase">
                                        Recent Loan Logs
                                    </h3>
                                    <span className="text-[10px] text-gray-400">
                                        Date: 25 Jan 2026
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        {
                                            name: 'Loan Record: Maria S.',
                                            amount: '₱15,000.00',
                                        },
                                        {
                                            name: 'Borrow: Tech Supplies',
                                            amount: '₱2,450.50',
                                        },
                                        {
                                            name: 'Loan Record: Juan Dela Cruz',
                                            amount: '₱5,000.00',
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between border-b border-gray-100 pb-2"
                                        >
                                            <span className="text-sm font-bold text-gray-700">
                                                {item.name}
                                            </span>
                                            <span className="text-sm font-bold text-blue-700">
                                                {item.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-6 text-center text-[10px] font-medium text-gray-400 italic">
                                    Private ledger: No third-party access to
                                    your data.
                                </p>
                            </div>
                        </div>

                        {/* Float Label */}
                        <div className="absolute bottom-6 left-6 flex items-center space-x-2 rounded-lg bg-black/30 px-4 py-2 text-white backdrop-blur-md">
                            <div className="flex h-5 w-5 items-center justify-center rounded bg-white/20">
                                📊
                            </div>
                            <span className="text-xs font-bold tracking-tighter uppercase">
                                Loan Management Dashboard
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Comparison Section */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-24 grid items-center gap-12 md:grid-cols-2">
                        {/* Left Side: Without MyPautangLog */}
                        <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-slate-50 p-8 md:p-12">
                            <span className="absolute top-6 rounded-full border border-slate-100 bg-white px-4 py-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                Without MyPautangLog
                            </span>

                            {/* Visual representation of mess */}
                            <div className="relative mt-10">
                                <div className="absolute -top-4 -left-12 z-10 w-48 rotate-[-5deg] rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                    <p className="text-[10px] font-bold text-red-500">
                                        ❌ Forgotten Payment
                                    </p>
                                    <p className="text-[11px] text-slate-500 italic">
                                        "Wait, Nag bayad na ba talaga sya?"
                                    </p>
                                </div>

                                <img
                                    src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=400"
                                    alt="Messy notebooks"
                                    className="h-64 w-64 rounded-2xl object-cover opacity-60 grayscale"
                                />

                                <div className="absolute -right-8 bottom-4 w-48 rotate-[3deg] rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-700">
                                        📝 Messy Notebooks
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        "Saan ko nga ba na-lista yung utang ni
                                        Ana?"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: With MyPautangLog */}
                        <div className="relative flex min-h-[400px] flex-col items-center overflow-hidden rounded-[2.5rem] bg-blue-50/50 p-8 md:p-12">
                            <span className="absolute top-6 rounded-full bg-blue-700 px-4 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                                With MyPautangLog
                            </span>

                            <div className="mt-16 w-full max-w-sm space-y-4">
                                <div className="flex items-center space-x-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-md">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 uppercase">
                                            Payment Confirmed
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Auto-logged and timestamped
                                            instantly.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-md">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        🔔
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 uppercase">
                                            Smart Reminders
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Get notified 2 days before a due
                                            date.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 text-center">
                                    <div className="inline-block rounded-xl border border-blue-100 bg-white px-6 py-3 shadow-sm">
                                        <p className="text-xs font-bold tracking-tight text-blue-700 italic">
                                            That's it! No more manual guesswork.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Headline */}
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="mb-6 text-4xl leading-tight font-black text-slate-900 md:text-5xl">
                            Messy notebooks and forgotten lists are holding you
                            back
                        </h2>
                        <p className="text-lg font-medium text-slate-500">
                            We built a simpler, smarter way to track personal
                            debt. <br className="hidden md:block" />
                            More private, more organized, and actually
                            stress-free.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                label: '90%',
                                desc: 'less disputes between friends over payments.',
                            },
                            {
                                label: '12 hrs',
                                desc: 'time saved per month on manual record-keeping.',
                            },
                            {
                                label: '100% Private',
                                desc: 'Your data stays yours. Never shared with third parties.',
                            },
                            {
                                label: '24/7 Access',
                                desc: 'Check your logs anytime on web or mobile.',
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="rounded-[2rem] border border-slate-100 bg-slate-50 p-8 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-xl"
                            >
                                <p className="mb-2 text-3xl font-black text-blue-700">
                                    {stat.label}
                                </p>
                                <p className="text-sm leading-relaxed font-medium text-slate-500">
                                    {stat.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Deep-Dive Section */}
            <section className="overflow-hidden bg-white py-20">
                <div className="mx-auto max-w-7xl space-y-32 px-6">
                    {/* Feature 1: The All-in-One Log (Text Left, Image Right) */}
                    <div className="grid items-center gap-16 md:grid-cols-2">
                        <div className="space-y-6">
                            <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900">
                                One log for <br /> all your needs
                            </h2>
                            <p className="text-lg text-slate-500">
                                Track personal borrowings, business credits, and
                                friendly loans. Everything is organized in a
                                single private vault accessible only by you.
                            </p>

                            <ul className="space-y-5 pt-4">
                                {[
                                    {
                                        icon: '📱',
                                        title: 'Web & Mobile access',
                                        desc: 'Sync your data across all devices.',
                                    },
                                    {
                                        icon: '⚡',
                                        title: 'Instant entry',
                                        desc: 'Log a new transaction in under 10 seconds.',
                                    },
                                    {
                                        icon: '☁️',
                                        title: 'Secure Cloud Backup',
                                        desc: 'Never lose your records even if you lose your phone.',
                                    },
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-lg shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-blue-100 bg-blue-50 shadow-inner md:aspect-video lg:aspect-square">
                            <img
                                src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=800"
                                alt="Organized Ledger"
                                className="h-full w-full object-cover opacity-70 mix-blend-multiply"
                            />
                            <div className="absolute rounded-2xl border border-blue-100 bg-white/90 px-6 py-4 shadow-xl backdrop-blur">
                                <p className="mb-1 text-xs font-black tracking-widest text-blue-700 uppercase">
                                    Entry Status
                                </p>
                                <p className="text-sm font-bold text-slate-800 italic">
                                    "Payment for Grocery Supplies Logged"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Control & Reminders (Image Left, Text Right) */}
                    <div className="grid items-center gap-16 md:grid-cols-2">
                        {/* On mobile, this will move below the text due to 'order-2 md:order-1' */}
                        <div className="relative order-2 flex aspect-square flex-col justify-center rounded-[2.5rem] border border-slate-100 bg-slate-50 p-8 md:order-1">
                            <div className="space-y-6 rounded-2xl bg-white p-6 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase">
                                        Reminder Settings
                                    </span>
                                    <button className="rounded-md bg-slate-900 px-3 py-1 text-[10px] text-white">
                                        Save Changes
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-700">
                                        Notification Channels
                                    </p>
                                    <div className="flex gap-2">
                                        {['📧 Email', '💬 SMS', '🔔 Push'].map(
                                            (tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700"
                                                >
                                                    {tag}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="mb-3 text-xs font-bold text-slate-700">
                                            Custom Reminder Time
                                        </p>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div className="h-full w-3/4 bg-blue-600"></div>
                                        </div>
                                        <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                            <span>3 Days Before</span>
                                            <span className="text-blue-600">
                                                Due Date
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 space-y-6 md:order-2">
                            <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900">
                                Take control of <br /> your debt history
                            </h2>
                            <p className="text-lg text-slate-500">
                                Set custom reminders and manage exactly how you
                                want to be notified. Keep your relationships
                                healthy by never forgetting a commitment.
                            </p>
                            <ul className="space-y-5 pt-4">
                                {[
                                    {
                                        icon: '⚙️',
                                        title: 'Set rules on logs',
                                        desc: 'Categorize by Personal, Business, or Family.',
                                    },
                                    {
                                        icon: '📅',
                                        title: 'Due date alerts',
                                        desc: 'Get notified via app or email before the deadline.',
                                    },
                                    {
                                        icon: '🖥️',
                                        title: 'Detailed Admin Panel',
                                        desc: 'View your total lending vs borrowing at a glance.',
                                    },
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-lg shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 3: Security & Exporting (Text Left, Image Right) */}
                    <div className="grid items-center gap-16 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="mb-2 inline-flex items-center space-x-2 rounded-md bg-green-50 px-3 py-1">
                                <span className="text-[10px] font-bold tracking-widest text-green-600 uppercase">
                                    Bank-Grade Privacy
                                </span>
                            </div>
                            <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900">
                                Your data, <br /> your rules.
                            </h2>
                            <p className="text-lg text-slate-500">
                                MyPautangLog is strictly a private
                                record-keeping tool. We do not provide loans or
                                connect you with lenders. Your records are
                                encrypted and meant for your eyes only.
                            </p>

                            <ul className="space-y-5 pt-4">
                                {[
                                    {
                                        icon: '🔒',
                                        title: 'End-to-End Encryption',
                                        desc: 'Personal loan details are encrypted before they hit our servers.',
                                    },
                                    {
                                        icon: '📊',
                                        title: 'Export to PDF/CSV',
                                        desc: 'Need a physical copy? Export your entire history in one click.',
                                    },
                                    {
                                        icon: '🛡️',
                                        title: 'Fully Legal & Safe',
                                        desc: 'A secure digital ledger that replaces risky paper trail habits.',
                                    },
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-lg shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="group relative">
                            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] bg-slate-900 p-1 shadow-2xl">
                                <div className="relative flex h-full w-full items-center justify-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                                    <div className="relative z-10 w-4/5 transform rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all group-hover:scale-105">
                                        <div className="mb-4 flex items-center justify-between border-b pb-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">
                                                Security Vault
                                            </span>
                                            <div className="flex space-x-1">
                                                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                                                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                                                <span className="text-xs font-bold tracking-tight text-slate-600">
                                                    Generate Report.pdf
                                                </span>
                                                <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white">
                                                    Download
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                                                <span className="text-xs font-bold tracking-tight text-slate-600">
                                                    Auto-Sync Status
                                                </span>
                                                <span className="text-[10px] font-black text-green-600 uppercase">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-center">
                                            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2">
                                                <p className="text-center text-[9px] font-bold text-blue-700 italic">
                                                    "Records verified & secured
                                                    under ISO 27001 standards"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Simple, transparent pricing
                        </h2>
                        <p className="mt-4 text-lg text-slate-500">
                            No hidden fees. Choose the plan that fits your
                            tracking needs.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Free Plan */}
                        <div className="flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Free
                                </h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900">
                                        ₱0
                                    </span>
                                    <span className="text-sm font-medium text-slate-500">
                                        /forever
                                    </span>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                                    Perfect for individuals tracking simple
                                    personal loans.
                                </p>
                            </div>
                            <ul className="mb-10 space-y-4 border-t border-slate-100 pt-8">
                                {[
                                    'Up to 20 active logs',
                                    'Up to 20 customers',
                                    'Promissiory Note generation',
                                    'Excel Export',
                                    'Mobile app access',
                                ].map((feat) => (
                                    <li
                                        key={feat}
                                        className="flex items-center gap-3 text-sm font-medium text-slate-600"
                                    >
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-600">
                                            ✓
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-auto w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50">
                                Get Started
                            </button>
                        </div>

                        {/* Premium Plan */}
                        <div className="flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Premium
                                </h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900">
                                        Coming Soon
                                    </span>
                                    <span className="text-sm font-medium text-slate-500">
                                        {/* /month */}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                                    For power users managing multiple lenders
                                    and borrowers.
                                </p>
                            </div>
                            <ul className="mb-10 space-y-4 border-t border-slate-100 pt-8">
                                {[
                                    'Up to 100 active logs',
                                    'Unlimited Customers',
                                    'Email reminders',
                                    'PDF Report generation',
                                    'Priority support',
                                    'Everything in Free Plan',
                                ].map((feat) => (
                                    <li
                                        key={feat}
                                        className="flex items-center gap-3 text-sm font-medium text-slate-600"
                                    >
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-600">
                                            ✓
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-auto w-full cursor-not-allowed  rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50">
                                Coming Soon
                            </button>
                        </div>

                        {/* Pro Plan - Highlighting as the "Rally" Tier */}
                        <div className="relative flex transform flex-col rounded-[2.5rem] border-2 border-blue-600 bg-blue-600 p-10 shadow-2xl md:-translate-y-4">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-1 text-[10px] font-black tracking-widest text-white uppercase">
                                Most Popular
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white">
                                    Pro
                                </h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white">
                                        Coming Soon
                                    </span>
                                    <span className="text-sm font-medium text-blue-100">
                                        {/* /month */}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-blue-100">
                                    Full business tracking without limits.
                                </p>
                            </div>
                            <ul className="mb-10 space-y-4 border-t border-blue-500 pt-8">
                                {[
                                    'Unlimited active logs',
                                    'Priority 24/7 support',
                                    'Staff account access',
                                    'SMS and Push notifications',
                                    'Advanced analytics',
                                    'Everything in Premium Plan',
                                ].map((feat) => (
                                    <li
                                        key={feat}
                                        className="flex items-center gap-3 text-sm font-medium text-white"
                                    >
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-blue-600">
                                            ✓
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                disabled
                                className="mt-auto w-full cursor-not-allowed rounded-xl bg-gray-300 py-3 text-sm font-black text-blue-600 shadow-lg transition-transform"
                            >
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-100 bg-white py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-16 md:grid-cols-2">
                        {/* Left Side: Heading (Matches Screenshot 6) */}
                        <div>
                            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:max-w-xs">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        {/* Right Side: Shadcn Accordion */}
                        <div className="w-full">
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full space-y-2"
                            >
                                {faqs.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`item-${index}`}
                                        className="border-b border-slate-100 px-2 transition-all hover:bg-slate-50/50"
                                    >
                                        <AccordionTrigger className="py-6 text-left text-base font-bold text-slate-900 hover:no-underline">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 text-sm leading-relaxed text-slate-500">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="border-t border-slate-100 bg-white pt-20 pb-10">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
                        {/* Brand Column */}
                        <div className="col-span-2 lg:col-span-2">
                            <div className="mb-6 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xl font-black text-white">
                                    P
                                </div>
                                <span className="text-xl font-black tracking-tight text-slate-900">
                                    MyPautangLog
                                </span>
                            </div>
                            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                                The secure digital ledger for your personal and
                                business debts. Keep your records private,
                                organized, and always accessible.
                            </p>
                        </div>

                        {/* Links: Product */}
                        <div>
                            <h4 className="mb-6 text-xs font-black tracking-widest text-slate-900 uppercase">
                                Product
                            </h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-500">
                                <li className="cursor-pointer hover:text-blue-600">
                                    Features
                                </li>
                                <li className="cursor-pointer hover:text-blue-600">
                                    Pricing
                                </li>
                                <li className="cursor-pointer hover:text-blue-600">
                                    Security
                                </li>
                            </ul>
                        </div>

                        {/* Links: Company */}
                        <div>
                            <h4 className="mb-6 text-xs font-black tracking-widest text-slate-900 uppercase">
                                Company
                            </h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-500">
                                <li className="cursor-pointer hover:text-blue-600">
                                    About
                                </li>
                                <li className="cursor-pointer hover:text-blue-600">
                                    Contact
                                </li>
                                <li className="cursor-pointer hover:text-blue-600">
                                    FAQ
                                </li>
                            </ul>
                        </div>

                        {/* Links: Legal */}
                        <div>
                            <h4 className="mb-6 text-xs font-black tracking-widest text-slate-900 uppercase">
                                Legal
                            </h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-500">
                                <li className="cursor-pointer hover:text-blue-600">
                                    Privacy
                                </li>
                                <li className="cursor-pointer hover:text-blue-600">
                                    Terms
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-10 md:flex-row">
                        <p className="text-xs font-medium text-slate-400">
                            © 2026 MyPautangLog. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            {/* Simple Social Icons Placeholders */}
                            <div className="h-5 w-5 cursor-pointer rounded-full bg-slate-100 transition-colors hover:bg-blue-50" />
                            <div className="h-5 w-5 cursor-pointer rounded-full bg-slate-100 transition-colors hover:bg-blue-50" />
                            <div className="h-5 w-5 cursor-pointer rounded-full bg-slate-100 transition-colors hover:bg-blue-50" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
