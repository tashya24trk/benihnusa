import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Info,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  AccountApprovalRequest,
  AdminScreenId,
  MembershipApprovalRequest,
  OrganizationApprovalRequest,
  SystemUserRecord,
} from '../../types/admin';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface AdminDashboardScreenProps {
  users: SystemUserRecord[];
  accountRequests: AccountApprovalRequest[];
  orgRequests: OrganizationApprovalRequest[];
  membershipRequests: MembershipApprovalRequest[];
  onNavigate: (screen: AdminScreenId) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  users,
  accountRequests,
  orgRequests,
  membershipRequests,
  onNavigate,
}) => {
  const pendingAccounts = accountRequests.filter(
    (r) => r.status === 'Menunggu Persetujuan'
  ).length;
  const pendingOrgs = orgRequests.filter(
    (r) => r.status === 'Menunggu Persetujuan'
  ).length;
  const pendingMemberships = membershipRequests.filter(
    (r) => r.status === 'Menunggu Persetujuan'
  ).length;

  const totalPending = pendingAccounts + pendingOrgs + pendingMemberships;

  const approvedTotal =
    accountRequests.filter((r) => r.status === 'Disetujui').length +
    orgRequests.filter((r) => r.status === 'Disetujui').length +
    membershipRequests.filter((r) => r.status === 'Disetujui').length;

  const recentActivities = [
    ...accountRequests.slice(0, 2).map((a) => ({
      id: a.id,
      subject: a.fullName,
      activityType: 'Persetujuan Akun',
      date: a.submittedAt,
      status: a.status,
      targetScreen: 'account-approvals' as AdminScreenId,
    })),
    ...orgRequests.slice(0, 2).map((o) => ({
      id: o.id,
      subject: o.organizationName,
      activityType: `Registrasi Organisasi (${o.organizationType})`,
      date: o.submittedAt,
      status: o.status,
      targetScreen: 'organization-approvals' as AdminScreenId,
    })),
    ...membershipRequests.slice(0, 2).map((m) => ({
      id: m.id,
      subject: `${m.userName} · ${m.organizationName}`,
      activityType: `Pengajuan Membership (${m.requestedRole})`,
      date: m.submittedAt,
      status: m.status,
      targetScreen: 'membership-approvals' as AdminScreenId,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Dashboard Administrator
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Kelola persetujuan akun pengguna, verifikasi organisasi, penetapan peran membership, serta audit sistem BenihNusa Track.
        </p>
      </div>

      {/* Role Governance Scope Notice */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-3 text-[13px] text-[#334155]">
        <Info className="w-5 h-5 text-[#00843D] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#111827]">
            Batasan Wewenang Administrator Sistem:
          </span>{' '}
          Administrator hanya mengelola tata kelola akun, organisasi, keanggotaan peran, dan log audit. Proses bisnis perbenihan maupun persetujuan sertifikat berada sepenuhnya pada Portal Produsen, Koperasi, Regulator BPSB, dan Petani.
        </div>
      </div>

      {/* Pending Approval Notice */}
      {totalPending > 0 && (
        <div className="p-4 rounded-xl bg-[#FEF3C7]/75 border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 text-[13px] text-[#92400E]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#D97706]" />
            <div>
              <div className="font-semibold">
                {totalPending} Permohonan Menunggu Persetujuan Anda
              </div>
              <p className="mt-0.5">
                Rincian antrean: <strong className="tabular-nums">{pendingAccounts}</strong> akun,{' '}
                <strong className="tabular-nums">{pendingOrgs}</strong> organisasi, dan{' '}
                <strong className="tabular-nums">{pendingMemberships}</strong> membership peran bisnis.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('account-approvals')}
              className="h-9 px-3 rounded-lg bg-white border border-[#FDE68A] text-[#92400E] text-[12px] font-semibold hover:bg-amber-50 cursor-pointer"
            >
              Tinjau Akun ({pendingAccounts})
            </button>
            <button
              type="button"
              onClick={() => onNavigate('organization-approvals')}
              className="h-9 px-3 rounded-lg bg-white border border-[#FDE68A] text-[#92400E] text-[12px] font-semibold hover:bg-amber-50 cursor-pointer"
            >
              Tinjau Organisasi ({pendingOrgs})
            </button>
          </div>
        </div>
      )}

      {/* Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Pengguna"
          value={String(users.length)}
          trendText="Aktif"
          trendContext="terdaftar di sistem demo"
          icon={Users}
        />
        <MetricCard
          title="Organisasi"
          value={String(orgRequests.length)}
          trendText="Terdata"
          trendContext="entitas & pengajuan baru"
          icon={Building2}
        />
        <MetricCard
          title="Menunggu Persetujuan"
          value={String(totalPending)}
          trendText="Antrean"
          trendContext="akun, organisasi & peran"
          trendPositive={totalPending === 0}
          icon={Clock}
        />
        <MetricCard
          title="Permohonan Disetujui"
          value={String(approvedTotal)}
          trendText="Tervalidasi"
          trendContext="total keputusan admin"
          icon={CheckCircle2}
        />
      </div>

      {/* Quick Approval Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('account-approvals')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#00843D] text-left transition-colors flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#111827]">
                Persetujuan Akun
              </div>
              <div className="text-[12px] text-[#64748B] tabular-nums">
                {pendingAccounts} menunggu tinjauan
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('organization-approvals')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#00843D] text-left transition-colors flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#111827]">
                Persetujuan Organisasi
              </div>
              <div className="text-[12px] text-[#64748B] tabular-nums">
                {pendingOrgs} menunggu tinjauan
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('membership-approvals')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#00843D] text-left transition-colors flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#111827]">
                Persetujuan Membership
              </div>
              <div className="text-[12px] text-[#64748B] tabular-nums">
                {pendingMemberships} menunggu tinjauan
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>

      {/* Recent Governance Activity Table */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
          <div>
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Aktivitas Permohonan Terbaru
            </h2>
            <p className="text-[12px] text-[#64748B]">
              Pengajuan akun, organisasi, dan membership peran bisnis terkini.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('audit-log')}
            className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold text-[#64748B]">
                <th className="py-3 px-4">Nama / Organisasi</th>
                <th className="py-3 px-4">Jenis Aktivitas</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
              {recentActivities.map((row) => (
                <tr key={row.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#111827]">
                    {row.subject}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">{row.activityType}</td>
                  <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onNavigate(row.targetScreen)}
                      className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[12px] font-semibold text-[#111827] cursor-pointer"
                    >
                      Buka Antrean
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
