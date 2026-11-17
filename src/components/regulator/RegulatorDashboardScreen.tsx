import React, { useMemo } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  GitBranch,
  ShieldAlert,
} from 'lucide-react';
import {
  CertificationApplicationRecord,
  RegulatorActivityLog,
  RegulatorScreenId,
  SeedCertificationRecord,
} from '../../types/certificationAuthority';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface RegulatorDashboardScreenProps {
  organizationName: string;
  inspectorName: string;
  applications: CertificationApplicationRecord[];
  certificates: SeedCertificationRecord[];
  activities: RegulatorActivityLog[];
  onNavigate: (screen: RegulatorScreenId) => void;
  onReviewApplication: (appId: string) => void;
  onQuickInspectPending: () => void;
}

export const RegulatorDashboardScreen: React.FC<
  RegulatorDashboardScreenProps
> = ({
  organizationName,
  inspectorName,
  applications,
  certificates,
  activities,
  onNavigate,
  onReviewApplication,
  onQuickInspectPending,
}) => {
  const stats = useMemo(() => {
    const totalApps = applications.length;
    const waitingReview = applications.filter(
      (a) => a.status === 'Menunggu Pemeriksaan' || a.status === 'Dalam Pemeriksaan'
    ).length;
    const approvedApps = applications.filter((a) => a.status === 'Disetujui').length;
    const rejectedApps = applications.filter((a) => a.status === 'Ditolak').length;
    const revokedCerts = certificates.filter((c) => c.status === 'Dicabut').length;
    return {
      totalApps,
      waitingReview,
      approvedApps,
      rejectedOrRevoked: rejectedApps + revokedCerts,
      activeCerts: certificates.filter((c) => c.status === 'Aktif').length,
      revokedCerts,
    };
  }, [applications, certificates]);

  const statusBreakdown = useMemo(() => {
    const total = Math.max(applications.length + stats.revokedCerts, 1);
    const items = [
      {
        label: 'Sertifikasi Disetujui / Aktif',
        count: stats.approvedApps,
        color: 'bg-[#00843D]',
      },
      {
        label: 'Menunggu Pemeriksaan',
        count: applications.filter((a) => a.status === 'Menunggu Pemeriksaan').length,
        color: 'bg-[#F59E0B]',
      },
      {
        label: 'Dalam Pemeriksaan',
        count: applications.filter((a) => a.status === 'Dalam Pemeriksaan').length,
        color: 'bg-[#2563EB]',
      },
      {
        label: 'Ditolak / Dicabut',
        count: stats.rejectedOrRevoked,
        color: 'bg-[#EF4444]',
      },
    ];
    return items.map((item) => ({
      ...item,
      percent: Math.round((item.count / total) * 100),
    }));
  }, [applications, stats]);

  const batchesNeedingReview = useMemo(
    () =>
      applications.filter(
        (a) => a.status === 'Menunggu Pemeriksaan' || a.status === 'Dalam Pemeriksaan'
      ),
    [applications]
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
            Ringkasan Operasional
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Pantau proses sertifikasi dan ketertelusuran benih.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onQuickInspectPending}
            className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] active:scale-[0.98] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Periksa Permohonan</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('registry')}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#64748B]" />
            <span>Lihat Data Sertifikasi</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('traceability')}
            className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F0FAF3] hover:border-[#BBF7D0] text-[#00843D] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <GitBranch className="w-4 h-4" />
            <span>Telusuri Batch</span>
          </button>
        </div>
      </div>

      {/* Institutional Context Banner */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[16px] font-semibold text-[#111827]">
              {organizationName}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] text-[#64748B]">
              <span>Pengawas Aktif: <strong className="text-[#111827] font-semibold">{inspectorName}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{stats.activeCerts} sertifikat aktif beredar</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap self-start sm:self-center cursor-pointer"
        >
          <span>Profil Lembaga</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Permohonan Sertifikasi"
          value={stats.totalApps.toLocaleString('id-ID')}
          trendText="Terdaftar"
          trendContext="periode pengawasan aktif"
          icon={ClipboardCheck}
        />
        <MetricCard
          title="Menunggu Pemeriksaan"
          value={stats.waitingReview.toLocaleString('id-ID')}
          trendText="Perlu tindak lanjut"
          trendContext="antrean inspektur BPSB"
          trendPositive={false}
          icon={Clock}
        />
        <MetricCard
          title="Sertifikasi Disetujui"
          value={stats.approvedApps.toLocaleString('id-ID')}
          trendText="Lulus uji SNI"
          trendContext="label QR diterbitkan"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Sertifikasi Ditolak / Dicabut"
          value={stats.rejectedOrRevoked.toLocaleString('id-ID')}
          trendText="Tindakan kepatuhan"
          trendContext="dengan berita acara"
          trendPositive={false}
          icon={ShieldAlert}
        />
      </div>

      {/* Middle Section: Recent Certification Applications & Status Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Permohonan Sertifikasi Terbaru */}
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
                Permohonan Sertifikasi Terbaru
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Pengajuan pemeriksaan mutu benih oleh penangkar terdaftar
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('applications')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="px-6 py-4 hover:bg-[#F0FAF3]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onReviewApplication(app.id)}
                      className="text-[13px] font-semibold text-[#00843D] hover:underline tabular-nums cursor-pointer"
                    >
                      {app.applicationNumber}
                    </button>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="text-[13px] font-medium text-[#111827] mt-1">
                    {app.batchNumber} · {app.variety} ({app.quantityKg.toLocaleString('id-ID')} kg)
                  </div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">
                    {app.producerName} · Diajukan {app.submissionDate}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onReviewApplication(app.id)}
                  className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#334155] whitespace-nowrap self-start sm:self-center cursor-pointer"
                >
                  {app.status === 'Menunggu Pemeriksaan' || app.status === 'Dalam Pemeriksaan'
                    ? 'Periksa'
                    : 'Detail'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Status Sertifikasi */}
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
                Ringkasan Status Sertifikasi
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Distribusi status permohonan dan sertifikat terbit
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('registry')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Registri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {statusBreakdown.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="font-medium text-[#111827]">{item.label}</span>
                  <span className="text-[#64748B] tabular-nums">
                    {item.count} ({item.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Batch yang Perlu Ditinjau & Aktivitas Pemeriksaan */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Batch yang Perlu Ditinjau */}
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
                Batch yang Perlu Ditinjau
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Daftar antrean verifikasi lapangan, uji lab, dan persetujuan sertifikat
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('verification')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Verifikasi Batch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                  <th className="py-3 pl-6 pr-3 whitespace-nowrap">Nomor Batch</th>
                  <th className="py-3 px-3 whitespace-nowrap">Produsen</th>
                  <th className="py-3 px-3 whitespace-nowrap">Varietas</th>
                  <th className="py-3 px-3 whitespace-nowrap">Status</th>
                  <th className="py-3 pl-3 pr-6 whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {batchesNeedingReview.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 px-6 text-center text-[13px] text-[#64748B]">
                      Seluruh batch dalam antrean telah selesai diperiksa.
                    </td>
                  </tr>
                ) : (
                  batchesNeedingReview.map((app) => (
                    <tr
                      key={app.id}
                      className="h-[52px] border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F0FAF3] transition-colors"
                    >
                      <td className="py-2.5 pl-6 pr-3 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                          {app.batchNumber}
                        </div>
                        <div className="text-[11px] text-[#64748B] tabular-nums">
                          {app.applicationNumber}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#111827] max-w-[180px] truncate">
                        {app.producerName}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[13px] text-[#334155]">
                        {app.variety}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-2.5 pl-3 pr-6 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => onReviewApplication(app.id)}
                          className="h-8 px-3 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[12px] font-semibold cursor-pointer"
                        >
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aktivitas Pemeriksaan */}
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
                Aktivitas Pemeriksaan
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Log keputusan pemeriksaan dan pengawasan terbaru
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('activity')}
              className="text-[13px] font-semibold text-[#00843D] hover:text-[#006B32] inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Semua Log</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="pb-3.5 border-b border-[#F1F5F9] last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[#111827]">
                    {act.title}
                  </span>
                  {act.referenceCode && (
                    <span className="text-[12px] font-semibold text-[#00843D] tabular-nums shrink-0">
                      {act.referenceCode}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#475569] mt-1 leading-relaxed">
                  {act.description}
                </p>
                <div className="text-[11px] text-[#64748B] tabular-nums mt-1">
                  {act.timestamp} · {act.actor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
