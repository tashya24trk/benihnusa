import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  GitBranch,
  Lock,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { RegulatedSeedBatch } from '../../types/certificationAuthority';
import { QrCodeSvg } from '../ui/QrCodeSvg';
import { StatusBadge } from '../ui/StatusBadge';

interface RegulatorBatchVerificationScreenProps {
  batches: RegulatedSeedBatch[];
  initialBatchId?: string | null;
  onOpenTraceability: (batchId: string) => void;
}

export const RegulatorBatchVerificationScreen: React.FC<
  RegulatorBatchVerificationScreenProps
> = ({ batches, initialBatchId, onOpenTraceability }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState(
    initialBatchId || batches[0]?.id || ''
  );

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return batches;
    return batches.filter(
      (b) =>
        b.batchNumber.toLowerCase().includes(q) ||
        b.producerName.toLowerCase().includes(q) ||
        b.variety.toLowerCase().includes(q) ||
        (b.certificateNumber ?? '').toLowerCase().includes(q)
    );
  }, [batches, searchQuery]);

  const activeBatch =
    batches.find((b) => b.id === selectedBatchId) ?? filteredList[0] ?? batches[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Verifikasi Batch
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Inspeksi menyeluruh identitas batch, legalitas produsen, dokumen sertifikasi, dan riwayat kepemilikan benih.
          </p>
        </div>

        {activeBatch && (
          <button
            type="button"
            onClick={() => onOpenTraceability(activeBatch.id)}
            className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <GitBranch className="w-4 h-4" />
            <span>Buka Ketertelusuran Penuh</span>
          </button>
        )}
      </div>

      {/* Read-only notice */}
      <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex items-start gap-3 text-[13px] text-[#475569]">
        <Lock className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#111827]">Mode Inspeksi Regulator (Baca-Saja):</span>{' '}
          Regulator dapat memverifikasi seluruh atribut batch dan rantai kepemilikan tanpa mengubah data registrasi milik produsen.
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar List of Batches */}
        <div
          className="xl:col-span-4 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="p-4 border-b border-[#E2E8F0]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari batch, sertifikat, atau produsen..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>

          <div className="divide-y divide-[#F1F5F9] max-h-[620px] overflow-y-auto">
            {filteredList.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-[#64748B]">
                Tidak ada batch yang cocok.
              </div>
            ) : (
              filteredList.map((b) => {
                const isSelected = activeBatch?.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBatchId(b.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F0FAF3]' : 'bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                        {b.batchNumber}
                      </span>
                      <StatusBadge status={b.certificationStatus} />
                    </div>
                    <div className="text-[13px] font-medium text-[#111827] mt-1">
                      {b.variety}
                    </div>
                    <div className="text-[12px] text-[#64748B] mt-0.5 truncate">
                      {b.producerName} · {b.quantityKg.toLocaleString('id-ID')} kg
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detailed Inspection View */}
        {activeBatch && (
          <div className="xl:col-span-8 space-y-6">
            {/* Batch Identity + QR */}
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-[18px] font-semibold text-[#111827] tabular-nums">
                      {activeBatch.batchNumber}
                    </h2>
                    <StatusBadge status={activeBatch.certificationStatus} />
                  </div>
                  <p className="text-[13px] text-[#64748B] mt-1">
                    {activeBatch.commodity} · {activeBatch.variety} · {activeBatch.seedClass}
                  </p>
                </div>
                <QrCodeSvg
                  value={`${activeBatch.batchNumber}|${activeBatch.certificateNumber ?? 'UNVERIFIED'}`}
                  size={76}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
                <div>
                  <div className="text-[#64748B]">Volume Batch</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {activeBatch.quantityKg.toLocaleString('id-ID')} kg
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Tanggal Produksi</div>
                  <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                    {activeBatch.productionDate}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Nomor Sertifikat</div>
                  <div className="font-semibold text-[#00843D] tabular-nums mt-0.5">
                    {activeBatch.certificateNumber ?? 'Belum Terbit'}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[#64748B]">Lokasi Produksi</div>
                  <div className="font-medium text-[#111827] mt-0.5">
                    {activeBatch.productionLocation}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B]">Sumber Benih Induk</div>
                  <div className="font-medium text-[#111827] tabular-nums mt-0.5">
                    {activeBatch.seedSource}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-3 text-[13px]">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#64748B]">Daya Kecambah</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {activeBatch.germinationRate.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#64748B]">Kadar Air</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {activeBatch.moistureContent.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#64748B]">Kemurnian Fisik</div>
                  <div className="font-bold text-[#111827] tabular-nums mt-0.5">
                    {activeBatch.physicalPurity.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Producer Info & Certification Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3"
                style={{
                  boxShadow:
                    '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
                  <Building2 className="w-4 h-4 text-[#00843D]" />
                  <h3 className="text-[14px] font-semibold text-[#111827]">
                    Informasi Produsen
                  </h3>
                </div>
                <div className="space-y-2 text-[13px]">
                  <div>
                    <div className="text-[#64748B]">Organisasi</div>
                    <div className="font-semibold text-[#111827]">
                      {activeBatch.producerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Nomor IUP Perbenihan</div>
                    <div className="font-medium text-[#111827] tabular-nums">
                      {activeBatch.producerLicense}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#64748B]">Wilayah Provinsi</div>
                    <div className="font-medium text-[#111827]">
                      {activeBatch.producerProvince}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3"
                style={{
                  boxShadow:
                    '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E8F0]">
                  <FileText className="w-4 h-4 text-[#00843D]" />
                  <h3 className="text-[14px] font-semibold text-[#111827]">
                    Dokumen Sertifikasi
                  </h3>
                </div>
                <div className="space-y-2">
                  {activeBatch.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-[#111827] truncate">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-[#64748B]">{doc.docType}</div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ownership History */}
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h3 className="text-[15px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
                Riwayat Kepemilikan Batch
              </h3>
              <div className="space-y-3">
                {activeBatch.ownershipHistory.map((own) => (
                  <div
                    key={own.id}
                    className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-[#111827]">
                        {own.fromParty} → {own.toParty}
                      </div>
                      <div className="text-[12px] text-[#64748B] tabular-nums mt-0.5">
                        {own.transferType} · Ref: {own.referenceCode} · {own.timestamp}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[13px] font-bold text-[#111827] tabular-nums">
                        {own.quantityKg.toLocaleString('id-ID')} kg
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traceability Preview */}
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  Ringkasan Ketertelusuran ({activeBatch.traceabilityEvents.length} Peristiwa)
                </h3>
                <button
                  type="button"
                  onClick={() => onOpenTraceability(activeBatch.id)}
                  className="text-[13px] font-semibold text-[#00843D] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Timeline Lengkap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {activeBatch.traceabilityEvents.slice(0, 4).map((ev) => (
                  <div key={ev.id} className="flex items-start justify-between gap-3 text-[13px]">
                    <div className="min-w-0">
                      <div className="font-semibold text-[#111827]">{ev.title}</div>
                      <div className="text-[12px] text-[#64748B]">
                        {ev.actor} · {ev.organization}
                      </div>
                    </div>
                    <span className="text-[12px] text-[#64748B] tabular-nums shrink-0">
                      {ev.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
