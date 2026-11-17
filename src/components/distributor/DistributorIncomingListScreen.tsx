import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  PackageCheck,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { CommodityType, IncomingBatch, ReceiptStatus } from '../../types/distributor';
import { StatusBadge } from '../ui/StatusBadge';

interface DistributorIncomingListScreenProps {
  incomingBatches: IncomingBatch[];
  onViewDetail: (batchId: string) => void;
  onConfirmReceipt: (batchId: string) => void;
  onRefresh: () => void;
}

export const DistributorIncomingListScreen: React.FC<
  DistributorIncomingListScreenProps
> = ({ incomingBatches, onViewDetail, onConfirmReceipt, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ReceiptStatus>('Semua');
  const [commodityFilter, setCommodityFilter] = useState<'Semua' | CommodityType>('Semua');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [lastRefreshed, setLastRefreshed] = useState('Baru saja');

  const activeFilterCount =
    (statusFilter !== 'Semua' ? 1 : 0) + (commodityFilter !== 'Semua' ? 1 : 0);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return incomingBatches.filter((b) => {
      if (statusFilter !== 'Semua' && b.receiptStatus !== statusFilter) return false;
      if (commodityFilter !== 'Semua' && b.commodity !== commodityFilter) return false;
      if (!q) return true;
      return (
        b.batchNumber.toLowerCase().includes(q) ||
        b.producerName.toLowerCase().includes(q) ||
        b.variety.toLowerCase().includes(q)
      );
    });
  }, [incomingBatches, searchQuery, statusFilter, commodityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filtered.length);

  const handleRefreshClick = () => {
    onRefresh();
    const now = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastRefreshed(`${now} WIB`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Batch Diterima (Batch Masuk)
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Daftar pengiriman benih yang ditujukan ke Koperasi Tani Makmur untuk verifikasi fisik dan konfirmasi penerimaan.
          </p>
        </div>
        <span className="text-[12px] text-[#64748B] tabular-nums">
          Terakhir diperbarui: {lastRefreshed}
        </span>
      </div>

      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Toolbar */}
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
                placeholder="Cari nomor batch atau nama produsen..."
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
                  setStatusFilter(e.target.value as 'Semua' | ReceiptStatus);
                  setPage(1);
                }}
                aria-label="Filter status penerimaan"
                className="h-10 pl-8 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

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
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('Semua');
                  setCommodityFilter('Semua');
                  setPage(1);
                }}
                className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-[#F0FAF3] text-[#00843D] text-[13px] font-semibold inline-flex items-center gap-1.5 hover:bg-[#DCFCE7] cursor-pointer"
              >
                <span>Filter ({activeFilterCount})</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleRefreshClick}
            className="h-10 px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#64748B]" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-3 whitespace-nowrap">Produsen</th>
                <th className="py-3 px-3 whitespace-nowrap">Jenis Benih</th>
                <th className="py-3 px-3 whitespace-nowrap">Varietas</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Jumlah Diterima</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Transfer</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Penerimaan</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-[13px] text-[#64748B]">
                    Tidak ada batch masuk yang cocok dengan kriteria pencarian Anda.
                  </td>
                </tr>
              ) : (
                paginated.map((batch) => (
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
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {batch.waybillNumber}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[13px] text-[#111827] max-w-[210px] truncate">
                        {batch.producerName}
                      </div>
                      <div className="text-[12px] text-[#64748B]">{batch.producerProvince}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[13px] text-[#111827]">{batch.commodity}</div>
                      <div className="text-[12px] text-[#64748B]">{batch.seedClass}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] font-medium text-[#111827]">
                      {batch.variety}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                      {batch.quantityKg.toLocaleString('id-ID')} kg
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                      {batch.transferDate}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={batch.receiptStatus} />
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

                        {batch.receiptStatus === 'Menunggu Konfirmasi' && (
                          <button
                            type="button"
                            onClick={() => onConfirmReceipt(batch.id)}
                            className="h-8 px-2.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Konfirmasi</span>
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
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[13px] text-[#64748B] tabular-nums">
            Menampilkan <span className="font-semibold text-[#111827]">{startItem}-{endItem}</span> dari{' '}
            <span className="font-semibold text-[#111827]">{filtered.length}</span> batch masuk
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
    </div>
  );
};
