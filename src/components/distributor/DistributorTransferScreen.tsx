import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Plus,
  X,
} from 'lucide-react';
import {
  DistributorInventoryBatch,
  DistributorOwnershipTransfer,
} from '../../types/distributor';
import { StatusBadge } from '../ui/StatusBadge';

interface DistributorTransferScreenProps {
  organizationName: string;
  inventory: DistributorInventoryBatch[];
  transfers: DistributorOwnershipTransfer[];
  onCreateTransfer: (payload: {
    batchId: string;
    receivingParty: string;
    receivingType: string;
    quantityKg: number;
    transferDate: string;
  }) => void;
  onConfirmTransferDone: (transferId: string) => void;
}

export const DistributorTransferScreen: React.FC<
  DistributorTransferScreenProps
> = ({
  organizationName,
  inventory,
  transfers,
  onCreateTransfer,
  onConfirmTransferDone,
}) => {
  const [selectedId, setSelectedId] = useState<string>(transfers[0]?.id ?? '');
  const [modalOpen, setModalOpen] = useState(false);

  const ownedBatches = inventory.filter(
    (b) =>
      b.currentOwner === organizationName &&
      b.availableQuantityKg > 0 &&
      b.batchStatus !== 'Dipecah'
  );

  const [batchId, setBatchId] = useState(ownedBatches[0]?.id ?? '');
  const [receivingParty, setReceivingParty] = useState('Koperasi Tani Jaya Pelalawan');
  const [receivingType, setReceivingType] = useState('Koperasi / Mitra Penyalur');
  const [quantityKg, setQuantityKg] = useState('1000');
  const [transferDate, setTransferDate] = useState('2026-11-16');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeTransfer =
    transfers.find((t) => t.id === selectedId) ?? transfers[0] ?? null;

  const activeFormBatch =
    ownedBatches.find((b) => b.id === batchId) ?? ownedBatches[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFormBatch) {
      setErrorMsg('Tidak ada stok batch milik organisasi yang tersedia untuk transfer kepemilikan.');
      return;
    }
    const qty = Number(quantityKg);
    if (!qty || qty <= 0 || qty > activeFormBatch.availableQuantityKg) {
      setErrorMsg(
        `Jumlah transfer harus antara 1 kg hingga ${activeFormBatch.availableQuantityKg.toLocaleString('id-ID')} kg.`
      );
      return;
    }
    if (!receivingParty.trim()) {
      setErrorMsg('Nama organisasi atau petani penerima wajib diisi.');
      return;
    }
    setErrorMsg(null);
    onCreateTransfer({
      batchId: activeFormBatch.id,
      receivingParty: receivingParty.trim(),
      receivingType,
      quantityKg: qty,
      transferDate,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Transfer Kepemilikan
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Kelola pengalihan hak milik batch benih dari {organizationName} kepada penerima sah beserta riwayat konfirmasinya.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setBatchId(ownedBatches[0]?.id ?? '');
            setQuantityKg(
              ownedBatches[0]
                ? String(Math.min(1000, ownedBatches[0].availableQuantityKg))
                : '0'
            );
            setErrorMsg(null);
            setModalOpen(true);
          }}
          disabled={ownedBatches.length === 0}
          className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] disabled:bg-slate-200 disabled:text-slate-500 text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Transfer Kepemilikan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Transfers Table */}
        <div
          className="xl:col-span-7 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
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
                  <th className="py-3 px-3 whitespace-nowrap">Pemilik Saat Ini</th>
                  <th className="py-3 px-3 whitespace-nowrap">Penerima</th>
                  <th className="py-3 px-3 whitespace-nowrap text-right">Jumlah</th>
                  <th className="py-3 px-3 whitespace-nowrap">Tanggal</th>
                  <th className="py-3 pl-3 pr-5 whitespace-nowrap">Status Transfer</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((tr) => {
                  const isSelected = activeTransfer?.id === tr.id;
                  return (
                    <tr
                      key={tr.id}
                      onClick={() => setSelectedId(tr.id)}
                      className={`h-[56px] border-b border-[#F1F5F9] last:border-b-0 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#F0FAF3]' : 'bg-white hover:bg-[#F0FAF3]/60'
                      }`}
                    >
                      <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                          {tr.batchNumber}
                        </div>
                        <div className="text-[11px] text-[#64748B] tabular-nums">
                          {tr.transferCode}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#111827]">
                        {tr.currentOwner}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-[13px] font-medium text-[#111827]">
                          {tr.receivingParty}
                        </div>
                        <div className="text-[12px] text-[#64748B]">{tr.receivingType}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                        {tr.quantityKg.toLocaleString('id-ID')} kg
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                        {tr.transferDate}
                      </td>
                      <td className="py-2.5 pl-3 pr-5 whitespace-nowrap">
                        <StatusBadge status={tr.transferStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Ownership Transfer Timeline */}
        {activeTransfer && (
          <div
            className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-[#00843D]" />
                  <h2 className="text-[16px] font-semibold text-[#111827] tabular-nums">
                    {activeTransfer.transferCode}
                  </h2>
                </div>
                <p className="text-[13px] text-[#64748B] mt-1">
                  {activeTransfer.batchNumber} · {activeTransfer.variety} (
                  {activeTransfer.quantityKg.toLocaleString('id-ID')} kg)
                </p>
              </div>
              <StatusBadge status={activeTransfer.transferStatus} />
            </div>

            <div className="space-y-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                Timeline &amp; Riwayat Konfirmasi Kepemilikan
              </h3>
              <div className="space-y-4">
                {activeTransfer.confirmationHistory.map((ev, idx) => (
                  <div key={ev.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          ev.completed
                            ? 'bg-[#00843D] text-white'
                            : 'bg-slate-100 border border-[#CBD5E1] text-[#64748B]'
                        }`}
                      >
                        {ev.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      {idx < activeTransfer.confirmationHistory.length - 1 && (
                        <div className="w-px flex-1 bg-[#E2E8F0] my-1 min-h-[20px]" />
                      )}
                    </div>
                    <div className="pb-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-semibold text-[#111827]">
                          {ev.title}
                        </span>
                        <span className="text-[11px] text-[#64748B] tabular-nums">
                          {ev.timestamp}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#64748B] mt-0.5">{ev.actor}</div>
                      <p className="text-[12px] text-[#334155] mt-0.5 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeTransfer.transferStatus === 'Dalam Proses' && (
              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="button"
                  onClick={() => onConfirmTransferDone(activeTransfer.id)}
                  className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sahkan Serah Terima Kepemilikan</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Transfer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-[500px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#111827]">
                Transfer Kepemilikan Baru
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[12px] font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Pilih Batch Milik {organizationName}
                </label>
                <select
                  value={activeFormBatch?.id ?? ''}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                >
                  {ownedBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchNumber} · {b.variety} (Tersedia {b.availableQuantityKg.toLocaleString('id-ID')} kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Organisasi / Petani Penerima
                  </label>
                  <input
                    type="text"
                    value={receivingParty}
                    onChange={(e) => setReceivingParty(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Kategori Penerima
                  </label>
                  <select
                    value={receivingType}
                    onChange={(e) => setReceivingType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  >
                    <option value="Koperasi / Mitra Penyalur">Koperasi / Mitra Penyalur</option>
                    <option value="Petani / Kelompok Tani">Petani / Kelompok Tani</option>
                    <option value="Kios Tani Mitra">Kios Tani Mitra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Jumlah Transfer (kg)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={activeFormBatch?.availableQuantityKg ?? 1}
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
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
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Proses Transfer Kepemilikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
