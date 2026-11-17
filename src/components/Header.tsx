import React from 'react';
import { ChevronRight, Menu, Plus, QrCode } from 'lucide-react';
import { ScreenId } from '../types/seed';

interface HeaderProps {
  activeScreen: ScreenId;
  onOpenMobileMenu: () => void;
  onOpenAddBatch: () => void;
  onOpenQrLookup: () => void;
}

const SCREEN_BREADCRUMB: Record<ScreenId, { section: string; current: string }> = {
  overview: {
    section: 'Sertifikasi Nasional',
    current: 'Ringkasan Operasional',
  },
  batches: {
    section: 'Ketertelusuran',
    current: 'Manajemen Batch Benih',
  },
  lab: {
    section: 'Pengawasan Mutu',
    current: 'Uji Mutu & Laboratorium',
  },
  distribution: {
    section: 'Rantai Pasok',
    current: 'Distribusi & Logistik',
  },
  producers: {
    section: 'Mitra Terdaftar',
    current: 'Direktori Penangkar',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onOpenMobileMenu,
  onOpenAddBatch,
  onOpenQrLookup,
}) => {
  const crumb = SCREEN_BREADCRUMB[activeScreen];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle + Breadcrumb Trail */}
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
          <span className="text-[#64748B] whitespace-nowrap hidden sm:inline">
            BenihNusa Track
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 hidden sm:inline" />
          <span className="text-[#64748B] whitespace-nowrap hidden md:inline">
            {crumb.section}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 hidden md:inline" />
          <span className="font-medium text-[#111827] truncate">
            {crumb.current}
          </span>
        </nav>
      </div>

      {/* Right: Operational Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenQrLookup}
          className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] text-[13px] font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-[#64748B]" />
          <span className="hidden sm:inline">Verifikasi QR Lot</span>
        </button>

        <button
          type="button"
          onClick={onOpenAddBatch}
          className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Batch Benih</span>
        </button>
      </div>
    </header>
  );
};
