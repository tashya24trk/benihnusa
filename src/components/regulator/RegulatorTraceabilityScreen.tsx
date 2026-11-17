import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Link2,
  Search,
  ShieldCheck,
} from 'lucide-react';
import {
  EventCategoryClass,
  RegulatedSeedBatch,
  TraceabilityStage,
} from '../../types/certificationAuthority';
import { StatusBadge } from '../ui/StatusBadge';

interface RegulatorTraceabilityScreenProps {
  batches: RegulatedSeedBatch[];
  initialBatchId?: string | null;
}

const CANONICAL_STAGES: { stage: TraceabilityStage; shortLabel: string }[] = [
  { stage: 'Registrasi Batch Produsen', shortLabel: '1. Registrasi Produsen' },
  { stage: 'Pengajuan Sertifikasi', shortLabel: '2. Pengajuan Sertifikasi' },
  { stage: 'Persetujuan Sertifikasi', shortLabel: '3. Persetujuan BPSB' },
  { stage: 'Distribusi / Transfer Kepemilikan', shortLabel: '4. Distribusi / Transfer' },
  { stage: 'Konfirmasi Penerimaan', shortLabel: '5. Konfirmasi Terima' },
  { stage: 'Catatan Tanam Petani', shortLabel: '6. Catatan Tanam Petani' },
];

export const RegulatorTraceabilityScreen: React.FC<
  RegulatorTraceabilityScreenProps
> = ({ batches, initialBatchId }) => {
  const [selectedBatchId, setSelectedBatchId] = useState(
    initialBatchId || batches[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState<'all' | EventCategoryClass>('all');

  const filteredBatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return batches;
    return batches.filter(
      (b) =>
        b.batchNumber.toLowerCase().includes(q) ||
        b.variety.toLowerCase().includes(q) ||
        b.producerName.toLowerCase().includes(q) ||
        (b.certificateNumber ?? '').toLowerCase().includes(q)
    );
  }, [batches, searchQuery]);

  const activeBatch =
    batches.find((b) => b.id === selectedBatchId) ?? filteredBatches[0] ?? batches[0];

  const visibleEvents = useMemo(() => {
    if (!activeBatch) return [];
    if (eventFilter === 'all') return activeBatch.traceabilityEvents;
    return activeBatch.traceabilityEvents.filter((e) => e.eventClass === eventFilter);
  }, [activeBatch, eventFilter]);

  const completedStages = useMemo(() => {
    if (!activeBatch) return new Set<TraceabilityStage>();
    return new Set(activeBatch.traceabilityEvents.map((e) => e.stage));
  }, [activeBatch]);

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Ketertelusuran Benih
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Jejak kronologis siklus hidup benih dari hulu produsen hingga penanaman petani, membedakan peristiwa bisnis tercatat blockchain dan log audit teknis.
        </p>
      </div>

      {/* Batch Selector Bar */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
          <div className="relative w-full sm:w-[260px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor batch..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <select
            value={activeBatch?.id ?? ''}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            aria-label="Pilih batch untuk ketertelusuran"
            className="h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#111827] flex-1 max-w-[420px] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
          >
            {filteredBatches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batchNumber} · {b.variety} ({b.producerName})
              </option>
            ))}
          </select>
        </div>

        {/* Event Class Filter */}
        <div className="inline-flex items-center p-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setEventFilter('all')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              eventFilter === 'all'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Semua Jejak
          </button>
          <button
            type="button"
            onClick={() => setEventFilter('blockchain')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              eventFilter === 'blockchain'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Peristiwa Blockchain
          </button>
          <button
            type="button"
            onClick={() => setEventFilter('audit')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              eventFilter === 'audit'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Log Audit Teknis
          </button>
        </div>
      </div>

      {activeBatch && (
        <>
          {/* Batch Summary + 6-Stage Milestone Strip */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-[18px] font-semibold text-[#111827] tabular-nums">
                    {activeBatch.batchNumber}
                  </h2>
                  <StatusBadge status={activeBatch.certificationStatus} />
                </div>
                <div className="text-[13px] text-[#64748B] mt-1">
                  {activeBatch.variety} · {activeBatch.producerName} ·{' '}
                  <span className="tabular-nums">
                    {activeBatch.quantityKg.toLocaleString('id-ID')} kg
                  </span>
                </div>
              </div>

              {activeBatch.certificateNumber && (
                <div className="text-left sm:text-right">
                  <div className="text-[11px] uppercase tracking-[0.04em] text-[#64748B] font-semibold">
                    Sertifikat Terhubung
                  </div>
                  <div className="text-[14px] font-bold text-[#00843D] tabular-nums">
                    {activeBatch.certificateNumber}
                  </div>
                </div>
              )}
            </div>

            {/* 6 Canonical Lifecycle Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {CANONICAL_STAGES.map((s) => {
                const reached =
                  completedStages.has(s.stage) ||
                  (s.stage === 'Persetujuan Sertifikasi' &&
                    completedStages.has('Pencabutan Sertifikasi'));
                return (
                  <div
                    key={s.stage}
                    className={`p-3 rounded-lg border text-[12px] ${
                      reached
                        ? 'bg-[#F0FAF3] border-[#BBF7D0] text-[#15803D]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          reached ? 'text-[#00843D]' : 'text-[#CBD5E1]'
                        }`}
                      />
                      <span className="truncate">{s.shortLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend Distinction: Blockchain Business Event vs Technical Audit Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div className="p-4 rounded-xl bg-white border border-[#BBF7D0] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-[#111827]">
                  Peristiwa Bisnis Tercatat Blockchain
                </div>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  Transaksi utama (registrasi lot, persetujuan/pencabutan sertifikat, transfer kepemilikan, penerimaan, dan tanam petani) yang tercatat permanen dengan hash transaksi.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#475569] flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-[#111827]">
                  Log Audit Teknis Sistem
                </div>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  Catatan operasional pendukung seperti validasi format berkas pengajuan dan pengunggahan hasil uji laboratorium sebelum penetapan keputusan resmi.
                </p>
              </div>
            </div>
          </div>

          {/* Chronological Timeline */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            {visibleEvents.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-[#64748B]">
                Tidak ada log pada kategori filter yang dipilih untuk batch ini.
              </div>
            ) : (
              <div className="space-y-6">
                {visibleEvents.map((ev, idx) => {
                  const isBlockchain = ev.eventClass === 'blockchain';
                  return (
                    <div key={ev.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${
                            isBlockchain
                              ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D]'
                              : 'bg-slate-100 border-[#CBD5E1] text-[#475569]'
                          }`}
                        >
                          {isBlockchain ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <ClipboardList className="w-4 h-4" />
                          )}
                        </div>
                        {idx < visibleEvents.length - 1 && (
                          <div className="w-px flex-1 bg-[#E2E8F0] my-1.5 min-h-[24px]" />
                        )}
                      </div>

                      <div className="flex-1 pb-2 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[14px] font-semibold text-[#111827]">
                              {ev.title}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                isBlockchain
                                  ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                                  : 'bg-slate-100 text-[#475569] border-[#E2E8F0]'
                              }`}
                            >
                              {isBlockchain ? 'Tercatat Blockchain' : 'Log Audit Teknis'}
                            </span>
                          </div>
                          <span className="text-[12px] text-[#64748B] tabular-nums">
                            {ev.timestamp}
                          </span>
                        </div>

                        <div className="text-[12px] text-[#64748B] mt-1">
                          Tahap: <strong className="text-[#334155] font-medium">{ev.stage}</strong> ·{' '}
                          Aktor: <strong className="text-[#334155] font-medium">{ev.actor}</strong> ({ev.organization})
                        </div>

                        <p className="text-[13px] text-[#334155] mt-1.5 leading-relaxed">
                          {ev.details}
                        </p>

                        {isBlockchain && ev.txHash && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-[#006B32] bg-[#F0FAF3] border border-[#BBF7D0] px-2.5 py-1 rounded-md tabular-nums">
                            <Link2 className="w-3 h-3" />
                            <span>Hash Transaksi: {ev.txHash}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
