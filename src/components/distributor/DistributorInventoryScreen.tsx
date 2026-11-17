import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  GitFork,
  Search,
  Truck,
  X,
} from 'lucide-react';
import {
  CommodityType,
  DistributorInventoryBatch,
} from '../../types/distributor';
import { StatusBadge } from '../ui/StatusBadge';

interface DistributorInventoryScreenProps {
  organizationName: string;
  inventory: DistributorInventoryBatch[];
  onDistributeBatch: (batchId: string) => void;
  onSplitBatch: (batchId: string) => void;
}

type SortKey = 'batchNumber' | 'availableQuantityKg' | 'variety';

export const DistributorInventoryScreen: React.FC<
  DistributorInventoryScreenProps
> = ({ organizationName, inventory, onDistributeBatch, onSplitBatch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [commodityFilter, setCommodityFilter] = useState<'Semua' | CommodityType>('Semua');
  const [certFilter, setCertFilter] = useState<'Semua' | 'Tersertifikasi'>('Semua');
  const [sortKey, setSortKey] = useState<SortKey>('batchNumber');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Business rule: only show batches owned by active organization
  const ownedInventory = useMemo(
    () => inventory.filter((b) => b.currentOwner === organizationName),
    [inventory, organizationName]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ownedInventory
      .filter((b) => {
        if (commodityFilter !== 'Semua' && b.commodity !== commodityFilter) return false;
        if (certFilter !== 'Semua' && b.certificationStatus !== certFilter) return false;
        if (!q) return true;
        return (
          b.batchNumber.toLowerCase().includes(q) ||
          b.variety.toLowerCase().includes(q) ||
          b.producerName.toLowerCase().includes(q) ||
          b.certificateNumber.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'availableQuantityKg') {
          cmp = a.availableQuantityKg - b.availableQuantityKg;
        } else if (sortKey === 'variety') {
          cmp = a.variety.localeCompare(b.variety);
        } else {
          cmp = a.batchNumber.localeCompare(b.batchNumber);
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [ownedInventory, searchQuery, commodityFilter, certFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, filtered.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Stok Benih
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Inventori benih tersertifikasi yang dimiliki secara sah oleh {organizationName} dan siap didistribusikan.
        </p>
      </div>

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
            <div className="relative w-full sm:w-[340px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nomor batch, bahan tanam, atau sertifikat..."
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
                value={commodityFilter}
                onChange={(e) => {
                  setCommodityFilter(e.target.value as 'Semua' | CommodityType);
                  setPage(1);
                }}
                aria-label="Filter jenis benih"
                className="h-10 pl-8 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Jenis Benih</option>
                <option value="Kelapa Sawit">Kelapa Sawit</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={certFilter}
                onChange={(e) => {
                  setCertFilter(e.target.value as 'Semua' | 'Tersertifikasi');
                  setPage(1);
                }}
                aria-label="Filter status sertifikasi"
                className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] appearance-none hover:bg-[#F8FAFC] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20 cursor-pointer"
              >
                <option value="Semua">Semua Sertifikasi</option>
                <option value="Tersertifikasi">Tersertifikasi</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('batchNumber')}
                    className="inline-flex items-center gap-1 hover:text-[#111827] cursor-pointer"
                  >
                    <span>Nomor Batch</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Jenis Benih</th>
                <th className="py-3 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('variety')}
                    className="inline-flex items-center gap-1 hover:text-[#111827] cursor-pointer"
                  >
                    <span>Bahan Tanam</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('availableQuantityKg')}
                    className="inline-flex items-center gap-1 hover:text-[#111827] cursor-pointer ml-auto"
                  >
                    <span>Stok Tersedia</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Pemilik Saat Ini</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Sertifikasi</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Batch</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-[13px] text-[#64748B]">
                    Tidak ada stok benih yang sesuai dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const canAct = item.availableQuantityKg > 0 && item.batchStatus !== 'Dipecah';
                  return (
                    <tr
                      key={item.id}
                      className="h-[52px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors"
                    >
                      <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                          {item.batchNumber}
                        </div>
                        <div className="text-[11px] text-[#64748B] tabular-nums">
                          {item.certificateNumber}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[13px] text-[#111827]">{item.commodity}</div>
                        <div className="text-[12px] text-[#64748B]">{item.seedClass}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-[13px] font-medium text-[#111827]">
                          {item.variety}
                        </div>
                        <div className="text-[12px] text-[#64748B] truncate max-w-[180px]">
                          {item.producerName}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-bold text-[#111827] tabular-nums">
                        {item.availableQuantityKg.toLocaleString('id-ID')} kg
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] font-medium text-[#111827]">
                        {item.currentOwner}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={item.certificationStatus} />
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={item.batchStatus} />
                      </td>
                      <td className="py-2.5 pl-3 pr-5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={!canAct}
                            onClick={() => onSplitBatch(item.id)}
                            className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <GitFork className="w-3.5 h-3.5 text-[#64748B]" />
                            <span>Pecah</span>
                          </button>

                          <button
                            type="button"
                            disabled={!canAct}
                            onClick={() => onDistributeBatch(item.id)}
                            className="h-8 px-2.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] disabled:opacity-40 disabled:pointer-events-none text-white text-[12px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Distribusi</span>
                          </button>
                        </div>
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
            <span className="font-semibold text-[#111827]">{filtered.length}</span> batch inventori
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
