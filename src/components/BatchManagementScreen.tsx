import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Plus,
  QrCode,
  Search,
  X,
} from 'lucide-react';
import {
  CertificationStatus,
  CommodityType,
  SeedBatch,
  SeedClass,
} from '../types/seed';
import { StatusBadge } from './ui/StatusBadge';

interface BatchManagementScreenProps {
  batches: SeedBatch[];
  initialProducerFilter?: string;
  onClearInitialProducerFilter?: () => void;
  onOpenAddBatch: () => void;
  onInspectBatch: (batch: SeedBatch) => void;
  onApproveBatch: (batch: SeedBatch) => void;
  onRejectBatch: (batch: SeedBatch) => void;
  onBulkApprove: (batchIds: string[]) => void;
}

type SortKey = 'batchNumber' | 'germinationRate' | 'weightKg' | 'certificationDate';

export const BatchManagementScreen: React.FC<BatchManagementScreenProps> = ({
  batches,
  initialProducerFilter = '',
  onClearInitialProducerFilter,
  onOpenAddBatch,
  onInspectBatch,
  onApproveBatch,
  onRejectBatch,
  onBulkApprove,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialProducerFilter);
  const [statusFilter, setStatusFilter] = useState<'Semua' | CertificationStatus>('Semua');
  const [commodityFilter, setCommodityFilter] = useState<'Semua' | CommodityType>('Semua');
  const [seedClassFilter, setSeedClassFilter] = useState<'Semua' | SeedClass>('Semua');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('batchNumber');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const activeFilterCount =
    (statusFilter !== 'Semua' ? 1 : 0) +
    (commodityFilter !== 'Semua' ? 1 : 0) +
    (seedClassFilter !== 'Semua' ? 1 : 0);

  const filteredBatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return batches
      .filter((b) => {
        if (statusFilter !== 'Semua' && b.status !== statusFilter) return false;
        if (commodityFilter !== 'Semua' && b.commodity !== commodityFilter) return false;
        if (seedClassFilter !== 'Semua' && b.seedClass !== seedClassFilter) return false;
        if (!q) return true;
        return (
          b.batchNumber.toLowerCase().includes(q) ||
          b.variety.toLowerCase().includes(q) ||
          b.producerName.toLowerCase().includes(q) ||
          b.province.toLowerCase().includes(q) ||
          (b.certificateNumber ?? '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'germinationRate') {
          comparison = a.germinationRate - b.germinationRate;
        } else if (sortKey === 'weightKg') {
          comparison = a.weightKg - b.weightKg;
        } else if (sortKey === 'certificationDate') {
          comparison = a.certificationDate.localeCompare(b.certificationDate);
        } else {
          comparison = a.batchNumber.localeCompare(b.batchNumber);
        }
        return sortAsc ? comparison : -comparison;
      });
  }, [batches, searchQuery, statusFilter, commodityFilter, seedClassFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedBatches = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredBatches.slice(start, start + pageSize);
  }, [filteredBatches, safePage, pageSize]);

  const allVisibleSelected =
    paginatedBatches.length > 0 &&
    paginatedBatches.every((b) => selectedIds.includes(b.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(paginatedBatches.map((b) => b.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...paginatedBatches.map((b) => b.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('Semua');
    setCommodityFilter('Semua');
    setSeedClassFilter('Semua');
    setPage(1);
    onClearInitialProducerFilter?.();
  };

  const handleExportCsv = (onlySelected = false) => {
    const rows = onlySelected
      ? filteredBatches.filter((b) => selectedIds.includes(b.id))
      : filteredBatches;

    const header = [
      'No. Batch',
      'No. Sertifikat',
      'Komoditas',
      'Bahan Tanam',
      'Kelas Benih',
      'Produsen / Penangkar',
      'Provinsi',
      'Daya Kecambah (%)',
      'Kadar Air (%)',
      'Tonase (kg)',
      'Tanggal Sertifikasi',
      'Status',
    ];

    const csvLines = [
      header.join(','),
      ...rows.map((r) =>
        [
          r.batchNumber,
          r.certificateNumber ?? '-',
          r.commodity,
          `"${r.variety}"`,
          `"${r.seedClass}"`,
          `"${r.producerName}"`,
          r.province,
          r.germinationRate.toFixed(1),
          r.moistureContent.toFixed(1),
          r.weightKg,
          r.certificationDate,
          `"${r.status}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvLines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `benihnusa-batch-benih-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setExportNotice(`${rows.length} data batch berhasil diekspor ke CSV.`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const startItem = filteredBatches.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filteredBatches.length);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Manajemen Batch &amp; Sertifikasi Benih
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Kelola nomor induk batch, parameter mutu laboratorium, penerbitan sertifikat BPSB, dan label QR ketertelusuran.
          </p>
        </div>
        {exportNotice && (
          <div className="px-3.5 py-2 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-[13px] font-medium">
            {exportNotice}
          </div>
        )}
      </div>

      {/* Unified Table Container with Search & Filter Toolbar */}
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
            {/* Search Input (360px on desktop) */}
            <div className="relative w-full sm:w-[360px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari no. batch, bahan tanam, atau produsen..."
                className="w-full h-10 pl-9 pr-8 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                    onClearInitialProducerFilter?.();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] cursor-pointer"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'Semua' | CertificationStatus);
                  setPage(1);
                }}
                aria-label="Filter status sertifikasi"
                className="h-10 pl-8 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Sertifikat Terbit">Sertifikat Terbit</option>
                <option value="Lolos Uji Mutu">Lolos Uji Mutu</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Masa Karantina">Masa Karantina</option>
                <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                <option value="Distribusi Selesai">Distribusi Selesai</option>
                <option value="Ditolak BPSB">Ditolak BPSB</option>
                <option value="Afkir">Afkir</option>
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
                aria-label="Filter komoditas"
                className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Komoditas</option>
                <option value="Kelapa Sawit">Kelapa Sawit</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Seed Class Filter */}
            <div className="relative">
              <select
                value={seedClassFilter}
                onChange={(e) => {
                  setSeedClassFilter(e.target.value as 'Semua' | SeedClass);
                  setPage(1);
                }}
                aria-label="Filter kelas benih"
                className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Kelas</option>
                <option value="Benih Penjenis (BS)">Benih Penjenis (BS)</option>
                <option value="Benih Dasar (BD)">Benih Dasar (BD)</option>
                <option value="Benih Pokok (BP)">Benih Pokok (BP)</option>
                <option value="Benih Sebar (BR)">Benih Sebar (BR)</option>
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

          {/* Trailing Secondary & Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleExportCsv(false)}
              className="h-10 px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#64748B]" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddBatch}
              className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Batch Benih</span>
            </button>
          </div>
        </div>

        {/* Bulk Selection Action Bar */}
        {selectedIds.length > 0 && (
          <div className="px-5 py-3 bg-[#F0FAF3] border-b border-[#BBF7D0] flex flex-wrap items-center justify-between gap-3">
            <div className="text-[13px] font-semibold text-[#006B32] tabular-nums">
              {selectedIds.length} batch benih dipilih
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onBulkApprove(selectedIds);
                  setSelectedIds([]);
                }}
                className="h-8 px-3 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Terbitkan Sertifikat Terpilih</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportCsv(true)}
                className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Terpilih</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="h-8 px-2.5 rounded-lg text-[12px] font-medium text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Enterprise Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="w-12 py-3 pl-5 pr-2">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    aria-label="Pilih semua baris di halaman ini"
                    className="w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[#CBD5E1] accent-[#00843D] cursor-pointer align-middle"
                  />
                </th>
                <th className="py-3 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('batchNumber')}
                    className="inline-flex items-center gap-1 hover:text-[#111827] cursor-pointer"
                  >
                    <span>No. Batch / Lot</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Bahan Tanam &amp; Kelas</th>
                <th className="py-3 px-3 whitespace-nowrap">Produsen / Penangkar</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('germinationRate')}
                    className="inline-flex items-center gap-1 hover:text-[#111827] cursor-pointer ml-auto"
                  >
                    <span>Daya Kecambah</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Kadar Air</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('weightKg')}
                    className="inline-flex items-center gap-1 hover:text-[#111827] cursor-pointer ml-auto"
                  >
                    <span>Tonase</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('certificationDate')}
                    className="inline-flex items-center gap-1 hover:text-[#111827] cursor-pointer"
                  >
                    <span>Tgl. Sertifikat</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Status Sertifikasi</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBatches.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 px-6 text-center">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      Tidak ada data batch benih yang sesuai dengan filter.
                    </p>
                    <p className="text-[13px] text-[#64748B] mt-1">
                      Coba ubah kata kunci pencarian atau atur ulang filter yang aktif.
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
                  const isSelected = selectedIds.includes(batch.id);
                  const canApprove =
                    batch.status === 'Menunggu Verifikasi' ||
                    batch.status === 'Lolos Uji Mutu' ||
                    batch.status === 'Masa Karantina';
                  return (
                    <tr
                      key={batch.id}
                      className={`h-[52px] border-b border-[#F1F5F9] last:border-b-0 transition-colors ${
                        isSelected ? 'bg-[#F0FAF3]/70' : 'bg-white hover:bg-[#F0FAF3]'
                      }`}
                    >
                      <td className="py-2.5 pl-5 pr-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(batch.id)}
                          aria-label={`Pilih batch ${batch.batchNumber}`}
                          className="w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[#CBD5E1] accent-[#00843D] cursor-pointer align-middle"
                        />
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onInspectBatch(batch)}
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
                          {batch.variety}
                        </div>
                        <div className="text-[12px] text-[#64748B]">
                          {batch.commodity} · {batch.seedClass}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[13px] text-[#111827] max-w-[210px] truncate">
                          {batch.producerName}
                        </div>
                        <div className="text-[12px] text-[#64748B]">{batch.province}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-right">
                        <span
                          className={`text-[13px] font-semibold tabular-nums ${
                            batch.germinationRate >= 80
                              ? 'text-[#111827]'
                              : 'text-[#B91C1C]'
                          }`}
                        >
                          {batch.germinationRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] text-[#64748B] tabular-nums">
                        {batch.moistureContent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-medium text-[#111827] tabular-nums">
                        {batch.weightKg.toLocaleString('id-ID')} kg
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                        {batch.certificationDate}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={batch.status} />
                      </td>
                      <td className="py-2.5 pl-3 pr-5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onInspectBatch(batch)}
                            title="Lihat Detail & QR Ketertelusuran"
                            className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1 cursor-pointer"
                          >
                            {batch.certificateNumber ? (
                              <QrCode className="w-3.5 h-3.5 text-[#00843D]" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                            )}
                            <span>Detail</span>
                          </button>

                          {canApprove && (
                            <>
                              <button
                                type="button"
                                onClick={() => onApproveBatch(batch)}
                                title="Setujui & Terbitkan Sertifikat"
                                className="h-8 px-2.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Setujui</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onRejectBatch(batch)}
                                title="Tolak Batch Benih"
                                className="h-8 w-8 rounded-lg border border-[#FECACA] bg-white hover:bg-[#FEE2E2] text-[#EF4444] inline-flex items-center justify-center cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
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
            <span className="font-semibold text-[#111827]">{filteredBatches.length}</span> data benih
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
