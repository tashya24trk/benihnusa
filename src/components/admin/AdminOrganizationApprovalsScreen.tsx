import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { ApprovalStatus, OrganizationApprovalRequest } from '../../types/admin';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyStateView } from '../ui/SystemStateViews';

interface AdminOrganizationApprovalsScreenProps {
  mode: 'organization-approvals' | 'organization-detail';
  requests: OrganizationApprovalRequest[];
  selectedOrg: OrganizationApprovalRequest | null;
  onOpenDetail: (id: string) => void;
  onBackToList: () => void;
  onDecision: (payload: {
    orgId: string;
    decision: 'Disetujui' | 'Ditolak';
    rejectionReason?: string;
  }) => void;
}

export const AdminOrganizationApprovalsScreen: React.FC<
  AdminOrganizationApprovalsScreenProps
> = ({
  mode,
  requests,
  selectedOrg,
  onOpenDetail,
  onBackToList,
  onDecision,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ApprovalStatus>('Semua');
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
        r.organizationName.toLowerCase().includes(q) ||
        r.applicantName.toLowerCase().includes(q) ||
        r.organizationType.toLowerCase().includes(q) ||
        r.nibOrLicense.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery, statusFilter]);

  if (mode === 'organization-detail' && selectedOrg) {
    const isPending = selectedOrg.status === 'Menunggu Persetujuan';

    const handleConfirmSubmit = () => {
      if (!modalDecision) return;
      if (modalDecision === 'Ditolak' && !rejectionReason.trim()) {
        setReasonError('Alasan penolakan legalitas organisasi wajib diisi.');
        return;
      }
      onDecision({
        orgId: selectedOrg.id,
        decision: modalDecision,
        rejectionReason:
          modalDecision === 'Ditolak' ? rejectionReason.trim() : undefined,
      });
      setModalDecision(null);
      setRejectionReason('');
      setReasonError('');
    };

    return (
      <div className="space-y-6 max-w-[960px]">
        <div>
          <button
            type="button"
            onClick={onBackToList}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Persetujuan Organisasi</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
              Detail Organisasi · {selectedOrg.organizationName}
            </h1>
            <StatusBadge status={selectedOrg.status} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Tinjau legalitas badan usaha/kelembagaan dan dokumen pendukung sebelum menyetujui organisasi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Identitas Organisasi &amp; Pemohon
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-[#64748B]">Nomor Pengajuan</div>
                <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                  {selectedOrg.requestNumber}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Jenis Organisasi</div>
                <div className="font-semibold text-[#00843D] mt-0.5">
                  {selectedOrg.organizationType}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Pemohon Penanggung Jawab</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {selectedOrg.applicantName}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Email Pemohon</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {selectedOrg.applicantEmail}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">NIB / Nomor Izin</div>
                <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                  {selectedOrg.nibOrLicense}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Tanggal Pengajuan</div>
                <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                  {selectedOrg.submittedAt}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[#64748B]">Alamat Lengkap &amp; Provinsi</div>
                <div className="text-[#334155] mt-0.5">
                  {selectedOrg.address}, {selectedOrg.province}
                </div>
              </div>
            </div>

            {selectedOrg.rejectionReason && (
              <div className="p-4 rounded-xl bg-[#FEE2E2]/70 border border-[#FECACA] text-[13px] text-[#991B1B]">
                <div className="font-semibold">Alasan Penolakan:</div>
                <p className="mt-0.5">{selectedOrg.rejectionReason}</p>
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
                  <span>Tolak Organisasi</span>
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
                  <span>Setujui Organisasi</span>
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4">
            <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Dokumen Legalitas Pendukung
            </h2>
            <div className="space-y-2.5">
              {selectedOrg.supportingDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#00843D] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[#111827] truncate">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {doc.fileSize}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                      doc.verified
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {doc.verified ? 'Terbaca' : 'Perlu Cek'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {modalDecision && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]">
            <div className="bg-white rounded-xl border border-[#E2E8F0] w-full max-w-[440px] p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  {modalDecision === 'Disetujui'
                    ? 'Setujui Organisasi?'
                    : 'Tolak Pengajuan Organisasi?'}
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
                  ? `Organisasi "${selectedOrg.organizationName}" akan aktif dan siap menerima pengajuan membership anggota.`
                  : `Pengajuan organisasi "${selectedOrg.organizationName}" akan ditolak beserta catatan alasan di bawah.`}
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
                    placeholder="Contoh: NIB tidak sesuai klasifikasi usaha perbenihan atau lampiran izin buram..."
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
          Persetujuan Organisasi
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Verifikasi registrasi entitas Produsen Benih, Koperasi Distributor, Kelompok Tani, dan Lembaga Sertifikasi.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama organisasi, jenis, pemohon, atau NIB..."
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
          <option value="Semua">Semua Status</option>
          <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyStateView
            title="Tidak Ada Pengajuan Organisasi"
            description="Tidak ditemukan organisasi yang sesuai kriteria pencarian."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold text-[#64748B]">
                  <th className="py-3 px-4">Nama Organisasi</th>
                  <th className="py-3 px-4">Jenis Organisasi</th>
                  <th className="py-3 px-4">Pemohon</th>
                  <th className="py-3 px-4">Tanggal Pengajuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                {filtered.map((org) => (
                  <tr key={org.id} className="hover:bg-[#F8FAFC]/80">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111827]">
                        {org.organizationName}
                      </div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {org.requestNumber} · {org.nibOrLicense}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#334155]">{org.organizationType}</td>
                    <td className="py-3.5 px-4 text-[#334155]">{org.applicantName}</td>
                    <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap">
                      {org.submittedAt}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={org.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(org.id)}
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
