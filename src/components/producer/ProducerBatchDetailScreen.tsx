import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Edit3,
  Eye,
  FileText,
  GitFork,
  Lock,
  Send,
  Truck,
  X,
} from 'lucide-react';
import { ProducerBatch, SupportingDocument } from '../../types/producer';
import { QrCodeSvg } from '../ui/QrCodeSvg';
import { StatusBadge } from '../ui/StatusBadge';

interface ProducerBatchDetailScreenProps {
  batch: ProducerBatch;
  onBack: () => void;
  onEditBatch: (batchId: string) => void;
  onSubmitCertification: (batch: ProducerBatch) => void;
  onSplitBatch: (batchId: string, splitQtyKg: number, reasonNote: string) => void;
  onInitiateTransfer: (batch: ProducerBatch) => void;
}

export const ProducerBatchDetailScreen: React.FC<ProducerBatchDetailScreenProps> = ({
  batch,
  onBack,
  onEditBatch,
  onSubmitCertification,
  onSplitBatch,
  onInitiateTransfer,
}) => {
  const [previewDoc, setPreviewDoc] = useState<SupportingDocument | null>(null);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitQty, setSplitQty] = useState(
    String(Math.max(1, Math.floor(batch.quantityKg / 2)))
  );
  const [splitNote, setSplitNote] = useState('Pemisahan lot untuk alokasi distribusi terpisah.');
  const [splitError, setSplitError] = useState<string | null>(null);

  // Business Rules:
  // 1. Editable ONLY before certification submission
  const isEditable = batch.certificationStatus === 'Belum Diajukan';
  // 2. Can submit certification if not yet submitted and not draft
  const canSubmitCert =
    batch.certificationStatus === 'Belum Diajukan' && batch.batchStatus !== 'Draf';
  // 3. Can split batch ONLY while producer is the rightful owner and has stock > 1 kg
  const isRightfulOwner = batch.ownershipStatus === 'Milik Produsen';
  const canSplit = isRightfulOwner && batch.quantityKg > 1;
  // 4. Can transfer ownership if certified, stock > 0, and producer still holds ownership
  const canTransfer =
    batch.certificationStatus === 'Tersertifikasi' &&
    batch.quantityKg > 0 &&
    batch.ownershipStatus !== 'Dialihkan ke Distributor';

  const handleConfirmSplit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(splitQty);
    if (!qty || qty <= 0 || qty >= batch.quantityKg) {
      setSplitError(
        `Jumlah pemecahan harus antara 1 kg hingga ${batch.quantityKg - 1} kg.`
      );
      return;
    }
    setSplitError(null);
    onSplitBatch(batch.id, qty, splitNote.trim());
    setSplitModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Top Back & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Data Batch Benih</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827] tabular-nums">
              {batch.batchNumber}
            </h1>
            <StatusBadge status={batch.certificationStatus} />
            <StatusBadge status={batch.batchStatus} />
            <StatusBadge status={batch.ownershipStatus} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            {batch.variety} · {batch.commodity} · {batch.seedClass}
            {batch.parentBatchNumber ? ` · Pecahan dari ${batch.parentBatchNumber}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Edit button: Disabled after certification submission */}
          <button
            type="button"
            disabled={!isEditable}
            onClick={() => onEditBatch(batch.id)}
            title={
              isEditable
                ? 'Edit informasi batch'
                : 'Pengeditan dinonaktifkan setelah sertifikasi diajukan'
            }
            className={`h-10 px-4 rounded-lg border text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap ${
              isEditable
                ? 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] cursor-pointer'
                : 'border-[#E2E8F0] bg-slate-50 text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            {isEditable ? <Edit3 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>Edit Batch</span>
          </button>

          {/* Split Batch: Allowed only while producer is the rightful owner */}
          <button
            type="button"
            disabled={!canSplit}
            onClick={() => {
              setSplitQty(String(Math.max(1, Math.floor(batch.quantityKg / 2))));
              setSplitError(null);
              setSplitModalOpen(true);
            }}
            title={
              canSplit
                ? 'Pecah batch menjadi lot baru'
                : 'Pemecahan batch hanya dapat dilakukan selama kepemilikan penuh masih di tangan Produsen'
            }
            className={`h-10 px-4 rounded-lg border text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap ${
              canSplit
                ? 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] cursor-pointer'
                : 'border-[#E2E8F0] bg-slate-50 text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Pecah Batch</span>
          </button>

          {canSubmitCert && (
            <button
              type="button"
              onClick={() => onSubmitCertification(batch)}
              className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Ajukan Sertifikasi</span>
            </button>
          )}

          {canTransfer && (
            <button
              type="button"
              onClick={() => onInitiateTransfer(batch)}
              className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Transfer Kepemilikan</span>
            </button>
          )}
        </div>
      </div>

      {/* Lock Notice if already submitted */}
      {!isEditable && (
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex items-start gap-3 text-[13px] text-[#475569]">
          <Lock className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#111827]">
              Data batch terkunci untuk pengeditan.
            </span>{' '}
            Sesuai aturan sertifikasi benih, informasi batch tidak dapat diubah setelah pengajuan sertifikasi dikirimkan ke BPSB.
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Specifications & Documents */}
        <div className="lg:col-span-8 space-y-6">
          {/* Batch & Production Specifications */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="pb-4 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Informasi Batch &amp; Produksi
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13px]">
              <div>
                <div className="text-[#64748B]">Organisasi Produsen</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {batch.organizationName}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Jenis &amp; Bahan Tanam</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {batch.commodity} · {batch.variety}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Kelas Benih</div>
                <div className="font-semibold text-[#111827] mt-0.5">{batch.seedClass}</div>
              </div>
              <div>
                <div className="text-[#64748B]">Stok Saat Ini / Awal</div>
                <div className="font-semibold text-[#111827] mt-0.5 tabular-nums">
                  {batch.quantityKg.toLocaleString('id-ID')} kg /{' '}
                  {batch.initialQuantityKg.toLocaleString('id-ID')} kg
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Tanggal Produksi</div>
                <div className="font-semibold text-[#111827] mt-0.5 tabular-nums">
                  {batch.productionDate}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Nomor Sertifikat BPSB</div>
                <div className="font-semibold text-[#00843D] mt-0.5 tabular-nums">
                  {batch.certificateNumber ?? 'Belum diterbitkan'}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[#64748B]">Lokasi Produksi</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {batch.productionLocation}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[#64748B]">Sumber Benih (Lot Induk)</div>
                <div className="font-medium text-[#111827] mt-0.5">{batch.seedSource}</div>
              </div>
              {batch.additionalNotes && (
                <div className="sm:col-span-2">
                  <div className="text-[#64748B]">Informasi Tambahan</div>
                  <div className="text-[#334155] mt-0.5 leading-relaxed">
                    {batch.additionalNotes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Supporting Documents */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="pb-4 border-b border-[#E2E8F0]">
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Dokumen Pendukung
              </h2>
            </div>

            {batch.documents.length === 0 ? (
              <p className="text-[13px] text-[#64748B]">
                Belum ada dokumen yang dilampirkan pada batch ini.
              </p>
            ) : (
              <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-lg overflow-hidden">
                {batch.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#F0FAF3] text-[#00843D] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#111827] truncate">
                          {doc.name}
                        </div>
                        <div className="text-[12px] text-[#64748B] tabular-nums">
                          {doc.category} · {doc.sizeLabel} · {doc.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={doc.status} />
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>Pratinjau</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: QR Traceability Card & Chronological History */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex items-center justify-between gap-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#00843D]">
                Identitas Ketertelusuran
              </div>
              <div className="text-[14px] font-semibold text-[#111827] mt-1 tabular-nums">
                {batch.batchNumber}
              </div>
              <div className="text-[12px] text-[#64748B] mt-0.5">
                {batch.certificateNumber
                  ? `Sertifikat: ${batch.certificateNumber}`
                  : 'Menunggu penerbitan sertifikat BPSB'}
              </div>
            </div>
            <QrCodeSvg
              value={`${batch.batchNumber}|${batch.organizationName}|${batch.certificateNumber ?? 'UNVERIFIED'}`}
              size={92}
            />
          </div>

          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-4 border-b border-[#E2E8F0]">
              Riwayat Batch
            </h2>
            <div className="mt-4 space-y-4">
              {batch.history.map((ev, idx) => (
                <div key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    {idx < batch.history.length - 1 && (
                      <div className="w-px flex-1 bg-[#E2E8F0] my-1 min-h-[16px]" />
                    )}
                  </div>
                  <div className="pb-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#111827]">
                      {ev.action}
                    </div>
                    <div className="text-[12px] text-[#64748B] tabular-nums mt-0.5">
                      {ev.timestamp} · {ev.actor}
                    </div>
                    {ev.note && (
                      <p className="text-[12px] text-[#334155] mt-1">{ev.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Split Batch Modal */}
      {splitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
            onClick={() => setSplitModalOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-[460px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[#111827]">
                  Pecah Batch ({batch.batchNumber})
                </h3>
                <p className="text-[12px] text-[#64748B] mt-0.5 tabular-nums">
                  Stok tersedia milik Nursery Tashya: {batch.quantityKg.toLocaleString('id-ID')} kg
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSplitModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSplit} className="p-6 space-y-4">
              {splitError && (
                <div className="px-3 py-2 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[12px] font-medium">
                  {splitError}
                </div>
              )}
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Jumlah untuk Lot Pecahan Baru (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  max={batch.quantityKg - 1}
                  value={splitQty}
                  onChange={(e) => setSplitQty(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
                <p className="text-[12px] text-[#64748B] mt-1 tabular-nums">
                  Sisa pada batch induk setelah pemecahan:{' '}
                  {Math.max(0, batch.quantityKg - (Number(splitQty) || 0)).toLocaleString('id-ID')} kg
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Alasan / Catatan Pemecahan Batch
                </label>
                <textarea
                  rows={2}
                  value={splitNote}
                  onChange={(e) => setSplitNote(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSplitModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-semibold text-[#334155] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <GitFork className="w-4 h-4" />
                  <span>Pecah Batch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
            onClick={() => setPreviewDoc(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-[460px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[15px] font-semibold text-[#111827] truncate">
                {previewDoc.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-[13px]">
              <p className="text-[#334155]">{previewDoc.summary}</p>
              <div className="text-[#64748B] tabular-nums">
                {previewDoc.category} · {previewDoc.sizeLabel} · Diunggah {previewDoc.uploadedAt}
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="h-9 px-4 rounded-lg bg-[#00843D] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
