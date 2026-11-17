import React from 'react';
import {
  Check,
  Clock,
  FileCheck2,
  Printer,
  ShieldAlert,
  Warehouse,
  X,
} from 'lucide-react';
import { SeedBatch } from '../../types/seed';
import { QrCodeSvg } from '../ui/QrCodeSvg';
import { StatusBadge } from '../ui/StatusBadge';

interface BatchDetailDrawerProps {
  batch: SeedBatch | null;
  onClose: () => void;
  onApprove: (batch: SeedBatch) => void;
  onReject: (batch: SeedBatch) => void;
}

export const BatchDetailDrawer: React.FC<BatchDetailDrawerProps> = ({
  batch,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!batch) return null;

  const canDecide =
    batch.status === 'Menunggu Verifikasi' ||
    batch.status === 'Lolos Uji Mutu' ||
    batch.status === 'Masa Karantina';

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-batch-title"
        className="relative z-10 w-full max-w-[540px] bg-white h-full border-l border-[#E2E8F0] flex flex-col"
        style={{
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h2
                id="drawer-batch-title"
                className="text-[18px] font-semibold text-[#111827] tabular-nums"
              >
                {batch.batchNumber}
              </h2>
              <StatusBadge status={batch.status} />
            </div>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              {batch.variety} · {batch.seedClass}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
            aria-label="Tutup panel detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Digital QR Certification Label */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#00843D]">
                Label QR Ketertelusuran BPSB
              </div>
              <div className="text-[14px] font-semibold text-[#111827] truncate">
                {batch.certificateNumber ?? 'Belum Diterbitkan Nomor Sertifikat'}
              </div>
              <div className="text-[12px] text-[#64748B] tabular-nums">
                Produksi: {batch.harvestDate} · Berlaku s/d: {batch.expiryDate ?? '-'}
              </div>
              <button
                type="button"
                onClick={handlePrintLabel}
                className="mt-2 h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Cetak Label QR</span>
              </button>
            </div>
            <QrCodeSvg value={`${batch.batchNumber}|${batch.certificateNumber ?? 'PENDING'}`} size={100} />
          </div>

          {/* Rejection Alert if any */}
          {batch.rejectionReason && (
            <div className="p-4 rounded-lg border border-[#FECACA] bg-[#FEE2E2]/60 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#991B1B]">
                <p className="font-semibold">Alasan Penolakan / Afkir BPSB</p>
                <p className="mt-0.5">{batch.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Core Provenance & Tonnage */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-3">
              Informasi Produksi &amp; Penyimpanan
            </h3>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-[#64748B]">Produsen / Penangkar</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {batch.producerName}
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Provinsi Asal</div>
                <div className="font-semibold text-[#111827] mt-0.5">{batch.province}</div>
              </div>
              <div>
                <div className="text-[#64748B]">Tonase Lot</div>
                <div className="font-semibold text-[#111827] mt-0.5 tabular-nums">
                  {batch.weightKg.toLocaleString('id-ID')} kg
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Inspektur Penguji</div>
                <div className="font-semibold text-[#111827] mt-0.5">
                  {batch.labInspector ?? 'Menunggu Penugasan'}
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2 pt-1 text-[#334155]">
                <Warehouse className="w-4 h-4 text-[#64748B] shrink-0" />
                <span>{batch.warehouseLocation}</span>
              </div>
            </div>
          </div>

          {/* Laboratory Parameters */}
          <div className="pt-5 border-t border-[#E2E8F0]">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-3">
              Hasil Uji Laboratorium
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-[#E2E8F0]">
                <div className="text-[11px] text-[#64748B]">Daya Kecambah</div>
                <div
                  className={`text-[18px] font-bold tabular-nums mt-0.5 ${
                    batch.germinationRate >= 80 ? 'text-[#15803D]' : 'text-[#B91C1C]'
                  }`}
                >
                  {batch.germinationRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0]">
                <div className="text-[11px] text-[#64748B]">Kadar Air</div>
                <div className="text-[18px] font-bold text-[#111827] tabular-nums mt-0.5">
                  {batch.moistureContent.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0]">
                <div className="text-[11px] text-[#64748B]">Kemurnian</div>
                <div className="text-[18px] font-bold text-[#111827] tabular-nums mt-0.5">
                  {batch.physicalPurity.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0]">
                <div className="text-[11px] text-[#64748B]">Benih Gulma</div>
                <div className="text-[18px] font-bold text-[#111827] tabular-nums mt-0.5">
                  {batch.weedSeedContent.toFixed(2)}%
                </div>
              </div>
            </div>
            {batch.labNotes && (
              <p className="mt-3 text-[13px] text-[#334155] leading-relaxed">
                {batch.labNotes}
              </p>
            )}
          </div>

          {/* Audit Trail Timeline */}
          <div className="pt-5 border-t border-[#E2E8F0]">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#64748B] mb-3">
              Riwayat Ketertelusuran (Audit Log)
            </h3>
            <div className="space-y-4">
              {batch.auditTrail.map((event, idx) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
                      {idx === 0 ? (
                        <FileCheck2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {idx < batch.auditTrail.length - 1 && (
                      <div className="w-px flex-1 bg-[#E2E8F0] my-1 min-h-[18px]" />
                    )}
                  </div>
                  <div className="pb-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#111827]">
                      {event.action}
                    </div>
                    <div className="text-[12px] text-[#64748B] tabular-nums mt-0.5">
                      {event.timestamp} · {event.actor} ({event.role})
                    </div>
                    {event.note && (
                      <p className="text-[12px] text-[#334155] mt-1">{event.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        {canDecide && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onReject(batch)}
              className="h-10 px-4 rounded-lg border border-[#EF4444] bg-white hover:bg-[#FEE2E2] text-[#EF4444] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Tolak Batch</span>
            </button>
            <button
              type="button"
              onClick={() => onApprove(batch)}
              className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Setujui &amp; Terbitkan Sertifikat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
