import React, { useMemo } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  PackageCheck,
  QrCode,
  Sprout,
  User,
  Wheat,
} from 'lucide-react';
import {
  FarmerIncomingBatch,
  FarmerPlantingRecord,
  FarmerScreenId,
  FarmerSeedBatch,
} from '../../types/farmer';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface FarmerDashboardScreenProps {
  farmerName: string;
  farmerGroup: string;
  seeds: FarmerSeedBatch[];
  incoming: FarmerIncomingBatch[];
  plantings: FarmerPlantingRecord[];
  onNavigate: (screen: FarmerScreenId) => void;
  onOpenSeedDetail: (seedId: string) => void;
  onQuickVerifyBatch: (batchNumber: string) => void;
  onStartReceptionConfirm: (incomingId?: string) => void;
  onOpenPlantingDetail: (plantingId: string) => void;
}

export const FarmerDashboardScreen: React.FC<FarmerDashboardScreenProps> = ({
  farmerName,
  farmerGroup,
  seeds,
  incoming,
  plantings,
  onNavigate,
  onOpenSeedDetail,
  onQuickVerifyBatch,
  onStartReceptionConfirm,
  onOpenPlantingDetail,
}) => {
  const stats = useMemo(() => {
    const totalReceived = seeds.length;
    const waitingVerify = seeds.filter(
      (s) => s.verificationStatus === 'Menunggu Verifikasi'
    ).length;
    const verifiedCount = seeds.filter(
      (s) => s.verificationStatus === 'Terverifikasi'
    ).length;
    const plantingCount = plantings.filter((p) => p.status !== 'Draf').length;
    const pendingReception = incoming.filter(
      (i) => i.receptionStatus === 'Menunggu Konfirmasi'
    ).length;
    return {
      totalReceived,
      waitingVerify,
      verifiedCount,
      plantingCount,
      pendingReception,
    };
  }, [seeds, plantings, incoming]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Dashboard Petani
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Pantau penerimaan benih dan aktivitas penanaman Anda.
        </p>
      </div>

      {/* Welcome Card & Easy Touch-Friendly Quick Actions */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[17px] font-semibold text-[#111827]">
                Selamat datang, Petani · {farmerName}
              </div>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Kelola dan telusuri benih yang Anda terima ({farmerGroup}).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <span>Profil Petani</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Large Touch-Friendly Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={() => onNavigate('qr-verify')}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-[#00843D] hover:bg-[#006B32] active:scale-[0.99] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <QrCode className="w-5 h-5 shrink-0" />
            <span>Scan QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => onStartReceptionConfirm()}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F0FAF3] hover:border-[#BBF7D0] text-[#111827] text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PackageCheck className="w-5 h-5 text-[#00843D] shrink-0" />
            <span>
              Konfirmasi Penerimaan
              {stats.pendingReception > 0 ? ` (${stats.pendingReception})` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('planting-form')}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F0FAF3] hover:border-[#BBF7D0] text-[#111827] text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sprout className="w-5 h-5 text-[#00843D] shrink-0" />
            <span>Catat Penanaman</span>
          </button>
        </div>
      </div>

      {/* 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Batch Diterima"
          value={stats.totalReceived.toLocaleString('id-ID')}
          trendText="Aktif"
          trendContext="tersedia untuk Anda"
          icon={Wheat}
        />
        <MetricCard
          title="Menunggu Verifikasi"
          value={stats.waitingVerify.toLocaleString('id-ID')}
          trendText="Perlu pindai QR"
          trendContext="sebelum penanaman"
          trendPositive={false}
          icon={Clock}
        />
        <MetricCard
          title="Benih Terverifikasi"
          value={stats.verifiedCount.toLocaleString('id-ID')}
          trendText="Asli & Bersertifikat"
          trendContext="siap ditanam"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Catatan Penanaman"
          value={stats.plantingCount.toLocaleString('id-ID')}
          trendText="Tercatat"
          trendContext="musim tanam berjalan"
          icon={Sprout}
        />
      </div>

      {/* Section A & B: Benih Terbaru & Status Verifikasi */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* A. Benih Terbaru */}
        <div
          className="xl:col-span-7 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="px-5 sm:px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Benih Terbaru
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Daftar batch benih yang Anda terima dari koperasi penyalur
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('my-seeds')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Benih Saya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {seeds.slice(0, 4).map((seed) => (
              <div
                key={seed.id}
                className="px-5 sm:px-6 py-4 hover:bg-[#F0FAF3]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onOpenSeedDetail(seed.id)}
                      className="text-[14px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                    >
                      {seed.batchNumber}
                    </button>
                    <StatusBadge status={seed.verificationStatus} />
                  </div>
                  <div className="text-[14px] font-medium text-[#111827] mt-1">
                    {seed.variety} · {seed.receivedQuantityKg.toLocaleString('id-ID')} kg
                  </div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">
                    Dari {seed.distributorName} · Diterima {seed.receivedDate}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {seed.verificationStatus === 'Menunggu Verifikasi' ? (
                    <button
                      type="button"
                      onClick={() => onQuickVerifyBatch(seed.batchNumber)}
                      className="min-h-[40px] px-3.5 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Verifikasi</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenSeedDetail(seed.id)}
                      className="min-h-[40px] px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-semibold text-[#334155] cursor-pointer"
                    >
                      Lihat Detail
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B. Status Verifikasi */}
        <div
          className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="pb-3 border-b border-[#E2E8F0] flex items-center justify-between gap-2">
            <div>
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Status Verifikasi Benih
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Pastikan benih sudah terverifikasi sebelum ditanam
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {seeds.map((seed) => {
              const isVerified = seed.verificationStatus === 'Terverifikasi';
              return (
                <div
                  key={seed.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isVerified
                      ? 'bg-[#F0FAF3]/70 border-[#BBF7D0]'
                      : 'bg-[#FEF3C7]/40 border-[#FDE68A]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#111827] truncate">
                      {seed.variety}
                    </div>
                    <div className="text-[12px] text-[#64748B] tabular-nums">
                      {seed.batchNumber}
                    </div>
                  </div>

                  {isVerified ? (
                    <StatusBadge status="Terverifikasi" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => onQuickVerifyBatch(seed.batchNumber)}
                      className="min-h-[36px] px-3 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Pindai QR
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section C: Aktivitas Penanaman Terbaru */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Aktivitas Penanaman Terbaru
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Catatan penanaman benih bersertifikat di lahan Anda
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('planting')}
            className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <span>Semua Catatan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {plantings.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onOpenPlantingDetail(rec.id)}
              className="px-5 sm:px-6 py-4 hover:bg-[#F0FAF3]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                    {rec.recordCode}
                  </span>
                  <StatusBadge status={rec.status} />
                </div>
                <div className="text-[14px] font-medium text-[#111827] mt-1">
                  {rec.variety} ({rec.plantedQuantityKg.toLocaleString('id-ID')} kg ·{' '}
                  {rec.landAreaHa} Ha)
                </div>
                <div className="text-[12px] text-[#64748B] mt-0.5">
                  {rec.location} · Ditanam {rec.plantingDate}
                </div>
              </div>

              <span className="text-[13px] font-semibold text-[#00843D] inline-flex items-center gap-1 shrink-0">
                <span>Detail</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
