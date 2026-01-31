import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSModal, setShowIOSModal] = useState(false);

    useEffect(() => {
        // Check if device is iOS
        const iOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(iOS);

        // Check if app is already installed (standalone mode)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone ||
            document.referrer.includes('android-app://');

        if (isStandalone) {
            setShowInstallButton(false);
            return;
        }

        // For Android/Desktop - Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt,
        );

        // For iOS - Show install button if not installed
        if (iOS && !isStandalone) {
            setShowInstallButton(true);
        }

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt,
            );
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // Show iOS installation instructions
            setShowIOSModal(true);
        } else if (deferredPrompt) {
            // For Android/Desktop
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
            
                setShowInstallButton(false);
            }

            setDeferredPrompt(null);
        }
    };

    if (!showInstallButton) return null;

    return (
        <>
            {/* Install Button */}
            <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-900 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
            >
                <Download className="h-5 w-5" />
                Install App
            </button>

            {/* iOS Installation Modal */}
            {showIOSModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="relative max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                        <button
                            onClick={() => setShowIOSModal(false)}
                            className="absolute top-4 right-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6 text-center">
                            <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-4">
                                <Download className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="mb-2 text-2xl font-black text-slate-900">
                                Install MyPautangLog
                            </h3>
                            <p className="text-sm text-slate-600">
                                Install this app on your iPhone for quick access
                            </p>
                        </div>

                        <div className="space-y-4 rounded-2xl bg-slate-50 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                                    1
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">
                                        Tap the Share button
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Look for{' '}
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs">
                                            📤
                                        </span>{' '}
                                        at the bottom of Safari
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                                    2
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">
                                        Select "Add to Home Screen"
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Scroll down and tap "Add to Home Screen"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                                    3
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">
                                        Tap "Add"
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Confirm by tapping "Add" in the top
                                        right
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIOSModal(false)}
                            className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
