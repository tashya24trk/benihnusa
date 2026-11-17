import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Info,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  User,
  X,
} from 'lucide-react';
import { INITIAL_ACCOUNT_REQUESTS, INITIAL_SYSTEM_USERS } from '../../data/adminGovernanceData';
import { AccountApprovalRequest, SystemUserRecord } from '../../types/admin';

interface RegisterPageProps {
  onNavigateLogin: (prefillEmail?: string) => void;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
}

interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  barColor: string;
  textColor: string;
  hasMinLength: boolean;
  hasUpperAndLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

const KNOWN_SYSTEM_EMAILS = [
  'raka.pratama@benihnusa.id',
  'sari.wijaya@bpsb-riau.go.id',
  'tashya@nurserytashya.id',
  'zulkifli@koptanimakmur.id',
  'darwis.petani@gapoktan-kampar.id',
];

function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const hasMinLength = password.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (!password) {
    return {
      score: 0,
      label: '',
      barColor: 'bg-[#E2E8F0]',
      textColor: 'text-[#64748B]',
      hasMinLength,
      hasUpperAndLower,
      hasNumber,
      hasSymbol,
    };
  }

  let points = 0;
  if (hasMinLength) points += 1;
  if (hasUpperAndLower) points += 1;
  if (hasNumber) points += 1;
  if (hasSymbol || password.length >= 12) points += 1;

  const score = Math.max(1, Math.min(4, points)) as 1 | 2 | 3 | 4;

  if (score === 1) {
    return {
      score,
      label: 'Lemah',
      barColor: 'bg-[#EF4444]',
      textColor: 'text-[#B91C1C]',
      hasMinLength,
      hasUpperAndLower,
      hasNumber,
      hasSymbol,
    };
  }
  if (score === 2) {
    return {
      score,
      label: 'Cukup',
      barColor: 'bg-[#F59E0B]',
      textColor: 'text-[#B45309]',
      hasMinLength,
      hasUpperAndLower,
      hasNumber,
      hasSymbol,
    };
  }
  if (score === 3) {
    return {
      score,
      label: 'Kuat',
      barColor: 'bg-[#10B981]',
      textColor: 'text-[#047857]',
      hasMinLength,
      hasUpperAndLower,
      hasNumber,
      hasSymbol,
    };
  }
  return {
    score,
    label: 'Sangat Kuat',
    barColor: 'bg-[#00843D]',
    textColor: 'text-[#00843D]',
    hasMinLength,
    hasUpperAndLower,
    hasNumber,
    hasSymbol,
  };
}

function isEmailAlreadyRegistered(normalizedEmail: string): boolean {
  if (KNOWN_SYSTEM_EMAILS.includes(normalizedEmail)) return true;

  const inInitialUsers = INITIAL_SYSTEM_USERS.some(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (inInitialUsers) return true;

  const inInitialRequests = INITIAL_ACCOUNT_REQUESTS.some(
    (r) => r.email.toLowerCase() === normalizedEmail
  );
  if (inInitialRequests) return true;

  try {
    const rawUsers = localStorage.getItem('benihnusa_admin_users_v1');
    if (rawUsers) {
      const parsedUsers = JSON.parse(rawUsers) as SystemUserRecord[];
      if (parsedUsers.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return true;
      }
    }

    const rawAccounts = localStorage.getItem('benihnusa_admin_accounts_v1');
    if (rawAccounts) {
      const parsedAccounts = JSON.parse(rawAccounts) as AccountApprovalRequest[];
      if (parsedAccounts.some((r) => r.email.toLowerCase() === normalizedEmail)) {
        return true;
      }
    }
  } catch {
    // Ignore storage read errors
  }

  return false;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [registeredRequestNo, setRegisteredRequestNo] = useState('');

  const [policyModal, setPolicyModal] = useState<'terms' | 'privacy' | null>(
    null
  );

  const passwordStrength = useMemo(
    () => evaluatePasswordStrength(password),
    [password]
  );

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const trimmedName = fullName.trim();
    const cleanedPhone = phone.replace(/[\s-]/g, '');
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      nextErrors.fullName = 'Nama lengkap wajib diisi.';
    } else if (trimmedName.length < 3) {
      nextErrors.fullName = 'Nama lengkap minimal 3 karakter.';
    }

    if (!cleanedPhone) {
      nextErrors.phone = 'Nomor telepon wajib diisi.';
    } else if (!/^(\+62|62|0)8\d{7,12}$/.test(cleanedPhone)) {
      nextErrors.phone =
        'Gunakan nomor seluler Indonesia yang valid (contoh: 081234567890 atau +6281234567890).';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Alamat email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Format alamat email tidak valid.';
    }

    if (!password) {
      nextErrors.password = 'Kata sandi wajib diisi.';
    } else if (
      !passwordStrength.hasMinLength ||
      !passwordStrength.hasUpperAndLower ||
      !passwordStrength.hasNumber
    ) {
      nextErrors.password =
        'Kata sandi minimal 8 karakter dan memuat huruf besar, huruf kecil, serta angka.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword =
        'Konfirmasi kata sandi tidak cocok dengan kata sandi di atas.';
    }

    if (!termsAccepted) {
      nextErrors.termsAccepted =
        'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.';
    }

    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    window.setTimeout(() => {
      setIsLoading(false);

      if (isEmailAlreadyRegistered(normalizedEmail)) {
        setSubmitError(
          'Alamat email ini sudah terdaftar di BenihNusa Track. Gunakan email lain atau masuk ke akun Anda.'
        );
        return;
      }

      const timestampId = Date.now();
      let requestNumber = `AKN-2026-042`;

      try {
        const rawAccounts = localStorage.getItem('benihnusa_admin_accounts_v1');
        const existingAccounts: AccountApprovalRequest[] = rawAccounts
          ? JSON.parse(rawAccounts)
          : INITIAL_ACCOUNT_REQUESTS;

        requestNumber = `AKN-2026-0${42 + existingAccounts.length}`;

        const newApprovalReq: AccountApprovalRequest = {
          id: `acc-req-${timestampId}`,
          requestNumber,
          fullName: trimmedName,
          email: normalizedEmail,
          phone: trimmedPhone,
          nikMasked: 'Belum diverifikasi',
          province: 'Menunggu verifikasi profil',
          submittedAt: '2026-11-16',
          status: 'Menunggu Persetujuan',
          notes:
            'Pendaftaran akun individu baru. Menunggu verifikasi email dan tinjauan Administrator Sistem.',
        };

        localStorage.setItem(
          'benihnusa_admin_accounts_v1',
          JSON.stringify([newApprovalReq, ...existingAccounts])
        );

        const rawUsers = localStorage.getItem('benihnusa_admin_users_v1');
        const existingUsers: SystemUserRecord[] = rawUsers
          ? JSON.parse(rawUsers)
          : INITIAL_SYSTEM_USERS;

        const newSystemUser: SystemUserRecord = {
          id: `usr-${timestampId}`,
          fullName: trimmedName,
          email: normalizedEmail,
          phone: trimmedPhone,
          systemRole: 'Pengguna Standar',
          accountStatus: 'Menunggu Persetujuan',
          registeredAt: '2026-11-16',
          lastLoginAt: 'Belum pernah masuk',
          memberships: [],
        };

        localStorage.setItem(
          'benihnusa_admin_users_v1',
          JSON.stringify([newSystemUser, ...existingUsers])
        );
      } catch {
        // Ignore localStorage quota issues
      }

      setRegisteredRequestNo(requestNumber);
      setEmailVerified(false);
      setIsSuccess(true);
    }, 650);
  };

  const handleSimulateEmailVerification = () => {
    setEmailVerified(true);
    try {
      const rawAccounts = localStorage.getItem('benihnusa_admin_accounts_v1');
      if (rawAccounts) {
        const parsed = JSON.parse(rawAccounts) as AccountApprovalRequest[];
        const normalizedEmail = email.trim().toLowerCase();
        const updated = parsed.map((item) =>
          item.email.toLowerCase() === normalizedEmail
            ? {
                ...item,
                notes:
                  'Email telah diverifikasi oleh pendaftar. Siap ditinjau untuk persetujuan akun oleh Administrator.',
              }
            : item
        );
        localStorage.setItem(
          'benihnusa_admin_accounts_v1',
          JSON.stringify(updated)
        );
      }
    } catch {
      // Ignore storage error
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex flex-col lg:grid lg:grid-cols-12">
      {/* Left Section: Branding & Individual Account Onboarding Visual */}
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

        {/* Center Headline & Subtle Agricultural Onboarding Visual */}
        <div className="my-8 lg:my-auto max-w-[480px] space-y-6">
          <div className="space-y-3">
            <h1 className="text-[28px] sm:text-[34px] leading-[1.18] font-bold tracking-[-0.02em] text-[#111827]">
              Bergabung dengan BenihNusa Track
            </h1>
            <p className="text-[15px] leading-relaxed text-[#475569]">
              Mulai perjalanan digital untuk membangun ekosistem benih yang
              transparan, terintegrasi, dan dapat ditelusuri.
            </p>
          </div>

          {/* Minimal Geometric Account & Seed Traceability Visual */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 hidden sm:block">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-4">
              Tahap Aktivasi Akun Individu
            </div>
            <svg
              viewBox="0 0 420 132"
              className="w-full h-auto"
              role="img"
              aria-label="Ilustrasi alur aktivasi akun individu: registrasi, verifikasi email, dan persetujuan administrator"
            >
              {/* Connecting Track Lines */}
              <line
                x1="68"
                y1="52"
                x2="352"
                y2="52"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1="68"
                y1="52"
                x2="210"
                y2="52"
                stroke="#00843D"
                strokeWidth="2.5"
              />

              {/* Step 1: Akun Individu */}
              <circle
                cx="68"
                cy="52"
                r="20"
                fill="#F0FAF3"
                stroke="#00843D"
                strokeWidth="1.75"
              />
              <path
                d="M68 60 V48 M68 52 C68 46 61 45 61 50 C61 53 65 54 68 53 M68 50 C68 44 75 43 75 48 C75 51 71 52 68 51"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <text
                x="68"
                y="92"
                textAnchor="middle"
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                1. Akun Individu
              </text>
              <text
                x="68"
                y="108"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Registrasi Data Diri
              </text>

              {/* Step 2: Verifikasi Email */}
              <circle
                cx="210"
                cy="52"
                r="20"
                fill="#F0FAF3"
                stroke="#00843D"
                strokeWidth="1.75"
              />
              <rect
                x="200"
                y="45"
                width="20"
                height="14"
                rx="2.5"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.6"
              />
              <path
                d="M201 46 L210 53 L219 46"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="210"
                y="92"
                textAnchor="middle"
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                2. Verifikasi Email
              </text>
              <text
                x="210"
                y="108"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Konfirmasi Alamat Aktif
              </text>

              {/* Step 3: Persetujuan Admin */}
              <circle
                cx="352"
                cy="52"
                r="20"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.75"
              />
              <path
                d="M352 43 L359 46 V52 C359 56.5 356 60 352 61.5 C348 60 345 56.5 345 52 V46 L352 43 Z"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M349 52 L351.2 54.2 L355.5 49.8"
                fill="none"
                stroke="#00843D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="352"
                y="92"
                textAnchor="middle"
                fill="#111827"
                fontSize="11"
                fontWeight="600"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                3. Tinjauan Admin
              </text>
              <text
                x="352"
                y="108"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                Persetujuan &amp; Akses Peran
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

      {/* Right Section: Registration Form */}
      <main className="lg:col-span-6 flex flex-col items-center justify-center p-5 sm:p-8 lg:p-10 flex-1">
        <div className="w-full max-w-[460px]">
          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            {isSuccess ? (
              /* Post-Submit Success State */
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#00843D] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h2 className="text-[22px] leading-[30px] font-bold tracking-[-0.015em] text-[#111827]">
                    Pendaftaran Akun Berhasil
                  </h2>
                  <p className="mt-1.5 text-[14px] text-[#64748B] leading-relaxed">
                    Akun individu Anda telah dibuat. Selesaikan verifikasi email
                    agar permohonan dapat ditinjau oleh Administrator.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#64748B]">Nomor Permohonan</span>
                    <span className="font-mono font-semibold text-[#111827]">
                      {registeredRequestNo}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#64748B]">Nama Lengkap</span>
                    <span className="font-semibold text-[#111827] text-right">
                      {fullName.trim()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#64748B]">Email</span>
                    <span className="font-medium text-[#111827] text-right break-all">
                      {email.trim().toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[#64748B]">Status Email</span>
                    {emailVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#166534] text-[12px] font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] text-[12px] font-semibold">
                        Menunggu Verifikasi Email
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#64748B]">Persetujuan Akun</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[#334155] text-[12px] font-semibold">
                      Menunggu Administrator
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#64748B]">Peran Organisasi</span>
                    <span className="text-[12px] font-medium text-[#64748B]">
                      Belum memiliki peran
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F0FAF3] border border-[#BBF7D0] text-[12.5px] text-[#166534] flex items-start gap-2.5 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                  <span>
                    Setelah email terverifikasi dan akun disetujui Administrator,
                    Anda dapat masuk dan mengajukan keanggotaan organisasi
                    (Produsen, Koperasi, Regulator, atau Petani) melalui sistem.
                  </span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={handleSimulateEmailVerification}
                      className="w-full h-11 rounded-xl border border-[#00843D] bg-[#F0FAF3] hover:bg-[#DCFCE7] text-[#00843D] text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Konfirmasi Verifikasi Email Sekarang</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigateLogin(email.trim().toLowerCase())}
                    className="w-full h-11 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[14px] font-semibold transition-colors cursor-pointer"
                  >
                    Ke Halaman Masuk
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form State */
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h2 className="text-[22px] leading-[30px] font-bold tracking-[-0.015em] text-[#111827]">
                    Buat Akun Baru
                  </h2>
                  <p className="mt-1 text-[14px] text-[#64748B]">
                    Lengkapi informasi berikut untuk membuat akun BenihNusa
                    Track.
                  </p>
                </div>

                {/* Clear Individual Account Notice */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[12.5px] text-[#475569] flex items-start gap-2.5 leading-relaxed">
                  <Info className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                  <span>
                    Pendaftaran ini membuat <strong>akun individu</strong>.
                    Pengajuan peran atau keanggotaan organisasi dilakukan
                    setelah verifikasi email dan persetujuan Administrator.
                  </span>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-[#FEE2E2]/80 border border-[#FECACA] text-[#B91C1C] text-[13px] flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* 1. Nama Lengkap */}
                  <div>
                    <label
                      htmlFor="reg-fullname"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Nama Lengkap <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-fullname"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          clearFieldError('fullName');
                        }}
                        placeholder="Masukkan nama lengkap sesuai identitas"
                        aria-invalid={Boolean(errors.fullName)}
                        className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-colors ${
                          errors.fullName
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15'
                            : 'border-[#E2E8F0] focus:border-[#00843D] focus:ring-[#00843D]/15'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2. Nomor Telepon */}
                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Nomor Telepon <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          clearFieldError('phone');
                        }}
                        placeholder="0812-xxxx-xxxx atau +62 812-xxxx-xxxx"
                        aria-invalid={Boolean(errors.phone)}
                        className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-[14px] text-[#111827] placeholder:text-[#94A3B8] tabular-nums focus:outline-none focus:ring-2 transition-colors ${
                          errors.phone
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15'
                            : 'border-[#E2E8F0] focus:border-[#00843D] focus:ring-[#00843D]/15'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* 3. Alamat Email */}
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Alamat Email <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearFieldError('email');
                        }}
                        placeholder="nama@email.id"
                        aria-invalid={Boolean(errors.email)}
                        className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-colors ${
                          errors.email
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15'
                            : 'border-[#E2E8F0] focus:border-[#00843D] focus:ring-[#00843D]/15'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* 4. Kata Sandi + Strength Indicator */}
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Kata Sandi <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          clearFieldError('password');
                        }}
                        placeholder="Minimal 8 karakter"
                        aria-invalid={Boolean(errors.password)}
                        className={`w-full h-11 pl-10 pr-11 rounded-xl border text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-colors ${
                          errors.password
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

                    {/* Password Strength Bar & Helper Requirements */}
                    <div className="mt-2 space-y-1.5">
                      {password.length > 0 && (
                        <div className="space-y-1">
                          <div className="grid grid-cols-4 gap-1.5">
                            {[1, 2, 3, 4].map((segment) => (
                              <div
                                key={segment}
                                className={`h-1.5 rounded-full transition-colors ${
                                  passwordStrength.score >= segment
                                    ? passwordStrength.barColor
                                    : 'bg-[#E2E8F0]'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-[11.5px]">
                            <span className="text-[#64748B]">
                              Kekuatan kata sandi:
                            </span>
                            <span
                              className={`font-semibold ${passwordStrength.textColor}`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-[#64748B]">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            passwordStrength.hasMinLength
                              ? 'text-[#00843D] font-medium'
                              : ''
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          Min. 8 karakter
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            passwordStrength.hasUpperAndLower
                              ? 'text-[#00843D] font-medium'
                              : ''
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          Huruf besar &amp; kecil
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            passwordStrength.hasNumber
                              ? 'text-[#00843D] font-medium'
                              : ''
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          Angka
                        </span>
                      </div>
                    </div>

                    {errors.password && (
                      <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* 5. Konfirmasi Kata Sandi */}
                  <div>
                    <label
                      htmlFor="reg-confirm-password"
                      className="block text-[13px] font-semibold text-[#111827] mb-1.5"
                    >
                      Konfirmasi Kata Sandi{' '}
                      <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          clearFieldError('confirmPassword');
                        }}
                        placeholder="Ulangi kata sandi Anda"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        className={`w-full h-11 pl-10 pr-11 rounded-xl border text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-colors ${
                          errors.confirmPassword
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15'
                            : 'border-[#E2E8F0] focus:border-[#00843D] focus:ring-[#00843D]/15'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Sembunyikan konfirmasi kata sandi'
                            : 'Tampilkan konfirmasi kata sandi'
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms & Privacy Checkbox */}
                <div>
                  <label className="flex items-start gap-2.5 text-[13px] text-[#334155] cursor-pointer select-none leading-snug">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        clearFieldError('termsAccepted');
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#00843D] focus:ring-[#00843D] shrink-0"
                    />
                    <span>
                      Saya menyetujui{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPolicyModal('terms');
                        }}
                        className="font-semibold text-[#00843D] hover:text-[#006B32] underline underline-offset-2 cursor-pointer"
                      >
                        Syarat &amp; Ketentuan
                      </button>{' '}
                      serta{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPolicyModal('privacy');
                        }}
                        className="font-semibold text-[#00843D] hover:text-[#006B32] underline underline-offset-2 cursor-pointer"
                      >
                        Kebijakan Privasi
                      </button>{' '}
                      BenihNusa Track.
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="mt-1.5 text-[12px] text-[#B91C1C] font-medium">
                      {errors.termsAccepted}
                    </p>
                  )}
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
                      <span>Mendaftarkan Akun...</span>
                    </>
                  ) : (
                    <span>Daftar</span>
                  )}
                </button>

                {/* Bottom Login Link */}
                <div className="pt-4 border-t border-[#E2E8F0] text-center text-[13px] text-[#64748B]">
                  Sudah memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigateLogin()}
                    className="font-semibold text-[#00843D] hover:text-[#006B32] cursor-pointer"
                  >
                    Masuk
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Inline Terms / Privacy Dialog */}
      {policyModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-modal-title"
        >
          <div className="bg-white rounded-2xl border border-[#E2E8F0] w-full max-w-[480px] p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00843D]" />
                <h3
                  id="policy-modal-title"
                  className="text-[16px] font-bold text-[#111827]"
                >
                  {policyModal === 'terms'
                    ? 'Syarat & Ketentuan Layanan'
                    : 'Kebijakan Privasi Data'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                aria-label="Tutup dialog"
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {policyModal === 'terms' ? (
              <div className="text-[13px] text-[#475569] space-y-2.5 leading-relaxed">
                <p>
                  1. Pendaftaran menghasilkan <strong>akun individu standar</strong>{' '}
                  tanpa hak akses peran bisnis otomatis.
                </p>
                <p>
                  2. Pengguna wajib memverifikasi alamat email aktif dan menunggu
                  persetujuan Administrator Sistem sebelum mengakses modul
                  organisasi.
                </p>
                <p>
                  3. Pengajuan peran (Produsen, Regulator, Distributor/Koperasi,
                  atau Petani) diproses terpisah melalui mekanisme persetujuan
                  organisasi dan keanggotaan.
                </p>
              </div>
            ) : (
              <div className="text-[13px] text-[#475569] space-y-2.5 leading-relaxed">
                <p>
                  Data nama lengkap, nomor telepon, dan alamat email digunakan
                  semata-mata untuk verifikasi identitas, tata kelola akun, dan
                  pencatatan audit ketertelusuran benih pada platform BenihNusa
                  Track.
                </p>
                <p>
                  Informasi pribadi Anda tidak dibagikan kepada pihak ketiga di
                  luar kebutuhan operasional ketertelusuran dan pengawasan
                  sertifikasi resmi.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="h-9 px-4 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
