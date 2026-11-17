import React, { useMemo } from 'react';
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Clock,
  Database,
  FilePlus2,
  Send,
  ShieldCheck,
  Sprout,
  Truck,
} from 'lucide-react';
import {
  CertificationApplication,
  DistributionTransfer,
  ProducerActivityLog,
  ProducerBatch,
  ProducerScreenId,
} from '../../types/producer';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface ProducerDashboardScreenProps {
  organizationName: string;
  roleLabel: string;
  batches: ProducerBatch[];
  applications: CertificationApplication[];
  transfers: DistributionTransfer[];
  activities: ProducerActivityLog[];
  onNavigate: (screen: ProducerScreenId) => void;
  onOpenBatchDetail: (batchId: string) => void;
  onOpenCertDetail: (appId: string) => void;
  onOpenQuickSubmitCert: () => void;
}

export const ProducerDashboardScreen: React.FC<ProducerDashboardScreenProps> = ({
  organizationName,
  roleLabel,
  batches,
  applications,
  transfers,
  activities,
  onNavigate,
  onOpenBatchDetail,
  onOpenCertDetail,
  onOpenQuickSubmitCert,
}) => {
  const stats = useMemo(() => {
    const totalBatches = batches.length;
    const waitingCert = batches.filter(
      (b) =>
        b.certificationStatus === 'Menunggu Verifikasi' ||
        b.certificationStatus === 'Dalam Pemeriksaan Lab' ||
        b.certificationStatus === 'Perlu Perbaikan'
    ).length;
    const certified = batches.filter(
      (b) => b.certificationStatus === 'Tersertifikasi'
    ).length;
    const inDistribution = batches.filter(
      (b) =>
        b.batchStatus === 'Dalam Distribusi' ||
        b.batchStatus === 'Dialihkan Sebagian'
    ).length;

    const totalKg = batches.reduce((acc, b) => acc + b.quantityKg, 0);

    return {
      totalBatches,
      waitingCert,
      certified,
      inDistribution,
      totalKg,
    };
  }, [batches]);

  const recentBatchActivities = useMemo(() => activities.slice(0, 5), [activities]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Ringkasan Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pantau dan kelola aktivitas produksi benih organisasi Anda.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Registrasi Batch Baru</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('batches')}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Database className="w-4 h-4 text-[#64748B]" />
            <span>Lihat Data Batch</span>
          </button>

          <button
            type="button"
            onClick={onOpenQuickSubmitCert}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F0FAF3] hover:border-[#BBF7D0] text-[#00843D] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Ajukan Sertifikasi</span>
          </button>
        </div>
      </div>

      {/* Welcome & Organization Context Card */}
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
              Selamat datang, Produsen
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] text-[#64748B]">
              <span className="font-semibold text-[#00843D]">{organizationName}</span>
              <span aria-hidden="true">·</span>
              <span>Peran: {roleLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                Stok Gudang Aktif: {stats.totalKg.toLocaleString('id-ID')} kg
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
          title="Total Batch Benih"
          value={stats.totalBatches.toLocaleString('id-ID')}
          trendText={`${stats.totalKg.toLocaleString('id-ID')} kg`}
          trendContext="tersimpan di gudang"
          icon={Sprout}
        />
        <MetricCard
          title="Menunggu Sertifikasi"
          value={stats.waitingCert.toLocaleString('id-ID')}
          trendText="Dalam proses BPSB"
          trendContext="verifikasi & uji lab"
          trendPositive={false}
          icon={ClipboardCheck}
        />
        <MetricCard
          title="Batch Tersertifikasi"
          value={stats.certified.toLocaleString('id-ID')}
          trendText="Memenuhi mutu simulasi"
          trendContext="siap alih kepemilikan"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Batch Dalam Distribusi"
          value={stats.inDistribution.toLocaleString('id-ID')}
          trendText={`${transfers.length} transfer`}
          trendContext="menuju distributor mitra"
          icon={Truck}
        />
      </div>

      {/* Operational Panels Below Metric Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Status Pengajuan Sertifikasi */}
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
                Status Pengajuan Sertifikasi
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Progres evaluasi permohonan sertifikasi oleh BPSB
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('certifications')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Semua Pengajuan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="px-6 py-4 hover:bg-[#F0FAF3]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onOpenCertDetail(app.id)}
                      className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                    >
                      {app.batchNumber}
                    </button>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="text-[13px] font-medium text-[#111827] mt-1">
                    {app.variety}
                  </div>
                  <div className="text-[12px] text-[#64748B] mt-0.5 tabular-nums">
                    Diajukan {app.submissionDate} · {app.progressLabel}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-28">
                    <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          app.status === 'Perlu Perbaikan'
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#00843D]'
                        }`}
                        style={{ width: `${app.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCertDetail(app.id)}
                    className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] whitespace-nowrap cursor-pointer"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Batch Terbaru */}
        <div
          className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Aktivitas Batch Terbaru
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Pembaruan registrasi dan proses sertifikasi
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('activity')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Riwayat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {recentBatchActivities.map((act, idx) => (
              <div key={act.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  {idx < recentBatchActivities.length - 1 && (
                    <div className="w-px flex-1 bg-[#E2E8F0] my-1 min-h-[16px]" />
                  )}
                </div>
                <div className="pb-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-[#111827]">
                      {act.title}
                    </span>
                    {act.batchId && act.batchNumber && (
                      <button
                        type="button"
                        onClick={() => onOpenBatchDetail(act.batchId!)}
                        className="text-[12px] font-semibold text-[#00843D] hover:underline tabular-nums shrink-0 cursor-pointer"
                      >
                        {act.batchNumber}
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="text-[11px] text-[#94A3B8] tabular-nums mt-1">
                    {act.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aktivitas Distribusi Terbaru */}
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
              Aktivitas Distribusi Terbaru
            </h2>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Catatan pengalihan kepemilikan dan status konfirmasi penerima benih
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('distribution')}
            className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap self-start sm:self-center cursor-pointer"
          >
            <span>Kelola Distribusi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                <th className="py-3 px-6 whitespace-nowrap">Nomor Batch</th>
                <th className="py-3 px-4 whitespace-nowrap">Tujuan Distributor / Koperasi</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Jumlah Ditransfer</th>
                <th className="py-3 px-4 whitespace-nowrap">Tanggal Transfer</th>
                <th className="py-3 px-4 whitespace-nowrap">Status Kepemilikan</th>
                <th className="py-3 px-6 whitespace-nowrap">Konfirmasi Terima</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((tr) => (
                <tr
                  key={tr.id}
                  className="h-[52px] border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F0FAF3] transition-colors"
                >
                  <td className="py-2.5 px-6 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenBatchDetail(tr.batchId)}
                      className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                    >
                      {tr.batchNumber}
                    </button>
                    <div className="text-[12px] text-[#64748B]">{tr.variety}</div>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="text-[13px] font-medium text-[#111827]">
                      {tr.destinationName}
                    </div>
                    <div className="text-[12px] text-[#64748B]">
                      {tr.destinationType} · {tr.destinationProvince}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap text-right text-[13px] font-semibold text-[#111827] tabular-nums">
                    {tr.quantityKg.toLocaleString('id-ID')} kg
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                    {tr.transferDate}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <StatusBadge status={tr.ownershipStatus} />
                  </td>
                  <td className="py-2.5 px-6 whitespace-nowrap">
                    <StatusBadge status={tr.receiptStatus} />
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
