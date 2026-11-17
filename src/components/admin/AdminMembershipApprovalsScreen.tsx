import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  Info,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import {
  ApprovalStatus,
  BusinessRoleType,
  MembershipApprovalRequest,
} from '../../types/admin';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyStateView } from '../ui/SystemStateViews';

interface AdminMembershipApprovalsScreenProps {
  mode: 'membership-approvals' | 'membership-detail';
  requests: MembershipApprovalRequest[];
  selectedMembership: MembershipApprovalRequest | null;
  onOpenDetail: (id: string) => void;
  onBackToList: () => void;
  onDecision: (payload: {
    membershipId: string;
    decision: 'Disetujui' | 'Ditolak';
    rejectionReason?: string;
  }) => void;
}

export const AdminMembershipApprovalsScreen: React.FC<
  AdminMembershipApprovalsScreenProps
> = ({
  mode,
  requests,
  selectedMembership,
  onOpenDetail,
  onBackToList,
  onDecision,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ApprovalStatus>('Semua');
  const [roleFilter, setRoleFilter] = useState<'Semua' | BusinessRoleType>('Semua');
  const [modalDecision, setModalDecision] = useState<'Disetujui' | 'Ditolak' | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== 'Semua' && r.status !== statusFilter) return false;
      if (roleFilter !== 'Semua' && r.requestedRole !== roleFilter) return false;
      if (!q) return true;
      return (
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.organizationName.toLowerCase().includes(q) ||
        r.requestNumber.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery, statusFilter, roleFilter]);

  if (mode === 'membership-detail' && selectedMembership) {
    const isPending = selectedMembership.status === 'Menunggu Persetujuan';

    const handleConfirmSubmit = () => {
      if (!modalDecision) return;
      if (modalDecision === 'Ditolak' && !rejectionReason.trim()) {
        setReasonError('Alasan penolakan membership wajib diisi.');
        return;
      }
      onDecision({
        membershipId: selectedMembership.id,
        decision: modalDecision,
        rejectionReason:
          modalDecision === 'Ditolak' ? rejectionReason.trim() : undefined,
      });
      setModalDecision(null);
      setRejectionReason('');
      setReasonError('');
    };

    return (
      <div className="space-y-6 max-w-[920px]">
        <div>
          <button
            type="button"
            onClick={onBackToList}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Persetujuan Membership</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
              Detail Membership · {selectedMembership.requestNumber}
            </h1>
            <StatusBadge status={selectedMembership.status} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Alur persetujuan peran bisnis di dalam organisasi terverifikasi (terpisah dari persetujuan akun &amp; organisasi).
          </p>
        </div>

        {/* Separation Verification Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
              1. Prasyarat Status Akun Pengguna
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-[14px] text-[#111827]">
                {selectedMembership.userName}
              </div>
              <StatusBadge status={selectedMembership.userAccountStatus} />
            </div>
            <div className="text-[12px] text-[#64748B]">
              {selectedMembership.userEmail}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
              2. Prasyarat Status Organisasi Tujuan
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-[14px] text-[#111827]">
                {selectedMembership.organizationName}
              </div>
              <StatusBadge status={selectedMembership.organizationStatus} />
            </div>
            <div className="text-[12px] text-[#00843D] font-semibold">
              Peran yang Diajukan: {selectedMembership.requestedRole}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4">
          <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Rincian Pengajuan Keanggotaan Peran
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <div className="text-[#64748B]">Peran Bisnis Diajukan</div>
              <div className="font-bold text-[#00843D] mt-0.5">
                {selectedMembership.requestedRole}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Tanggal Pengajuan</div>
              <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                {selectedMembership.submittedAt}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[#64748B]">Justifikasi / Surat Tugas</div>
              <div className="text-[#334155] mt-0.5 leading-relaxed">
                {selectedMembership.justification}
              </div>
            </div>
          </div>

          {selectedMembership.rejectionReason && (
            <div className="p-4 rounded-xl bg-[#FEE2E2]/70 border border-[#FECACA] text-[13px] text-[#991B1B]">
              <div className="font-semibold">Alasan Penolakan:</div>
              <p className="mt-0.5">{selectedMembership.rejectionReason}</p>
            </div>
          )}

          {isPending && (
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectionReason('');
                  setReasonError('');
                  setModalDecision('Ditolak');
                }}
                className="h-10 px-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#B91C1C] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak Membership</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setReasonError('');
                  setModalDecision('Disetujui');
                }}
                className="h-10 px-5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Setujui Membership</span>
              </button>
            </div>
          )}
        </div>

        {modalDecision && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]">
            <div className="bg-white rounded-xl border border-[#E2E8F0] w-full max-w-[440px] p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  {modalDecision === 'Disetujui'
                    ? 'Setujui Peran Membership?'
                    : 'Tolak Pengajuan Membership?'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalDecision(null)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#111827]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[13px] text-[#475569]">
                {modalDecision === 'Disetujui'
                  ? `Berikan akses peran "${selectedMembership.requestedRole}" pada organisasi "${selectedMembership.organizationName}" untuk ${selectedMembership.userName}?`
                  : `Tolak pengajuan membership ${selectedMembership.userName}?`}
              </p>

              {modalDecision === 'Ditolak' && (
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827] mb-1">
                    Alasan Penolakan *
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Surat tugas dari pimpinan organisasi belum dilampirkan..."
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
                  />
                  {reasonError && (
                    <div className="mt-1 text-[12px] text-[#B91C1C] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{reasonError}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalDecision(null)}
                  className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#334155] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className={`h-9 px-4 rounded-lg text-white text-[13px] font-semibold cursor-pointer ${
                    modalDecision === 'Disetujui'
                      ? 'bg-[#00843D] hover:bg-[#006B32]'
                      : 'bg-[#B91C1C] hover:bg-[#991B1B]'
                  }`}
                >
                  Ya, Simpan Keputusan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Persetujuan Membership
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Tetapkan peran bisnis pengguna (Produsen, Distributor/Koperasi, Petani, Regulator) pada organisasi yang telah disetujui.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-2.5 text-[12px] text-[#1E3A8A]">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <span>
          Alur <strong>Persetujuan Membership</strong> dipisahkan dari verifikasi akun dan verifikasi legalitas organisasi agar pemisahan tugas tetap terjaga.
        </span>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna, organisasi, atau nomor pengajuan..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as 'Semua' | BusinessRoleType)
            }
            className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
          >
            <option value="Semua">Semua Peran</option>
            <option value="Produsen">Produsen</option>
            <option value="Distributor/Koperasi">Distributor/Koperasi</option>
            <option value="Petani">Petani</option>
            <option value="Regulator">Regulator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'Semua' | ApprovalStatus)
            }
            className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyStateView
            title="Tidak Ada Pengajuan Membership"
            description="Tidak ada permohonan membership peran yang cocok dengan filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold text-[#64748B]">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Organisasi</th>
                  <th className="py-3 px-4">Peran yang Diajukan</th>
                  <th className="py-3 px-4">Tanggal Pengajuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F8FAFC]/80">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111827]">{req.userName}</div>
                      <div className="text-[11px] text-[#64748B]">{req.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#334155]">
                      {req.organizationName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F0FAF3] border border-[#BBF7D0] text-[12px] font-semibold text-[#00843D]">
                        {req.requestedRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap">
                      {req.submittedAt}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(req.id)}
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
