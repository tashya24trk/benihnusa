import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  FarmerIncomingBatch,
  ReceptionStatus,
  SeedConditionOption,
} from '../../types/farmer';
import { StatusBadge } from '../ui/StatusBadge';

interface FarmerReceptionScreenProps {
  mode: 'reception' | 'reception-confirm';
  incomingBatches: FarmerIncomingBatch[];
  selectedIncoming: FarmerIncomingBatch | null;
  onOpenConfirmForm: (batchId: string) => void;
  onBackToList: () => void;
  onSubmitReception: (payload: {
    incomingId: string;
    decision: 'Diterima' | 'Dilaporkan Bermasalah';
    receivedQuantityKg: number;
    receptionDate: string;
    seedCondition: SeedConditionOption;
    notes: string;
  }) => void;
}

const CONDITION_OPTIONS: SeedConditionOption[] = [
  'Baik & Kemasan Utuh',
  'Kemasan Rusak / Segel Terbuka',
  'Benih Lembab / Berjamur',
  'Jumlah Tidak Sesuai',
];

export const FarmerReceptionScreen: React.FC<FarmerReceptionScreenProps> = ({
  mode,
  incomingBatches,
  selectedIncoming,
  onOpenConfirmForm,
  onBackToList,
  onSubmitReception,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | ReceptionStatus>('Semua');

  // Form states
  const [receivedQty, setReceivedQty] = useState('');
  const [receptionDate, setReceptionDate] = useState('2026-11-16');
  const [seedCondition, setSeedCondition] =
    useState<SeedConditionOption>('Baik & Kemasan Utuh');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Confirmation modal state
  const [pendingDecision, setPendingDecision] = useState<
    'Diterima' | 'Dilaporkan Bermasalah' | null
  >(null);

  useEffect(() => {
    if (selectedIncoming) {
      setReceivedQty(
        String(selectedIncoming.receivedQuantityKg ?? selectedIncoming.quantitySentKg)
      );
      setReceptionDate(selectedIncoming.receptionDate ?? '2026-11-16');
      setSeedCondition(selectedIncoming.seedCondition ?? 'Baik & Kemasan Utuh');
      setNotes(selectedIncoming.notes ?? '');
      setFormError('');
      setPendingDecision(null);
    }
  }, [selectedIncoming]);

  if (mode === 'reception-confirm' && selectedIncoming) {
    const isAlreadyProcessed = selectedIncoming.receptionStatus !== 'Menunggu Konfirmasi';

    const validateAndAskConfirm = (decision: 'Diterima' | 'Dilaporkan Bermasalah') => {
      const qtyNum = Number(receivedQty);
      if (!Number.isFinite(qtyNum) || qtyNum < 0) {
        setFormError('Masukkan jumlah benih diterima dalam satuan kg dengan benar.');
        return;
      }
      if (decision === 'Diterima' && qtyNum === 0) {
        setFormError('Kuantitas benih diterima harus lebih dari 0 kg.');
        return;
      }
      if (!receptionDate) {
        setFormError('Tanggal penerimaan wajib diisi.');
        return;
      }
      if (decision === 'Dilaporkan Bermasalah' && !notes.trim()) {
        setFormError(
          'Mohon tuliskan keterangan masalah pada kolom catatan agar penyalur dapat menindaklanjuti.'
        );
        return;
      }
      setFormError('');
      setPendingDecision(decision);
    };

    const handleConfirmModalSubmit = () => {
      if (!pendingDecision) return;
      onSubmitReception({
        incomingId: selectedIncoming.id,
        decision: pendingDecision,
        receivedQuantityKg: Number(receivedQty),
        receptionDate,
        seedCondition,
        notes: notes.trim(),
      });
      setPendingDecision(null);
    };

    return (
      <div className="space-y-6 max-w-[920px]">
        <div>
          <button
            type="button"
            onClick={onBackToList}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Penerimaan</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
              Konfirmasi Penerimaan Benih
            </h1>
            <StatusBadge status={selectedIncoming.receptionStatus} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Periksa kesesuaian karung, label sertifikat, dan jumlah kiriman sebelum mengonfirmasi penerimaan.
          </p>
        </div>

        {/* Batch Information Card */}
        <div
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Informasi Pengiriman dari Penyalur
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[13px]">
            <div>
              <div className="text-[#64748B]">Nomor Batch</div>
              <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                {selectedIncoming.batchNumber}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Bahan Tanam &amp; Komoditas</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {selectedIncoming.variety} ({selectedIncoming.commodity})
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Kelas Benih</div>
              <div className="font-medium text-[#111827] mt-0.5">
                {selectedIncoming.seedClass}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Distributor / Koperasi</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {selectedIncoming.distributorName}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Produsen Asal</div>
              <div className="font-medium text-[#111827] mt-0.5">
                {selectedIncoming.producerName}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Nomor Sertifikat</div>
              <div className="font-semibold text-[#00843D] tabular-nums mt-0.5">
                {selectedIncoming.certificateNumber}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Kuantitas Dikirim</div>
              <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                {selectedIncoming.quantitySentKg.toLocaleString('id-ID')} kg
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Tanggal Pengiriman</div>
              <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                {selectedIncoming.transferDate}
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            {isAlreadyProcessed
              ? 'Ringkasan Berita Acara Penerimaan'
              : 'Formulir Penerimaan oleh Petani'}
          </h2>

          {formError && (
            <div className="p-3.5 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Kuantitas Benih Diterima (kg)
              </label>
              <input
                type="number"
                min={0}
                step="0.5"
                disabled={isAlreadyProcessed}
                value={receivedQty}
                onChange={(e) => setReceivedQty(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums disabled:bg-slate-50 disabled:text-[#64748B] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Tanggal Penerimaan
              </label>
              <input
                type="date"
                disabled={isAlreadyProcessed}
                value={receptionDate}
                onChange={(e) => setReceptionDate(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums disabled:bg-slate-50 disabled:text-[#64748B] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Kondisi Fisik &amp; Kemasan Benih
              </label>
              <select
                disabled={isAlreadyProcessed}
                value={seedCondition}
                onChange={(e) =>
                  setSeedCondition(e.target.value as SeedConditionOption)
                }
                className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] disabled:bg-slate-50 disabled:text-[#64748B] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Catatan Penerimaan / Ketidaksesuaian
              </label>
              <textarea
                rows={3}
                disabled={isAlreadyProcessed}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: 5 karung diterima utuh bersegel label biru BPSB. Atau jelaskan jika ada kemasan robek / kurang jumlah..."
                className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] disabled:bg-slate-50 disabled:text-[#64748B] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>

          {!isAlreadyProcessed ? (
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => validateAndAskConfirm('Dilaporkan Bermasalah')}
                className="min-h-[46px] px-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#B91C1C] text-[13px] font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Laporkan Ketidaksesuaian</span>
              </button>

              <button
                type="button"
                onClick={() => validateAndAskConfirm('Diterima')}
                className="min-h-[46px] px-5 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Penerimaan</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[13px] text-[#334155]">
                <ShieldCheck className="w-5 h-5 text-[#00843D] shrink-0" />
                <span>
                  Penerimaan batch ini telah tercatat pada{' '}
                  <strong className="tabular-nums">{selectedIncoming.receptionDate}</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={onBackToList}
                className="min-h-[40px] px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#111827] whitespace-nowrap cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}
        </div>

        {/* Confirmation Dialog Modal */}
        {pendingDecision && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]">
            <div className="bg-white rounded-xl border border-[#E2E8F0] w-full max-w-[440px] p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      pendingDecision === 'Diterima'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : 'bg-[#FEE2E2] text-[#B91C1C]'
                    }`}
                  >
                    {pendingDecision === 'Diterima' ? (
                      <PackageCheck className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#111827]">
                    {pendingDecision === 'Diterima'
                      ? 'Konfirmasi Penerimaan Benih?'
                      : 'Kirim Laporan Ketidaksesuaian?'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingDecision(null)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#111827]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-[13px]">
                <div className="flex justify-between gap-2">
                  <span className="text-[#64748B]">Batch:</span>
                  <span className="font-bold text-[#111827] tabular-nums">
                    {selectedIncoming.batchNumber}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#64748B]">Bahan Tanam:</span>
                  <span className="font-semibold text-[#111827]">
                    {selectedIncoming.variety}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#64748B]">Jumlah Diterima:</span>
                  <span className="font-bold text-[#111827] tabular-nums">
                    {Number(receivedQty).toLocaleString('id-ID')} kg
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#64748B]">Kondisi:</span>
                  <span className="font-medium text-[#111827]">{seedCondition}</span>
                </div>
              </div>

              <p className="text-[13px] text-[#64748B] leading-relaxed">
                {pendingDecision === 'Diterima'
                  ? 'Benih akan otomatis ditambahkan ke daftar Benih Saya untuk diverifikasi QR dan dicatat penanamannya.'
                  : 'Status penerimaan akan ditandai bermasalah dan diteruskan ke distributor terkait untuk pemeriksaan ulang.'}
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingDecision(null)}
                  className="min-h-[42px] px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[13px] font-semibold text-[#334155] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmModalSubmit}
                  className={`min-h-[42px] px-4 rounded-lg text-white text-[13px] font-semibold cursor-pointer ${
                    pendingDecision === 'Diterima'
                      ? 'bg-[#00843D] hover:bg-[#006B32]'
                      : 'bg-[#B91C1C] hover:bg-[#991B1B]'
                  }`}
                >
                  Ya, Simpan Keputusan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Incoming List View
  const filtered = incomingBatches.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.batchNumber.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.distributorName.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'Semua' || item.receptionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = incomingBatches.filter(
    (b) => b.receptionStatus === 'Menunggu Konfirmasi'
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Penerimaan Benih
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Konfirmasi batch benih yang dikirim oleh Koperasi atau laporkan jika kemasan maupun jumlah tidak sesuai.
        </p>
      </div>

      {pendingCount > 0 && (
        <div className="p-4 rounded-xl bg-[#FEF3C7]/70 border border-[#FDE68A] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[13px] text-[#92400E]">
            <PackageCheck className="w-5 h-5 shrink-0" />
            <span>
              Terdapat <strong className="tabular-nums">{pendingCount}</strong> pengiriman benih yang menunggu konfirmasi penerimaan Anda.
            </span>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor batch, bahan tanam, atau penyalur..."
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'Semua' | ReceptionStatus)
          }
          className="h-11 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
        >
          <option value="Semua">Semua Status</option>
          <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
          <option value="Diterima">Diterima</option>
          <option value="Dilaporkan Bermasalah">Dilaporkan Bermasalah</option>
        </select>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[14px] font-bold text-[#111827] tabular-nums">
                  {item.batchNumber}
                </div>
                <div className="text-[13px] font-medium text-[#334155]">
                  {item.variety}
                </div>
              </div>
              <StatusBadge status={item.receptionStatus} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[12px] pt-2 border-t border-[#F1F5F9]">
              <div>
                <span className="text-[#64748B] block">Distributor</span>
                <span className="font-medium text-[#111827]">
                  {item.distributorName}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Kuantitas</span>
                <span className="font-semibold text-[#111827] tabular-nums">
                  {item.quantitySentKg.toLocaleString('id-ID')} kg
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Tanggal Kirim</span>
                <span className="font-medium text-[#111827] tabular-nums">
                  {item.transferDate}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">No. Sertifikat</span>
                <span className="font-medium text-[#00843D] tabular-nums">
                  {item.certificateNumber}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenConfirmForm(item.id)}
              className={`w-full min-h-[44px] rounded-xl text-[13px] font-semibold cursor-pointer ${
                item.receptionStatus === 'Menunggu Konfirmasi'
                  ? 'bg-[#00843D] text-white hover:bg-[#006B32]'
                  : 'border border-[#E2E8F0] bg-[#F8FAFC] text-[#111827]'
              }`}
            >
              {item.receptionStatus === 'Menunggu Konfirmasi'
                ? 'Konfirmasi Penerimaan'
                : 'Lihat Berita Acara'}
            </button>
          </div>
        ))}
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
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[12px] font-semibold text-[#64748B]">
                <th className="py-3 px-4">Nomor Batch</th>
                <th className="py-3 px-4">Distributor</th>
                <th className="py-3 px-4">Bahan Tanam</th>
                <th className="py-3 px-4 text-right">Kuantitas</th>
                <th className="py-3 px-4">Tanggal Kirim</th>
                <th className="py-3 px-4">Status Penerimaan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#64748B]">
                    Tidak ada data pengiriman benih yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#111827] tabular-nums whitespace-nowrap">
                      {item.batchNumber}
                    </td>
                    <td className="py-3.5 px-4 text-[#334155]">{item.distributorName}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#111827]">{item.variety}</div>
                      <div className="text-[11px] text-[#64748B]">{item.commodity}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#111827] tabular-nums whitespace-nowrap">
                      {item.quantitySentKg.toLocaleString('id-ID')} kg
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap">
                      {item.transferDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.receptionStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenConfirmForm(item.id)}
                        className={`h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer ${
                          item.receptionStatus === 'Menunggu Konfirmasi'
                            ? 'bg-[#00843D] hover:bg-[#006B32] text-white'
                            : 'border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#111827]'
                        }`}
                      >
                        {item.receptionStatus === 'Menunggu Konfirmasi'
                          ? 'Konfirmasi'
                          : 'Lihat Detail'}
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
