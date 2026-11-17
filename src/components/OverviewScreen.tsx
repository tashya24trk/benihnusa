import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Eye,
  QrCode,
  ShieldCheck,
  Sprout,
  Truck,
  X,
} from 'lucide-react';
import { MONTHLY_CERTIFICATION_SERIES } from '../data/mockSeedData';
import { CommodityType, ScreenId, SeedBatch } from '../types/seed';
import { MetricCard } from './ui/MetricCard';
import { StatusBadge } from './ui/StatusBadge';

interface OverviewScreenProps {
  batches: SeedBatch[];
  onNavigate: (screen: ScreenId) => void;
  onInspectBatch: (batch: SeedBatch) => void;
  onQuickApprove: (batch: SeedBatch) => void;
  onQuickReject: (batch: SeedBatch) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  batches,
  onNavigate,
  onInspectBatch,
  onQuickApprove,
  onQuickReject,
}) => {
  const [chartCommodity, setChartCommodity] = useState<'Semua' | CommodityType>('Semua');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);

  const stats = useMemo(() => {
    const totalBatches = batches.length;
    const certifiedCount = batches.filter(
      (b) =>
        b.status === 'Sertifikat Terbit' ||
        b.status === 'Dalam Pengiriman' ||
        b.status === 'Distribusi Selesai'
    ).length;
    const passedQualityCount = batches.filter(
      (b) => b.status !== 'Ditolak BPSB' && b.status !== 'Afkir' && b.germinationRate >= 80
    ).length;
    const passRate = totalBatches > 0 ? ((passedQualityCount / totalBatches) * 100).toFixed(1) : '0.0';
    const distributedKg = batches
      .filter((b) => b.status === 'Dalam Pengiriman' || b.status === 'Distribusi Selesai')
      .reduce((sum, b) => sum + b.weightKg, 0);

    return {
      totalBatches,
      certifiedCount,
      passRate,
      distributedTons: (distributedKg / 1000).toFixed(1),
    };
  }, [batches]);

  const pendingQueue = useMemo(
    () =>
      batches.filter(
        (b) => b.status === 'Menunggu Verifikasi' || b.status === 'Lolos Uji Mutu' || b.status === 'Masa Karantina'
      ),
    [batches]
  );

  const provinceBreakdown = useMemo(() => {
    const map = new Map<string, { batches: number; totalKg: number }>();
    batches.forEach((b) => {
      const prev = map.get(b.province) ?? { batches: 0, totalKg: 0 };
      map.set(b.province, {
        batches: prev.batches + 1,
        totalKg: prev.totalKg + b.weightKg,
      });
    });
    const maxKg = Math.max(...Array.from(map.values()).map((v) => v.totalKg), 1);
    return Array.from(map.entries())
      .map(([province, data]) => ({
        province,
        ...data,
        percent: Math.round((data.totalKg / maxKg) * 100),
      }))
      .sort((a, b) => b.totalKg - a.totalKg);
  }, [batches]);

  const chartSeries = useMemo(() => {
    return MONTHLY_CERTIFICATION_SERIES.map((item) => ({
      ...item,
      scaledKg: item.totalKg,
      scaledBatches: item.batches,
    }));
  }, []);

  const maxChartKg = Math.max(...chartSeries.map((c) => c.scaledKg), 1);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Ringkasan Operasional Sertifikasi
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pemantauan nasional registrasi lot benih, hasil uji laboratorium BPSB, dan distribusi lintas provinsi.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('batches')}
          className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <span>Lihat Seluruh Batch Benih</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4-Column KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Batch Terdaftar"
          value={stats.totalBatches.toLocaleString('id-ID')}
          trendText="+12.5%"
          trendContext="dari bulan lalu"
          icon={Sprout}
        />
        <MetricCard
          title="Sertifikat Simulasi Terbit"
          value={stats.certifiedCount.toLocaleString('id-ID')}
          trendText="+8.2%"
          trendContext="teregistrasi BPSB"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Rasio Lolos Uji Mutu"
          value={`${stats.passRate}%`}
          trendText="+1.4%"
          trendContext="ambang mutu simulasi 80%"
          icon={QrCode}
        />
        <MetricCard
          title="Tonase Terdistribusi"
          value={`${stats.distributedTons} Ton`}
          trendText="+18.0%"
          trendContext="musim tanam berjalan"
          icon={Truck}
        />
      </div>

      {/* Middle Analytical Row (12-column grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Volume Sertifikasi Chart */}
        <div
          className="xl:col-span-8 bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col justify-between"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Volume Sertifikasi &amp; Kelulusan Uji Mutu
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Tonase benih tersertifikasi per bulan (Juni – November 2026)
              </p>
            </div>

            <div className="inline-flex items-center p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg self-start">
              {(['Semua', 'Kelapa Sawit'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setChartCommodity(tab)}
                  className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    chartCommodity === tab
                      ? 'bg-[#00843D] text-white'
                      : 'text-[#64748B] hover:text-[#111827]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="mt-6">
            <div className="h-[220px] flex items-end justify-between gap-3 sm:gap-5 px-1">
              {chartSeries.map((item, idx) => {
                const heightPct = Math.max(16, Math.round((item.scaledKg / maxChartKg) * 100));
                const isHovered = hoveredMonthIndex === idx;
                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setHoveredMonthIndex(idx)}
                    onMouseLeave={() => setHoveredMonthIndex(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  >
                    {isHovered && (
                      <div
                        className="absolute -top-2 z-10 bg-[#111827] text-white px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap pointer-events-none"
                        style={{
                          boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <div className="font-semibold tabular-nums">
                          {(item.scaledKg / 1000).toFixed(1)} Ton · {item.scaledBatches} batch
                        </div>
                        <div className="text-emerald-300 tabular-nums">
                          Lolos mutu simulasi: {item.passRate}%
                        </div>
                      </div>
                    )}

                    <div className="w-full max-w-[48px] flex-1 flex items-end justify-center">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-md transition-colors duration-150 ${
                          isHovered
                            ? 'bg-[#006B32]'
                            : idx === chartSeries.length - 1
                            ? 'bg-[#00843D]'
                            : 'bg-[#00843D]/75 hover:bg-[#00843D]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3 sm:gap-5 px-1">
              {chartSeries.map((item) => (
                <div key={item.month} className="flex-1 text-center">
                  <div className="text-[12px] font-semibold text-[#111827]">{item.month}</div>
                  <div className="text-[11px] text-[#64748B] tabular-nums">
                    {item.passRate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sebaran Provinsi */}
        <div
          className="xl:col-span-4 bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="pb-4 border-b border-[#E2E8F0]">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Sebaran Stok per Provinsi
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Akumulasi volume batch terdaftar aktif
            </p>
          </div>

          <div className="mt-5 space-y-4 flex-1">
            {provinceBreakdown.map((row) => (
              <div key={row.province} className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-[#111827]">{row.province}</span>
                  <span className="text-[#64748B] tabular-nums">
                    {(row.totalKg / 1000).toFixed(1)} Ton · {row.batches} lot
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#00843D]"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('producers')}
            className="mt-6 w-full h-9 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-semibold text-[#334155] transition-colors cursor-pointer"
          >
            Lihat Direktori Penangkar
          </button>
        </div>
      </div>

      {/* Antrean Verifikasi Prioritas */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Antrean Verifikasi &amp; Pengesahan Inspektur
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Batch benih yang memerlukan persetujuan laboratorium atau penerbitan sertifikat BPSB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('lab')}
            className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-semibold text-[#334155] inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <span>Buka Modul Uji Mutu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-[14px] font-medium text-[#111827]">
              Seluruh antrean verifikasi telah selesai diproses.
            </p>
            <p className="text-[13px] text-[#64748B] mt-1">
              Semua batch benih yang masuk telah memiliki keputusan sertifikasi terbaru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                  <th className="py-3 px-6 whitespace-nowrap">No. Batch</th>
                  <th className="py-3 px-4 whitespace-nowrap">Bahan Tanam &amp; Kelas</th>
                  <th className="py-3 px-4 whitespace-nowrap">Penangkar</th>
                  <th className="py-3 px-4 whitespace-nowrap text-right">Daya Kecambah</th>
                  <th className="py-3 px-4 whitespace-nowrap text-right">Kadar Air</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-6 whitespace-nowrap text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody>
                {pendingQueue.map((batch) => (
                  <tr
                    key={batch.id}
                    className="h-[52px] border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F0FAF3] transition-colors"
                  >
                    <td className="py-2.5 px-6 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onInspectBatch(batch)}
                        className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                      >
                        {batch.batchNumber}
                      </button>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="text-[13px] font-medium text-[#111827]">
                        {batch.variety}
                      </div>
                      <div className="text-[12px] text-[#64748B]">
                        {batch.commodity} · {batch.seedClass}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="text-[13px] text-[#111827]">{batch.producerName}</div>
                      <div className="text-[12px] text-[#64748B]">{batch.province}</div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap text-right text-[13px] font-medium text-[#111827] tabular-nums">
                      {batch.germinationRate.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap text-right text-[13px] text-[#64748B] tabular-nums">
                      {batch.moistureContent.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="py-2.5 px-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onInspectBatch(batch)}
                          className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickApprove(batch)}
                          className="h-8 px-2.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-[12px] font-semibold text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickReject(batch)}
                          className="h-8 px-2.5 rounded-lg border border-[#FECACA] bg-white hover:bg-[#FEE2E2] text-[12px] font-semibold text-[#EF4444] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
