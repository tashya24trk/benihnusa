import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Clock,
  Eye,
  Mail,
  Phone,
  Search,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { ApprovalStatus, SystemUserRecord } from '../../types/admin';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyStateView } from '../ui/SystemStateViews';

interface AdminUsersScreenProps {
  mode: 'users' | 'user-detail';
  users: SystemUserRecord[];
  selectedUser: SystemUserRecord | null;
  onOpenDetail: (userId: string) => void;
  onBackToList: () => void;
}

export const AdminUsersScreen: React.FC<AdminUsersScreenProps> = ({
  mode,
  users,
  selectedUser,
  onOpenDetail,
  onBackToList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ApprovalStatus>('Semua');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== 'Semua' && u.accountStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, statusFilter]);

  if (mode === 'user-detail' && selectedUser) {
    return (
      <div className="space-y-6 max-w-[920px]">
        <div>
          <button
            type="button"
            onClick={onBackToList}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Manajemen Pengguna</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
              Detail Pengguna · {selectedUser.fullName}
            </h1>
            <StatusBadge status={selectedUser.accountStatus} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pemisahan antara peran sistem platform dan keanggotaan peran bisnis pada organisasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Identitas Akun &amp; Peran Sistem
            </h2>

            <div className="space-y-3 text-[13px]">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#64748B]">Email</div>
                  <div className="font-medium text-[#111827]">{selectedUser.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#64748B]">Nomor Telepon</div>
                  <div className="font-medium text-[#111827] tabular-nums">
                    {selectedUser.phone}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#64748B]">Peran Sistem (Platform)</div>
                  <div className="font-semibold text-[#111827]">
                    {selectedUser.systemRole}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
                <div>
                  <div className="text-[#64748B]">Tanggal Terdaftar</div>
                  <div className="font-medium text-[#111827] tabular-nums">
                    {selectedUser.registeredAt}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Login Terakhir</div>
                  <div className="font-medium text-[#111827] tabular-nums">
                    {selectedUser.lastLoginAt}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Organisasi &amp; Peran Bisnis (Membership)
            </h2>

            {selectedUser.memberships.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] text-[13px] text-[#475569]">
                <div className="font-semibold text-[#111827]">
                  Belum memiliki peran
                </div>
                <p className="mt-1">
                  Pengguna ini belum memiliki membership peran bisnis yang disetujui pada organisasi manapun.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedUser.memberships.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold text-[13px] text-[#111827]">
                        <Building2 className="w-4 h-4 text-[#00843D]" />
                        <span>{m.organizationName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#15803D] text-[11px] font-semibold">
                        {m.role}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#64748B] tabular-nums">
                      Disetujui sejak {m.approvedAt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const approvedCount = users.filter((u) => u.accountStatus === 'Disetujui').length;
  const pendingCount = users.filter(
    (u) => u.accountStatus === 'Menunggu Persetujuan'
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Manajemen Pengguna
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Daftar seluruh akun pengguna, memisahkan peran sistem platform dari keanggotaan peran bisnis perbenihan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Pengguna"
          value={String(users.length)}
          trendText="Terdaftar"
          trendContext="seluruh akun sistem"
          icon={Users}
        />
        <MetricCard
          title="Akun Disetujui"
          value={String(approvedCount)}
          trendText="Aktif"
          trendContext="dapat masuk sistem"
          icon={UserCheck}
        />
        <MetricCard
          title="Menunggu Persetujuan"
          value={String(pendingCount)}
          trendText="Pending"
          trendContext="perlu verifikasi admin"
          trendPositive={pendingCount === 0}
          icon={Clock}
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau nomor telepon..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'Semua' | ApprovalStatus)
          }
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
        >
          <option value="Semua">Semua Status Akun</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyStateView
            title="Pengguna Tidak Ditemukan"
            description="Ubah kata kunci pencarian nama/email/telepon atau status akun."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold text-[#64748B]">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Peran Sistem</th>
                  <th className="py-3 px-4">Organisasi &amp; Peran Bisnis</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F8FAFC]/80">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111827]">
                        {user.fullName}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {user.email} · <span className="tabular-nums">{user.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[#334155] text-[11px] font-medium">
                        {user.systemRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {user.memberships.length === 0 ? (
                        <span className="text-[12px] italic text-[#64748B]">
                          Belum memiliki peran
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {user.memberships.map((m) => (
                            <div key={m.id} className="text-[12px]">
                              <span className="font-semibold text-[#111827]">
                                {m.organizationName}
                              </span>{' '}
                              <span className="text-[#00843D] font-semibold">
                                ({m.role})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={user.accountStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap">
                      {user.registeredAt}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(user.id)}
                        className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[12px] font-semibold text-[#111827] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
