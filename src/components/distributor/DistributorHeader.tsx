import React from 'react';
import { ChevronRight, Menu, PackageCheck, Truck } from 'lucide-react';
import { DistributorScreenId } from '../../types/distributor';

interface DistributorHeaderProps {
  activeScreen: DistributorScreenId;
  activeIncomingBatchNumber?: string;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: DistributorScreenId) => void;
  onStartReceiptConfirm: () => void;
}

const SCREEN_BREADCRUMBS: Record<
  DistributorScreenId,
  { parent?: { label: string; screen: DistributorScreenId }; current: string }
> = {
  dashboard: { current: 'Dashboard' },
  incoming: { current: 'Batch Diterima' },
  'incoming-detail': {
    parent: { label: 'Batch Diterima', screen: 'incoming' },
    current: 'Detail Batch Masuk',
  },
  'receipt-confirm': {
    parent: { label: 'Batch Diterima', screen: 'incoming' },
    current: 'Konfirmasi Penerimaan',
  },
  inventory: { current: 'Stok Benih' },
  distribution: { current: 'Distribusi Benih' },
  split: { current: 'Pemecahan Batch' },
  transfer: { current: 'Transfer Kepemilikan' },
  activity: { current: 'Riwayat Aktivitas' },
  profile: { current: 'Profil Organisasi' },
};

export const DistributorHeader: React.FC<DistributorHeaderProps> = ({
  activeScreen,
  activeIncomingBatchNumber,
  onOpenMobileMenu,
  onNavigate,
  onStartReceiptConfirm,
}) => {
  const crumb = SCREEN_BREADCRUMBS[activeScreen];
  const currentLabel =
    (activeScreen === 'incoming-detail' || activeScreen === 'receipt-confirm') &&
    activeIncomingBatchNumber
      ? `${crumb.current} (${activeIncomingBatchNumber})`
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
            Koperasi Tani Makmur
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
            {currentLabel}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onStartReceiptConfirm}
          className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <PackageCheck className="w-4 h-4 text-[#00843D]" />
          <span className="hidden sm:inline">Konfirmasi Penerimaan</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('distribution')}
          className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>Buat Distribusi</span>
        </button>
      </div>
    </header>
  );
};
