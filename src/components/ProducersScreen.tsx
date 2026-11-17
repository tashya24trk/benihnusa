import React, { useMemo, useState } from 'react';
import { ArrowRight, Building2, MapPin, Phone, Search, ShieldCheck } from 'lucide-react';
import { Producer } from '../types/seed';

interface ProducersScreenProps {
  producers: Producer[];
  onViewProducerBatches: (producerName: string) => void;
}

export const ProducersScreen: React.FC<ProducersScreenProps> = ({
  producers,
  onViewProducerBatches,
}) => {
  const [search, setSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('Semua');

  const provinces = useMemo(
    () => ['Semua', ...Array.from(new Set(producers.map((p) => p.province)))],
    [producers]
  );

  const filteredProducers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return producers.filter((p) => {
      if (provinceFilter !== 'Semua' && p.province !== provinceFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.iupNumber.toLowerCase().includes(q) ||
        p.regency.toLowerCase().includes(q) ||
        p.leadAgronomist.toLowerCase().includes(q)
      );
    });
  }, [producers, search, provinceFilter]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Direktori Penangkar &amp; Produsen Benih
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Daftar badan usaha dan koperasi penangkar resmi pemegang Izin Usaha Perbenihan (IUP) terintegrasi BPSB.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="relative w-full sm:w-[360px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama penangkar, nomor IUP, atau agronomis..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {provinces.map((prov) => (
            <button
              key={prov}
              type="button"
              onClick={() => setProvinceFilter(prov)}
              className={`h-9 px-3 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                provinceFilter === prov
                  ? 'bg-[#00843D] text-white border-[#00843D]'
                  : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>
      </div>

      {/* Producers Grid */}
      {filteredProducers.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-10 text-center">
          <p className="text-[14px] font-semibold text-[#111827]">
            Penangkar tidak ditemukan.
          </p>
          <p className="text-[13px] text-[#64748B] mt-1">
            Silakan ubah filter provinsi atau kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducers.map((producer) => (
            <div
              key={producer.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col justify-between"
              style={{
                boxShadow:
                  '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F0FAF3] text-[#00843D] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#15803D]">
                    <ShieldCheck className="w-4 h-4" />
                    IUP Terverifikasi
                  </span>
                </div>

                <h2 className="mt-3.5 text-[16px] font-semibold text-[#111827] leading-snug">
                  {producer.name}
                </h2>
                <p className="mt-1 text-[12px] text-[#64748B] tabular-nums">
                  {producer.iupNumber}
                </p>

                <div className="mt-4 space-y-2 text-[13px] text-[#334155]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span>
                      {producer.regency}, {producer.province}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span className="tabular-nums">{producer.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[11px] text-[#64748B]">Luas Lahan</div>
                    <div className="text-[14px] font-bold text-[#111827] tabular-nums mt-0.5">
                      {producer.acreageHa} Ha
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B]">Batch Aktif</div>
                    <div className="text-[14px] font-bold text-[#111827] tabular-nums mt-0.5">
                      {producer.activeBatches} lot
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#64748B]">Lolos Uji</div>
                    <div className="text-[14px] font-bold text-[#00843D] tabular-nums mt-0.5">
                      {producer.passRatePercent}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                <span className="text-[12px] text-[#64748B] truncate">
                  {producer.commodities.join(' · ')}
                </span>
                <button
                  type="button"
                  onClick={() => onViewProducerBatches(producer.name)}
                  className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Lihat Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
