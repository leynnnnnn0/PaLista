import { login } from '@/routes';
import { Link } from '@inertiajs/react';
import { Heart, Lightbulb, Shield, Target, Users, Zap } from 'lucide-react';
import LOGO from '../../images/mainLogo.png';
import Navigation from '../pages/navigation';
export default function AboutUs() {
    const values = [
        {
            icon: Shield,
            title: 'Privacy First',
            description:
                'Your data is yours alone. We never share, sell, or access your lending records. Your trust is our foundation.',
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            icon: Heart,
            title: 'Built for Filipinos',
            description:
                'We understand the unique lending culture in the Philippines. Our tools are designed with local practices in mind.',
            gradient: 'from-emerald-500 to-emerald-600',
        },
        {
            icon: Zap,
            title: 'Simplicity Matters',
            description:
                "Complex spreadsheets and messy notebooks shouldn't hold you back. We make loan tracking effortless.",
            gradient: 'from-amber-500 to-amber-600',
        },
        {
            icon: Users,
            title: 'Community Driven',
            description:
                'Every feature we build comes from listening to real lenders. Your feedback shapes our roadmap.',
            gradient: 'from-purple-500 to-purple-600',
        },
    ];

    const timeline = [
        {
            year: '2025',
            title: 'The Beginning',
            description:
                'Started as a student project to solve a real problem faced by Filipino lenders managing personal loans.',
        },
        {
            year: '2026',
            title: 'Launched beta version',
            description:
                'Launched beta version and received overwhelming support from small business owners and individual lenders.',
        },
        {
            year: '2026',
            title: 'Growing Strong',
            description:
                'Continuously improving based on user feedback. Building features that truly matter to our community.',
        },
        {
            year: 'Future',
            title: 'The Vision',
            description:
                'Becoming the most trusted lending management tool for Filipinos, empowering thousands of lenders nationwide.',
        },
    ];

    const stats = [
        { number: '100%', label: 'Privacy Guaranteed' },
        { number: '24/7', label: 'Access Anytime' },
        { number: '0', label: 'Hidden Fees' },
        { number: '∞', label: 'Peace of Mind' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navigation */}
            <Navigation/>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 px-6 pt-24 pb-32">
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
                    <div
                        className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-purple-500 blur-3xl"
                        style={{ animationDuration: '5s' }}
                    />
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
                        <span className="text-xs font-bold tracking-wide text-blue-300 uppercase">
                            Our Story
                        </span>
                    </div>

                    <h1 className="mb-6 text-5xl leading-tight font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                        Empowering Filipino Lenders,
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            One Log at a Time
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300">
                        We're a student-led project on a mission to simplify
                        loan tracking for every Filipino lender. No investors,
                        no complexity—just a genuine solution built by someone
                        who saw a problem and decided to fix it.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm"
                            >
                                <div className="text-3xl font-black text-white">
                                    {stat.number}
                                </div>
                                <div className="text-xs font-semibold text-slate-400 uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-[3rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-12 md:p-16">
                        <div className="mb-8 inline-flex rounded-2xl bg-blue-600 p-4">
                            <Target className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="mb-6 text-4xl leading-tight font-black tracking-tight text-slate-900 md:text-5xl">
                            Our Mission
                        </h2>
                        <p className="mb-6 text-xl leading-relaxed text-slate-700">
                            To provide Filipino lenders with a secure, private,
                            and effortless way to manage their lending
                            operations—without the complexity of traditional
                            banking systems or the chaos of manual
                            record-keeping.
                        </p>
                        <p className="text-lg leading-relaxed text-slate-600">
                            We believe that managing loans shouldn't require
                            expensive software or technical expertise. Whether
                            you're lending to friends, family, or running a
                            small lending business, MyPautangLog helps you stay
                            organized, professional, and stress-free.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-white px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            What We Stand For
                        </h2>
                        <p className="text-lg text-slate-600">
                            The principles that guide everything we build
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div
                                        className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${value.gradient} p-4`}
                                    >
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>

                                    <h3 className="mb-4 text-xl font-black text-slate-900">
                                        {value.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-600">
                                        {value.description}
                                    </p>

                                    {/* Decorative element */}
                                    <div
                                        className={`absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-br ${value.gradient} opacity-10 transition-all duration-300 group-hover:scale-150`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="bg-slate-50 px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Our Journey
                        </h2>
                        <p className="text-lg text-slate-600">
                            From student project to trusted platform
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-blue-600 via-emerald-500 to-purple-600 md:left-1/2" />

                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className={`relative mb-12 flex items-center ${
                                    index % 2 === 0
                                        ? 'md:flex-row'
                                        : 'md:flex-row-reverse'
                                }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-8 z-10 flex h-4 w-4 items-center justify-center md:left-1/2">
                                    <div className="h-4 w-4 rounded-full border-4 border-white bg-blue-600 shadow-lg" />
                                </div>

                                {/* Content Card */}
                                <div
                                    className={`ml-20 w-full md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}
                                >
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <div className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1">
                                            <span className="text-xs font-black text-blue-600 uppercase">
                                                {item.year}
                                            </span>
                                        </div>
                                        <h3 className="mb-3 text-xl font-black text-slate-900">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-[3rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-12 md:p-16">
                        <div className="mb-8 inline-flex rounded-2xl bg-emerald-500 p-4">
                            <Lightbulb className="h-8 w-8 text-white" />
                        </div>

                        <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                            Why We Built This
                        </h2>

                        <div className="space-y-6 text-lg leading-relaxed text-slate-700">
                            <p>
                                As a third-year student, I witnessed how
                                Filipino lenders—whether they're family members
                                helping relatives, friends splitting bills, or
                                small business owners—struggle with tracking
                                their loans.
                            </p>

                            <p>
                                Notebooks get lost. Excel spreadsheets become
                                confusing. Messages get buried. And suddenly,
                                you can't remember who paid what or when the
                                next payment is due.
                            </p>

                            <p className="rounded-2xl border-l-4 border-blue-600 bg-blue-50 p-6 font-bold text-blue-900">
                                "There had to be a better way—one that's
                                private, simple, and built specifically for how
                                Filipinos lend money."
                            </p>

                            <p>
                                MyPautangLog isn't about connecting lenders to
                                borrowers or becoming a financial institution.
                                It's about giving you the tools to manage your
                                own lending records with dignity, privacy, and
                                ease.
                            </p>

                            <p>
                                No third parties. No data sharing. No
                                complicated features you'll never use. Just
                                straightforward loan tracking that works the way
                                you do.
                            </p>
                        </div>
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
                        Join Our Growing Community
                    </h2>
                    <p className="mb-10 text-lg leading-relaxed text-slate-300">
                        Be part of the movement to modernize lending in the
                        Philippines.
                        <br className="hidden md:block" />
                        Start tracking your loans with confidence today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button className="rounded-xl bg-white px-8 py-4 text-sm font-black text-slate-900 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                            Get Started for Free
                        </button>
                        <Link
                            href="/contact"
                            className="rounded-xl border-2 border-white bg-transparent px-8 py-4 text-sm font-black text-white transition-all hover:bg-white hover:text-slate-900"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-100 bg-white px-6 pt-16 pb-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <img src={LOGO} alt="Logo" className="h-10" />
                            <span className="font-bold text-[#1e293b]">
                                MyPautang
                                <span className="text-blue-600">Log</span>
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 text-center">
                        <p className="text-sm text-slate-500">
                            © 2026 MyPautangLog. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
