import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { ProducerBatch } from '../../types/producer';

interface SubmitCertificationModalProps {
  open: boolean;
  eligibleBatches: ProducerBatch[];
  preselectedBatchId?: string | null;
  onClose: () => void;
  onSubmitCertification: (batchId: string, submissionNote: string) => void;
}

export const SubmitCertificationModal: React.FC<SubmitCertificationModalProps> = ({
  open,
  eligibleBatches,
  preselectedBatchId,
  onClose,
  onSubmitCertification,
}) => {
  const [batchId, setBatchId] = useState(
    preselectedBatchId || eligibleBatches[0]?.id || ''
  );
  const [note, setNote] = useState(
    'Sampel benih di gudang siap diambil oleh Petugas Pengambil Contoh BPSB.'
  );

  if (!open) return null;

  const selectedBatch =
    eligibleBatches.find((b) => b.id === batchId) ?? eligibleBatches[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    onSubmitCertification(selectedBatch.id, note.trim());
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
        className="relative z-10 w-full max-w-[500px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#111827]">
              Ajukan Sertifikasi Benih ke BPSB
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Setelah diajukan, data batch akan dikunci selama proses evaluasi regulator.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {eligibleBatches.length === 0 ? (
          <div className="p-6 space-y-4">
            <p className="text-[13px] text-[#475569]">
              Saat ini tidak ada batch terdaftar berstatus <strong>Belum Diajukan</strong>. Daftarkan batch baru terlebih dahulu atau ubah batch berstatus Draf menjadi Terdaftar.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-semibold text-[#334155] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Pilih Batch Benih
              </label>
              <select
                value={selectedBatch?.id ?? ''}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              >
                {eligibleBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} · {b.variety} ({b.quantityKg.toLocaleString('id-ID')} kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Catatan Kesiapan Pengambilan Sampel
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#FEF3C7]/60 border border-[#FDE68A] text-[12px] text-[#92400E]">
              Catatan: Pengajuan akan dikirimkan ke BPSB Wilayah Provinsi Riau. Produsen tidak dapat mengubah detail batch atau menyetujui sertifikasinya sendiri.
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pengajuan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
