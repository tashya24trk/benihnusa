import React from 'react';
import { ChevronRight, Menu, Plus, Send } from 'lucide-react';
import { ProducerScreenId } from '../../types/producer';

interface ProducerHeaderProps {
  activeScreen: ProducerScreenId;
  activeBatchNumber?: string;
  activeApplicationNumber?: string;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: ProducerScreenId) => void;
  onOpenQuickSubmitCert: () => void;
}

const SCREEN_BREADCRUMBS: Record<
  ProducerScreenId,
  { parent?: { label: string; screen: ProducerScreenId }; current: string }
> = {
  dashboard: { current: 'Dashboard' },
  batches: { current: 'Data Batch Benih' },
  register: { current: 'Registrasi Batch' },
  'batch-detail': {
    parent: { label: 'Data Batch Benih', screen: 'batches' },
    current: 'Detail Batch',
  },
  certifications: { current: 'Pengajuan Sertifikasi' },
  'certification-detail': {
    parent: { label: 'Pengajuan Sertifikasi', screen: 'certifications' },
    current: 'Detail Pengajuan',
  },
  distribution: { current: 'Distribusi Benih' },
  activity: { current: 'Riwayat Aktivitas' },
  profile: { current: 'Profil Organisasi' },
};

export const ProducerHeader: React.FC<ProducerHeaderProps> = ({
  activeScreen,
  activeBatchNumber,
  activeApplicationNumber,
  onOpenMobileMenu,
  onNavigate,
  onOpenQuickSubmitCert,
}) => {
  const crumb = SCREEN_BREADCRUMBS[activeScreen];

  const finalLabel =
    activeScreen === 'batch-detail' && activeBatchNumber
      ? activeBatchNumber
      : activeScreen === 'certification-detail' && activeApplicationNumber
      ? activeApplicationNumber
      : crumb.current;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] min-w-0">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-[#64748B] hover:text-[#111827] whitespace-nowrap hidden sm:inline cursor-pointer"
          >
            Nursery Tashya
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 hidden sm:inline" />
          {crumb.parent && (
            <>
              <button
                type="button"
                onClick={() => onNavigate(crumb.parent!.screen)}
                className="text-[#64748B] hover:text-[#111827] whitespace-nowrap cursor-pointer"
              >
                {crumb.parent.label}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            </>
          )}
          <span className="font-medium text-[#111827] truncate tabular-nums">
            {finalLabel}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenQuickSubmitCert}
          className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-[#00843D]" />
          <span className="hidden sm:inline">Ajukan Sertifikasi</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('register')}
          className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrasi Batch</span>
        </button>
      </div>
    </header>
  );
};
