import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  BatchLifecycleStatus,
  CommodityType,
  ProducerBatch,
  ProducerCertStatus,
} from '../../types/producer';
import { StatusBadge } from '../ui/StatusBadge';

interface ProducerBatchTableScreenProps {
  organizationName: string;
  batches: ProducerBatch[];
  onOpenRegister: () => void;
  onViewDetail: (batchId: string) => void;
  onEditBatch: (batchId: string) => void;
}

export const ProducerBatchTableScreen: React.FC<ProducerBatchTableScreenProps> = ({
  organizationName,
  batches,
  onOpenRegister,
  onViewDetail,
  onEditBatch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [certFilter, setCertFilter] = useState<'Semua' | ProducerCertStatus>('Semua');
  const [batchStatusFilter, setBatchStatusFilter] = useState<'Semua' | BatchLifecycleStatus>('Semua');
  const [commodityFilter, setCommodityFilter] = useState<'Semua' | CommodityType>('Semua');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Enforce business rule: show only batches belonging to the active producer organization
  const orgBatches = useMemo(
    () => batches.filter((b) => b.organizationName === organizationName),
    [batches, organizationName]
  );

  const activeFilterCount =
    (certFilter !== 'Semua' ? 1 : 0) +
    (batchStatusFilter !== 'Semua' ? 1 : 0) +
    (commodityFilter !== 'Semua' ? 1 : 0);

  const filteredBatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orgBatches.filter((b) => {
      if (certFilter !== 'Semua' && b.certificationStatus !== certFilter) return false;
      if (batchStatusFilter !== 'Semua' && b.batchStatus !== batchStatusFilter) return false;
      if (commodityFilter !== 'Semua' && b.commodity !== commodityFilter) return false;
      if (!q) return true;
      return (
        b.batchNumber.toLowerCase().includes(q) ||
        b.commodity.toLowerCase().includes(q) ||
        b.variety.toLowerCase().includes(q) ||
        b.productionLocation.toLowerCase().includes(q)
      );
    });
  }, [orgBatches, searchQuery, certFilter, batchStatusFilter, commodityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedBatches = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredBatches.slice(start, start + pageSize);
  }, [filteredBatches, safePage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCertFilter('Semua');
    setBatchStatusFilter('Semua');
    setCommodityFilter('Semua');
    setPage(1);
  };

  const startItem = filteredBatches.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filteredBatches.length);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Data Batch Benih
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Daftar seluruh batch benih milik {organizationName}, status sertifikasi BPSB, dan ketersediaan stok.
          </p>
        </div>
      </div>

      {/* Unified Table Container */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col xl:flex-row xl:items-center justify-between gap-3">
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
                placeholder="Cari nomor batch, jenis, atau varietas..."
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
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Certification Status Filter */}
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={certFilter}
                onChange={(e) => {
                  setCertFilter(e.target.value as 'Semua' | ProducerCertStatus);
                  setPage(1);
                }}
                aria-label="Filter status sertifikasi"
                className="h-10 pl-8 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Status Sertifikasi</option>
                <option value="Belum Diajukan">Belum Diajukan</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Dalam Pemeriksaan Lab">Dalam Pemeriksaan Lab</option>
                <option value="Tersertifikasi">Tersertifikasi</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                <option value="Ditolak BPSB">Ditolak BPSB</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Batch Status Filter */}
            <div className="relative">
              <select
                value={batchStatusFilter}
                onChange={(e) => {
                  setBatchStatusFilter(e.target.value as 'Semua' | BatchLifecycleStatus);
                  setPage(1);
                }}
                aria-label="Filter status batch"
                className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Status Batch</option>
                <option value="Draf">Draf</option>
                <option value="Terdaftar">Terdaftar</option>
                <option value="Diajukan Sertifikasi">Diajukan Sertifikasi</option>
                <option value="Siap Distribusi">Siap Distribusi</option>
                <option value="Dalam Distribusi">Dalam Distribusi</option>
                <option value="Dialihkan Penuh">Dialihkan Penuh</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Commodity Filter */}
            <div className="relative">
              <select
                value={commodityFilter}
                onChange={(e) => {
                  setCommodityFilter(e.target.value as 'Semua' | CommodityType);
                  setPage(1);
                }}
                aria-label="Filter jenis benih"
                className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Jenis Benih</option>
                <option value="Padi">Padi</option>
                <option value="Jagung">Jagung</option>
                <option value="Kedelai">Kedelai</option>
                <option value="Cabai">Cabai</option>
                <option value="Bawang Merah">Bawang Merah</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F0FAF3] text-[#00843D] text-[13px] font-semibold inline-flex items-center gap-1.5 hover:bg-[#DCFCE7] cursor-pointer"
              >
                <span>Filter Aktif</span>
                <span className="w-5 h-5 rounded-full bg-[#00843D] text-white text-[11px] font-bold inline-flex items-center justify-center tabular-nums">
                  {activeFilterCount}
                </span>
                <X className="w-3.5 h-3.5 ml-0.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrasi Batch Baru</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-3 whitespace-nowrap">Jenis Benih</th>
                <th className="py-3 px-3 whitespace-nowrap">Varietas</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Jumlah</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Produksi</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Sertifikasi</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Batch</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      Tidak ada batch benih yang sesuai dengan filter.
                    </p>
                    <p className="text-[13px] text-[#64748B] mt-1">
                      Atur ulang filter atau daftarkan batch benih baru untuk organisasi Anda.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-4 h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-semibold text-[#334155] cursor-pointer"
                    >
                      Atur Ulang Filter
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedBatches.map((batch) => {
                  // Business rule: editable ONLY before certification submission
                  const isEditable = batch.certificationStatus === 'Belum Diajukan';
                  return (
                    <tr
                      key={batch.id}
                      className="h-[52px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors"
                    >
                      <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onViewDetail(batch.id)}
                          className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                        >
                          {batch.batchNumber}
                        </button>
                        {batch.certificateNumber && (
                          <div className="text-[11px] text-[#64748B] tabular-nums">
                            {batch.certificateNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[13px] font-medium text-[#111827]">
                          {batch.commodity}
                        </div>
                        <div className="text-[12px] text-[#64748B]">{batch.seedClass}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#111827] font-medium">
                        {batch.variety}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                        {batch.quantityKg.toLocaleString('id-ID')} kg
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                        {batch.productionDate}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={batch.certificationStatus} />
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={batch.batchStatus} />
                      </td>
                      <td className="py-2.5 pl-3 pr-5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewDetail(batch.id)}
                            className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                            <span>Detail</span>
                          </button>

                          {isEditable && (
                            <button
                              type="button"
                              onClick={() => onEditBatch(batch.id)}
                              title="Edit informasi batch (tersedia sebelum pengajuan sertifikasi)"
                              className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F0FAF3] hover:border-[#BBF7D0] text-[12px] font-semibold text-[#00843D] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[13px] text-[#64748B] tabular-nums">
            Menampilkan <span className="font-semibold text-[#111827]">{startItem}-{endItem}</span> dari{' '}
            <span className="font-semibold text-[#111827]">{filteredBatches.length}</span> batch benih
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
                aria-label="Halaman sebelumnya"
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
                aria-label="Halaman berikutnya"
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
