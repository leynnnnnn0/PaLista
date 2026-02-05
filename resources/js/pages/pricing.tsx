import { login } from '@/routes';
import { Link, router } from '@inertiajs/react';
import { Check, Crown, Sparkles, X, Zap } from 'lucide-react';
import LOGO from '../../images/mainLogo.png';
import Navigation from '../pages/navigation';
import Footer from '../pages/footer';
export default function Pricing() {
    const plans = [
        {
            name: 'Free',
            tagline: 'Start your lending journey',
            price: '₱0',
            period: '/forever',
            description:
                'Perfect for individuals tracking simple personal loans.',
            icon: Sparkles,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            buttonStyle:
                'border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-50',
            features: [
                { text: 'Up to 20 active logs', included: true },
                { text: 'Up to 20 customers', included: true },
                { text: 'Promissory note generation', included: true },
                { text: 'Finance Analytics', included: true },
                { text: 'Mobile app access', included: true },
                { text: 'Email reminders', included: false },
                { text: 'PDF Report generation', included: false },
                { text: 'Priority support', included: false },
            ],
            popular: false,
        },
        {
            name: 'Premium',
            tagline: 'Scale your operations',
            price: 'Coming Soon',
            period: '',
            description:
                'For power users managing multiple lenders and borrowers.',
            icon: Zap,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            buttonStyle:
                'border-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700',
            features: [
                { text: 'Up to 100 active logs', included: true },
                { text: 'Unlimited Customers', included: true },
                { text: 'Email reminders', included: true },
                { text: 'PDF Report generation', included: true },
                { text: 'Priority support', included: true },
                { text: 'Everything in Free Plan', included: true },
                { text: 'Staff account access', included: false },
                { text: 'SMS and Push notifications', included: false },
            ],
            popular: true,
            comingSoon: true,
        },
        {
            name: 'Pro',
            tagline: 'Unlimited business power',
            price: 'Coming Soon',
            period: '',
            description: 'Full business tracking without limits.',
            icon: Crown,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            buttonStyle:
                'border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:border-slate-800',
            features: [
                { text: 'Unlimited active logs', included: true },
                { text: 'Unlimited Customers', included: true },
                { text: 'Priority 24/7 support', included: true },
                { text: 'Staff account access', included: true },
                { text: 'SMS and Push notifications', included: true },
                { text: 'Advanced analytics', included: true },
                { text: 'Everything in Premium Plan', included: true },
                { text: 'Custom integrations', included: true },
            ],
            popular: false,
            comingSoon: true,
        },
    ];

    const comparisonFeatures = [
        {
            category: 'Core Features',
            features: [
                {
                    name: 'Active Logs',
                    free: '20',
                    premium: '100',
                    pro: 'Unlimited',
                },
                {
                    name: 'Customer Records',
                    free: '20',
                    premium: 'Unlimited',
                    pro: 'Unlimited',
                },
                {
                    name: 'Mobile App Access',
                    free: true,
                    premium: true,
                    pro: true,
                },
                {
                    name: 'Finance Analytics',
                    free: true,
                    premium: true,
                    pro: true,
                },
                {
                    name: 'Promissory Notes',
                    free: true,
                    premium: true,
                    pro: true,
                },
            ],
        },
        {
            category: 'Communication',
            features: [
                {
                    name: 'Email Reminders',
                    free: false,
                    premium: true,
                    pro: true,
                },
                {
                    name: 'Push Notifications',
                    free: false,
                    premium: false,
                    pro: true,
                },
            ],
        },
        {
            category: 'Team & Support',
            features: [
                {
                    name: 'Staff Accounts',
                    free: false,
                    premium: false,
                    pro: true,
                },
                {
                    name: 'Priority Support',
                    free: false,
                    premium: true,
                    pro: true,
                },
                {
                    name: '24/7 Support',
                    free: false,
                    premium: false,
                    pro: true,
                },
            ],
        },
    ];

    const faqs = [
        {
            question: 'Can I upgrade or downgrade my plan?',
            answer: "Yes! You can change your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.",
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept major credit cards, debit cards, and GCash. All payments are processed securely through our payment partners.',
        },
        {
            question: 'Is there a free trial for paid plans?',
            answer: "Currently, we recommend starting with our Free plan to explore MyPautangLog. Once Premium and Pro plans launch, we'll offer trial periods for new users.",
        },
        {
            question: 'What happens to my data if I cancel?',
            answer: 'Your data remains safe and accessible even after cancellation. You can export all your records at any time. We keep your data for 90 days after cancellation in case you decide to return.',
        },
        {
            question: 'Do you offer refunds?',
            answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team for a full refund.",
        },
        {
            question: 'Can I add more users to my account?',
            answer: 'Staff accounts are available with the Pro plan. This allows you to add team members with controlled access to help manage your lending operations.',
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navigation */}
            <Navigation/>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 pt-20 pb-16">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100 opacity-20 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-100 opacity-20 blur-3xl" />

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-bold tracking-wide text-blue-700 uppercase">
                            Simple & Transparent Pricing
                        </span>
                    </div>

                    <h1 className="mb-6 text-5xl leading-tight font-black tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
                        Choose the perfect plan
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                            for your lending needs
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
                        Start with our free plan and upgrade as you grow. No
                        hidden fees, no complicated pricing tiers. Just honest,
                        straightforward plans designed for Filipino lenders.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-500">
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-emerald-600" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-emerald-600" />
                            <span>Cancel anytime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-emerald-600" />
                            <span>30-day money-back guarantee</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {plans.map((plan, index) => {
                            const Icon = plan.icon;
                            return (
                                <div
                                    key={index}
                                    className={`group relative flex flex-col overflow-hidden rounded-[2rem] border-2 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                                        plan.popular
                                            ? 'border-blue-600 lg:scale-105'
                                            : 'border-slate-200'
                                    }`}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div className="mb-6">
                                        {/* <div
                                            className={`mb-4 inline-flex rounded-2xl ${plan.iconBg} p-4`}
                                        >
                                            <Icon
                                                className={`h-8 w-8 ${plan.iconColor}`}
                                            />
                                        </div> */}

                                        <h3 className="mb-2 text-2xl font-black text-slate-900">
                                            {plan.name}
                                        </h3>

                                        <p className="mb-4 text-sm font-semibold text-slate-500">
                                            {plan.tagline}
                                        </p>

                                        <div className="mb-4 flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-slate-900">
                                                {plan.price}
                                            </span>
                                            {plan.period && (
                                                <span className="text-sm font-semibold text-slate-500">
                                                    {plan.period}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm leading-relaxed text-slate-600">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.get('/login')}
                                        disabled={plan.comingSoon}
                                        className={`cursor-pointer mb-8 w-full rounded-xl py-4 text-sm font-black transition-all ${plan.buttonStyle} ${
                                            plan.comingSoon
                                                ? 'cursor-not-allowed opacity-50'
                                                : ''
                                        }`}
                                    >
                                        {plan.comingSoon
                                            ? 'Coming Soon'
                                            : 'Get Started'}
                                    </button>

                                    <div className="space-y-3 border-t border-slate-100 pt-6">
                                        {plan.features.map((feature, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3"
                                            >
                                                {feature.included ? (
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50">
                                                        <Check className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-50">
                                                        <X className="h-4 w-4 text-slate-300" />
                                                    </div>
                                                )}
                                                <span
                                                    className={`text-sm font-medium ${
                                                        feature.included
                                                            ? 'text-slate-700'
                                                            : 'text-slate-400'
                                                    }`}
                                                >
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Detailed Comparison Table */}
            <section className="bg-slate-50 px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Compare all features
                        </h2>
                        <p className="text-lg text-slate-600">
                            See exactly what you get with each plan
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4 border-b border-slate-200 bg-slate-50 p-6">
                            <div className="col-span-1">
                                <span className="text-sm font-black tracking-wider text-slate-500 uppercase">
                                    Features
                                </span>
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-black text-slate-900">
                                    Free
                                </span>
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-black text-blue-600">
                                    Premium
                                </span>
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-black text-slate-900">
                                    Pro
                                </span>
                            </div>
                        </div>

                        {/* Table Body */}
                        {comparisonFeatures.map((category, categoryIndex) => (
                            <div key={categoryIndex}>
                                <div className="bg-slate-50 px-6 py-3">
                                    <span className="text-xs font-black tracking-widest text-slate-700 uppercase">
                                        {category.category}
                                    </span>
                                </div>
                                {category.features.map(
                                    (feature, featureIndex) => (
                                        <div
                                            key={featureIndex}
                                            className="grid grid-cols-4 gap-4 border-b border-slate-100 p-6 transition-colors hover:bg-slate-50"
                                        >
                                            <div className="col-span-1 flex items-center">
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {feature.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                {typeof feature.free ===
                                                'boolean' ? (
                                                    feature.free ? (
                                                        <Check className="h-5 w-5 text-emerald-600" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-slate-300" />
                                                    )
                                                ) : (
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {feature.free}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                {typeof feature.premium ===
                                                'boolean' ? (
                                                    feature.premium ? (
                                                        <Check className="h-5 w-5 text-emerald-600" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-slate-300" />
                                                    )
                                                ) : (
                                                    <span className="text-sm font-bold text-blue-600">
                                                        {feature.premium}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                {typeof feature.pro ===
                                                'boolean' ? (
                                                    feature.pro ? (
                                                        <Check className="h-5 w-5 text-emerald-600" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-slate-300" />
                                                    )
                                                ) : (
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {feature.pro}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Frequently asked questions
                        </h2>
                        <p className="text-lg text-slate-600">
                            Everything you need to know about our pricing
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-200 hover:bg-blue-50/30"
                            >
                                <summary className="flex cursor-pointer items-start justify-between gap-4 font-bold text-slate-900">
                                    <span className="text-base">
                                        {faq.question}
                                    </span>
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform group-open:rotate-180">
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </span>
                                </summary>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>

                    <div className="mt-12 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-50 to-emerald-50 p-8 text-center">
                        <p className="mb-4 text-lg font-bold text-slate-900">
                            Still have questions?
                        </p>
                        <p className="mb-6 text-sm text-slate-600">
                            Our support team is here to help you choose the
                            right plan
                        </p>
                        <button onClick={() => router.get('/contact')} className="rounded-xl bg-slate-900 cursor-pointer px-8 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800">
                            Contact Support
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-4xl leading-tight font-black text-white md:text-5xl">
                        Ready to streamline your
                        <br />
                        lending operations?
                    </h2>
                    <p className="mb-10 text-lg leading-relaxed text-slate-300">
                        Join hundreds of Filipino lenders who trust MyPautangLog
                        <br className="hidden md:block" />
                        to manage their lending business with confidence.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button onClick={() => router.get('/login')}  className="rounded-xl bg-white px-8 py-4 text-sm font-black cursor-pointer text-slate-900 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                            Get Started for Free
                        </button>
                    </div>
                </div>
            </section>

           <Footer/>
        </div>
    );
}
