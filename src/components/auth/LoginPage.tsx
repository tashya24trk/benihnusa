import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sprout,
} from 'lucide-react';
import { PortalMode } from '../../types/certificationAuthority';

export interface AuthenticatedSession {
  portal: PortalMode;
  email: string;
  fullName: string;
  rememberMe: boolean;
}

interface LoginPageProps {
  onLoginSuccess: (session: AuthenticatedSession) => void;
  onNavigateRegister: () => void;
  initialEmail?: string;
}

interface DemoCredential {
  portal: PortalMode;
  roleLabel: string;
  fullName: string;
  email: string;
}

const DEMO_ACCOUNTS: DemoCredential[] = [
  {
    portal: 'admin',
    roleLabel: 'Admin',
    fullName: 'Raka Pratama',
    email: 'raka.pratama@benihnusa.id',
  },
  {
    portal: 'regulator',
    roleLabel: 'Regulator',
    fullName: 'Ir. Sari Wijaya',
    email: 'sari.wijaya@bpsb-riau.go.id',
  },
  {
    portal: 'producer',
    roleLabel: 'Produsen',
    fullName: 'Tashya Amanda',
    email: 'tashya@nurserytashya.id',
  },
  {
    portal: 'distributor',
    roleLabel: 'Koperasi',
    fullName: 'H. Ahmad Zulkifli',
    email: 'zulkifli@koptanimakmur.id',
  },
  {
    portal: 'farmer',
    roleLabel: 'Petani',
    fullName: 'Bpk. Darwis',
    email: 'darwis.petani@gapoktan-kampar.id',
  },
];

type AuthViewMode = 'login' | 'forgot-password';

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  initialEmail,
}) => {
  const [viewMode, setViewMode] = useState<AuthViewMode>('login');

  // Login states
  const [email, setEmail] = useState(initialEmail ?? 'raka.pratama@benihnusa.id');
  const [password, setPassword] = useState(
    initialEmail ? '' : 'benihnusa2026'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  // Forgot password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleQuickFill = (acc: DemoCredential) => {
    setViewMode('login');
    setEmail(acc.email);
    setPassword('benihnusa2026');
    setEmailError('');
    setPasswordError('');
    setAuthError('');
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    const trimmedEmail = email.trim().toLowerCase();
    let hasFieldError = false;

    if (!trimmedEmail) {
      setEmailError('Alamat email wajib diisi.');
      hasFieldError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Format alamat email tidak valid.');
      hasFieldError = true;
    }

    if (!password) {
      setPasswordError('Kata sandi wajib diisi.');
      hasFieldError = true;
    } else if (password.length < 6) {
      setPasswordError('Kata sandi minimal 6 karakter.');
      hasFieldError = true;
    }

    if (hasFieldError) return;

    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);

      const matched = DEMO_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === trimmedEmail
      );

      if (!matched || password !== 'benihnusa2026') {
        setAuthError(
          'Email atau kata sandi tidak valid. Periksa kembali kredensial Anda atau gunakan salah satu akun demo di bawah.'
        );
        return;
      }

      onLoginSuccess({
        portal: matched.portal,
        email: matched.email,
        fullName: matched.fullName,
        rememberMe,
      });
    }, 650);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex flex-col lg:grid lg:grid-cols-12">
      {/* Left Section: Minimalist Agricultural Branding */}
      <section className="lg:col-span-6 bg-[#F0FAF3] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] px-6 py-8 sm:px-10 lg:px-14 lg:py-12 flex flex-col justify-between">
        {/* Top Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00843D] flex items-center justify-center text-white shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[17px] font-bold tracking-tight text-[#111827] leading-tight">
              BenihNusa Track
            </div>
            <div className="text-[12px] text-[#64748B]">
              Sistem Informasi Ketertelusuran Benih
            </div>
          </div>
        </div>

        {/* Center Headline & Subtle Agricultural SVG Visual */}
        <div className="my-8 lg:my-auto max-w-[480px] space-y-6">
          <div className="space-y-3">
            <h1 className="text-[28px] sm:text-[34px] leading-[1.18] font-bold tracking-[-0.02em] text-[#111827]">
              Selamat Datang Kembali
            </h1>
            <p className="text-[15px] leading-relaxed text-[#475569]">
              Masuk ke akun Anda untuk mengelola dan memantau perjalanan benih secara transparan dan terpercaya.
            </p>
          </div>

          {/* Minimal geometric seed-to-field traceability line art */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 hidden sm:block">
            <svg
              viewBox="0 0 420 132"
              className="w-full h-auto"
              role="img"
              aria-label="Ilustrasi alur ketertelusuran benih bersertifikat dari produsen hingga petani"
            >
              {/* Connecting Track Line */}
              <line
                x1="48"
                y1="56"
                x2="372"
                y2="56"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1="48"
                y1="56"
                x2="264"
                y2="56"
                stroke="#00843D"
                strokeWidth="2.5"
              />

              {/* Node 1: Produsen */}
              <circle cx="48" cy="56" r="18" fill="#F0FAF3" stroke="#00843D" strokeWidth="1.75" />
              <path
                d="M48 63 V51 M48 55 C48 49 41 48 41 53 C41 56 45 57 48 56 M48 53 C48 47 55 46 55 51 C55 54 51 55 48 54"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <text
                x="48"
                y="94"
                textAnchor="middle"
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Produsen
              </text>
              <text
                x="48"
                y="109"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Registrasi Batch
              </text>

              {/* Node 2: Regulator BPSB */}
              <circle cx="156" cy="56" r="18" fill="#F0FAF3" stroke="#00843D" strokeWidth="1.75" />
              <path
                d="M150 56 L154.5 60.5 L163 51.5"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="156"
                y="94"
                textAnchor="middle"
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Regulator BPSB
              </text>
              <text
                x="156"
                y="109"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Sertifikasi Mutu
              </text>

              {/* Node 3: Koperasi / Distributor */}
              <circle cx="264" cy="56" r="18" fill="#F0FAF3" stroke="#00843D" strokeWidth="1.75" />
              <rect
                x="257"
                y="49"
                width="14"
                height="14"
                rx="2.5"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.6"
              />
              <path
                d="M257 54 H271"
                stroke="#00843D"
                strokeWidth="1.4"
              />
              <text
                x="264"
                y="94"
                textAnchor="middle"
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Koperasi
              </text>
              <text
                x="264"
                y="109"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Distribusi Resmi
              </text>

              {/* Node 4: Petani */}
              <circle cx="372" cy="56" r="18" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.75" />
              <rect
                x="365"
                y="49"
                width="6"
                height="6"
                rx="1"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.4"
              />
              <rect
                x="373"
                y="49"
                width="6"
                height="6"
                rx="1"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.4"
              />
              <rect
                x="365"
                y="57"
                width="6"
                height="6"
                rx="1"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.4"
              />
              <path d="M374 58 H379 V63" fill="none" stroke="#00843D" strokeWidth="1.4" />
              <text
                x="372"
                y="94"
                textAnchor="middle"
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Petani
              </text>
              <text
                x="372"
                y="109"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Verifikasi QR &amp; Tanam
              </text>
            </svg>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="hidden lg:flex items-center justify-between text-[12px] text-[#64748B] pt-4 border-t border-[#D1FAE5]">
          <span>&copy; 2026 BenihNusa Track</span>
          <span>Ketertelusuran Benih Pertanian Terpadu</span>
        </div>
      </section>

      {/* Right Section: Compact Login / Recovery / Registration Form */}
      <main className="lg:col-span-6 flex flex-col items-center justify-center p-5 sm:p-8 lg:p-12 flex-1">
        <div className="w-full max-w-[430px] space-y-5">
          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            {viewMode === 'login' && (
              <form onSubmit={handleSubmitLogin} noValidate className="space-y-5">
                <div>
                  <h2 className="text-[22px] leading-[30px] font-bold tracking-[-0.015em] text-[#111827]">
                    Masuk ke Akun
                  </h2>
                  <p className="mt-1 text-[14px] text-[#64748B]">
                    Silakan masukkan email dan kata sandi Anda.
                  </p>
                </div>

                {authError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-[#FEE2E2]/80 border border-[#FECACA] text-[#B91C1C] text-[13px] flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                          if (authError) setAuthError('');
                        }}
                        placeholder="nama@organisasi.id"
                        aria-invalid={Boolean(emailError)}
                        className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-colors ${
                          emailError
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15'
                            : 'border-[#E2E8F0] focus:border-[#00843D] focus:ring-[#00843D]/15'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError('');
                          if (authError) setAuthError('');
                        }}
                        placeholder="Masukkan kata sandi"
                        aria-invalid={Boolean(passwordError)}
                        className={`w-full h-11 pl-10 pr-11 rounded-xl border text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-colors ${
                          passwordError
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15'
                            : 'border-[#E2E8F0] focus:border-[#00843D] focus:ring-[#00843D]/15'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? 'Sembunyikan kata sandi'
                            : 'Tampilkan kata sandi'
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <label className="inline-flex items-center gap-2 text-[#334155] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#00843D] focus:ring-[#00843D]"
                    />
                    <span>Ingat saya</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setResetSent(false);
                      setViewMode('forgot-password');
                    }}
                    className="font-semibold text-[#00843D] hover:text-[#006B32] cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#00843D] hover:bg-[#006B32] active:scale-[0.99] disabled:opacity-70 text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <span>Masuk</span>
                  )}
                </button>

                {/* Bottom Registration Prompt */}
                <div className="pt-4 border-t border-[#E2E8F0] text-center text-[13px] text-[#64748B]">
                  Belum memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={onNavigateRegister}
                    className="font-semibold text-[#00843D] hover:text-[#006B32] cursor-pointer"
                  >
                    Daftar sekarang
                  </button>
                </div>
              </form>
            )}

            {viewMode === 'forgot-password' && (
              <div className="space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={() => setViewMode('login')}
                    className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Halaman Masuk</span>
                  </button>
                  <h2 className="text-[20px] font-bold text-[#111827]">
                    Atur Ulang Kata Sandi
                  </h2>
                  <p className="mt-1 text-[13px] text-[#64748B]">
                    Masukkan alamat email akun Anda untuk menerima instruksi pemulihan kata sandi.
                  </p>
                </div>

                {resetSent ? (
                  <div className="p-4 rounded-xl bg-[#DCFCE7]/70 border border-[#BBF7D0] text-[13px] text-[#166534] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                    <span>
                      Tautan pemulihan telah dikirim ke <strong>{resetEmail}</strong> apabila alamat tersebut terdaftar di sistem.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="nama@organisasi.id"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[14px] font-semibold cursor-pointer"
                    >
                      Kirim Instruksi Pemulihan
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Minimal Quick Demo Account Switcher */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[12px]">
              <span className="font-semibold text-[#334155]">
                Akun Demo Cepat (Sandi:{' '}
                <code className="font-mono text-[#00843D]">benihnusa2026</code>)
              </span>
              <span className="text-[11px] text-[#64748B]">Data Demo</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const isSelected =
                  email.trim().toLowerCase() === acc.email.toLowerCase() &&
                  viewMode === 'login';
                return (
                  <button
                    key={acc.portal}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className={`h-8 px-2.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0FAF3] border-[#BBF7D0] text-[#00843D]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:text-[#111827]'
                    }`}
                  >
                    {acc.roleLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
