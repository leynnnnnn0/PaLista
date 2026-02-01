import { login } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LOGO from '../../images/mainLogo.png';

export default function NavigationEnhanced() {
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/about-us', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
    ];

    const isActive = (href) => {
        // Exact match for home page
        if (href === '/' && url === '/') return true;
        // For other pages, check if URL starts with the href
        if (href !== '/' && url.startsWith(href)) return true;
        return false;
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <img src={LOGO} alt="Logo" className="h-10" />
                        <span className="font-bold text-[#1e293b]">
                            MyPautang
                            <span className="text-blue-600">Log</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        <div className="flex space-x-6 text-sm font-semibold text-gray-600">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative transition hover:text-blue-700 ${
                                        isActive(link.href)
                                            ? 'font-black text-blue-700'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {link.label}
                                    {/* Underline indicator for active page */}
                                    {isActive(link.href) && (
                                        <span className="absolute right-0 -bottom-2 left-0 h-0.5 rounded-full bg-blue-700" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <Link
                            href={login.url()}
                            className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-800"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white md:hidden">
                        <div className="mx-auto max-w-7xl space-y-1 px-6 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={handleLinkClick}
                                    className={`block rounded-lg px-4 py-3 text-base font-semibold transition ${
                                        isActive(link.href)
                                            ? 'bg-blue-50 font-black text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="pt-4">
                                <Link
                                    href={login.url()}
                                    onClick={handleLinkClick}
                                    className="block w-full rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-bold text-white shadow-md transition hover:bg-blue-800"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
