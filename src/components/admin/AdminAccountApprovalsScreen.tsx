import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Search,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import { AccountApprovalRequest, ApprovalStatus } from '../../types/admin';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyStateView } from '../ui/SystemStateViews';

interface AdminAccountApprovalsScreenProps {
  mode: 'account-approvals' | 'account-detail';
  requests: AccountApprovalRequest[];
  selectedRequest: AccountApprovalRequest | null;
  onOpenDetail: (id: string) => void;
  onBackToList: () => void;
  onDecision: (payload: {
    requestId: string;
    decision: 'Disetujui' | 'Ditolak';
    rejectionReason?: string;
  }) => void;
}

export const AdminAccountApprovalsScreen: React.FC<
  AdminAccountApprovalsScreenProps
> = ({
  mode,
  requests,
  selectedRequest,
  onOpenDetail,
  onBackToList,
  onDecision,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ApprovalStatus>('Semua');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Confirmation modal state
  const [modalDecision, setModalDecision] = useState<'Disetujui' | 'Ditolak' | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== 'Semua' && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.requestNumber.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (mode === 'account-detail' && selectedRequest) {
    const isPending = selectedRequest.status === 'Menunggu Persetujuan';

    const handleConfirmSubmit = () => {
      if (!modalDecision) return;
      if (modalDecision === 'Ditolak' && !rejectionReason.trim()) {
        setReasonError('Alasan penolakan wajib diisi sebelum mengirim keputusan.');
        return;
      }
      onDecision({
        requestId: selectedRequest.id,
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
            <span>Kembali ke Persetujuan Akun</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
              Detail Persetujuan Akun · {selectedRequest.requestNumber}
            </h1>
            <StatusBadge status={selectedRequest.status} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Persetujuan akun hanya memvalidasi identitas pengguna. Penetapan peran organisasi dilakukan terpisah di modul Persetujuan Membership.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5">
          <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Informasi Identitas Pemohon
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <div className="text-[#64748B]">Nama Lengkap</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {selectedRequest.fullName}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Email Terdaftar</div>
              <div className="font-medium text-[#111827] mt-0.5">
                {selectedRequest.email}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Nomor Telepon</div>
              <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                {selectedRequest.phone}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">NIK (Tersamar)</div>
              <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                {selectedRequest.nikMasked}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Provinsi Domisili</div>
              <div className="font-medium text-[#111827] mt-0.5">
                {selectedRequest.province}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Tanggal Pengajuan</div>
              <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                {selectedRequest.submittedAt}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[#64748B]">Catatan Pemohon</div>
              <div className="text-[#334155] mt-0.5">{selectedRequest.notes}</div>
            </div>
          </div>

          {selectedRequest.rejectionReason && (
            <div className="p-4 rounded-xl bg-[#FEE2E2]/70 border border-[#FECACA] text-[13px] text-[#991B1B]">
              <div className="font-semibold">Alasan Penolakan:</div>
              <p className="mt-0.5">{selectedRequest.rejectionReason}</p>
            </div>
          )}

          {selectedRequest.reviewedBy && (
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#475569]">
              Ditinjau oleh <strong>{selectedRequest.reviewedBy}</strong> pada{' '}
              <span className="tabular-nums">{selectedRequest.reviewedAt}</span>
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
                <span>Tolak Akun</span>
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
                <span>Setujui Akun</span>
              </button>
            </div>
          )}
        </div>

        {/* Decision Confirmation Dialog */}
        {modalDecision && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]">
            <div className="bg-white rounded-xl border border-[#E2E8F0] w-full max-w-[440px] p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  {modalDecision === 'Disetujui'
                    ? 'Konfirmasi Persetujuan Akun'
                    : 'Konfirmasi Penolakan Akun'}
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
                  ? `Setujui aktivasi akun untuk ${selectedRequest.fullName} (${selectedRequest.email})? Pengguna dapat masuk ke sistem setelah disetujui.`
                  : `Tolak permohonan akun untuk ${selectedRequest.fullName}? Sertakan alasan resmi agar dapat ditindaklanjuti.`}
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
                    placeholder="Contoh: Nomor telepon tidak aktif atau dokumen identitas tidak sesuai..."
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

  const pendingCount = requests.filter((r) => r.status === 'Menunggu Persetujuan').length;
  const approvedCount = requests.filter((r) => r.status === 'Disetujui').length;
  const rejectedCount = requests.filter((r) => r.status === 'Ditolak').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Persetujuan Akun
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Verifikasi identitas pendaftaran akun pengguna baru secara terpisah sebelum pengajuan organisasi atau membership peran bisnis.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Menunggu Persetujuan"
          value={String(pendingCount)}
          trendText="Perlu Tinjauan"
          trendContext="permohonan akun aktif"
          trendPositive={pendingCount === 0}
          icon={Clock}
        />
        <MetricCard
          title="Akun Disetujui"
          value={String(approvedCount)}
          trendText="Terverifikasi"
          trendContext="identitas valid"
          icon={UserCheck}
        />
        <MetricCard
          title="Permohonan Ditolak"
          value={String(rejectedCount)}
          trendText="Ditolak"
          trendContext="tidak memenuhi syarat"
          trendPositive={false}
          icon={XCircle}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama, email, telepon, atau nomor..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'Semua' | ApprovalStatus);
            setPage(1);
          }}
          className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
        >
          <option value="Semua">Semua Status</option>
          <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyStateView
            title="Tidak Ada Permohonan Akun"
            description="Tidak ditemukan permohonan akun yang cocok dengan pencarian atau filter status."
            actionLabel="Reset Filter"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('Semua');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold text-[#64748B]">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Telepon</th>
                  <th className="py-3 px-4">Tanggal Pengajuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                {paginated.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F8FAFC]/80">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111827]">{req.fullName}</div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {req.requestNumber} · {req.province}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#334155]">{req.email}</td>
                    <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap">
                      {req.phone}
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

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[12px] text-[#64748B]">
          <span className="tabular-nums">
            Halaman {safePage} dari {totalPages} ({filtered.length} permohonan)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
