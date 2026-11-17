import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileEdit,
  Plus,
  Save,
  Search,
  Send,
  Sprout,
} from 'lucide-react';
import {
  FarmerPlantingRecord,
  FarmerSeedBatch,
  PlantingCorrectionRequest,
  PlantingRecordStatus,
} from '../../types/farmer';
import { StatusBadge } from '../ui/StatusBadge';

interface FarmerPlantingScreenProps {
  mode: 'planting' | 'planting-form' | 'planting-detail';
  seeds: FarmerSeedBatch[];
  plantings: FarmerPlantingRecord[];
  corrections: PlantingCorrectionRequest[];
  selectedRecord: FarmerPlantingRecord | null;
  preselectedBatchId?: string | null;
  onNavigateList: () => void;
  onStartNewForm: (batchId?: string) => void;
  onOpenDetail: (recordId: string) => void;
  onResumeDraft: (recordId: string) => void;
  onRequestCorrection: (recordId: string) => void;
  onSavePlanting: (payload: {
    draftId?: string;
    batchId: string;
    plantingDate: string;
    location: string;
    plantedQuantityKg: number;
    landAreaHa: number;
    notes: string;
    submitType: 'Draf' | 'Tercatat';
  }) => void;
}

export const FarmerPlantingScreen: React.FC<FarmerPlantingScreenProps> = ({
  mode,
  seeds,
  plantings,
  corrections,
  selectedRecord,
  preselectedBatchId,
  onNavigateList,
  onStartNewForm,
  onOpenDetail,
  onResumeDraft,
  onRequestCorrection,
  onSavePlanting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | PlantingRecordStatus>('Semua');

  // Form states
  const verifiedSeeds = seeds.filter(
    (s) => s.verificationStatus === 'Terverifikasi'
  );
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [plantingDate, setPlantingDate] = useState('2026-11-16');
  const [location, setLocation] = useState('');
  const [plantedQuantityKg, setPlantedQuantityKg] = useState('');
  const [landAreaHa, setLandAreaHa] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (mode !== 'planting-form') return;

    if (selectedRecord && selectedRecord.status === 'Draf') {
      setSelectedBatchId(selectedRecord.batchId);
      setPlantingDate(selectedRecord.plantingDate);
      setLocation(selectedRecord.location);
      setPlantedQuantityKg(String(selectedRecord.plantedQuantityKg));
      setLandAreaHa(String(selectedRecord.landAreaHa));
      setNotes(selectedRecord.notes);
      setFormError('');
      return;
    }

    const defaultBatch =
      verifiedSeeds.find((s) => s.id === preselectedBatchId) ??
      verifiedSeeds.find((s) => s.receivedQuantityKg - s.plantedQuantityKg > 0) ??
      verifiedSeeds[0];

    setSelectedBatchId(defaultBatch?.id ?? '');
    setPlantingDate('2026-11-16');
    setLocation('Petak Sawah Desa Pulau Lawas');
    setPlantedQuantityKg(
      defaultBatch
        ? String(
            Math.max(
              0,
              Math.min(50, defaultBatch.receivedQuantityKg - defaultBatch.plantedQuantityKg)
            ) || ''
          )
        : ''
    );
    setLandAreaHa('1.0');
    setNotes('');
    setFormError('');
  }, [mode, selectedRecord, preselectedBatchId, seeds]);

  if (mode === 'planting-form') {
    const activeBatch = seeds.find((s) => s.id === selectedBatchId) ?? null;
    const availableKg = activeBatch
      ? Math.max(0, activeBatch.receivedQuantityKg - activeBatch.plantedQuantityKg)
      : 0;

    const handleFormAction = (submitType: 'Draf' | 'Tercatat') => {
      if (!activeBatch) {
        setFormError('Pilih batch benih yang sudah terverifikasi terlebih dahulu.');
        return;
      }
      if (!plantingDate) {
        setFormError('Tanggal tanam wajib diisi.');
        return;
      }
      if (!location.trim()) {
        setFormError('Lokasi lahan atau nama petak sawah wajib diisi.');
        return;
      }
      const qtyNum = Number(plantedQuantityKg);
      if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
        setFormError('Jumlah benih ditanam harus lebih dari 0 kg.');
        return;
      }
      if (qtyNum > availableKg) {
        setFormError(
          `Jumlah melebihi sisa benih yang tersedia pada batch ini (${availableKg.toLocaleString('id-ID')} kg).`
        );
        return;
      }
      const areaNum = Number(landAreaHa);
      if (!Number.isFinite(areaNum) || areaNum <= 0) {
        setFormError('Luas lahan harus lebih dari 0 hektar.');
        return;
      }

      setFormError('');
      onSavePlanting({
        draftId: selectedRecord?.status === 'Draf' ? selectedRecord.id : undefined,
        batchId: activeBatch.id,
        plantingDate,
        location: location.trim(),
        plantedQuantityKg: qtyNum,
        landAreaHa: areaNum,
        notes: notes.trim(),
        submitType,
      });
    };

    return (
      <div className="space-y-6 max-w-[880px]">
        <div>
          <button
            type="button"
            onClick={onNavigateList}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Catatan Penanaman</span>
          </button>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            {selectedRecord?.status === 'Draf'
              ? 'Lanjutkan Draf Catatan Penanaman'
              : 'Catat Penanaman Benih'}
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Isi rincian tanggal, petak lahan, dan jumlah benih terverifikasi yang ditanam.
          </p>
        </div>

        <div
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          {verifiedSeeds.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#FEF3C7]/70 border border-[#FDE68A] text-[13px] text-[#92400E] flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                Belum ada benih berstatus <strong>Terverifikasi</strong>. Silakan lakukan Verifikasi QR di menu Verifikasi QR terlebih dahulu sebelum mencatat penanaman.
              </span>
            </div>
          ) : (
            <>
              {formError && (
                <div className="p-3.5 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Pilih Batch Benih Terverifikasi
                  </label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  >
                    {verifiedSeeds.map((seed) => {
                      const rem = Math.max(
                        0,
                        seed.receivedQuantityKg - seed.plantedQuantityKg
                      );
                      return (
                        <option key={seed.id} value={seed.id}>
                          {seed.batchNumber} — {seed.variety} (Tersisa: {rem} kg)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Tanggal Penanaman
                  </label>
                  <input
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Lokasi / Nama Petak Lahan
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Petak Irigasi Blok Barat, Kampar"
                    className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Jumlah Benih Ditanam (kg)
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    step="0.5"
                    value={plantedQuantityKg}
                    onChange={(e) => setPlantedQuantityKg(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                  {activeBatch && (
                    <p className="mt-1 text-[12px] text-[#64748B] tabular-nums">
                      Sisa siap tanam: <strong>{availableKg.toLocaleString('id-ID')} kg</strong> dari {activeBatch.receivedQuantityKg.toLocaleString('id-ID')} kg diterima.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Luas Lahan Ditanami (Ha)
                  </label>
                  <input
                    type="number"
                    min={0.1}
                    step="0.1"
                    value={landAreaHa}
                    onChange={(e) => setLandAreaHa(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Catatan Lapangan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Sistem tanam jajar legowo 2:1, irigasi teknis lancar."
                    className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>
              </div>

              {/* Compact Review Summary */}
              {activeBatch && (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                    Ringkasan Catatan Sebelum Dikirim
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Batch &amp; Varietas</span>
                      <span className="font-semibold text-[#111827] tabular-nums">
                        {activeBatch.batchNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Tanggal Tanam</span>
                      <span className="font-medium text-[#111827] tabular-nums">
                        {plantingDate || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Jumlah Benih</span>
                      <span className="font-semibold text-[#00843D] tabular-nums">
                        {plantedQuantityKg ? `${plantedQuantityKg} kg` : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Luas Lahan</span>
                      <span className="font-semibold text-[#111827] tabular-nums">
                        {landAreaHa ? `${landAreaHa} Ha` : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleFormAction('Draf')}
                  className="min-h-[46px] px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#334155] text-[13px] font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Draf</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFormAction('Tercatat')}
                  className="min-h-[46px] px-5 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Catatan Penanaman</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'planting-detail' && selectedRecord) {
    const linkedBatch = seeds.find((s) => s.id === selectedRecord.batchId);
    const relatedCorrections = corrections.filter(
      (c) => c.plantingRecordId === selectedRecord.id
    );

    return (
      <div className="space-y-6 max-w-[880px]">
        <div>
          <button
            type="button"
            onClick={onNavigateList}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Catatan Penanaman</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827] tabular-nums">
                  {selectedRecord.recordCode}
                </h1>
                <StatusBadge status={selectedRecord.status} />
              </div>
              <p className="mt-1 text-[14px] text-[#64748B]">
                {selectedRecord.variety} · Batch {selectedRecord.batchNumber}
              </p>
            </div>

            {selectedRecord.status === 'Draf' ? (
              <button
                type="button"
                onClick={() => onResumeDraft(selectedRecord.id)}
                className="min-h-[44px] px-4 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <FileEdit className="w-4 h-4" />
                <span>Lanjutkan &amp; Kirim Draf</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRequestCorrection(selectedRecord.id)}
                className="min-h-[44px] px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#111827] text-[13px] font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <FileEdit className="w-4 h-4 text-[#00843D]" />
                <span>Ajukan Koreksi Catatan</span>
              </button>
            )}
          </div>
        </div>

        <div
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Rincian Penanaman
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <div className="text-[#64748B]">Nomor Batch</div>
              <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                {selectedRecord.batchNumber}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Varietas &amp; Komoditas</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {selectedRecord.variety} ({selectedRecord.commodity})
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Tanggal Penanaman</div>
              <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                {selectedRecord.plantingDate}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Lokasi Lahan</div>
              <div className="font-medium text-[#111827] mt-0.5">
                {selectedRecord.location}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Jumlah Benih Ditanam</div>
              <div className="font-bold text-[#00843D] tabular-nums mt-0.5">
                {selectedRecord.plantedQuantityKg.toLocaleString('id-ID')} kg
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Luas Lahan</div>
              <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                {selectedRecord.landAreaHa.toLocaleString('id-ID')} Ha
              </div>
            </div>
            {linkedBatch && (
              <div>
                <div className="text-[#64748B]">Sertifikat Benih</div>
                <div className="font-semibold text-[#00843D] tabular-nums mt-0.5">
                  {linkedBatch.certificateNumber}
                </div>
              </div>
            )}
            <div className="sm:col-span-2">
              <div className="text-[#64748B]">Catatan Lapangan</div>
              <div className="text-[#334155] mt-0.5">
                {selectedRecord.notes || 'Tidak ada catatan tambahan.'}
              </div>
            </div>
          </div>
        </div>

        {relatedCorrections.length > 0 && (
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-3"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[15px] font-semibold text-[#111827] pb-2.5 border-b border-[#E2E8F0]">
              Riwayat Permintaan Koreksi
            </h2>
            <div className="space-y-3">
              {relatedCorrections.map((corr) => (
                <div
                  key={corr.id}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-[13px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#111827] tabular-nums">
                      {corr.requestCode}
                    </span>
                    <StatusBadge status={corr.status} />
                  </div>
                  <div className="text-[#334155]">
                    <span className="text-[#64748B]">Perbaikan diajukan:</span>{' '}
                    <strong>{corr.requestedCorrection}</strong>
                  </div>
                  <div className="text-[12px] text-[#64748B]">
                    Alasan: {corr.reason}
                  </div>
                  {corr.regulatorNote && (
                    <div className="text-[12px] text-[#00843D] font-medium">
                      Catatan BPSB: {corr.regulatorNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // List Mode
  const filtered = plantings.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.recordCode.toLowerCase().includes(q) ||
      p.batchNumber.toLowerCase().includes(q) ||
      p.variety.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'Semua' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Catatan Penanaman
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Rekam penggunaan benih bersertifikat di lahan Anda atau ajukan koreksi data jika ada kesalahan pencatatan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onStartNewForm()}
            className="min-h-[44px] px-4 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Penanaman</span>
          </button>
        </div>
      </div>

      {/* Filters */}
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
            placeholder="Cari kode tanam, nomor batch, atau petak lahan..."
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'Semua' | PlantingRecordStatus)
          }
          className="h-11 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D]"
        >
          <option value="Semua">Semua Status</option>
          <option value="Tercatat">Tercatat</option>
          <option value="Draf">Draf</option>
          <option value="Koreksi Diajukan">Koreksi Diajukan</option>
          <option value="Koreksi Disetujui">Koreksi Disetujui</option>
        </select>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[14px] font-bold text-[#111827] tabular-nums">
                  {rec.recordCode}
                </div>
                <div className="text-[13px] font-semibold text-[#334155]">
                  {rec.variety}
                </div>
                <div className="text-[12px] text-[#64748B] tabular-nums">
                  Batch {rec.batchNumber}
                </div>
              </div>
              <StatusBadge status={rec.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[12px] pt-2 border-t border-[#F1F5F9]">
              <div>
                <span className="text-[#64748B] block">Tanggal Tanam</span>
                <span className="font-medium text-[#111827] tabular-nums">
                  {rec.plantingDate}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Jumlah / Luas</span>
                <span className="font-semibold text-[#111827] tabular-nums">
                  {rec.plantedQuantityKg} kg · {rec.landAreaHa} Ha
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#64748B] block">Lokasi Lahan</span>
                <span className="font-medium text-[#111827]">{rec.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenDetail(rec.id)}
                className="min-h-[42px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#111827] text-[13px] font-semibold cursor-pointer"
              >
                Detail
              </button>
              {rec.status === 'Draf' ? (
                <button
                  type="button"
                  onClick={() => onResumeDraft(rec.id)}
                  className="min-h-[42px] rounded-xl bg-[#00843D] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Lanjutkan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequestCorrection(rec.id)}
                  className="min-h-[42px] rounded-xl border border-[#BBF7D0] bg-[#F0FAF3] text-[#00843D] text-[13px] font-semibold cursor-pointer"
                >
                  Koreksi
                </button>
              )}
            </div>
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
                <th className="py-3 px-4">Kode Catatan</th>
                <th className="py-3 px-4">Batch &amp; Varietas</th>
                <th className="py-3 px-4">Tanggal Tanam</th>
                <th className="py-3 px-4">Lokasi Lahan</th>
                <th className="py-3 px-4 text-right">Benih &amp; Luas</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center gap-2">
                      <Sprout className="w-6 h-6 text-[#94A3B8]" />
                      <span>Belum ada catatan penanaman yang sesuai filter.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#111827] tabular-nums whitespace-nowrap">
                      {rec.recordCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111827]">{rec.variety}</div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {rec.batchNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] tabular-nums whitespace-nowrap">
                      {rec.plantingDate}
                    </td>
                    <td className="py-3.5 px-4 text-[#334155] max-w-[240px]">
                      <div className="truncate">{rec.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                      <div className="font-semibold text-[#111827]">
                        {rec.plantedQuantityKg.toLocaleString('id-ID')} kg
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {rec.landAreaHa.toLocaleString('id-ID')} Ha
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={rec.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(rec.id)}
                        className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[12px] font-semibold text-[#111827] cursor-pointer"
                      >
                        Detail
                      </button>
                      {rec.status === 'Draf' ? (
                        <button
                          type="button"
                          onClick={() => onResumeDraft(rec.id)}
                          className="h-8 px-3 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold cursor-pointer"
                        >
                          Lanjutkan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRequestCorrection(rec.id)}
                          className="h-8 px-3 rounded-lg border border-[#BBF7D0] bg-[#F0FAF3] hover:bg-[#DCFCE7] text-[#00843D] text-[12px] font-semibold cursor-pointer"
                        >
                          Koreksi
                        </button>
                      )}
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
