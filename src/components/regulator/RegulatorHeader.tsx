import React from 'react';
import { ChevronRight, ClipboardCheck, GitBranch, Menu } from 'lucide-react';
import { RegulatorScreenId } from '../../types/certificationAuthority';

interface RegulatorHeaderProps {
  activeScreen: RegulatorScreenId;
  organizationShortName: string;
  activeAppNumber?: string;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: RegulatorScreenId) => void;
  onQuickInspectPending: () => void;
}

const SCREEN_BREADCRUMBS: Record<
  RegulatorScreenId,
  { parent?: { label: string; screen: RegulatorScreenId }; current: string }
> = {
  dashboard: { current: 'Dashboard' },
  applications: { current: 'Permohonan Sertifikasi' },
  'application-review': {
    parent: { label: 'Permohonan Sertifikasi', screen: 'applications' },
    current: 'Detail Pemeriksaan',
  },
  registry: { current: 'Data Sertifikasi' },
  verification: { current: 'Verifikasi Batch' },
  revocation: { current: 'Pencabutan Sertifikasi' },
  traceability: { current: 'Ketertelusuran Benih' },
  activity: { current: 'Riwayat Aktivitas' },
  profile: { current: 'Profil Organisasi' },
};

export const RegulatorHeader: React.FC<RegulatorHeaderProps> = ({
  activeScreen,
  organizationShortName,
  activeAppNumber,
  onOpenMobileMenu,
  onNavigate,
  onQuickInspectPending,
}) => {
  const crumb = SCREEN_BREADCRUMBS[activeScreen];
  const currentLabel =
    activeScreen === 'application-review' && activeAppNumber
      ? `${crumb.current} (${activeAppNumber})`
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
            {organizationShortName}
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
          onClick={() => onNavigate('traceability')}
          className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <GitBranch className="w-4 h-4 text-[#00843D]" />
          <span className="hidden sm:inline">Telusuri Batch</span>
        </button>

        <button
          type="button"
          onClick={onQuickInspectPending}
          className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Periksa Permohonan</span>
        </button>
      </div>
    </header>
  );
};
