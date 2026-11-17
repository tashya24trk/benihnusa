import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Sprout,
} from 'lucide-react';
import { FarmerSeedBatch } from '../../types/farmer';
import { QrCodeSvg } from '../ui/QrCodeSvg';
import { StatusBadge } from '../ui/StatusBadge';

interface FarmerSeedDetailScreenProps {
  seed: FarmerSeedBatch;
  onBack: () => void;
  onVerifyBatch: (batchNumber: string) => void;
  onStartPlanting: (seedId: string) => void;
}

export const FarmerSeedDetailScreen: React.FC<FarmerSeedDetailScreenProps> = ({
  seed,
  onBack,
  onVerifyBatch,
  onStartPlanting,
}) => {
  const remainingKg = Math.max(0, seed.receivedQuantityKg - seed.plantedQuantityKg);

  return (
    <div className="space-y-6 max-w-[1040px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Benih Saya</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827] tabular-nums">
              {seed.batchNumber}
            </h1>
            <StatusBadge status={seed.verificationStatus} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            {seed.variety} · {seed.commodity} · {seed.seedClass}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {seed.verificationStatus === 'Menunggu Verifikasi' ? (
            <button
              type="button"
              onClick={() => onVerifyBatch(seed.batchNumber)}
              className="min-h-[44px] px-4 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Verifikasi QR Sekarang</span>
            </button>
          ) : (
            remainingKg > 0 && (
              <button
                type="button"
                onClick={() => onStartPlanting(seed.id)}
                className="min-h-[44px] px-4 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sprout className="w-4 h-4" />
                <span>Catat Penanaman</span>
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Asal Benih &amp; Informasi Sertifikasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <div className="text-[#64748B]">Nomor Sertifikat BPSB</div>
              <div className="font-semibold text-[#00843D] tabular-nums mt-0.5 inline-flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{seed.certificateNumber}</span>
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Status Sertifikasi</div>
              <div className="mt-1">
                <StatusBadge status={seed.certificationStatus} />
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Produsen Asal</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {seed.producerName}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Distributor / Koperasi Penyalur</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {seed.distributorName}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[#64748B]">Lokasi Asal Produksi</div>
              <div className="font-medium text-[#111827] mt-0.5">{seed.batchOrigin}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F1F5F9] text-[13px]">
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-[#64748B]">Diterima</div>
              <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                {seed.receivedQuantityKg.toLocaleString('id-ID')} kg
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-[#64748B]">Sudah Ditanam</div>
              <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                {seed.plantedQuantityKg.toLocaleString('id-ID')} kg
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#F0FAF3] border border-[#BBF7D0]">
              <div className="text-[#006B32]">Sisa Benih</div>
              <div className="font-bold text-[#00843D] tabular-nums mt-0.5">
                {remainingKg.toLocaleString('id-ID')} kg
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex items-center justify-between gap-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#00843D]">
                Label QR Batch
              </div>
              <div className="text-[14px] font-semibold text-[#111827] tabular-nums mt-1">
                {seed.batchNumber}
              </div>
              <div className="text-[12px] text-[#64748B] mt-0.5">
                Cocokkan label karung benih dengan kode ini.
              </div>
            </div>
            <QrCodeSvg value={`${seed.batchNumber}|${seed.certificateNumber}`} size={84} />
          </div>

          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Perjalanan Benih ke Lahan Anda
            </h2>
            <div className="space-y-4">
              {seed.traceabilityTimeline.map((ev, idx) => (
                <div key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#DCFCE7] text-[#00843D] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    {idx < seed.traceabilityTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-[#E2E8F0] my-1 min-h-[18px]" />
                    )}
                  </div>
                  <div className="pb-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#111827]">
                      {ev.title}
                    </div>
                    <div className="text-[11px] text-[#64748B] tabular-nums">
                      {ev.date} · {ev.organization}
                    </div>
                    <p className="text-[12px] text-[#334155] mt-0.5 leading-relaxed">
                      {ev.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
