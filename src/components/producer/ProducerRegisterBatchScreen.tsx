import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Save,
  Send,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  CommodityType,
  ProducerBatch,
  SeedClass,
  SupportingDocument,
} from '../../types/producer';
import { StatusBadge } from '../ui/StatusBadge';

interface ProducerRegisterBatchScreenProps {
  organizationName: string;
  editingBatch?: ProducerBatch | null;
  onCancelEdit?: () => void;
  onSaveBatch: (batchData: ProducerBatch, mode: 'draft' | 'submit') => void;
}

export const ProducerRegisterBatchScreen: React.FC<ProducerRegisterBatchScreenProps> = ({
  organizationName,
  editingBatch,
  onCancelEdit,
  onSaveBatch,
}) => {
  const [commodity, setCommodity] = useState<CommodityType>(
    editingBatch?.commodity ?? 'Kelapa Sawit'
  );
  const [variety, setVariety] = useState(editingBatch?.variety ?? '');
  const [seedClass, setSeedClass] = useState<SeedClass>(
    editingBatch?.seedClass ?? 'Benih Pokok (BP)'
  );
  const [quantityKg, setQuantityKg] = useState(
    editingBatch ? String(editingBatch.quantityKg) : '4500'
  );
  const [productionDate, setProductionDate] = useState(
    editingBatch?.productionDate ?? '2026-11-14'
  );

  const [productionLocation, setProductionLocation] = useState(
    editingBatch?.productionLocation ?? 'Blok Kebun A1, Kec. Rumbai, Pekanbaru'
  );
  const [seedSource, setSeedSource] = useState(
    editingBatch?.seedSource ?? 'Lot Induk BD-BPTP-2025-104'
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    editingBatch?.additionalNotes ?? ''
  );

  const [documents, setDocuments] = useState<SupportingDocument[]>(
    editingBatch?.documents ?? [
      {
        id: 'doc-default-1',
        name: 'Bukti_Asal_Benih_Sumber_2026.pdf',
        category: 'Bukti Sumber Benih',
        sizeLabel: '1.1 MB',
        uploadedAt: '2026-11-16',
        status: 'Terverifikasi Format',
        summary: 'Tag label resmi benih sumber yang ditanam pada periode ini.',
      },
    ]
  );

  const [previewDoc, setPreviewDoc] = useState<SupportingDocument | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const added: SupportingDocument[] = Array.from(files).map((file, idx) => ({
      id: `doc-${Date.now()}-${idx}`,
      name: file.name,
      category: 'Dokumen Pendukung Produsen',
      sizeLabel: `${Math.max(120, Math.round(file.size / 1024))} KB`,
      uploadedAt: '2026-11-16',
      status: 'Terunggah',
      summary: `Berkas ${file.name} siap dilampirkan pada arsip batch ${organizationName}.`,
    }));

    setDocuments((prev) => [...prev, ...added]);
    e.target.value = '';
  };

  const handleAddSampleDocument = (category: string, filename: string) => {
    const newDoc: SupportingDocument = {
      id: `doc-${Date.now()}`,
      name: filename,
      category,
      sizeLabel: '860 KB',
      uploadedAt: '2026-11-16',
      status: 'Terunggah',
      summary: `Dokumen ${category} diunggah oleh tim produksi ${organizationName}.`,
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAction = (mode: 'draft' | 'submit') => {
    if (!variety.trim()) {
      setFormError('Identitas bahan tanam wajib diisi sebelum menyimpan batch.');
      return;
    }
    const qty = Number(quantityKg);
    if (!qty || qty <= 0) {
      setFormError('Jumlah benih (kg) harus lebih besar dari 0.');
      return;
    }
    if (!productionLocation.trim() || !seedSource.trim()) {
      setFormError('Lokasi produksi dan sumber benih wajib dilengkapi.');
      return;
    }
    if (mode === 'submit' && documents.length === 0) {
      setFormError('Unggah minimal 1 dokumen pendukung untuk mendaftarkan batch resmi.');
      return;
    }

    setFormError(null);

    const prefixMap: Record<CommodityType, string> = {
      'Kelapa Sawit': 'KS',
    };

    const batchNumber =
      editingBatch?.batchNumber ??
      `NT-2026-${prefixMap[commodity]}-${Math.floor(110 + Math.random() * 880)}`;

    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: ProducerBatch = {
      id: editingBatch?.id ?? `pb-${Date.now()}`,
      batchNumber,
      organizationName,
      commodity,
      variety: variety.trim(),
      seedClass,
      quantityKg: qty,
      initialQuantityKg: editingBatch ? editingBatch.initialQuantityKg : qty,
      productionDate,
      productionLocation: productionLocation.trim(),
      seedSource: seedSource.trim(),
      additionalNotes: additionalNotes.trim(),
      certificationStatus: editingBatch?.certificationStatus ?? 'Belum Diajukan',
      batchStatus: mode === 'draft' ? 'Draf' : 'Terdaftar',
      ownershipStatus: editingBatch?.ownershipStatus ?? 'Milik Produsen',
      certificateNumber: editingBatch?.certificateNumber,
      documents,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: `2026-11-16 ${nowTime} WIB`,
          actor: 'Tashya Putri, S.P.',
          action: editingBatch
            ? 'Memperbarui Data Batch Benih'
            : mode === 'draft'
            ? 'Menyimpan Draf Batch Benih'
            : 'Mendaftarkan Batch Benih Resmi',
          note: `${variety.trim()} · ${qty.toLocaleString('id-ID')} kg`,
        },
        ...(editingBatch?.history ?? []),
      ],
    };

    onSaveBatch(newRecord, mode);
  };

  return (
    <div className="space-y-6 max-w-[1120px]">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {editingBatch && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          )}
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            {editingBatch
              ? `Ubah Batch ${editingBatch.batchNumber}`
              : 'Registrasi Batch Benih'}
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Lengkapi informasi produksi dan dokumen pendukung batch untuk {organizationName}.
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[13px] font-medium">
          {formError}
        </div>
      )}

      {/* Section A: Informasi Batch */}
      <section
        className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="pb-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-semibold text-[#111827]">
            A. Informasi Batch
          </h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Identitas komoditas, bahan tanaman, kelas benih, dan volume batch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Jenis Benih
            </label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value as CommodityType)}
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            >
              <option value="Kelapa Sawit">Kelapa Sawit</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Identitas Bahan Tanam
            </label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="Contoh: Bahan Tanam DxP (Tenera) (Simulasi) - Kelompok A"
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Kelas Benih
            </label>
            <select
              value={seedClass}
              onChange={(e) => setSeedClass(e.target.value as SeedClass)}
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            >
              <option value="Benih Penjenis (BS)">Benih Penjenis (BS)</option>
              <option value="Benih Dasar (BD)">Benih Dasar (BD)</option>
              <option value="Benih Pokok (BP)">Benih Pokok (BP)</option>
              <option value="Benih Sebar (BR)">Benih Sebar (BR)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Jumlah Benih (kg)
              </label>
              <input
                type="number"
                min="1"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Tanggal Produksi
              </label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Informasi Produksi */}
      <section
        className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="pb-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-semibold text-[#111827]">
            B. Informasi Produksi
          </h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Detail lokasi penangkaran, sumber benih induk, dan catatan teknis budidaya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Lokasi Produksi
            </label>
            <input
              type="text"
              value={productionLocation}
              onChange={(e) => setProductionLocation(e.target.value)}
              placeholder="Blok kebun, kecamatan, dan kabupaten"
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Sumber Benih (Lot Induk)
            </label>
            <input
              type="text"
              value={seedSource}
              onChange={(e) => setSeedSource(e.target.value)}
              placeholder="Nomor lot benih sumber atau lembaga pemulia"
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Informasi Tambahan
            </label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Catatan penanganan bahan tanam, penyimpanan, atau jenis kemasan..."
              className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>
        </div>
      </section>

      {/* Section C: Dokumen Pendukung */}
      <section
        className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="pb-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#111827]">
              C. Dokumen Pendukung
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Unggah bukti sumber benih, pemeriksaan pembibitan, atau dokumentasi kemasan gudang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="h-9 px-3.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Unggah Berkas</span>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                handleAddSampleDocument(
                  'Catatan Produksi Benih',
                  `Catatan_Produksi_Benih_${commodity}_${productionDate}.pdf`
                )
              }
              className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] cursor-pointer"
            >
              + Lampirkan Catatan Produksi Benih
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-center">
            <p className="text-[13px] font-medium text-[#111827]">
              Belum ada dokumen pendukung yang diunggah.
            </p>
            <p className="text-[12px] text-[#64748B] mt-1">
              Unggah dokumen dalam format PDF atau gambar (JPG/PNG) untuk keperluan pratinjau.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-lg overflow-hidden">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-[#F8FAFC]"
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
                      {doc.category} · {doc.sizeLabel} · Diunggah {doc.uploadedAt}
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
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    aria-label={`Hapus ${doc.name}`}
                    className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#FEE2E2] hover:border-[#FECACA] text-[#64748B] hover:text-[#EF4444] inline-flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section D: Review & Submit */}
      <section
        className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="pb-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-semibold text-[#111827]">
            D. Review &amp; Konfirmasi
          </h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">
            Periksa ringkasan informasi batch sebelum menyimpan sebagai draf atau mengirimkannya ke daftar batch resmi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[13px]">
          <div>
            <div className="text-[12px] text-[#64748B]">Jenis &amp; Bahan Tanam</div>
            <div className="font-semibold text-[#111827] mt-0.5">
              {commodity} · {variety.trim() || 'Belum diisi'}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-[#64748B]">Kelas &amp; Jumlah</div>
            <div className="font-semibold text-[#111827] mt-0.5 tabular-nums">
              {seedClass} · {Number(quantityKg || 0).toLocaleString('id-ID')} kg
            </div>
          </div>
          <div>
            <div className="text-[12px] text-[#64748B]">Lokasi Produksi</div>
            <div className="font-semibold text-[#111827] mt-0.5 truncate">
              {productionLocation || '-'}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-[#64748B]">Dokumen Terlampir</div>
            <div className="font-semibold text-[#00843D] mt-0.5 tabular-nums">
              {documents.length} berkas siap
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[12px] text-[#64748B]">
            Data batch tetap dapat diubah selama belum diajukan untuk sertifikasi BPSB.
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleAction('draft')}
              className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#64748B]" />
              <span>Simpan sebagai Draf</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('submit')}
              className="h-10 px-5 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{editingBatch ? 'Simpan Perubahan Batch' : 'Simpan & Daftarkan Batch'}</span>
            </button>
          </div>
        </div>
      </section>

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
            className="relative z-10 w-full max-w-[480px] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-[#00843D] shrink-0" />
                <h3 className="text-[15px] font-semibold text-[#111827] truncate">
                  {previewDoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Kategori</span>
                  <span className="font-semibold text-[#111827]">{previewDoc.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Ukuran Berkas</span>
                  <span className="font-medium text-[#111827] tabular-nums">{previewDoc.sizeLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Status Validasi</span>
                  <StatusBadge status={previewDoc.status} />
                </div>
              </div>
              <div className="p-4 rounded-lg border border-[#BBF7D0] bg-[#F0FAF3] flex items-start gap-2.5 text-[13px] text-[#15803D]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{previewDoc.summary}</p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
