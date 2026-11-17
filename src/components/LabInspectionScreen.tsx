import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  FlaskConical,
  Search,
  X,
} from 'lucide-react';
import { SeedBatch } from '../types/seed';
import { StatusBadge } from './ui/StatusBadge';

interface LabInspectionScreenProps {
  batches: SeedBatch[];
  onUpdateLabMetrics: (
    batchId: string,
    metrics: {
      germinationRate: number;
      moistureContent: number;
      physicalPurity: number;
      weedSeedContent: number;
      labNotes: string;
    }
  ) => void;
  onApproveBatch: (batch: SeedBatch) => void;
  onRejectBatch: (batch: SeedBatch) => void;
}

export const LabInspectionScreen: React.FC<LabInspectionScreenProps> = ({
  batches,
  onUpdateLabMetrics,
  onApproveBatch,
  onRejectBatch,
}) => {
  const [filterMode, setFilterMode] = useState<'pending' | 'all'>('pending');
  const [search, setSearch] = useState('');

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    return batches.filter((b) => {
      if (
        filterMode === 'pending' &&
        b.status !== 'Menunggu Verifikasi' &&
        b.status !== 'Masa Karantina' &&
        b.status !== 'Lolos Uji Mutu'
      ) {
        return false;
      }
      if (!q) return true;
      return (
        b.batchNumber.toLowerCase().includes(q) ||
        b.variety.toLowerCase().includes(q) ||
        b.producerName.toLowerCase().includes(q)
      );
    });
  }, [batches, filterMode, search]);

  const [selectedId, setSelectedId] = useState<string>(
    filteredList[0]?.id ?? batches[0]?.id ?? ''
  );

  const activeBatch =
    batches.find((b) => b.id === selectedId) ?? filteredList[0] ?? batches[0];

  const [germinationInput, setGerminationInput] = useState<string>(
    activeBatch ? activeBatch.germinationRate.toString() : '85'
  );
  const [moistureInput, setMoistureInput] = useState<string>(
    activeBatch ? activeBatch.moistureContent.toString() : '11.5'
  );
  const [purityInput, setPurityInput] = useState<string>(
    activeBatch ? activeBatch.physicalPurity.toString() : '99.0'
  );
  const [weedInput, setWeedInput] = useState<string>(
    activeBatch ? activeBatch.weedSeedContent.toString() : '0.0'
  );
  const [notesInput, setNotesInput] = useState<string>(
    activeBatch?.labNotes ?? ''
  );
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSelectBatch = (batch: SeedBatch) => {
    setSelectedId(batch.id);
    setGerminationInput(batch.germinationRate.toString());
    setMoistureInput(batch.moistureContent.toString());
    setPurityInput(batch.physicalPurity.toString());
    setWeedInput(batch.weedSeedContent.toString());
    setNotesInput(batch.labNotes ?? '');
    setSavedNotice(null);
  };

  const germNum = parseFloat(germinationInput) || 0;
  const moistNum = parseFloat(moistureInput) || 0;
  const purityNum = parseFloat(purityInput) || 0;
  const weedNum = parseFloat(weedInput) || 0;

  const passGermination = germNum >= 80;
  const passMoisture = moistNum <= 13.0;
  const passPurity = purityNum >= 98.0;
  const passWeed = weedNum <= 0.2;
  const meetsQualityThreshold = passGermination && passMoisture && passPurity && passWeed;

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch) return;
    onUpdateLabMetrics(activeBatch.id, {
      germinationRate: germNum,
      moistureContent: moistNum,
      physicalPurity: purityNum,
      weedSeedContent: weedNum,
      labNotes: notesInput,
    });
    setSavedNotice('Parameter hasil uji laboratorium berhasil diperbarui.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Uji Mutu &amp; Laboratorium BPSB
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Evaluasi daya kecambah, kadar air, dan kemurnian fisik terhadap ambang mutu simulasi.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-white border border-[#E2E8F0] rounded-lg self-start">
          <button
            type="button"
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filterMode === 'pending'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Antrean Inspeksi
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              filterMode === 'all'
                ? 'bg-[#00843D] text-white'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Semua Sampel
          </button>
        </div>
      </div>

      {/* Split Inspection Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Sample Queue List */}
        <div
          className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari no. batch atau bahan tanam..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>

          <div className="divide-y divide-[#F1F5F9] max-h-[600px] overflow-y-auto">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[#64748B]">
                Tidak ada sampel uji mutu pada antrean ini.
              </div>
            ) : (
              filteredList.map((item) => {
                const isActive = activeBatch?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectBatch(item)}
                    className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer ${
                      isActive ? 'bg-[#F0FAF3]' : 'bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                        {item.batchNumber}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-1 text-[13px] font-medium text-[#111827]">
                      {item.variety}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[12px] text-[#64748B]">
                      <span className="truncate max-w-[200px]">{item.producerName}</span>
                      <span className="tabular-nums shrink-0">
                        DK {item.germinationRate.toFixed(1)}% · KA {item.moistureContent.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Laboratory Inspection Sheet */}
        {activeBatch && (
          <div
            className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F0FAF3] text-[#00843D] flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold text-[#111827] tabular-nums">
                      {activeBatch.batchNumber}
                    </h2>
                    <StatusBadge status={activeBatch.status} />
                  </div>
                  <p className="text-[13px] text-[#64748B]">
                    {activeBatch.variety} · {activeBatch.seedClass}
                  </p>
                </div>
              </div>

              <div className="text-right text-[12px] text-[#64748B]">
                <div>Produsen: {activeBatch.producerName}</div>
                <div className="tabular-nums">
                  Lokasi: {activeBatch.warehouseLocation}
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveMetrics} className="p-6 space-y-6">
              {/* Seed quality status banner */}
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  meetsQualityThreshold
                    ? 'bg-[#DCFCE7]/60 border-[#BBF7D0] text-[#15803D]'
                    : 'bg-[#FEF3C7]/70 border-[#FDE68A] text-[#B45309]'
                }`}
              >
                {meetsQualityThreshold ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="text-[13px]">
                  <p className="font-semibold">
                    {meetsQualityThreshold
                      ? 'Memenuhi Ambang Mutu Simulasi'
                      : 'Ada Parameter di Luar Ambang Mutu Simulasi'}
                  </p>
                  <p className="mt-0.5 opacity-90">
                    {meetsQualityThreshold
                      ? 'Sampel layak melanjutkan ke tahap sertifikasi simulasi.'
                      : 'Periksa kembali kadar air atau daya kecambah sebelum mengambil keputusan afkir/tolak.'}
                  </p>
                </div>
              </div>

              {/* 4 Parameter Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-semibold text-[#111827]">
                      Daya Kecambah (%)
                    </label>
                    <span className={`text-[12px] font-semibold ${passGermination ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                      Min. 80.0%
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={germinationInput}
                    onChange={(e) => setGerminationInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-semibold text-[#111827]">
                      Kadar Air (%)
                    </label>
                    <span className={`text-[12px] font-semibold ${passMoisture ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                      Maks. 13.0%
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={moistureInput}
                    onChange={(e) => setMoistureInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-semibold text-[#111827]">
                      Kemurnian Fisik (%)
                    </label>
                    <span className={`text-[12px] font-semibold ${passPurity ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                      Min. 98.0%
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={purityInput}
                    onChange={(e) => setPurityInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-semibold text-[#111827]">
                      Benih Gulma / Kotoran (%)
                    </label>
                    <span className={`text-[12px] font-semibold ${passWeed ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                      Maks. 0.2%
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={weedInput}
                    onChange={(e) => setWeedInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                  />
                </div>
              </div>

              {/* Lab Notes */}
              <div>
                <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                  Catatan Analis &amp; Pengawas Benih
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Tuliskan temuan uji kertas merang, kesehatan benih, atau kondisi penyimpanan..."
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
                />
              </div>

              {savedNotice && (
                <div className="px-3.5 py-2 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-[13px] font-medium">
                  {savedNotice}
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold cursor-pointer"
                >
                  Simpan Parameter Uji
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onRejectBatch(activeBatch)}
                    className="h-10 px-4 rounded-lg border border-[#EF4444] bg-white hover:bg-[#FEE2E2] text-[#EF4444] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Tolak / Afkir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onApproveBatch(activeBatch)}
                    className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Setujui &amp; Terbitkan Sertifikat</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
