import React, { useMemo, useState } from 'react';
import { Eye, Plus, Search } from 'lucide-react';
import {
  CertificationApplication,
  ProducerCertStatus,
} from '../../types/producer';
import { StatusBadge } from '../ui/StatusBadge';

interface ProducerCertificationListScreenProps {
  applications: CertificationApplication[];
  eligibleBatchesCount: number;
  onViewApplication: (appId: string) => void;
  onOpenSubmitModal: () => void;
}

export const ProducerCertificationListScreen: React.FC<ProducerCertificationListScreenProps> = ({
  applications,
  eligibleBatchesCount,
  onViewApplication,
  onOpenSubmitModal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | Exclude<ProducerCertStatus, 'Belum Diajukan'>>('Semua');

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (statusFilter !== 'Semua' && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.batchNumber.toLowerCase().includes(q) ||
        a.applicationNumber.toLowerCase().includes(q) ||
        a.variety.toLowerCase().includes(q)
      );
    });
  }, [applications, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Pengajuan Sertifikasi
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pantau status permohonan sertifikasi benih Anda, progres uji laboratorium BPSB, dan umpan balik regulator.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSubmitModal}
          className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Sertifikasi ({eligibleBatchesCount} siap)</span>
        </button>
      </div>

      {/* Applications Table Card */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:w-[340px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor batch, pengajuan, atau varietas..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                'Semua',
                'Menunggu Verifikasi',
                'Dalam Pemeriksaan Lab',
                'Perlu Perbaikan',
                'Tersertifikasi',
              ] as const
            ).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`h-9 px-3 rounded-lg text-[12px] font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#00843D] text-white border-[#00843D]'
                    : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-3 whitespace-nowrap">Varietas Benih</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Pengajuan</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Sertifikasi</th>
                <th className="py-3 px-3 whitespace-nowrap">Progres Pemeriksaan</th>
                <th className="py-3 px-3 whitespace-nowrap">Umpan Balik Regulator</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-[13px] text-[#64748B]">
                    Tidak ada pengajuan sertifikasi yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className="h-[60px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors"
                  >
                    <td className="py-3 pl-5 pr-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewApplication(app.id)}
                        className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                      >
                        {app.batchNumber}
                      </button>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {app.applicationNumber}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-[13px] font-medium text-[#111827]">
                        {app.variety}
                      </div>
                      <div className="text-[12px] text-[#64748B] tabular-nums">
                        {app.commodity} · {app.quantityKg.toLocaleString('id-ID')} kg
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                      {app.submissionDate}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
                        <span>{app.progressLabel}</span>
                        <span className="font-semibold text-[#111827] tabular-nums">
                          {app.progressPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            app.status === 'Perlu Perbaikan'
                              ? 'bg-[#F59E0B]'
                              : app.status === 'Ditolak BPSB'
                              ? 'bg-[#EF4444]'
                              : 'bg-[#00843D]'
                          }`}
                          style={{ width: `${app.progressPercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-[260px]">
                      <p className="text-[12px] text-[#334155] line-clamp-2">
                        {app.regulatorFeedback}
                      </p>
                    </td>
                    <td className="py-3 pl-3 pr-5 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => onViewApplication(app.id)}
                        className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
