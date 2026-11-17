import React, { useMemo, useState } from 'react';
import { Check, CheckCircle2, Search, Truck } from 'lucide-react';
import {
  DistributionDestType,
  DistributorDistributionRecord,
  DistributorInventoryBatch,
} from '../../types/distributor';
import { StatusBadge } from '../ui/StatusBadge';

interface DistributorDistributionScreenProps {
  organizationName: string;
  inventory: DistributorInventoryBatch[];
  distributions: DistributorDistributionRecord[];
  preselectedBatchId?: string | null;
  onCreateDistribution: (payload: {
    batchId: string;
    recipientName: string;
    recipientType: DistributionDestType;
    recipientDetails: string;
    quantityKg: number;
    transferDate: string;
    notes: string;
  }) => void;
  onConfirmRecipientReceipt: (distId: string) => void;
}

export const DistributorDistributionScreen: React.FC<
  DistributorDistributionScreenProps
> = ({
  organizationName,
  inventory,
  distributions,
  preselectedBatchId,
  onCreateDistribution,
  onConfirmRecipientReceipt,
}) => {
  const availableBatches = useMemo(
    () =>
      inventory.filter(
        (b) =>
          b.currentOwner === organizationName &&
          b.availableQuantityKg > 0 &&
          b.batchStatus !== 'Dipecah'
      ),
    [inventory, organizationName]
  );

  const [activeTab, setActiveTab] = useState<'form' | 'history'>(
    preselectedBatchId ? 'form' : 'form'
  );
  const [selectedBatchId, setSelectedBatchId] = useState(
    preselectedBatchId || availableBatches[0]?.id || ''
  );
  const [recipientName, setRecipientName] = useState('Kelompok Tani Karya Mandiri');
  const [recipientType, setRecipientType] = useState<DistributionDestType>(
    'Petani / Kelompok Tani'
  );
  const [recipientDetails, setRecipientDetails] = useState(
    'Desa Tambang, Kab. Kampar · Ketua: Bpk. Ridwan (+62 812-7704-129)'
  );
  const [quantityKg, setQuantityKg] = useState('500');
  const [transferDate, setTransferDate] = useState('2026-11-16');
  const [notes, setNotes] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState('');

  const activeBatch =
    availableBatches.find((b) => b.id === selectedBatchId) ?? availableBatches[0];

  const filteredHistory = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    return distributions.filter((d) => {
      if (!q) return true;
      return (
        d.batchNumber.toLowerCase().includes(q) ||
        d.recipientName.toLowerCase().includes(q) ||
        d.variety.toLowerCase().includes(q)
      );
    });
  }, [distributions, historySearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch) {
      setErrorMsg('Tidak ada stok batch tersedia untuk didistribusikan.');
      return;
    }
    const qty = Number(quantityKg);
    if (!qty || qty <= 0 || qty > activeBatch.availableQuantityKg) {
      setErrorMsg(
        `Jumlah distribusi harus antara 1 kg hingga ${activeBatch.availableQuantityKg.toLocaleString('id-ID')} kg.`
      );
      return;
    }
    if (!recipientName.trim() || !recipientDetails.trim()) {
      setErrorMsg('Informasi penerima tujuan wajib diisi lengkap.');
      return;
    }
    if (!confirmChecked) {
      setErrorMsg('Centang konfirmasi tinjauan distribusi sebelum mengirimkan data.');
      return;
    }

    setErrorMsg(null);
    onCreateDistribution({
      batchId: activeBatch.id,
      recipientName: recipientName.trim(),
      recipientType,
      recipientDetails: recipientDetails.trim(),
      quantityKg: qty,
      transferDate,
      notes: notes.trim(),
    });
    setConfirmChecked(false);
    setNotes('');
    setActiveTab('history');
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Distribusi Benih
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Salurkan stok benih tersertifikasi kepada petani, kelompok tani, atau kios penyalur dan pantau riwayat pengirimannya.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-white border border-[#E2E8F0] rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'form'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Formulir Distribusi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Riwayat Distribusi ({distributions.length})
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1. Informasi Batch */}
          <section
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              1. Informasi Batch Sumber
            </h2>

            {availableBatches.length === 0 ? (
              <p className="text-[13px] text-[#64748B]">
                Belum ada batch tersedia di stok {organizationName}. Konfirmasi penerimaan batch masuk terlebih dahulu.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Pilih Batch Tersedia
                  </label>
                  <select
                    value={activeBatch?.id ?? ''}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  >
                    {availableBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} · {b.variety} (Tersedia {b.availableQuantityKg.toLocaleString('id-ID')} kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[13px]">
                  <div className="text-[#64748B]">Nomor Batch &amp; Varietas</div>
                  <div className="font-semibold text-[#111827] mt-0.5 tabular-nums">
                    {activeBatch?.batchNumber} · {activeBatch?.variety}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F0FAF3] border border-[#BBF7D0] text-[13px]">
                  <div className="text-[#006B32]">Stok Tersedia Saat Ini</div>
                  <div className="font-bold text-[#00843D] text-[16px] mt-0.5 tabular-nums">
                    {activeBatch?.availableQuantityKg.toLocaleString('id-ID')} kg
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 2. Informasi Tujuan */}
          <section
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              2. Informasi Tujuan Penerima
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Nama Petani atau Organisasi Penerima
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Jenis Penerima
                </label>
                <select
                  value={recipientType}
                  onChange={(e) =>
                    setRecipientType(e.target.value as DistributionDestType)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                >
                  <option value="Petani / Kelompok Tani">Petani / Kelompok Tani</option>
                  <option value="Kios Tani Mitra">Kios Tani Mitra</option>
                  <option value="Sub-Penyalur Resmi">Sub-Penyalur Resmi</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Detail Penerima (Alamat, Kecamatan &amp; Kontak)
                </label>
                <input
                  type="text"
                  value={recipientDetails}
                  onChange={(e) => setRecipientDetails(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>
            </div>
          </section>

          {/* 3. Detail Distribusi */}
          <section
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              3. Detail Distribusi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Jumlah Didistribusikan (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  max={activeBatch?.availableQuantityKg ?? 1}
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Tanggal Distribusi
                </label>
                <input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan armada pengangkut, nomor kemasan, atau jadwal tanam..."
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>
            </div>
          </section>

          {/* 4. Review & Konfirmasi */}
          <section
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              4. Review &amp; Konfirmasi Pengiriman
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[13px]">
              <div>
                <div className="text-[#64748B]">Organisasi Sumber</div>
                <div className="font-semibold text-[#111827] mt-0.5">{organizationName}</div>
              </div>
              <div>
                <div className="text-[#64748B]">Penerima Tujuan</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {recipientName || '-'}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Batch &amp; Varietas</div>
                <div className="font-semibold text-[#111827] mt-0.5 tabular-nums">
                  {activeBatch?.batchNumber ?? '-'} · {activeBatch?.variety ?? '-'}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Jumlah Transfer</div>
                <div className="font-bold text-[#00843D] mt-0.5 tabular-nums">
                  {Number(quantityKg || 0).toLocaleString('id-ID')} kg
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-[13px] text-[#334155] cursor-pointer">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#00843D] rounded cursor-pointer"
              />
              <span>
                Saya memastikan informasi batch, jumlah benih, dan penerima tujuan sudah benar untuk dicatat dalam jejak distribusi BenihNusa Track.
              </span>
            </label>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={availableBatches.length === 0}
                className="h-10 px-5 rounded-lg bg-[#00843D] hover:bg-[#006B32] disabled:bg-slate-200 disabled:text-slate-500 text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Kirim Distribusi Benih</span>
              </button>
            </div>
          </section>
        </form>
      ) : (
        /* Distribution History Table */
        <div
          className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
            <div className="relative w-full max-w-[340px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Cari nomor batch, penerima, atau varietas..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                  <th className="py-3 pl-5 pr-3 whitespace-nowrap">Nomor Batch</th>
                  <th className="py-3 px-3 whitespace-nowrap">Penerima</th>
                  <th className="py-3 px-3 whitespace-nowrap text-right">Jumlah</th>
                  <th className="py-3 px-3 whitespace-nowrap">Tanggal Transfer</th>
                  <th className="py-3 px-3 whitespace-nowrap">Status Kepemilikan</th>
                  <th className="py-3 px-3 whitespace-nowrap">Status Konfirmasi Terima</th>
                  <th className="py-3 pl-3 pr-5 whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((dist) => (
                  <tr
                    key={dist.id}
                    className="h-[56px] border-b border-[#F1F5F9] last:border-b-0 bg-white hover:bg-[#F0FAF3] transition-colors"
                  >
                    <td className="py-2.5 pl-5 pr-3 whitespace-nowrap">
                      <div className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                        {dist.batchNumber}
                      </div>
                      <div className="text-[12px] text-[#64748B]">{dist.variety}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-[13px] font-medium text-[#111827]">
                        {dist.recipientName}
                      </div>
                      <div className="text-[12px] text-[#64748B] truncate max-w-[220px]">
                        {dist.recipientDetails}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                      {dist.quantityKg.toLocaleString('id-ID')} kg
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                      {dist.transferDate}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={dist.ownershipStatus} />
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={dist.receiptConfirmationStatus} />
                    </td>
                    <td className="py-2.5 pl-3 pr-5 whitespace-nowrap text-right">
                      {dist.receiptConfirmationStatus === 'Menunggu Konfirmasi' ? (
                        <button
                          type="button"
                          onClick={() => onConfirmRecipientReceipt(dist.id)}
                          className="h-8 px-2.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Catat Diterima</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#15803D] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
