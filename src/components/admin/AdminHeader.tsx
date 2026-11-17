import React from 'react';
import { ChevronRight, FileSearch, Menu, ShieldAlert } from 'lucide-react';
import { AdminScreenId } from '../../types/admin';

interface AdminHeaderProps {
  activeScreen: AdminScreenId;
  onOpenMobileMenu: () => void;
  onNavigate: (screen: AdminScreenId) => void;
}

const ADMIN_CRUMBS: Record<
  AdminScreenId,
  { parent?: { label: string; screen: AdminScreenId }; current: string }
> = {
  dashboard: { current: 'Dashboard Tata Kelola' },
  'account-approvals': { current: 'Persetujuan Akun' },
  'account-detail': {
    parent: { label: 'Persetujuan Akun', screen: 'account-approvals' },
    current: 'Detail Persetujuan Akun',
  },
  'organization-approvals': { current: 'Persetujuan Organisasi' },
  'organization-detail': {
    parent: { label: 'Persetujuan Organisasi', screen: 'organization-approvals' },
    current: 'Detail Persetujuan Organisasi',
  },
  'membership-approvals': { current: 'Persetujuan Membership' },
  'membership-detail': {
    parent: { label: 'Persetujuan Membership', screen: 'membership-approvals' },
    current: 'Detail Membership',
  },
  users: { current: 'Manajemen Pengguna' },
  'user-detail': {
    parent: { label: 'Manajemen Pengguna', screen: 'users' },
    current: 'Detail Pengguna',
  },
  'audit-log': { current: 'Audit Log' },
  'access-denied': { current: 'Pembatasan Akses' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeScreen,
  onOpenMobileMenu,
  onNavigate,
}) => {
  const crumb = ADMIN_CRUMBS[activeScreen];

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

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[13px] min-w-0"
        >
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-[#64748B] hover:text-[#111827] whitespace-nowrap hidden sm:inline cursor-pointer"
          >
            Administrator Sistem
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
        <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-[#E2E8F0] text-[11px] font-medium text-[#475569]">
          Data Demo
        </span>

        <button
          type="button"
          onClick={() => onNavigate('access-denied')}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#475569] text-[12px] font-medium hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          title="Simulasi rute bisnis yang dibatasi bagi Administrator"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Uji Batas Akses</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('audit-log')}
          className="h-9 px-3.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
        >
          <FileSearch className="w-4 h-4" />
          <span>Audit Log</span>
        </button>
      </div>
    </header>
  );
};
