import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    Calculator,
    CheckCircle2,
    Clock,
    Cloud,
    FileCheck,
    FileText,
    Lock,
    LogIn,
    Play,
    Shield,
    Smartphone,
    TrendingUp,
    UserPlus,
    Users,
    Zap,
} from 'lucide-react';
import Footer from './footer';
import Navigation from './navigation';
import Tutorial from '../../videos/mypautanglog version 1.mov';

export default function Features() {
    const features = [
        {
            icon: Shield,
            title: 'Privacy First',
            description:
                'Your loan data is encrypted and stored securely. We never share or sell your information to third parties.',
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            icon: BarChart3,
            title: 'Finance Analytics',
            description:
                'Visual charts and reports help you understand your lending portfolio at a glance.',
            color: 'emerald',
            gradient: 'from-emerald-500 to-emerald-600',
        },
        {
            icon: Clock,
            title: 'Payment History',
            description:
                'Track every payment with timestamps. See complete transaction history for each borrower.',
            color: 'amber',
            gradient: 'from-amber-500 to-amber-600',
        },
        {
            icon: Smartphone,
            title: 'Mobile & Web Access',
            description:
                'Access your records anywhere, anytime. Full sync across all your devices.',
            color: 'pink',
            gradient: 'from-pink-500 to-pink-600',
        },
        {
            icon: Cloud,
            title: 'Cloud Backup',
            description:
                'Automatic cloud backup ensures your data is never lost, even if you lose your device.',
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
        },
        {
            icon: Lock,
            title: 'Secure Authentication',
            description:
                'Multi-layer security with encrypted passwords and secure login sessions.',
            color: 'red',
            gradient: 'from-red-500 to-red-600',
        },
        {
            icon: FileCheck,
            title: 'Promissory Notes',
            description:
                'Generate professional promissory notes for your loans with one click.',
            color: 'teal',
            gradient: 'from-teal-500 to-teal-600',
        },
        {
            icon: Calculator,
            title: 'Interest Calculator',
            description:
                'Built-in calculator for computing interest rates and payment schedules automatically.',
            color: 'orange',
            gradient: 'from-orange-500 to-orange-600',
        },
        {
            icon: TrendingUp,
            title: 'Profit Tracking',
            description:
                'Monitor your lending business growth with detailed profit and loss statements.',
            color: 'cyan',
            gradient: 'from-cyan-500 to-cyan-600',
        },
        {
            icon: Users,
            title: 'Customer Management',
            description:
                'Organize borrower information, contact details, and credit history in one place.',
            color: 'violet',
            gradient: 'from-violet-500 to-violet-600',
        },
        {
            icon: Zap,
            title: 'Quick Entry',
            description:
                'Log new transactions in under 10 seconds with our streamlined interface.',
            color: 'lime',
            gradient: 'from-lime-500 to-lime-600',
        },
    ];

    const gettingStartedSteps = [
        {
            step: 1,
            icon: UserPlus,
            title: 'Sign Up',
            description:
                'Create your free account in less than a minute. Just enter your name, email, and password.',
            details: [
                'No credit card required',
                'Email verification',
                'Set up your profile',
                'Choose your plan',
            ],
            color: 'blue',
        },
        {
            step: 2,
            icon: LogIn,
            title: 'Login',
            description:
                'Access your secure dashboard from any device. Your data syncs automatically across all platforms.',
            details: [
                'Secure authentication',
                'Remember device option',
                'Quick access dashboard',
            ],
            color: 'emerald',
        },
        {
            step: 3,
            icon: FileText,
            title: 'Start Logging Loans',
            description:
                "Add your first loan record and start tracking payments. It's that simple!",
            details: [
                'Add borrower details',
                'Set loan amount & interest',
                'Choose payment schedule',
                'Track payments in real-time',
            ],
            color: 'purple',
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 px-6 pt-24 pb-20">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="absolute top-0 left-0 h-96 w-96 animate-pulse rounded-full bg-blue-500 blur-3xl"
                        style={{ animationDuration: '4s' }}
                    />
                    <div
                        className="absolute right-0 bottom-0 h-96 w-96 animate-pulse rounded-full bg-emerald-500 blur-3xl"
                        style={{ animationDuration: '6s' }}
                    />
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
                        <span className="text-xs font-bold tracking-wide text-blue-300 uppercase">
                            Powerful Features
                        </span>
                    </div>

                    <h1 className="mb-6 text-5xl leading-tight font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                        Everything You Need to
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Manage Your Loans
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300">
                        From quick loan entries to detailed analytics,
                        MyPautangLog has all the tools you need to run your
                        lending business efficiently and professionally.
                    </p>
                </div>
            </section>

            {/* Video Tutorial Section */}
            <section className="bg-slate-50 px-6 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-2">
                            <Play className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-bold tracking-wide text-blue-700 uppercase">
                                Video Tutorial
                            </span>
                        </div>
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            See MyPautangLog in Action
                        </h2>
                        <p className="text-lg text-slate-600">
                            Watch this quick tutorial to learn how to get
                            started
                        </p>
                    </div>

                    {/* Video Container */}
                    <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-slate-200 bg-slate-900 shadow-2xl">
                        <div className="aspect-video">
                            {/* Replace this with your actual video embed */}
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                <video
                                    className="h-full w-full object-cover"
                                    src={Tutorial}
                                    controls
                                    playsInline
                                    preload="metadata"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Getting Started Section */}
            <section className="bg-white px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center space-x-2 rounded-full bg-emerald-50 px-4 py-2">
                            <Zap className="h-4 w-4 text-emerald-600" />
                            <span className="text-xs font-bold tracking-wide text-emerald-700 uppercase">
                                Quick Start
                            </span>
                        </div>
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Get Started in 3 Simple Steps
                        </h2>
                        <p className="text-lg text-slate-600">
                            From signup to your first loan record in minutes
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div
                            className="absolute top-20 bottom-20 left-12 hidden w-1 bg-gradient-to-b from-blue-600 via-emerald-500 to-purple-600 lg:block"
                            style={{ left: 'calc(16.666% + 2rem)' }}
                        />

                        <div className="grid gap-12 lg:grid-cols-3">
                            {gettingStartedSteps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.step}
                                        className="group relative"
                                    >
                                        {/* Step Number Badge */}
                                        <div
                                            className={`absolute -top-4 -left-4 z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color === 'blue' ? 'from-blue-500 to-blue-600' : step.color === 'emerald' ? 'from-emerald-500 to-emerald-600' : 'from-purple-500 to-purple-600'} shadow-lg transition-transform group-hover:scale-110`}
                                        >
                                            <span className="text-2xl font-black text-white">
                                                {step.step}
                                            </span>
                                        </div>

                                        <div className="h-full overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-slate-300 group-hover:shadow-2xl">
                                            <div
                                                className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${step.color === 'blue' ? 'from-blue-500 to-blue-600' : step.color === 'emerald' ? 'from-emerald-500 to-emerald-600' : 'from-purple-500 to-purple-600'} p-4`}
                                            >
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>

                                            <h3 className="mb-4 text-2xl font-black text-slate-900">
                                                {step.title}
                                            </h3>

                                            <p className="mb-6 text-slate-600">
                                                {step.description}
                                            </p>

                                            <ul className="space-y-3">
                                                {step.details.map(
                                                    (detail, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-center gap-3 text-sm text-slate-700"
                                                        >
                                                            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50">
                                                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                            </div>
                                                            {detail}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-16 text-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-black text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl"
                        >
                            Get Started Now
                            <CheckCircle2 className="h-5 w-5" />
                        </Link>
                        <p className="mt-4 text-sm text-slate-500">
                            No credit card required • Free forever plan
                            available
                        </p>
                    </div>
                </div>
            </section>

            {/* All Features Grid */}
            <section className="bg-slate-50 px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            All Features at a Glance
                        </h2>
                        <p className="text-lg text-slate-600">
                            Comprehensive tools designed for Filipino lenders
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div
                                        className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 shadow-lg`}
                                    >
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>

                                    <h3 className="mb-3 text-xl font-black text-slate-900">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-600">
                                        {feature.description}
                                    </p>

                                    {/* Hover effect */}
                                    <div
                                        className={`absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 transition-all duration-300 group-hover:scale-150 group-hover:opacity-10`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-6 py-24">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-4xl leading-tight font-black text-white md:text-5xl">
                        Ready to Transform Your
                        <br />
                        Lending Business?
                    </h2>
                    <p className="mb-10 text-lg leading-relaxed text-slate-300">
                        Join hundreds of Filipino lenders who trust MyPautangLog
                        to manage
                        <br className="hidden md:block" />
                        their loans efficiently and professionally.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="rounded-xl bg-white px-8 py-4 text-sm font-black text-slate-900 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/pricing"
                            className="rounded-xl border-2 border-white bg-transparent px-8 py-4 text-sm font-black text-white transition-all hover:bg-white hover:text-slate-900"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
