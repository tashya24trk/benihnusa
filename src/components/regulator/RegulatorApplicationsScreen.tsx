import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileEdit,
  Filter,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import {
  ApplicationInspectionStatus,
  CertificationApplicationRecord,
} from '../../types/certificationAuthority';
import { PlantingCorrectionRequest } from '../../types/farmer';
import { StatusBadge } from '../ui/StatusBadge';

interface RegulatorApplicationsScreenProps {
  applications: CertificationApplicationRecord[];
  farmerCorrections: PlantingCorrectionRequest[];
  onReviewApplication: (appId: string) => void;
  onDecideFarmerCorrection: (payload: {
    correctionId: string;
    decision: 'Disetujui' | 'Ditolak';
    note: string;
  }) => void;
}

export const RegulatorApplicationsScreen: React.FC<
  RegulatorApplicationsScreenProps
> = ({
  applications,
  farmerCorrections,
  onReviewApplication,
  onDecideFarmerCorrection,
}) => {
  const [activeTab, setActiveTab] = useState<'certifications' | 'corrections'>(
    'certifications'
  );
  const [decisionTarget, setDecisionTarget] = useState<{
    item: PlantingCorrectionRequest;
    decision: 'Disetujui' | 'Ditolak';
  } | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [decisionError, setDecisionError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ApplicationInspectionStatus>('Semua');
  const [dateFilter, setDateFilter] = useState<'Semua' | '2026-11' | '2026-10'>('Semua');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const activeFilterCount =
    (statusFilter !== 'Semua' ? 1 : 0) + (dateFilter !== 'Semua' ? 1 : 0);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return applications.filter((app) => {
      if (statusFilter !== 'Semua' && app.status !== statusFilter) return false;
      if (dateFilter !== 'Semua' && !app.submissionDate.startsWith(dateFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        app.applicationNumber.toLowerCase().includes(q) ||
        app.batchNumber.toLowerCase().includes(q) ||
        app.producerName.toLowerCase().includes(q) ||
        app.variety.toLowerCase().includes(q) ||
        app.commodity.toLowerCase().includes(q)
      );
    });
  }, [applications, searchQuery, statusFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filtered.length);

  const pendingCorrectionCount = farmerCorrections.filter(
    (c) => c.status === 'Menunggu Persetujuan'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Permohonan Sertifikasi &amp; Koreksi
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pemeriksaan pengajuan sertifikasi benih dari produsen serta tinjauan permintaan koreksi catatan penanaman dari petani.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-lg bg-white border border-[#E2E8F0] self-start">
          <button
            type="button"
            onClick={() => setActiveTab('certifications')}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold cursor-pointer whitespace-nowrap ${
              activeTab === 'certifications'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Permohonan Sertifikasi ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('corrections')}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'corrections'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Koreksi Catatan Petani</span>
            {pendingCorrectionCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] tabular-nums ${
                  activeTab === 'corrections'
                    ? 'bg-white text-[#00843D]'
                    : 'bg-[#FEF3C7] text-[#B45309]'
                }`}
              >
                {pendingCorrectionCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'corrections' ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0]">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Tinjauan Koreksi Catatan Penanaman Petani
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Petani tidak dapat menyetujui permohonan koreksi sendiri. Hanya Regulator BPSB yang berwenang menyetujui atau menolak perubahan catatan tanam.
            </p>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {farmerCorrections.length === 0 ? (
              <div className="py-12 text-center text-[13px] text-[#64748B]">
                Tidak ada pengajuan koreksi catatan penanaman dari petani.
              </div>
            ) : (
              farmerCorrections.map((corr) => (
                <div
                  key={corr.id}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 text-[13px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#111827] tabular-nums">
                        {corr.requestCode}
                      </span>
                      <span className="text-[#64748B] tabular-nums">
                        · Catatan {corr.recordCode} ({corr.batchNumber})
                      </span>
                      <StatusBadge status={corr.status} />
                    </div>
                    <div className="text-[#334155]">
                      <span className="text-[#64748B]">Bahan Tanam:</span>{' '}
                      <strong>{corr.variety}</strong> · Diajukan{' '}
                      <span className="tabular-nums">{corr.submittedAt}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[12px]">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-[#E2E8F0]">
                        <span className="text-[#64748B] block">Data Awal:</span>
                        <span className="font-medium text-[#111827]">
                          {corr.incorrectInfo}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F0FAF3] border border-[#BBF7D0]">
                        <span className="text-[#00843D] block font-semibold">
                          Usulan Perbaikan:
                        </span>
                        <span className="font-semibold text-[#111827]">
                          {corr.requestedCorrection}
                        </span>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#475569]">
                      Alasan Petani: {corr.reason}
                    </div>
                    {corr.regulatorNote && (
                      <div className="text-[12px] text-[#00843D] font-medium">
                        Catatan BPSB: {corr.regulatorNote}
                      </div>
                    )}
                  </div>

                  {corr.status === 'Menunggu Persetujuan' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setDecisionError('');
                          setDecisionNote('');
                          setDecisionTarget({ item: corr, decision: 'Ditolak' });
                        }}
                        className="h-9 px-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#B91C1C] text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDecisionError('');
                          setDecisionNote(
                            'Disetujui oleh Ir. Sari Wijaya (BPSB Provinsi Riau).'
                          );
                          setDecisionTarget({ item: corr, decision: 'Disetujui' });
                        }}
                        className="h-9 px-3.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Setujui Koreksi</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {decisionTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]">
              <div className="bg-white rounded-xl border border-[#E2E8F0] w-full max-w-[440px] p-5 sm:p-6 space-y-4 shadow-xl">
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  {decisionTarget.decision === 'Disetujui'
                    ? 'Setujui Koreksi Catatan Tanam?'
                    : 'Tolak Permintaan Koreksi?'}
                </h3>
                <p className="text-[13px] text-[#475569]">
                  {decisionTarget.item.requestCode} — {decisionTarget.item.requestedCorrection}
                </p>
                <div>
                  <label className="block text-[12px] font-semibold text-[#111827] mb-1">
                    Catatan Resmi Regulator BPSB *
                  </label>
                  <textarea
                    rows={3}
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    placeholder="Masukkan catatan persetujuan atau alasan penolakan..."
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827]"
                  />
                  {decisionError && (
                    <div className="mt-1 text-[12px] text-[#B91C1C]">
                      {decisionError}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionTarget(null)}
                    className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#334155] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!decisionNote.trim()) {
                        setDecisionError('Catatan regulator wajib diisi.');
                        return;
                      }
                      onDecideFarmerCorrection({
                        correctionId: decisionTarget.item.id,
                        decision: decisionTarget.decision,
                        note: decisionNote.trim(),
                      });
                      setDecisionTarget(null);
                    }}
                    className={`h-9 px-4 rounded-lg text-white text-[13px] font-semibold cursor-pointer ${
                      decisionTarget.decision === 'Disetujui'
                        ? 'bg-[#00843D] hover:bg-[#006B32]'
                        : 'bg-[#B91C1C] hover:bg-[#991B1B]'
                    }`}
                  >
                    Simpan Keputusan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
      <>

      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative w-full sm:w-[320px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari no. permohonan, batch, atau produsen..."
                className="w-full h-10 pl-9 pr-8 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'Semua' | ApplicationInspectionStatus);
                  setPage(1);
                }}
                aria-label="Filter status pemeriksaan"
                className="h-10 pl-8 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Status Pemeriksaan</option>
                <option value="Menunggu Pemeriksaan">Menunggu Pemeriksaan</option>
                <option value="Dalam Pemeriksaan">Dalam Pemeriksaan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value as 'Semua' | '2026-11' | '2026-10');
                  setPage(1);
                }}
                aria-label="Filter periode pengajuan"
                className="h-10 pl-8 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Tanggal</option>
                <option value="2026-11">November 2026</option>
                <option value="2026-10">Oktober 2026</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('Semua');
                  setDateFilter('Semua');
                  setPage(1);
                }}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F0FAF3] text-[#00843D] text-[13px] font-semibold inline-flex items-center gap-1.5 hover:bg-[#DCFCE7] cursor-pointer"
              >
                <span>Filter ({activeFilterCount})</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Permohonan</th>
                <th className="py-3 px-3 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-3 whitespace-nowrap">Nama Produsen</th>
                <th className="py-3 px-3 whitespace-nowrap">Jenis Benih</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Pengajuan</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Pemeriksaan</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-[13px] text-[#64748B]">
                    Tidak ada permohonan sertifikasi yang sesuai dengan filter Anda.
                  </td>
                </tr>
              ) : (
                paginated.map((app) => {
                  const needsAction =
                    app.status === 'Menunggu Pemeriksaan' ||
                    app.status === 'Dalam Pemeriksaan';
                  return (
                    <tr
                      key={app.id}
                      onClick={() => onReviewApplication(app.id)}
                      className="h-[54px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                          {app.applicationNumber}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-[#111827] tabular-nums">
                          {app.batchNumber}
                        </div>
                        <div className="text-[11px] text-[#64748B] tabular-nums">
                          {app.quantityKg.toLocaleString('id-ID')} kg
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[13px] text-[#111827] max-w-[220px] truncate">
                          {app.producerName}
                        </div>
                        <div className="text-[11px] text-[#64748B]">{app.producerProvince}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[13px] font-medium text-[#111827]">
                          {app.commodity} · {app.variety}
                        </div>
                        <div className="text-[11px] text-[#64748B]">{app.seedClass}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                        {app.submissionDate}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td
                        className="py-2.5 pl-3 pr-5 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onReviewApplication(app.id)}
                          className={`h-8 px-3 rounded-lg text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                            needsAction
                              ? 'bg-[#00843D] hover:bg-[#006B32] text-white'
                              : 'border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155]'
                          }`}
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          <span>{needsAction ? 'Periksa' : 'Detail'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[13px] text-[#64748B] tabular-nums">
            Menampilkan <span className="font-semibold text-[#111827]">{startItem}-{endItem}</span> dari{' '}
            <span className="font-semibold text-[#111827]">{filtered.length}</span> permohonan
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
              <span>Baris:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                aria-label="Jumlah baris per halaman"
                className="h-8 px-2 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] tabular-nums cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={15}>15</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center text-[#334155] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-[13px] font-medium text-[#111827] tabular-nums">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center text-[#334155] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
