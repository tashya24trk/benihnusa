import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Lock,
  PackageCheck,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { IncomingBatch } from '../../types/distributor';
import { QrCodeSvg } from '../ui/QrCodeSvg';
import { StatusBadge } from '../ui/StatusBadge';

interface DistributorIncomingDetailScreenProps {
  batch: IncomingBatch;
  mode: 'detail' | 'confirm';
  onBack: () => void;
  onSwitchToConfirm: () => void;
  onSubmitDecision: (
    batchId: string,
    decision: 'Diterima' | 'Ditolak',
    note: string
  ) => void;
}

export const DistributorIncomingDetailScreen: React.FC<
  DistributorIncomingDetailScreenProps
> = ({ batch, mode, onBack, onSwitchToConfirm, onSubmitDecision }) => {
  const [sealChecked, setSealChecked] = useState(true);
  const [qtyChecked, setQtyChecked] = useState(true);
  const [certChecked, setCertChecked] = useState(true);
  const [decision, setDecision] = useState<'Diterima' | 'Ditolak'>('Diterima');
  const [note, setNote] = useState(
    'Seluruh karung bersegel QR diterima dalam kondisi kering dan utuh sesuai surat jalan.'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isPending = batch.receiptStatus === 'Menunggu Konfirmasi';

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'Diterima' && (!sealChecked || !qtyChecked || !certChecked)) {
      setErrorMsg(
        'Centang seluruh daftar periksa fisik penerimaan sebelum menyetujui masuknya batch ke stok.'
      );
      return;
    }
    if (decision === 'Ditolak' && !note.trim()) {
      setErrorMsg('Tuliskan alasan penolakan penerimaan batch.');
      return;
    }
    setErrorMsg(null);
    onSubmitDecision(batch.id, decision, note.trim());
  };

  return (
    <div className="space-y-6 max-w-[1160px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Batch Diterima</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827] tabular-nums">
              {mode === 'confirm'
                ? `Konfirmasi Penerimaan · ${batch.batchNumber}`
                : `Detail Batch Masuk · ${batch.batchNumber}`}
            </h1>
            <StatusBadge status={batch.receiptStatus} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            {batch.variety} · {batch.commodity} · Dikirim oleh {batch.producerName}
          </p>
        </div>

        {mode === 'detail' && isPending && (
          <button
            type="button"
            onClick={onSwitchToConfirm}
            className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Konfirmasi Penerimaan</span>
          </button>
        )}
      </div>

      {/* Read-only Producer Data Notice */}
      <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex items-start gap-3 text-[13px] text-[#475569]">
        <Lock className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#111827]">
            Data registrasi produsen bersifat baca-saja.
          </span>{' '}
          Distributor / Koperasi hanya berwenang memeriksa kondisi fisik dan mengonfirmasi penerimaan atau penolakan pengiriman.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Batch & Sender Info */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-4 border-b border-[#E2E8F0]">
              Informasi Batch &amp; Sertifikasi Asal
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-[#64748B]">Nomor Batch</div>
                <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                  {batch.batchNumber}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Nomor Sertifikat BPSB</div>
                <div className="font-semibold text-[#00843D] tabular-nums mt-0.5 inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{batch.certificateNumber}</span>
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Jenis &amp; Varietas</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {batch.commodity} · {batch.variety}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Kelas Benih</div>
                <div className="font-medium text-[#111827] mt-0.5">{batch.seedClass}</div>
              </div>
              <div>
                <div className="text-[#64748B]">Jumlah Dikirim</div>
                <div className="font-bold text-[15px] text-[#111827] tabular-nums mt-0.5">
                  {batch.quantityKg.toLocaleString('id-ID')} kg
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Tanggal Produksi</div>
                <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                  {batch.productionDate}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Daya Kecambah / Kadar Air</div>
                <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                  {batch.germinationRate.toFixed(1)}% / {batch.moistureContent.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Sumber Benih Induk</div>
                <div className="font-medium text-[#111827] mt-0.5">{batch.seedSource}</div>
              </div>
            </div>
          </div>

          {/* Sender Info */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <Truck className="w-4 h-4 text-[#00843D]" />
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Informasi Pengirim &amp; Surat Jalan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-[#64748B]">Produsen Pengirim</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {batch.producerName}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Provinsi Asal</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {batch.producerProvince}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Nomor Surat Jalan</div>
                <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                  {batch.waybillNumber}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Tanggal Transfer</div>
                <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                  {batch.transferDate}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[#64748B]">Armada Ekspedisi</div>
                <div className="font-medium text-[#111827] mt-0.5">{batch.carrierInfo}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: QR Verification & Receipt Confirmation Form */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex items-center justify-between gap-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#00843D]">
                Label QR Pengiriman
              </div>
              <div className="text-[14px] font-semibold text-[#111827] tabular-nums mt-1">
                {batch.waybillNumber}
              </div>
              <div className="text-[12px] text-[#64748B] mt-0.5">
                Cocokkan kode QR ini dengan label fisik pada karung benih.
              </div>
            </div>
            <QrCodeSvg value={`${batch.batchNumber}|${batch.waybillNumber}`} size={88} />
          </div>

          {isPending ? (
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
                Formulir Konfirmasi Penerimaan
              </h2>

              <form onSubmit={handleConfirmSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[12px] font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2.5 text-[13px]">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sealChecked}
                      onChange={(e) => setSealChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#00843D] rounded cursor-pointer"
                    />
                    <span className="text-[#334155]">
                      Kemasan dan segel label QR BPSB dalam kondisi utuh &amp; kering.
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={qtyChecked}
                      onChange={(e) => setQtyChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#00843D] rounded cursor-pointer"
                    />
                    <span className="text-[#334155]">
                      Jumlah timbangan sesuai ({batch.quantityKg.toLocaleString('id-ID')} kg).
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certChecked}
                      onChange={(e) => setCertChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#00843D] rounded cursor-pointer"
                    />
                    <span className="text-[#334155]">
                      Dokumen surat jalan dan nomor sertifikat {batch.certificateNumber} sesuai.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Keputusan Penerimaan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecision('Diterima')}
                      className={`h-10 rounded-lg border text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                        decision === 'Diterima'
                          ? 'bg-[#F0FAF3] border-[#00843D] text-[#00843D]'
                          : 'bg-white border-[#E2E8F0] text-[#64748B]'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Terima ke Stok</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision('Ditolak')}
                      className={`h-10 rounded-lg border text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                        decision === 'Ditolak'
                          ? 'bg-[#FEE2E2] border-[#EF4444] text-[#B91C1C]'
                          : 'bg-white border-[#E2E8F0] text-[#64748B]'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Tolak Pengiriman</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                    Catatan Pemeriksaan Gudang
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full h-10 rounded-lg text-white text-[13px] font-semibold cursor-pointer ${
                    decision === 'Diterima'
                      ? 'bg-[#00843D] hover:bg-[#006B32]'
                      : 'bg-[#EF4444] hover:bg-[#DC2626]'
                  }`}
                >
                  {decision === 'Diterima'
                    ? 'Konfirmasi Terima & Tambah ke Stok Benih'
                    : 'Konfirmasi Tolak Penerimaan Batch'}
                </button>
              </form>
            </div>
          ) : (
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#111827]">
                  Status Konfirmasi
                </h2>
                <StatusBadge status={batch.receiptStatus} />
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed">
                {batch.receiptNote || 'Penerimaan batch telah diproses oleh petugas gudang.'}
              </p>
              {batch.confirmedAt && (
                <p className="text-[12px] text-[#64748B] tabular-nums">
                  Dikonfirmasi pada: {batch.confirmedAt}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
