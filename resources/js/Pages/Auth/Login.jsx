import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex font-sans">
                {/* Sisi Kiri — Branding (tersembunyi di mobile) */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-emerald-950">
                    {/* Background Image */}
                    <img 
                        src="/foto-sugity.jpeg" 
                        alt="Background" 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                    />
                    {/* Color Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-emerald-700/80 to-amber-500/80" />
                    
                    {/* Pola dekoratif */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-72 h-72 border border-white/30 rounded-full" />
                        <div className="absolute top-40 left-40 w-96 h-96 border border-white/20 rounded-full" />
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 border border-white/25 rounded-full" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
                        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
                            <span className="text-white font-bold text-2xl">QC</span>
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 shadow-sm">
                            AI Quality<br />Control System
                        </h1>
                        <p className="text-emerald-50 text-lg xl:text-xl leading-relaxed max-w-md">
                            Sistem inspeksi kualitas otomatis berbasis kecerdasan buatan untuk lini produksi Anda.
                        </p>

                        {/* Stats card */}
                        <div className="mt-12 flex gap-8">
                            <div>
                                <p className="text-3xl font-bold text-white">99.8%</p>
                                <p className="text-emerald-100 text-sm mt-1">Akurasi AI</p>
                            </div>
                            <div className="w-px bg-emerald-400/30" />
                            <div>
                                <p className="text-3xl font-bold text-white">&lt;3s</p>
                                <p className="text-emerald-100 text-sm mt-1">Per Inspeksi</p>
                            </div>
                            <div className="w-px bg-emerald-400/30" />
                            <div>
                                <p className="text-3xl font-bold text-white">24/7</p>
                                <p className="text-emerald-100 text-sm mt-1">Monitoring</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sisi Kanan — Form Login */}
                <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 bg-white">
                    <div className="w-full max-w-[400px]">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200">
                                QC
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">AI QC System</h1>
                                <p className="text-xs text-gray-400">Quality Control</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Selamat Datang 👋</h2>
                            <p className="text-gray-500 mt-2 text-[15px]">Masuk ke akun Anda untuk melanjutkan</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    id="email-input"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@perusahaan.com"
                                    className={`
                                        w-full px-4 py-3 rounded-xl border-2 text-[15px] outline-none
                                        transition-all duration-200
                                        placeholder:text-gray-300
                                        focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
                                        ${errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white hover:border-gray-300'}
                                    `}
                                    autoComplete="email"
                                    autoFocus
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-[13px] mt-1.5 flex items-center gap-1">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    id="password-input"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-[15px] outline-none
                                        transition-all duration-200 bg-white
                                        placeholder:text-gray-300
                                        hover:border-gray-300
                                        focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    autoComplete="current-password"
                                />
                            </div>

                            {/* Remember */}
                            <div className="flex items-center">
                                <input
                                    id="remember-checkbox"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600
                                        focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                                />
                                <label htmlFor="remember-checkbox" className="ml-2 text-sm text-gray-500 cursor-pointer select-none">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                id="login-button"
                                type="submit"
                                disabled={processing}
                                className={`
                                    w-full py-3.5 rounded-xl border-0 text-white text-[15px] font-semibold
                                    transition-all duration-200 cursor-pointer
                                    shadow-lg shadow-emerald-500/25
                                    ${processing
                                        ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-700 hover:to-amber-600 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                        Memproses...
                                    </span>
                                ) : 'Masuk'}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-gray-300 text-xs mt-8">
                            &copy; {new Date().getFullYear()} AI QC System &mdash; PT. Perusahaan Anda
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
