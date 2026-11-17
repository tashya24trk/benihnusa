import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, GitFork } from 'lucide-react';
import { DistributorInventoryBatch } from '../../types/distributor';

interface DistributorSplitBatchScreenProps {
  organizationName: string;
  inventory: DistributorInventoryBatch[];
  preselectedBatchId?: string | null;
  onExecuteSplit: (payload: {
    parentBatchId: string;
    allocations: { suffix: string; quantityKg: number }[];
  }) => void;
}

const SUFFIX_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const DistributorSplitBatchScreen: React.FC<
  DistributorSplitBatchScreenProps
> = ({ organizationName, inventory, preselectedBatchId, onExecuteSplit }) => {
  // Business rule: Distributors can split batches ONLY while they are the rightful owner
  const splittableBatches = useMemo(
    () =>
      inventory.filter(
        (b) =>
          b.currentOwner === organizationName &&
          b.availableQuantityKg >= 2 &&
          b.batchStatus !== 'Dipecah'
      ),
    [inventory, organizationName]
  );

  const [selectedBatchId, setSelectedBatchId] = useState(
    preselectedBatchId || splittableBatches[0]?.id || ''
  );

  const activeBatch =
    splittableBatches.find((b) => b.id === selectedBatchId) ?? splittableBatches[0];

  const [splitCount, setSplitCount] = useState<number>(3);
  const [allocations, setAllocations] = useState<number[]>(() => {
    const avail = activeBatch?.availableQuantityKg ?? 3000;
    const part = Math.floor(avail / 3);
    return [part, part, avail - part * 2, 0, 0];
  });
  const [confirmReview, setConfirmReview] = useState(false);

  const handleBatchChange = (nextId: string) => {
    setSelectedBatchId(nextId);
    const nextBatch = splittableBatches.find((b) => b.id === nextId);
    if (nextBatch) {
      const part = Math.floor(nextBatch.availableQuantityKg / splitCount);
      const nextAllocs = Array.from({ length: 5 }, (_, idx) => {
        if (idx >= splitCount) return 0;
        if (idx === splitCount - 1) {
          return nextBatch.availableQuantityKg - part * (splitCount - 1);
        }
        return part;
      });
      setAllocations(nextAllocs);
    }
    setConfirmReview(false);
  };

  const handleCountChange = (count: number) => {
    setSplitCount(count);
    if (activeBatch) {
      const part = Math.floor(activeBatch.availableQuantityKg / count);
      const nextAllocs = Array.from({ length: 5 }, (_, idx) => {
        if (idx >= count) return 0;
        if (idx === count - 1) {
          return activeBatch.availableQuantityKg - part * (count - 1);
        }
        return part;
      });
      setAllocations(nextAllocs);
    }
    setConfirmReview(false);
  };

  const activeAllocs = allocations.slice(0, splitCount).map((qty, idx) => ({
    suffix: SUFFIX_LETTERS[idx],
    quantityKg: Number(qty) || 0,
  }));

  const totalAllocated = activeAllocs.reduce((sum, a) => sum + a.quantityKg, 0);
  const availableQty = activeBatch?.availableQuantityKg ?? 0;
  const remainingUnallocated = availableQty - totalAllocated;
  const hasInvalidPositive = activeAllocs.some((a) => a.quantityKg <= 0);
  const exceedsAvailable = totalAllocated > availableQty;
  const isValid =
    Boolean(activeBatch) && !hasInvalidPositive && !exceedsAvailable && totalAllocated > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch || !isValid || !confirmReview) return;
    onExecuteSplit({
      parentBatchId: activeBatch.id,
      allocations: activeAllocs,
    });
    setConfirmReview(false);
  };

  return (
    <div className="space-y-6 max-w-[1160px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Pemecahan Batch
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Pecah batch benih milik {organizationName} menjadi beberapa lot turunan untuk penyaluran terpisah dengan jejak silsilah tetap terhubung.
        </p>
      </div>

      {splittableBatches.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-10 text-center">
          <p className="text-[14px] font-semibold text-[#111827]">
            Tidak ada batch yang tersedia untuk dipecah saat ini.
          </p>
          <p className="text-[13px] text-[#64748B] mt-1">
            Pemecahan batch hanya tersedia untuk stok aktif milik {organizationName}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Configuration & Quantity Allocation */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
                Konfigurasi Batch Asal &amp; Alokasi
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Pilih Batch Induk Milik {organizationName}
                  </label>
                  <select
                    value={activeBatch?.id ?? ''}
                    onChange={(e) => handleBatchChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  >
                    {splittableBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} · {b.variety} (Tersedia {b.availableQuantityKg.toLocaleString('id-ID')} kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[13px]">
                  <div className="text-[#64748B]">Jumlah Awal / Tersedia</div>
                  <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                    {activeBatch?.initialQuantityKg.toLocaleString('id-ID')} kg /{' '}
                    <span className="text-[#00843D]">
                      {availableQty.toLocaleString('id-ID')} kg
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Jumlah Batch Hasil Pemecahan
                  </label>
                  <select
                    value={splitCount}
                    onChange={(e) => handleCountChange(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  >
                    <option value={2}>2 Batch (A, B)</option>
                    <option value={3}>3 Batch (A, B, C)</option>
                    <option value={4}>4 Batch (A, B, C, D)</option>
                    <option value={5}>5 Batch (A, B, C, D, E)</option>
                  </select>
                </div>
              </div>

              {/* Allocation Inputs */}
              <div className="space-y-3 pt-2">
                <div className="text-[13px] font-semibold text-[#111827]">
                  Alokasi Jumlah per Batch Turunan (kg)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeAllocs.map((alloc, idx) => (
                    <div
                      key={alloc.suffix}
                      className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]/70"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-semibold text-[#111827]">
                          Batch {alloc.suffix}
                        </span>
                        <span className="text-[11px] text-[#00843D] font-semibold tabular-nums">
                          {activeBatch?.batchNumber}-{alloc.suffix}
                        </span>
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={availableQty}
                        value={allocations[idx]}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setAllocations((prev) =>
                            prev.map((item, i) => (i === idx ? val : item))
                          );
                        }}
                        className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation & Summary Bar */}
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 text-[13px] ${
                  exceedsAvailable || hasInvalidPositive
                    ? 'bg-[#FEE2E2]/70 border-[#FECACA] text-[#B91C1C]'
                    : 'bg-[#DCFCE7]/60 border-[#BBF7D0] text-[#15803D]'
                }`}
              >
                {exceedsAvailable || hasInvalidPositive ? (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-semibold tabular-nums">
                    Total Alokasi: {totalAllocated.toLocaleString('id-ID')} kg dari{' '}
                    {availableQty.toLocaleString('id-ID')} kg tersedia
                  </div>
                  <div className="text-[12px]">
                    {exceedsAvailable
                      ? `Total alokasi melebihi stok tersedia sebesar ${(
                          totalAllocated - availableQty
                        ).toLocaleString('id-ID')} kg.`
                      : hasInvalidPositive
                      ? 'Setiap batch pecahan harus memiliki jumlah lebih dari 0 kg.'
                      : remainingUnallocated === 0
                      ? 'Seluruh stok tersedia telah teralokasi ke batch pecahan.'
                      : `Sisa ${remainingUnallocated.toLocaleString('id-ID')} kg akan tetap bertahan pada batch induk.`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Relationship Diagram + Review Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
                Struktur Relasi Pemecahan Batch
              </h2>

              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                      Batch Asal
                    </div>
                    <div className="text-[13px] font-bold text-[#111827] tabular-nums">
                      {activeBatch?.batchNumber}
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                    {availableQty.toLocaleString('id-ID')} kg
                  </div>
                </div>

                <div className="ml-6 pl-4 border-l-2 border-[#CBD5E1] mt-3 space-y-2.5">
                  {activeAllocs.map((alloc) => (
                    <div
                      key={alloc.suffix}
                      className="relative flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-[#E2E8F0]"
                    >
                      <span
                        className="absolute -left-4 top-1/2 w-4 h-0.5 bg-[#CBD5E1]"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="text-[12px] font-semibold text-[#111827]">
                          Batch {alloc.suffix}
                        </div>
                        <div className="text-[11px] text-[#64748B] tabular-nums">
                          {activeBatch?.batchNumber}-{alloc.suffix}
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold text-[#111827] tabular-nums">
                        {alloc.quantityKg.toLocaleString('id-ID')} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-[13px] text-[#334155] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={confirmReview}
                  onChange={(e) => setConfirmReview(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#00843D] rounded cursor-pointer"
                />
                <span>
                  Saya telah meninjau alokasi jumlah tiap batch pecahan dan menyetujui pencatatan lot turunan ke Stok Benih.
                </span>
              </label>

              <button
                type="submit"
                disabled={!isValid || !confirmReview}
                className="w-full h-10 rounded-lg bg-[#00843D] hover:bg-[#006B32] disabled:bg-slate-200 disabled:text-slate-500 text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GitFork className="w-4 h-4" />
                <span>Konfirmasi &amp; Pecah Batch</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
