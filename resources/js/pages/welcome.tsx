import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Head, router } from '@inertiajs/react';
import Chart from '../../images/dashboard.png';
import Financial from '../../images/financial.png';
import Graph from '../../images/graph.png';
import MyPautang from '../../images/mypautangs.png';
import Footer from '../pages/footer';
import InstallPrompt from '../pages/install-prompt';
import Navigation from '../pages/navigation';

export default function Welcome() {
    const faqs = [
        {
            question: 'What is MyPautangLog?',
            answer: 'MyPautangLog is a secure digital ledger designed to help you track personal and business loans. It is a private record-keeping tool, not a lending service.',
        },
        {
            question: 'Who can use MyPautangLog?',
            answer: 'Anyone who wants to organize their personal or business loan records. Ideal for small business owners, friends sharing expenses, or individuals tracking  debts.',
        },
        {
            question: 'How is it different from a banking app?',
            answer: 'Unlike banks, we focus on informal or personal loan records. You can log any transaction without involving bank accounts.',
        },
        {
            question: 'What are your fees?',
            answer: 'We offer a Free plan for basic tracking. Premium and Pro plans provide additional features like advanced reminders, staff accounts, and reporting tools.',
        },
        {
            question: 'How do I get started?',
            answer: 'Sign up with your account and start logging your first transactions immediately.',
        },
    ];

    // SEO metadata
    const siteUrl = 'https://mypautanglog.com'; // Replace with your actual domain
    const pageTitle =
        'MyPautangLog - Digital Loan Tracking for Filipino Lenders';
    const pageDescription =
        'Track personal and business loans with MyPautangLog. Secure digital ledger with automated reminders, payment tracking, and financial analytics. Free plan available.';
    const pageKeywords =
        'loan tracking, debt management, lending app Philippines, pautang tracker, personal loan ledger, business loan tracking, Filipino lenders, digital ledger';
    const ogImage = `${siteUrl}/images/og-image.png`; // Create and add your OG image

    return (
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>{pageTitle}</title>
                <meta name="title" content={pageTitle} />
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={pageKeywords} />
                <meta name="author" content="MyPautangLog" />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="7 days" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="MyPautangLog" />
                <meta property="og:locale" content="en_PH" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={siteUrl} />
                <meta property="twitter:title" content={pageTitle} />
                <meta
                    property="twitter:description"
                    content={pageDescription}
                />
                <meta property="twitter:image" content={ogImage} />

                {/* Additional SEO Tags */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="theme-color" content="#1d4ed8" />
                <link rel="canonical" href={siteUrl} />

                {/* Geo Tags for Philippines */}
                <meta name="geo.region" content="PH" />
                <meta name="geo.placename" content="Philippines" />

                {/* Schema.org structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: 'MyPautangLog',
                        applicationCategory: 'FinanceApplication',
                        operatingSystem: 'Web, iOS, Android',
                        offers: {
                            '@type': 'Offer',
                            price: '0',
                            priceCurrency: 'PHP',
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '4.8',
                            ratingCount: '150',
                        },
                        description: pageDescription,
                        url: siteUrl,
                        image: ogImage,
                        author: {
                            '@type': 'Organization',
                            name: 'MyPautangLog',
                        },
                    })}
                </script>

                {/* FAQ Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map((faq) => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer,
                            },
                        })),
                    })}
                </script>

                {/* Organization Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'MyPautangLog',
                        url: siteUrl,
                        logo: `${siteUrl}/images/mainLogo.png`,
                        sameAs: [
                            // Add your social media profiles here
                            // "https://www.facebook.com/mypautanglog",
                            // "https://twitter.com/mypautanglog"
                        ],
                        contactPoint: {
                            '@type': 'ContactPoint',
                            contactType: 'Customer Service',
                            availableLanguage: ['English', 'Tagalog'],
                        },
                    })}
                </script>
            </Head>

            <div className="min-h-screen bg-white font-sans text-[#1e293b]">
                {/* Navigation */}
                <Navigation />

                {/* Hero Section */}
                <main className="mx-auto grid max-w-7xl items-center gap-12 px-6 pt-12 pb-24 md:grid-cols-2">
                    {/* Left Column: Copy */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-2 rounded-md border border-green-200 bg-green-50 px-3 py-1">
                            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                Designed for Filipino Lenders
                            </span>
                        </div>

                        <h1 className="text-6xl leading-[1.1] font-extrabold tracking-tighter text-gray-900 md:text-7xl">
                            Clear records,
                            <br />
                            <span className="text-blue-700">zero stress.</span>
                        </h1>

                        <p className="max-w-md text-lg leading-relaxed text-gray-500">
                            Keep all your personal and business loan records in
                            one secure place with automated reminders and a
                            private ledger accessible only to you.
                        </p>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.get('/login')}
                                className="cursor-pointer rounded-xl bg-blue-700 px-8 py-4 font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-blue-200"
                            >
                                Get Started
                            </button>
                            <InstallPrompt />
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
                            <div className="absolute inset-0 opacity-80 mix-blend-multiply" />
                            <img
                                src={Chart}
                                alt="MyPautangLog dashboard showing payment schedules and loan tracking interface"
                                className="h-full w-full object-cover"
                            />

                            {/* Dashboard Overlay (Matching the "Invoices" look) */}
                            <div className="absolute top-10 right-0 flex items-end justify-center px-8">
                                <div className="w-full transform rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-transform group-hover:scale-[1.02]">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-xs font-black text-gray-400 uppercase">
                                            Payment Schedules
                                        </h3>
                                        <span className="text-[10px] text-gray-400">
                                            Date: 25 Jan 2026
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                name: 'Jaslela Smith',
                                                amount: '₱15,000.00',
                                            },
                                            {
                                                name: 'Milo Almoguera',
                                                amount: '₱2,450.50',
                                            },
                                            {
                                                name: 'Mimi Alvarez',
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
                                        alt="Messy paper notebooks and scattered loan records showing disorganized tracking"
                                        className="h-64 w-64 rounded-2xl object-cover opacity-60 grayscale"
                                    />

                                    <div className="absolute -right-8 bottom-4 w-48 rotate-[3deg] rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-700">
                                            📝 Messy Notebooks
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            "Saan ko nga ba na-lista yung utang
                                            ni Ana?"
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
                                                Payment Recorded
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Timestamped instantly.
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
                                                That's it! No more manual
                                                guesswork.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Headline */}
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="mb-6 text-4xl leading-tight font-black text-slate-900 md:text-5xl">
                                Messy notebooks and forgotten lists are holding
                                you back
                            </h2>
                            <p className="text-lg font-medium text-slate-500">
                                We built a simpler, smarter way to track
                                personal debt.{' '}
                                <br className="hidden md:block" />
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
                                    Track business credits, and friendly loans.
                                    Everything is organized in a single private
                                    vault accessible only by you.
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

                            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-inner md:aspect-video lg:aspect-square">
                                <img
                                    src={MyPautang}
                                    alt="MyPautangLog organized ledger showing loan records and payment tracking"
                                    className="h-72 w-full rounded-lg bg-white p-3 mix-blend-multiply"
                                />
                                <div className="absolute rounded-2xl border border-blue-100 bg-white/90 px-6 py-4 shadow-xl backdrop-blur">
                                    <p className="mb-1 text-xs font-black tracking-widest text-blue-700 uppercase">
                                        Track Aging
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 italic">
                                        "Past Due Dates"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2: Control & Reminders (Image Left, Text Right) */}
                        <div className="grid items-center gap-16 md:grid-cols-2">
                            {/* On mobile, this will move below the text due to 'order-2 md:order-1' */}
                            <div className="relative order-2 flex aspect-square flex-col justify-center rounded-[2.5rem] border border-slate-100 bg-slate-50 p-8 md:order-1">
                                {/* The Financial Summary Card Component */}
                                <img
                                    src={Financial}
                                    alt="Financial summary dashboard showing receivables and payment tracking"
                                />
                            </div>

                            <div className="order-1 space-y-6 md:order-2">
                                {/* Updated Contextual Header */}
                                <div className="space-y-4">
                                    <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900">
                                        Track Every Peso <br /> of Your Lending
                                    </h2>
                                    <p className="text-lg text-slate-500">
                                        Manage your receivables with precision.
                                        Monitor outstanding balances, add
                                        penalties, and verify payment progress
                                        to ensure your capital is always
                                        accounted for.
                                    </p>
                                </div>

                                {/* Updated Lender Features List */}
                                <ul className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-1">
                                    {[
                                        {
                                            icon: '⚖️',
                                            title: 'Penalty Enforcement',
                                            desc: 'Apply late fees based on custom grace periods.',
                                        },
                                        {
                                            icon: '📝',
                                            title: 'Payment Logging',
                                            desc: 'Record partial or full payments with date-stamped receipts.',
                                        },
                                        {
                                            icon: '📉',
                                            title: 'Diminishing Balance',
                                            desc: 'Watch the balance drop in real-time as logs are added.',
                                        },
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start space-x-4"
                                        >
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-lg shadow-sm">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs leading-relaxed text-slate-500">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Feature 3: Portfolio Insights (Text Left, Image Right) */}
                        <div className="grid items-center gap-16 md:grid-cols-2">
                            <div className="space-y-6">
                                <div className="mb-2 inline-flex items-center space-x-2 rounded-md bg-blue-50 px-3 py-1">
                                    <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                                        Lender Analytics
                                    </span>
                                </div>
                                <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900">
                                    A birds-eye view <br /> of your capital.
                                </h2>
                                <p className="text-lg text-slate-500">
                                    Stop guessing your net worth. Monitor your
                                    total lent amount, accumulated interest, and
                                    actual collection rates in one centralized
                                    dashboard designed for modern lenders.
                                </p>

                                <ul className="space-y-5 pt-4">
                                    {[
                                        {
                                            icon: '📈',
                                            title: 'Collection Rate Tracking',
                                            desc: 'See exactly what percentage of your expected returns have been collected.',
                                        },
                                        {
                                            icon: '💸',
                                            title: 'Profit & Loss Metrics',
                                            desc: 'Track net profit and cash flow to understand the health of your lending business.',
                                        },
                                        {
                                            icon: '📅',
                                            title: 'Scheduled vs. Actuals',
                                            desc: 'Compare monthly scheduled dues against actual payments received via visual charts.',
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

                            {/* Dashboard Visualization Component */}
                            <div className="group relative">
                                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] bg-slate-200 p-4 shadow-2xl">
                                    <img
                                        src={Graph}
                                        alt="Analytics dashboard showing lending portfolio performance and collection rates"
                                        className="rounded-lg"
                                    />
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
                                        'Promissiory note generation',
                                        'Finance Analytics',
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
                                <button
                                    onClick={() => router.get('/login')}
                                    className="mt-auto w-full cursor-pointer rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50"
                                >
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
                                        For power users managing multiple
                                        lenders and borrowers.
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
                                <button className="mt-auto w-full cursor-not-allowed rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50">
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

                <Footer />
            </div>
        </>
    );
}
