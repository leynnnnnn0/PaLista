import { useForm } from '@inertiajs/react';
import { Facebook, Mail, MessageSquare, Send, Video } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '../pages/footer';
import Navigation from '../pages/navigation';

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    "Thank you for reaching out! We'll get back to you soon.",
                );
                reset();
            },
            onError: (errors) => {
                if (errors.error) {
                    toast.error(errors.error);
                } else {
                    toast.error('Please check the form for errors.');
                }
            },
        });
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Us',
            description: "Send us an email and we'll respond within 24 hours",
            value: 'support@mypautanglog.online',
            link: 'mailto:support@mypautanglog.online',
            gradient: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            icon: Facebook,
            title: 'Facebook',
            description: 'Follow us for updates and community discussions',
            value: '@MyPautangLog',
            link: 'https://facebook.com/mypautanglog',
            gradient: 'from-blue-600 to-blue-700',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
        },
        {
            icon: Video,
            title: 'TikTok',
            description: 'Watch tutorials and tips on managing your loans',
            value: '@mypautanglog',
            link: 'https://tiktok.com/@mypautanglog',
            gradient: 'from-slate-700 to-slate-900',
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-800',
        },
    ];

    const faqs = [
        {
            question: 'How quickly do you respond?',
            answer: 'We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please mark your message as urgent.',
        },
        {
            question: 'Can I schedule a demo?',
            answer: "Absolutely! Send us an email with your preferred time and we'll arrange a personalized walkthrough of MyPautangLog.",
        },
        {
            question: 'Do you offer phone support?',
            answer: 'Currently, we provide support via email and social media. Phone support will be available with our Premium and Pro plans.',
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 pt-20 pb-16">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100 opacity-30 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-100 opacity-30 blur-3xl" />

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-bold tracking-wide text-blue-700 uppercase">
                            We're Here to Help
                        </span>
                    </div>

                    <h1 className="mb-6 text-5xl leading-tight font-black tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
                        Let's Start a
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                            Conversation
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
                        Have questions about MyPautangLog? Need help getting
                        started? Or just want to share feedback? We'd love to
                        hear from you!
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>Usually responds in 24 hours</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span>Available Mon-Sat</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                            Choose Your Preferred Channel
                        </h2>
                        <p className="text-lg text-slate-600">
                            Reach out through the platform that works best for
                            you
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {contactMethods.map((method, index) => {
                            const Icon = method.icon;
                            return (
                                <a
                                    key={index}
                                    href={method.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl"
                                >
                                    <div
                                        className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${method.gradient} p-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>

                                    <h3 className="mb-3 text-2xl font-black text-slate-900">
                                        {method.title}
                                    </h3>

                                    <p className="mb-4 text-sm leading-relaxed text-slate-600">
                                        {method.description}
                                    </p>

                                    <div
                                        className={`inline-flex items-center gap-2 rounded-xl ${method.bgColor} px-4 py-2`}
                                    >
                                        <span
                                            className={`text-sm font-bold ${method.textColor}`}
                                        >
                                            {method.value}
                                        </span>
                                    </div>

                                    {/* Hover effect */}
                                    <div
                                        className={`absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-br ${method.gradient} opacity-0 transition-all duration-300 group-hover:scale-150 group-hover:opacity-10`}
                                    />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="bg-slate-50 px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-xl md:p-12">
                        <div className="mb-8 text-center">
                            <div className="mb-4 inline-flex rounded-2xl bg-blue-600 p-4">
                                <Send className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                                Send Us a Message
                            </h2>
                            <p className="text-slate-600">
                                Fill out the form below and we'll get back to
                                you as soon as possible
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-bold text-slate-900"
                                    >
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        maxLength={100}
                                        required
                                        className={`w-full rounded-xl border-2 ${
                                            errors.name
                                                ? 'border-red-500'
                                                : 'border-slate-200'
                                        } bg-white px-4 py-3 text-slate-900 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none`}
                                        placeholder="Juan Dela Cruz"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-bold text-slate-900"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        maxLength={255}
                                        required
                                        className={`w-full rounded-xl border-2 ${
                                            errors.email
                                                ? 'border-red-500'
                                                : 'border-slate-200'
                                        } bg-white px-4 py-3 text-slate-900 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none`}
                                        placeholder="juan@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-bold text-slate-900"
                                >
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData('subject', e.target.value)
                                    }
                                    maxLength={200}
                                    required
                                    className={`w-full rounded-xl border-2 ${
                                        errors.subject
                                            ? 'border-red-500'
                                            : 'border-slate-200'
                                    } bg-white px-4 py-3 text-slate-900 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none`}
                                    placeholder="How can we help you?"
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-bold text-slate-900"
                                >
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    maxLength={2000}
                                    required
                                    rows={6}
                                    className={`w-full rounded-xl border-2 ${
                                        errors.message
                                            ? 'border-red-500'
                                            : 'border-slate-200'
                                    } bg-white px-4 py-3 text-slate-900 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none`}
                                    placeholder="Tell us more about your inquiry..."
                                />
                                <div className="mt-1 flex items-center justify-between">
                                    {errors.message ? (
                                        <p className="text-sm text-red-600">
                                            {errors.message}
                                        </p>
                                    ) : (
                                        <span className="text-xs text-slate-500">
                                            {data.message.length}/2000
                                            characters
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Sending...' : 'Send Message'}
                            </button>

                            <p className="text-center text-xs text-slate-500">
                                We typically respond within 24 hours during
                                business days
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* Quick FAQ */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                            Quick Answers
                        </h2>
                        <p className="text-slate-600">
                            Common questions about getting in touch
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
                </div>
            </section>

            {/* Social Proof Section */}
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
                        Follow us on social media for tips, updates, and
                        community support
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="https://facebook.com/mypautanglog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl border-2 border-blue-400 bg-blue-500 px-8 py-4 text-sm font-black text-white transition-all hover:bg-blue-600"
                        >
                            <Facebook className="h-5 w-5" />
                            Follow on Facebook
                        </a>
                        <a
                            href="https://tiktok.com/@mypautanglog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl border-2 border-white bg-white px-8 py-4 text-sm font-black text-slate-900 transition-all hover:bg-slate-100"
                        >
                            <Video className="h-5 w-5" />
                            Watch on TikTok
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
