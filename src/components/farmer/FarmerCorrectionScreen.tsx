import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Info,
  Send,
  ShieldAlert,
} from 'lucide-react';
import {
  FarmerPlantingRecord,
  PlantingCorrectionRequest,
} from '../../types/farmer';
import { StatusBadge } from '../ui/StatusBadge';

interface FarmerCorrectionScreenProps {
  plantings: FarmerPlantingRecord[];
  corrections: PlantingCorrectionRequest[];
  preselectedPlantingId?: string | null;
  onBack: () => void;
  onSubmitCorrection: (payload: {
    plantingRecordId: string;
    incorrectInfo: string;
    requestedCorrection: string;
    reason: string;
  }) => void;
}

export const FarmerCorrectionScreen: React.FC<FarmerCorrectionScreenProps> = ({
  plantings,
  corrections,
  preselectedPlantingId,
  onBack,
  onSubmitCorrection,
}) => {
  const submittedPlantings = plantings.filter((p) => p.status !== 'Draf');

  const [selectedPlantingId, setSelectedPlantingId] = useState('');
  const [incorrectInfo, setIncorrectInfo] = useState('');
  const [requestedCorrection, setRequestedCorrection] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const target =
      submittedPlantings.find((p) => p.id === preselectedPlantingId) ??
      submittedPlantings[0];
    setSelectedPlantingId(target?.id ?? '');
    setIncorrectInfo('');
    setRequestedCorrection('');
    setReason('');
    setFormError('');
  }, [preselectedPlantingId, plantings.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlantingId) {
      setFormError('Pilih catatan penanaman yang akan dikoreksi.');
      return;
    }
    if (!incorrectInfo.trim()) {
      setFormError('Jelaskan bagian data yang kurang tepat pada catatan saat ini.');
      return;
    }
    if (!requestedCorrection.trim()) {
      setFormError('Masukkan nilai atau informasi perbaikan yang benar.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Tuliskan alasan pengajuan koreksi.');
      return;
    }
    setFormError('');
    onSubmitCorrection({
      plantingRecordId: selectedPlantingId,
      incorrectInfo: incorrectInfo.trim(),
      requestedCorrection: requestedCorrection.trim(),
      reason: reason.trim(),
    });
    setIncorrectInfo('');
    setRequestedCorrection('');
    setReason('');
  };

  return (
    <div className="space-y-6 max-w-[960px]">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Catatan Penanaman</span>
        </button>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Permintaan Koreksi Catatan Penanaman
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Ajukan perbaikan jika terdapat kesalahan pencatatan tanggal, jumlah benih, lokasi, atau luas lahan tanam.
        </p>
      </div>

      {/* Explicit non-self-approval governance rule banner */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-3 text-[13px] text-[#1E3A8A]">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#2563EB]" />
        <div>
          <div className="font-semibold">Kebijakan Verifikasi Koreksi</div>
          <p className="mt-0.5 leading-relaxed">
            Demi menjaga integritas data ketertelusuran benih, setiap permintaan koreksi akan ditinjau dan hanya dapat disetujui atau ditolak oleh <strong>Regulator BPSB</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Submit Correction Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Formulir Pengajuan Koreksi
          </h2>

          {submittedPlantings.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 border border-[#E2E8F0] text-[13px] text-[#64748B]">
              Belum ada catatan penanaman terkirim yang dapat dikoreksi.
            </div>
          ) : (
            <>
              {formError && (
                <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Pilih Catatan Penanaman
                </label>
                <select
                  value={selectedPlantingId}
                  onChange={(e) => setSelectedPlantingId(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                >
                  {submittedPlantings.map((rec) => (
                    <option key={rec.id} value={rec.id}>
                      {rec.recordCode} — {rec.variety} ({rec.plantingDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Informasi yang Kurang Tepat Saat Ini
                </label>
                <input
                  type="text"
                  value={incorrectInfo}
                  onChange={(e) => setIncorrectInfo(e.target.value)}
                  placeholder="Contoh: Luas lahan tercatat 2,5 Ha"
                  className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Data Perbaikan yang Diajukan
                </label>
                <input
                  type="text"
                  value={requestedCorrection}
                  onChange={(e) => setRequestedCorrection(e.target.value)}
                  placeholder="Contoh: Luas lahan sebenarnya 3,2 Ha"
                  className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Alasan Pengajuan Koreksi
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Jelaskan secara singkat penyebab kesalahan pencatatan..."
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Permintaan Koreksi</span>
              </button>
            </>
          )}
        </form>

        {/* Correction Request History */}
        <div
          className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Status Pengajuan Koreksi Anda
            </h2>
            <span className="text-[12px] font-semibold text-[#64748B] tabular-nums">
              {corrections.length} pengajuan
            </span>
          </div>

          <div className="space-y-3">
            {corrections.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-[#64748B]">
                Belum ada pengajuan koreksi catatan penanaman.
              </div>
            ) : (
              corrections.map((corr) => (
                <div
                  key={corr.id}
                  className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/70 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[13px] font-bold text-[#111827] tabular-nums">
                      {corr.requestCode} · {corr.recordCode}
                    </div>
                    <StatusBadge status={corr.status} />
                  </div>

                  <div className="text-[12px] text-[#64748B]">
                    {corr.variety} ({corr.batchNumber}) · Diajukan{' '}
                    <span className="tabular-nums">{corr.submittedAt}</span>
                  </div>

                  <div className="text-[13px] space-y-1 pt-1">
                    <div>
                      <span className="text-[#64748B]">Tertulis:</span>{' '}
                      <span className="text-[#475569]">{corr.incorrectInfo}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Koreksi:</span>{' '}
                      <span className="font-semibold text-[#111827]">
                        {corr.requestedCorrection}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#475569]">
                      Alasan: {corr.reason}
                    </div>
                  </div>

                  {corr.regulatorNote && (
                    <div className="pt-2 border-t border-[#E2E8F0] flex items-start gap-2 text-[12px] text-[#334155]">
                      <ShieldAlert className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                      <span>{corr.regulatorNote}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
