import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { SeedBatch } from '../../types/seed';

interface CertificationModalProps {
  batch: SeedBatch | null;
  mode: 'approve' | 'reject' | null;
  onClose: () => void;
  onConfirmApprove: (batchId: string, certificateNumber: string, expiryDate: string) => void;
  onConfirmReject: (batchId: string, reason: string) => void;
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  batch,
  mode,
  onClose,
  onConfirmApprove,
  onConfirmReject,
}) => {
  const defaultCertNo = batch
    ? `DUMMY-BPSB-${batch.province.slice(0, 3).toUpperCase()}-2026/${Math.floor(
        10000 + Math.random() * 89999
      )}`
    : '';
  const [certificateNumber, setCertificateNumber] = useState(defaultCertNo);
  const [expiryDate, setExpiryDate] = useState('2027-05-16');
  const [rejectReason, setRejectReason] = useState(
    'Daya kecambah atau kadar air tidak memenuhi ambang mutu simulasi.'
  );

  if (!batch || !mode) return null;

  const isApprove = mode === 'approve';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isApprove) {
      onConfirmApprove(batch.id, certificateNumber || defaultCertNo, expiryDate);
    } else {
      onConfirmReject(batch.id, rejectReason.trim() || 'Ditolak pada verifikasi akhir BPSB.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        className="relative z-10 w-full max-w-[480px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2
              id="cert-modal-title"
              className="text-[18px] font-semibold text-[#111827]"
            >
              {isApprove ? 'Formulir Terbit Sertifikasi' : 'Konfirmasi Penolakan Batch'}
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5 tabular-nums">
              {batch.batchNumber} · {batch.variety}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isApprove ? (
            <>
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Nomor Sertifikat (Data Simulasi)
                </label>
                <input
                  type="text"
                  required
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Masa Berlaku Label Sertifikasi (6 Bulan)
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>
              <div className="p-3 rounded-lg bg-[#F0FAF3] border border-[#BBF7D0] text-[12px] text-[#15803D]">
                Daya Kecambah tercatat <span className="font-semibold tabular-nums">{batch.germinationRate.toFixed(1)}%</span> dan Kadar Air <span className="font-semibold tabular-nums">{batch.moistureContent.toFixed(1)}%</span>. Label QR ketertelusuran akan aktif secara otomatis.
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Alasan Penolakan / Afkir
              </label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
              />
            </div>
          )}

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold cursor-pointer"
            >
              Batal
            </button>
            {isApprove ? (
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Terbitkan Sertifikat</span>
              </button>
            ) : (
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Konfirmasi Tolak</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
