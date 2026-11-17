import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Search,
  Truck,
  X,
} from 'lucide-react';
import {
  DistributionTransfer,
  ProducerBatch,
} from '../../types/producer';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface ProducerDistributionScreenProps {
  batches: ProducerBatch[];
  transfers: DistributionTransfer[];
  preselectedBatchId?: string | null;
  onClearPreselectedBatch?: () => void;
  onCreateTransfer: (payload: {
    batchId: string;
    destinationName: string;
    destinationType: 'Distributor' | 'Koperasi' | 'Kios Tani';
    destinationProvince: string;
    quantityKg: number;
    transferDate: string;
    notes: string;
  }) => void;
  onOpenBatchDetail: (batchId: string) => void;
}

export const ProducerDistributionScreen: React.FC<ProducerDistributionScreenProps> = ({
  batches,
  transfers,
  preselectedBatchId,
  onClearPreselectedBatch,
  onCreateTransfer,
  onOpenBatchDetail,
}) => {
  const [search, setSearch] = useState('');
  const [receiptFilter, setReceiptFilter] = useState<
    'Semua' | 'Menunggu Konfirmasi' | 'Diterima Tujuan'
  >('Semua');

  const eligibleBatches = useMemo(
    () =>
      batches.filter(
        (b) =>
          b.certificationStatus === 'Tersertifikasi' &&
          b.quantityKg > 0 &&
          b.ownershipStatus !== 'Dialihkan ke Distributor'
      ),
    [batches]
  );

  const [modalOpen, setModalOpen] = useState(Boolean(preselectedBatchId));
  const [selectedBatchId, setSelectedBatchId] = useState(
    preselectedBatchId || eligibleBatches[0]?.id || ''
  );
  const [destinationName, setDestinationName] = useState(
    'Koperasi Tani Subur Riau'
  );
  const [destinationType, setDestinationType] = useState<
    'Distributor' | 'Koperasi' | 'Kios Tani'
  >('Koperasi');
  const [destinationProvince, setDestinationProvince] = useState('Riau');
  const [transferQty, setTransferQty] = useState('1500');
  const [transferDate, setTransferDate] = useState('2026-11-16');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeEligibleBatch =
    eligibleBatches.find((b) => b.id === selectedBatchId) ?? eligibleBatches[0];

  const filteredTransfers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transfers.filter((tr) => {
      if (receiptFilter !== 'Semua' && tr.receiptStatus !== receiptFilter) return false;
      if (!q) return true;
      return (
        tr.batchNumber.toLowerCase().includes(q) ||
        tr.destinationName.toLowerCase().includes(q) ||
        tr.waybillNumber.toLowerCase().includes(q) ||
        tr.variety.toLowerCase().includes(q)
      );
    });
  }, [transfers, search, receiptFilter]);

  const stats = useMemo(() => {
    const totalTransferredKg = transfers.reduce((s, t) => s + t.quantityKg, 0);
    const awaitingReceipt = transfers.filter(
      (t) => t.receiptStatus === 'Menunggu Konfirmasi'
    ).length;
    const confirmedReceipt = transfers.filter(
      (t) => t.receiptStatus === 'Diterima Tujuan'
    ).length;
    return {
      totalTransfers: transfers.length,
      totalTransferredKg,
      awaitingReceipt,
      confirmedReceipt,
    };
  }, [transfers]);

  const handleOpenTransferModal = () => {
    const first = eligibleBatches[0];
    setSelectedBatchId(first?.id ?? '');
    setTransferQty(first ? String(Math.min(2000, first.quantityKg)) : '0');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    onClearPreselectedBatch?.();
  };

  const handleSubmitTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEligibleBatch) {
      setErrorMsg('Tidak ada batch tersertifikasi milik organisasi yang tersedia untuk ditransfer.');
      return;
    }
    const qty = Number(transferQty);
    if (!qty || qty <= 0 || qty > activeEligibleBatch.quantityKg) {
      setErrorMsg(
        `Jumlah transfer harus antara 1 kg hingga ${activeEligibleBatch.quantityKg.toLocaleString('id-ID')} kg.`
      );
      return;
    }
    if (!destinationName.trim()) {
      setErrorMsg('Nama distributor atau koperasi tujuan wajib diisi.');
      return;
    }

    onCreateTransfer({
      batchId: activeEligibleBatch.id,
      destinationName: destinationName.trim(),
      destinationType,
      destinationProvince: destinationProvince.trim() || 'Riau',
      quantityKg: qty,
      transferDate,
      notes: notes.trim(),
    });
    setNotes('');
    setErrorMsg(null);
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Distribusi Benih
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Kelola pengalihan kepemilikan batch benih tersertifikasi kepada distributor, koperasi, atau kios tani mitra.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenTransferModal}
          disabled={eligibleBatches.length === 0}
          className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] disabled:bg-slate-200 disabled:text-slate-500 text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Transfer Kepemilikan</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pengalihan"
          value={stats.totalTransfers.toString()}
          trendText="Catatan transfer"
          trendContext="kepemilikan benih"
          icon={Truck}
        />
        <MetricCard
          title="Volume Ditransfer"
          value={`${stats.totalTransferredKg.toLocaleString('id-ID')} kg`}
          trendText="Tersertifikasi"
          trendContext="label resmi BPSB"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Menunggu Konfirmasi"
          value={stats.awaitingReceipt.toString()}
          trendText="Dalam transit"
          trendContext="menunggu resi tujuan"
          trendPositive={false}
          icon={Truck}
        />
        <MetricCard
          title="Batch Siap Transfer"
          value={eligibleBatches.length.toString()}
          trendText="Milik Nursery Tashya"
          trendContext="siap dialihkan"
          icon={CheckCircle2}
        />
      </div>

      {/* Distribution Table Card */}
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
              placeholder="Cari nomor batch, tujuan, atau surat jalan..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div className="inline-flex items-center p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg self-start">
            {(['Semua', 'Menunggu Konfirmasi', 'Diterima Tujuan'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setReceiptFilter(tab)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  receiptFilter === tab
                    ? 'bg-[#00843D] text-white'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-3 whitespace-nowrap">Tujuan Distributor / Koperasi</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Jumlah Ditransfer</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Transfer</th>
                <th className="py-3 px-3 whitespace-nowrap">Status Kepemilikan</th>
                <th className="py-3 pl-3 pr-5 whitespace-nowrap">Konfirmasi Terima</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-[13px] text-[#64748B]">
                    Belum ada catatan distribusi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((tr) => (
                  <tr
                    key={tr.id}
                    className="h-[56px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors"
                  >
                    <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenBatchDetail(tr.batchId)}
                        className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                      >
                        {tr.batchNumber}
                      </button>
                      <div className="text-[12px] text-[#64748B] tabular-nums">
                        {tr.variety} · {tr.waybillNumber}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-[13px] font-medium text-[#111827]">
                        {tr.destinationName}
                      </div>
                      <div className="text-[12px] text-[#64748B]">
                        {tr.destinationType} · {tr.destinationProvince}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                      {tr.quantityKg.toLocaleString('id-ID')} kg
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                      {tr.transferDate}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={tr.ownershipStatus} />
                    </td>
                    <td className="py-2.5 pl-3 pr-5 whitespace-nowrap">
                      <StatusBadge status={tr.receiptStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ownership Transfer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
            onClick={handleCloseModal}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-[520px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Inisiasi Transfer Kepemilikan Benih
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Hanya batch tersertifikasi milik Nursery Tashya yang dapat dialihkan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-lg text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTransfer} className="p-6 space-y-4">
              {errorMsg && (
                <div className="px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px]">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Pilih Batch Tersertifikasi
                </label>
                <select
                  value={activeEligibleBatch?.id ?? ''}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setSelectedBatchId(nextId);
                    const found = eligibleBatches.find((b) => b.id === nextId);
                    if (found) {
                      setTransferQty(String(Math.min(2000, found.quantityKg)));
                    }
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                >
                  {eligibleBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchNumber} · {b.variety} (Tersedia {b.quantityKg.toLocaleString('id-ID')} kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Nama Distributor / Koperasi Tujuan
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Jenis Penerima
                  </label>
                  <select
                    value={destinationType}
                    onChange={(e) =>
                      setDestinationType(
                        e.target.value as 'Distributor' | 'Koperasi' | 'Kios Tani'
                      )
                    }
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  >
                    <option value="Koperasi">Koperasi</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Kios Tani">Kios Tani</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Jumlah (kg)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={activeEligibleBatch?.quantityKg ?? 1}
                    value={transferQty}
                    onChange={(e) => setTransferQty(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Tanggal Transfer
                  </label>
                  <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Provinsi Tujuan
                  </label>
                  <input
                    type="text"
                    value={destinationProvince}
                    onChange={(e) => setDestinationProvince(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Catatan Pengiriman
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan armada, jumlah kemasan, atau instruksi serah terima..."
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Kirim Transfer Kepemilikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
