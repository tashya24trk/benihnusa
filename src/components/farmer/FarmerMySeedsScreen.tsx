import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  QrCode,
  Search,
  X,
} from 'lucide-react';
import {
  FarmerSeedBatch,
  FarmerSeedVerificationStatus,
} from '../../types/farmer';
import { StatusBadge } from '../ui/StatusBadge';

interface FarmerMySeedsScreenProps {
  seeds: FarmerSeedBatch[];
  onViewDetail: (seedId: string) => void;
  onVerifyBatch: (batchNumber: string) => void;
}

export const FarmerMySeedsScreen: React.FC<FarmerMySeedsScreenProps> = ({
  seeds,
  onViewDetail,
  onVerifyBatch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | FarmerSeedVerificationStatus>('Semua');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return seeds.filter((s) => {
      if (statusFilter !== 'Semua' && s.verificationStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        s.batchNumber.toLowerCase().includes(q) ||
        s.variety.toLowerCase().includes(q) ||
        s.producerName.toLowerCase().includes(q)
      );
    });
  }, [seeds, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filtered.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Benih Saya
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Daftar benih yang telah diterima atas nama Anda beserta status keaslian dan sisa stok siap tanam.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="relative w-full sm:w-[320px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nomor batch atau varietas..."
            className="w-full h-11 pl-9 pr-8 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
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
              setStatusFilter(e.target.value as 'Semua' | FarmerSeedVerificationStatus);
              setPage(1);
            }}
            aria-label="Filter status verifikasi"
            className="w-full sm:w-auto h-11 pl-8 pr-9 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
          >
            <option value="Semua">Semua Status Verifikasi</option>
            <option value="Terverifikasi">Terverifikasi</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Sertifikasi Tidak Valid">Sertifikasi Tidak Valid</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Readable Cards */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-[13px] text-[#64748B]">
            Tidak ada benih yang cocok dengan pencarian Anda.
          </div>
        ) : (
          paginated.map((seed) => (
            <div
              key={seed.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[14px] font-semibold text-[#00843D] tabular-nums">
                    {seed.batchNumber}
                  </div>
                  <div className="text-[15px] font-semibold text-[#111827] mt-0.5">
                    {seed.variety}
                  </div>
                </div>
                <StatusBadge status={seed.verificationStatus} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px] text-[#475569] pt-2 border-t border-[#F1F5F9]">
                <div>
                  <span className="text-[#64748B] block">Produsen</span>
                  <span className="font-medium text-[#111827]">{seed.producerName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Distributor</span>
                  <span className="font-medium text-[#111827]">{seed.distributorName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Jenis Benih</span>
                  <span className="font-medium text-[#111827]">{seed.commodity}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Jumlah Diterima</span>
                  <span className="font-bold text-[#111827] tabular-nums">
                    {seed.receivedQuantityKg.toLocaleString('id-ID')} kg
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onViewDetail(seed.id)}
                  className="flex-1 min-h-[44px] rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#334155] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Detail</span>
                </button>
                {seed.verificationStatus === 'Menunggu Verifikasi' && (
                  <button
                    type="button"
                    onClick={() => onVerifyBatch(seed.batchNumber)}
                    className="flex-1 min-h-[44px] rounded-lg bg-[#00843D] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Verifikasi QR</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div
        className="hidden md:block bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-3 whitespace-nowrap">Jenis Benih</th>
                <th className="py-3 px-3 whitespace-nowrap">Varietas</th>
                <th className="py-3 px-3 whitespace-nowrap">Produsen</th>
                <th className="py-3 px-3 whitespace-nowrap">Distributor</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Jumlah Diterima</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Verifikasi</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-[13px] text-[#64748B]">
                    Tidak ada batch benih yang sesuai dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                paginated.map((seed) => (
                  <tr
                    key={seed.id}
                    onClick={() => onViewDetail(seed.id)}
                    className="h-[54px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                      <span className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                        {seed.batchNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#111827]">
                      {seed.commodity}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] font-medium text-[#111827]">
                      {seed.variety}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#334155]">
                      {seed.producerName}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#334155]">
                      {seed.distributorName}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                      {seed.receivedQuantityKg.toLocaleString('id-ID')} kg
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={seed.verificationStatus} />
                    </td>
                    <td
                      className="py-2.5 pl-3 pr-5 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail(seed.id)}
                          className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>Detail</span>
                        </button>
                        {seed.verificationStatus === 'Menunggu Verifikasi' && (
                          <button
                            type="button"
                            onClick={() => onVerifyBatch(seed.batchNumber)}
                            className="h-8 px-2.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Verifikasi</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-white flex items-center justify-between gap-3">
          <div className="text-[13px] text-[#64748B] tabular-nums">
            Menampilkan <span className="font-semibold text-[#111827]">{startItem}-{endItem}</span> dari{' '}
            <span className="font-semibold text-[#111827]">{filtered.length}</span> batch benih
          </div>

          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Jumlah baris per halaman"
              className="h-8 px-2 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] tabular-nums cursor-pointer"
            >
              <option value={6}>6 baris</option>
              <option value={12}>12 baris</option>
            </select>

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
    </div>
  );
};
