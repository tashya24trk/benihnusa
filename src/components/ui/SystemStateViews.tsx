import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Inbox,
  RefreshCw,
  ShieldX,
} from 'lucide-react';

interface AccessDeniedViewProps {
  currentRoleLabel: string;
  attemptedArea?: string;
  reason?: string;
  onReturnSafe: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentRoleLabel,
  attemptedArea = 'Modul Terbatas',
  reason,
  onReturnSafe,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 sm:p-10 text-center max-w-[600px] mx-auto my-8 space-y-4">
      <div className="w-12 h-12 rounded-full bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] flex items-center justify-center mx-auto">
        <ShieldX className="w-6 h-6" />
      </div>
      <div className="space-y-1.5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#B91C1C]">
          403 · Akses Ditolak
        </div>
        <h2 className="text-[20px] font-semibold text-[#111827]">
          Anda Tidak Memiliki Izin ke {attemptedArea}
        </h2>
        <p className="text-[14px] text-[#64748B] leading-relaxed">
          {reason ||
            `Peran aktif Anda saat ini adalah ${currentRoleLabel}. Sesuai kebijakan pemisahan hak akses BenihNusa Track, rute atau tindakan ini hanya tersedia bagi peran berwenang.`}
        </p>
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={onReturnSafe}
          className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Aman</span>
        </button>
      </div>
    </div>
  );
};

interface EmptyStateViewProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-12 px-6 text-center space-y-3">
      <div className="w-11 h-11 rounded-full bg-slate-100 border border-[#E2E8F0] text-[#64748B] flex items-center justify-center mx-auto">
        <Inbox className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[15px] font-semibold text-[#111827]">{title}</div>
        <p className="mt-1 text-[13px] text-[#64748B] max-w-md mx-auto">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[13px] font-semibold text-[#111827] cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

interface ErrorStateBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorStateBanner: React.FC<ErrorStateBannerProps> = ({
  title = 'Gagal Memuat Data',
  message,
  onRetry,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#FEE2E2]/80 border border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5" />
        <div>
          <div className="text-[14px] font-semibold text-[#B91C1C]">{title}</div>
          <p className="text-[13px] text-[#7F1D1D] mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="h-9 px-3.5 rounded-lg bg-white border border-[#FECACA] text-[#B91C1C] text-[12px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Muat Ulang</span>
        </button>
      )}
    </div>
  );
};

export const LoadingStateSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-11 bg-slate-100 rounded-lg w-full" />
      ))}
    </div>
  );
};
