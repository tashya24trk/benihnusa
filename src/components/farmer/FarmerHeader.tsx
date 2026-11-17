import React from 'react';
import { ChevronRight, Menu, QrCode, Sprout } from 'lucide-react';
import { FarmerScreenId } from '../../types/farmer';

interface FarmerHeaderProps {
  activeScreen: FarmerScreenId;
  farmerName: string;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: FarmerScreenId) => void;
}

const SCREEN_BREADCRUMBS: Record<
  FarmerScreenId,
  { parent?: { label: string; screen: FarmerScreenId }; current: string }
> = {
  dashboard: { current: 'Dashboard Petani' },
  'my-seeds': { current: 'Benih Saya' },
  'seed-detail': {
    parent: { label: 'Benih Saya', screen: 'my-seeds' },
    current: 'Detail Benih',
  },
  'qr-verify': { current: 'Verifikasi QR' },
  'qr-result': {
    parent: { label: 'Verifikasi QR', screen: 'qr-verify' },
    current: 'Hasil Verifikasi',
  },
  reception: { current: 'Penerimaan Benih' },
  'reception-confirm': {
    parent: { label: 'Penerimaan Benih', screen: 'reception' },
    current: 'Konfirmasi Penerimaan',
  },
  planting: { current: 'Catatan Penanaman' },
  'planting-form': {
    parent: { label: 'Catatan Penanaman', screen: 'planting' },
    current: 'Catat Penanaman',
  },
  'planting-detail': {
    parent: { label: 'Catatan Penanaman', screen: 'planting' },
    current: 'Detail Penanaman',
  },
  correction: {
    parent: { label: 'Catatan Penanaman', screen: 'planting' },
    current: 'Permintaan Koreksi',
  },
  activity: { current: 'Riwayat Aktivitas' },
  profile: { current: 'Profil Petani' },
};

export const FarmerHeader: React.FC<FarmerHeaderProps> = ({
  activeScreen,
  farmerName,
  onOpenMobileMenu,
  onNavigate,
}) => {
  const crumb = SCREEN_BREADCRUMBS[activeScreen];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between gap-3">
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
            {farmerName}
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
          <span className="font-medium text-[#111827] truncate">{crumb.current}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('qr-verify')}
          className="h-10 px-3.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('planting-form')}
          className="h-10 px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#111827] text-[13px] font-semibold hidden sm:inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sprout className="w-4 h-4 text-[#00843D]" />
          <span>Catat Tanam</span>
        </button>
      </div>
    </header>
  );
};
