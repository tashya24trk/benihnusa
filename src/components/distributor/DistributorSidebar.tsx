import React from 'react';
import {
  ArrowLeftRight,
  Building2,
  GitFork,
  History,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Sprout,
  Truck,
  Warehouse,
  X,
} from 'lucide-react';
import { PortalMode } from '../../types/certificationAuthority';
import { DistributorScreenId } from '../../types/distributor';

interface DistributorSidebarProps {
  activeScreen: DistributorScreenId;
  onSelectScreen: (screen: DistributorScreenId) => void;
  onSwitchPortal: (portal: PortalMode) => void;
  onLogout?: () => void;
  organizationName: string;
  roleLabel: string;
  representativeName: string;
  pendingIncomingCount: number;
  activeDistributionCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface DistributorNavItem {
  id: DistributorScreenId;
  matchIds?: DistributorScreenId[];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export const DistributorSidebar: React.FC<DistributorSidebarProps> = ({
  activeScreen,
  onSelectScreen,
  onSwitchPortal,
  onLogout,
  organizationName,
  roleLabel,
  representativeName,
  pendingIncomingCount,
  activeDistributionCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: DistributorNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'incoming',
      matchIds: ['incoming', 'incoming-detail', 'receipt-confirm'],
      label: 'Batch Diterima',
      icon: PackageCheck,
      badgeCount: pendingIncomingCount,
    },
    {
      id: 'inventory',
      label: 'Stok Benih',
      icon: Warehouse,
    },
    {
      id: 'distribution',
      label: 'Distribusi Benih',
      icon: Truck,
      badgeCount: activeDistributionCount,
    },
    {
      id: 'split',
      label: 'Pemecahan Batch',
      icon: GitFork,
    },
    {
      id: 'transfer',
      label: 'Transfer Kepemilikan',
      icon: ArrowLeftRight,
    },
    {
      id: 'activity',
      label: 'Riwayat Aktivitas',
      icon: History,
    },
    {
      id: 'profile',
      label: 'Profil Organisasi',
      icon: Building2,
    },
  ];

  const handleNavClick = (id: DistributorScreenId) => {
    onSelectScreen(id);
    onCloseMobile();
  };

  const initials = representativeName
    .split(' ')
    .filter((p) => !p.endsWith('.'))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase() || 'KT';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] w-[260px] shrink-0">
      {/* Brand Lockup */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#E2E8F0] shrink-0">
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00843D] rounded-lg py-1 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#00843D] flex items-center justify-center text-white shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-[#111827] whitespace-nowrap">
            BenihNusa Track
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100"
          aria-label="Tutup menu navigasi"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Distributor Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Navigasi Distributor">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
          Portal Distributor
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matchIds
            ? item.matchIds.includes(activeScreen)
            : activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00843D] ${
                isActive
                  ? 'bg-[#F0FAF3] text-[#00843D] font-semibold'
                  : 'text-[#334155] font-medium hover:bg-slate-50 hover:text-[#111827]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive ? 'text-[#00843D]' : 'text-[#64748B]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>
              {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-full tabular-nums shrink-0 ${
                    isActive
                      ? 'bg-[#00843D] text-white'
                      : 'bg-slate-100 text-[#475569]'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Portal Switcher & Organization Footer */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/60 shrink-0 space-y-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-1.5">
            Mode Portal
          </div>
          <div className="space-y-1 p-1 rounded-lg bg-white border border-[#E2E8F0]">
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => {
                  onSwitchPortal('farmer');
                  onCloseMobile();
                }}
                className="py-1.5 px-1.5 rounded-md text-[11px] font-medium text-[#64748B] hover:text-[#111827] whitespace-nowrap cursor-pointer"
              >
                Petani
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchPortal('regulator');
                  onCloseMobile();
                }}
                className="py-1.5 px-1.5 rounded-md text-[11px] font-medium text-[#64748B] hover:text-[#111827] whitespace-nowrap cursor-pointer"
              >
                Regulator
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchPortal('producer');
                  onCloseMobile();
                }}
                className="py-1.5 px-1.5 rounded-md text-[11px] font-medium text-[#64748B] hover:text-[#111827] whitespace-nowrap cursor-pointer"
              >
                Produsen
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => onSwitchPortal('distributor')}
                className="py-1.5 px-2 rounded-md text-[11px] font-semibold bg-[#F0FAF3] text-[#00843D] whitespace-nowrap cursor-pointer"
              >
                Koperasi
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchPortal('admin');
                  onCloseMobile();
                }}
                className="py-1.5 px-2 rounded-md text-[11px] font-medium text-[#64748B] hover:text-[#111827] whitespace-nowrap cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className="flex-1 min-w-0 flex items-center gap-3 text-left rounded-lg hover:bg-white p-1.5 -mx-1.5 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] flex items-center justify-center text-[#00843D] text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#111827] truncate">
                {organizationName}
              </p>
              <p className="text-[12px] text-[#64748B] truncate">
                {roleLabel}
              </p>
            </div>
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Keluar ke halaman login"
              aria-label="Keluar dari akun"
              className="p-2 rounded-lg text-[#64748B] hover:text-[#B91C1C] hover:bg-[#FEE2E2]/60 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-30">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
