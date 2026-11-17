import React, { useMemo } from 'react';
import {
  ArrowRight,
  Building2,
  Clock,
  GitFork,
  PackageCheck,
  Truck,
  Warehouse,
} from 'lucide-react';
import {
  DistributorDistributionRecord,
  DistributorInventoryBatch,
  DistributorScreenId,
  IncomingBatch,
} from '../../types/distributor';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface DistributorDashboardScreenProps {
  organizationName: string;
  roleLabel: string;
  incomingBatches: IncomingBatch[];
  inventory: DistributorInventoryBatch[];
  distributions: DistributorDistributionRecord[];
  onNavigate: (screen: DistributorScreenId) => void;
  onOpenIncomingDetail: (batchId: string) => void;
  onStartReceiptConfirm: (batchId?: string) => void;
}

export const DistributorDashboardScreen: React.FC<DistributorDashboardScreenProps> = ({
  organizationName,
  roleLabel,
  incomingBatches,
  inventory,
  distributions,
  onNavigate,
  onOpenIncomingDetail,
  onStartReceiptConfirm,
}) => {
  const stats = useMemo(() => {
    const acceptedCount = incomingBatches.filter(
      (b) => b.receiptStatus === 'Diterima'
    ).length;
    const totalStockKg = inventory.reduce(
      (sum, item) => sum + item.availableQuantityKg,
      0
    );
    const pendingConfirm = incomingBatches.filter(
      (b) => b.receiptStatus === 'Menunggu Konfirmasi'
    ).length;
    const ongoingDistributions = distributions.filter(
      (d) => d.receiptConfirmationStatus === 'Menunggu Konfirmasi'
    ).length;

    return {
      acceptedCount,
      totalStockKg,
      pendingConfirm,
      ongoingDistributions,
    };
  }, [incomingBatches, inventory, distributions]);

  const inventoryByVariety = useMemo(() => {
    const map = new Map<string, { commodity: string; totalKg: number; batches: number }>();
    inventory
      .filter((i) => i.availableQuantityKg > 0)
      .forEach((item) => {
        const prev = map.get(item.variety) ?? {
          commodity: item.commodity,
          totalKg: 0,
          batches: 0,
        };
        map.set(item.variety, {
          commodity: item.commodity,
          totalKg: prev.totalKg + item.availableQuantityKg,
          batches: prev.batches + 1,
        });
      });
    const maxKg = Math.max(...Array.from(map.values()).map((v) => v.totalKg), 1);
    return Array.from(map.entries())
      .map(([variety, data]) => ({
        variety,
        ...data,
        percent: Math.round((data.totalKg / maxKg) * 100),
      }))
      .sort((a, b) => b.totalKg - a.totalKg);
  }, [inventory]);

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Ringkasan Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pantau penerimaan, stok, dan distribusi benih organisasi Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onStartReceiptConfirm()}
            className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Konfirmasi Penerimaan</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('inventory')}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Warehouse className="w-4 h-4 text-[#64748B]" />
            <span>Lihat Stok Benih</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('distribution')}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#64748B]" />
            <span>Buat Distribusi</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('split')}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F0FAF3] hover:border-[#BBF7D0] text-[#00843D] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <GitFork className="w-4 h-4" />
            <span>Pecah Batch</span>
          </button>
        </div>
      </div>

      {/* Welcome Context Card */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[16px] font-semibold text-[#111827]">
              Selamat datang, Distributor
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] text-[#64748B]">
              <span className="font-semibold text-[#00843D]">{organizationName}</span>
              <span aria-hidden="true">·</span>
              <span>Peran: {roleLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                Stok Tersedia: {stats.totalStockKg.toLocaleString('id-ID')} kg
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap self-start sm:self-center cursor-pointer"
        >
          <span>Profil Organisasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Batch Diterima"
          value={stats.acceptedCount.toLocaleString('id-ID')}
          trendText="Terverifikasi"
          trendContext="masuk ke gudang"
          icon={PackageCheck}
        />
        <MetricCard
          title="Total Stok Benih"
          value={`${stats.totalStockKg.toLocaleString('id-ID')} kg`}
          trendText={`${inventory.filter((i) => i.availableQuantityKg > 0).length} lot aktif`}
          trendContext="milik koperasi"
          icon={Warehouse}
        />
        <MetricCard
          title="Menunggu Konfirmasi"
          value={stats.pendingConfirm.toLocaleString('id-ID')}
          trendText="Perlu diperiksa"
          trendContext="penerimaan dari produsen"
          trendPositive={false}
          icon={Clock}
        />
        <MetricCard
          title="Distribusi Berjalan"
          value={stats.ongoingDistributions.toLocaleString('id-ID')}
          trendText="Dalam pengiriman"
          trendContext="menuju petani & kios"
          icon={Truck}
        />
      </div>

      {/* Middle Panels: Recent Incoming Batches & Current Seed Inventory */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Recent Incoming Batches */}
        <div
          className="xl:col-span-7 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Batch Masuk Terbaru
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Pengiriman benih dari produsen untuk diperiksa dan dikonfirmasi
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('incoming')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Semua Batch Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {incomingBatches.slice(0, 4).map((batch) => (
              <div
                key={batch.id}
                className="px-6 py-4 hover:bg-[#F0FAF3]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onOpenIncomingDetail(batch.id)}
                      className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                    >
                      {batch.batchNumber}
                    </button>
                    <StatusBadge status={batch.receiptStatus} />
                  </div>
                  <div className="text-[13px] font-medium text-[#111827] mt-1">
                    {batch.variety} · {batch.quantityKg.toLocaleString('id-ID')} kg
                  </div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">
                    Dari {batch.producerName} · Transfer {batch.transferDate}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {batch.receiptStatus === 'Menunggu Konfirmasi' ? (
                    <button
                      type="button"
                      onClick={() => onStartReceiptConfirm(batch.id)}
                      className="h-8 px-3 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Konfirmasi
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenIncomingDetail(batch.id)}
                      className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] whitespace-nowrap cursor-pointer"
                    >
                      Detail
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Seed Inventory grouped by variety */}
        <div
          className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="pb-4 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
            <div>
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Stok Benih Saat Ini
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Ringkasan persediaan berdasarkan bahan tanam benih
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('inventory')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Stok</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {inventoryByVariety.map((row) => (
              <div key={row.variety} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="font-medium text-[#111827] truncate">
                    {row.variety}
                  </span>
                  <span className="text-[#64748B] tabular-nums shrink-0">
                    {row.totalKg.toLocaleString('id-ID')} kg · {row.batches} lot
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
        </div>
      </div>

      {/* Recent Distribution Activity */}
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
              Aktivitas Distribusi &amp; Transfer Terbaru
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Penyaluran benih ke petani, kelompok tani, dan kios mitra
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('distribution')}
            className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap self-start sm:self-center cursor-pointer"
          >
            <span>Lihat Semua Distribusi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 px-6 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-4 whitespace-nowrap">Penerima Tujuan</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Jumlah</th>
                <th className="py-3 px-4 whitespace-nowrap">Tanggal Transfer</th>
                <th className="py-3 px-4 whitespace-nowrap">Status Kepemilikan</th>
                <th className="py-3 px-6 whitespace-nowrap">Konfirmasi Terima</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((dist) => (
                <tr
                  key={dist.id}
                  className="h-[52px] border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F0FAF3] transition-colors"
                >
                  <td className="py-2.5 px-6 whitespace-nowrap">
                    <div className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                      {dist.batchNumber}
                    </div>
                    <div className="text-[12px] text-[#64748B]">{dist.variety}</div>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="text-[13px] font-medium text-[#111827]">
                      {dist.recipientName}
                    </div>
                    <div className="text-[12px] text-[#64748B]">{dist.recipientType}</div>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                    {dist.quantityKg.toLocaleString('id-ID')} kg
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                    {dist.transferDate}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <StatusBadge status={dist.ownershipStatus} />
                  </td>
                  <td className="py-2.5 px-6 whitespace-nowrap">
                    <StatusBadge status={dist.receiptConfirmationStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
