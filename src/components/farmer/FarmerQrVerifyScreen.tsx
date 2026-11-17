import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  HelpCircle,
  QrCode,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sprout,
} from 'lucide-react';
import { QrLookupOutcome } from '../../types/farmer';
import { StatusBadge } from '../ui/StatusBadge';

interface FarmerQrVerifyScreenProps {
  mode: 'qr-verify' | 'qr-result';
  initialCode?: string;
  outcome: QrLookupOutcome | null;
  onVerifyCode: (code: string) => void;
  onBackToScanner: () => void;
  onStartPlantingFromVerified: (seedId?: string) => void;
  onGoToReceptionIssue: () => void;
}

export const FarmerQrVerifyScreen: React.FC<FarmerQrVerifyScreenProps> = ({
  mode,
  initialCode,
  outcome,
  onVerifyCode,
  onBackToScanner,
  onStartPlantingFromVerified,
  onGoToReceptionIssue,
}) => {
  const [manualCode, setManualCode] = useState(initialCode ?? '');
  const [cameraActive, setCameraActive] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onVerifyCode(manualCode.trim());
  };

  if (mode === 'qr-result' && outcome) {
    return (
      <div className="space-y-6 max-w-[920px]">
        <div>
          <button
            type="button"
            onClick={onBackToScanner}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pindai / Cek Kode Lain</span>
          </button>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Hasil Verifikasi QR Benih
          </h1>
        </div>

        {/* Result State Banner */}
        {outcome.state === 'Benih Terverifikasi' && (
          <div className="p-5 sm:p-6 rounded-xl bg-[#DCFCE7]/70 border border-[#BBF7D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#00843D] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#15803D]">
                  Benih Terverifikasi Asli
                </div>
                <p className="text-[14px] text-[#166534] mt-0.5 leading-relaxed">
                  Benih ini tercatat resmi di sistem BenihNusa Track dengan sertifikat BPSB aktif dan aman untuk ditanam.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onStartPlantingFromVerified(outcome.linkedSeedId)}
              className="min-h-[44px] px-4 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
            >
              <Sprout className="w-4 h-4" />
              <span>Catat Penanaman</span>
            </button>
          </div>
        )}

        {outcome.state === 'Sertifikasi Tidak Valid' && (
          <div className="p-5 sm:p-6 rounded-xl bg-[#FEE2E2]/80 border border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#B91C1C]">
                  Sertifikasi Tidak Valid
                </div>
                <p className="text-[14px] text-[#7F1D1D] mt-0.5 leading-relaxed">
                  {outcome.invalidReason}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToReceptionIssue}
              className="min-h-[44px] px-4 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[13px] font-semibold whitespace-nowrap cursor-pointer shrink-0"
            >
              Laporkan ke Penyalur
            </button>
          </div>
        )}

        {outcome.state === 'Data Tidak Ditemukan' && (
          <div className="p-6 rounded-xl bg-[#FEF3C7]/70 border border-[#FDE68A] space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-[#B45309]">
                  Data Tidak Ditemukan
                </div>
                <p className="text-[14px] text-[#78350F] mt-1 leading-relaxed">
                  Kode <strong className="tabular-nums">{outcome.queriedCode}</strong> tidak terdaftar di basis data sertifikasi BenihNusa Track. Periksa kembali penulisan nomor batch/sertifikat pada label karung atau hubungi Koperasi penyalur Anda.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBackToScanner}
              className="min-h-[44px] px-4 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-[13px] font-semibold cursor-pointer"
            >
              Coba Pindai atau Ketik Ulang
            </button>
          </div>
        )}

        {/* Full Metadata & Traceability Details when batch exists */}
        {outcome.state !== 'Data Tidak Ditemukan' && (
          <div className="space-y-6">
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
                Informasi Keaslian &amp; Sertifikasi Benih
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                <div>
                  <div className="text-[#64748B]">Nomor Batch</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {outcome.batchNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Jenis &amp; Bahan Tanam</div>
                  <div className="font-semibold text-[#111827] mt-0.5">
                    {outcome.commodity} · {outcome.variety}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Organisasi Produsen</div>
                  <div className="font-semibold text-[#111827] mt-0.5">
                    {outcome.producerName}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Organisasi Distributor</div>
                  <div className="font-semibold text-[#111827] mt-0.5">
                    {outcome.distributorName}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Nomor Sertifikat</div>
                  <div className="font-semibold text-[#00843D] tabular-nums mt-0.5">
                    {outcome.certificateNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Status Sertifikasi</div>
                  <div className="mt-1">
                    <StatusBadge
                      status={
                        outcome.state === 'Benih Terverifikasi' ? 'Aktif' : 'Dicabut'
                      }
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[#64748B]">Asal Produksi Batch</div>
                  <div className="font-medium text-[#111827] mt-0.5">
                    {outcome.batchOrigin}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distribution History */}
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-3"
                style={{
                  boxShadow:
                    '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                }}
              >
                <h3 className="text-[15px] font-semibold text-[#111827] pb-2.5 border-b border-[#E2E8F0]">
                  Riwayat Distribusi
                </h3>
                <ul className="space-y-2.5 text-[13px] text-[#334155]">
                  {outcome.distributionHistory.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traceability Timeline */}
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-3"
                style={{
                  boxShadow:
                    '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                }}
              >
                <h3 className="text-[15px] font-semibold text-[#111827] pb-2.5 border-b border-[#E2E8F0]">
                  Jejak Ketertelusuran
                </h3>
                <div className="space-y-3">
                  {outcome.traceabilityTimeline.map((ev) => (
                    <div key={ev.id} className="text-[13px]">
                      <div className="font-semibold text-[#111827]">{ev.title}</div>
                      <div className="text-[11px] text-[#64748B] tabular-nums">
                        {ev.date} · {ev.organization}
                      </div>
                      <p className="text-[12px] text-[#475569] mt-0.5">{ev.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[920px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Verifikasi QR Benih
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Pindai label QR pada karung benih atau masukkan nomor batch untuk memastikan keaslian dan keabsahan sertifikatnya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Large QR Scanner Area */}
        <div
          className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="w-16 h-16 rounded-2xl bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center mb-4">
              {cameraActive ? (
                <Camera className="w-8 h-8" />
              ) : (
                <QrCode className="w-8 h-8" />
              )}
            </div>

            <h2 className="text-[16px] font-semibold text-[#111827]">
              {cameraActive
                ? 'Kamera Pemindai Siap — Arahkan ke Label QR Karung'
                : 'Area Pindai QR Label Benih'}
            </h2>
            <p className="text-[13px] text-[#64748B] mt-1 max-w-sm">
              Arahkan kamera ponsel Anda ke kode QR biru atau putih pada kemasan karung benih bersegel BPSB.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCameraActive(true);
                }}
                className="min-h-[46px] px-5 rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[14px] font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>{cameraActive ? 'Kamera Aktif · Pilih Contoh Hasil' : 'Buka Kamera Pemindai'}</span>
              </button>
            </div>

            {cameraActive && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] w-full space-y-2">
                <div className="text-[12px] font-medium text-[#64748B]">
                  Simulasi hasil tangkapan kamera QR:
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onVerifyCode('BNT-2026-JG-0395')}
                    className="h-9 px-3 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-[12px] font-semibold cursor-pointer"
                  >
                    QR Valid: BNT-2026-JG-0395
                  </button>
                  <button
                    type="button"
                    onClick={() => onVerifyCode('BNT-2026-BM-0142')}
                    className="h-9 px-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-[12px] font-semibold cursor-pointer"
                  >
                    QR Dicabut: BNT-2026-BM-0142
                  </button>
                  <button
                    type="button"
                    onClick={() => onVerifyCode('KODE-PALSU-999')}
                    className="h-9 px-3 rounded-lg bg-slate-100 border border-[#E2E8F0] text-[#475569] text-[12px] font-semibold cursor-pointer"
                  >
                    QR Tidak Terdaftar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Manual Batch Input */}
          <form onSubmit={handleManualSubmit} className="space-y-3 pt-2 border-t border-[#E2E8F0]">
            <label className="block text-[14px] font-semibold text-[#111827]">
              Atau Masukkan Kode Batch Secara Manual
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Contoh: BNT-2026-JG-0395 atau NT-2026-PD-0103"
                  className="w-full h-12 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>
              <button
                type="submit"
                className="min-h-[48px] px-5 rounded-xl bg-[#111827] hover:bg-slate-800 text-white text-[14px] font-semibold whitespace-nowrap cursor-pointer"
              >
                Verifikasi Benih
              </button>
            </div>
          </form>
        </div>

        {/* Clear Instructions Card */}
        <div
          className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Panduan Mudah Cek Keaslian Benih
          </h2>

          <ol className="space-y-3.5 text-[13px] text-[#334155]">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] font-bold text-[12px] flex items-center justify-center shrink-0">
                1
              </span>
              <span>
                Cari <strong>label sertifikasi berkode QR</strong> yang terjahit atau menempel pada karung benih.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] font-bold text-[12px] flex items-center justify-center shrink-0">
                2
              </span>
              <span>
                Tekan tombol <strong>Buka Kamera Pemindai</strong> atau ketik nomor batch pada kotak di sebelah kiri.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] font-bold text-[12px] flex items-center justify-center shrink-0">
                3
              </span>
              <span>
                Pastikan muncul status hijau <strong>Benih Terverifikasi Asli</strong> sebelum benih disemai atau ditanam.
              </span>
            </li>
          </ol>

          <div className="p-3.5 rounded-xl bg-[#FEF3C7]/60 border border-[#FDE68A] flex items-start gap-2.5 text-[12px] text-[#92400E]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Jika muncul status merah <strong>Sertifikasi Tidak Valid</strong>, hentikan penggunaan benih dan laporkan melalui menu Penerimaan Benih.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
