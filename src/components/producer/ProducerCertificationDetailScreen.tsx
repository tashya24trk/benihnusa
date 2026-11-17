import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquareText,
} from 'lucide-react';
import { CertificationApplication } from '../../types/producer';
import { StatusBadge } from '../ui/StatusBadge';

interface ProducerCertificationDetailScreenProps {
  application: CertificationApplication;
  onBack: () => void;
  onOpenBatchDetail: (batchId: string) => void;
}

export const ProducerCertificationDetailScreen: React.FC<
  ProducerCertificationDetailScreenProps
> = ({ application, onBack, onOpenBatchDetail }) => {
  return (
    <div className="space-y-6 max-w-[1120px]">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pengajuan Sertifikasi</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827] tabular-nums">
              {application.applicationNumber}
            </h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-[14px] text-[#64748B] tabular-nums">
            Batch {application.batchNumber} · {application.variety} · Diajukan{' '}
            {application.submissionDate}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenBatchDetail(application.batchId)}
          className="h-10 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-semibold text-[#334155] inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Lihat Detail Batch</span>
          <ExternalLink className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>

      {/* Progress & Regulator Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Card */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-[#111827]">
                  Progres Evaluasi BPSB
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  {application.assignedBpsbOffice}
                </p>
              </div>
              <span className="text-[20px] font-bold text-[#00843D] tabular-nums">
                {application.progressPercent}%
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  application.status === 'Perlu Perbaikan'
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#00843D]'
                }`}
                style={{ width: `${application.progressPercent}%` }}
              />
            </div>
            <div className="text-[13px] font-medium text-[#334155]">
              {application.progressLabel}
            </div>

            {application.labMetrics && (
              <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="text-[11px] text-[#64748B]">Daya Kecambah</div>
                  <div className="text-[16px] font-bold text-[#111827] tabular-nums mt-0.5">
                    {application.labMetrics.germinationRate !== undefined
                      ? `${application.labMetrics.germinationRate.toFixed(1)}%`
                      : 'Dalam Uji'}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="text-[11px] text-[#64748B]">Kadar Air</div>
                  <div className="text-[16px] font-bold text-[#111827] tabular-nums mt-0.5">
                    {application.labMetrics.moistureContent !== undefined
                      ? `${application.labMetrics.moistureContent.toFixed(1)}%`
                      : 'Dalam Uji'}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="text-[11px] text-[#64748B]">Kemurnian Fisik</div>
                  <div className="text-[16px] font-bold text-[#111827] tabular-nums mt-0.5">
                    {application.labMetrics.physicalPurity !== undefined
                      ? `${application.labMetrics.physicalPurity.toFixed(1)}%`
                      : 'Dalam Uji'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chronological Timeline */}
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-4 border-b border-[#E2E8F0]">
              Timeline Status Pengajuan
            </h2>

            <div className="mt-5 space-y-5">
              {application.timeline.map((step, idx) => {
                const isDone = step.state === 'completed';
                const isCurrent = step.state === 'current';
                const isIssue = step.state === 'issue';
                return (
                  <div key={step.id} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-[#00843D] text-white'
                            : isCurrent
                            ? 'bg-[#EFF6FF] border border-[#93C5FD] text-[#1D4ED8]'
                            : isIssue
                            ? 'bg-[#FEF3C7] border border-[#FCD34D] text-[#B45309]'
                            : 'bg-slate-100 border border-[#CBD5E1] text-[#64748B]'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isIssue ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      {idx < application.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-[#E2E8F0] my-1.5 min-h-[20px]" />
                      )}
                    </div>

                    <div className="pb-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#111827]">
                          {step.title}
                        </span>
                        <span className="text-[12px] text-[#64748B] tabular-nums">
                          {step.timestamp}
                        </span>
                      </div>
                      <div className="text-[12px] font-medium text-[#64748B] mt-0.5">
                        {step.actor}
                      </div>
                      <p className="text-[13px] text-[#334155] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Regulator Feedback & Batch Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
              <MessageSquareText className="w-5 h-5 text-[#00843D]" />
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Umpan Balik Regulator (BPSB)
              </h2>
            </div>

            <div
              className={`p-4 rounded-lg border text-[13px] leading-relaxed ${
                application.status === 'Perlu Perbaikan'
                  ? 'bg-[#FEF3C7]/60 border-[#FDE68A] text-[#92400E]'
                  : application.status === 'Tersertifikasi'
                  ? 'bg-[#DCFCE7]/50 border-[#BBF7D0] text-[#15803D]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]'
              }`}
            >
              {application.regulatorFeedback}
            </div>

            <p className="text-[12px] text-[#64748B]">
              Catatan evaluasi dan keputusan sertifikat diterbitkan secara eksklusif oleh Pengawas Benih Tanaman &amp; Inspektur BPSB.
            </p>
          </div>

          <div
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4 text-[13px]"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
              Ringkasan Batch Diajukan
            </h2>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Nomor Batch</span>
              <span className="font-semibold text-[#111827] tabular-nums">
                {application.batchNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Komoditas</span>
              <span className="font-medium text-[#111827]">{application.commodity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Varietas</span>
              <span className="font-medium text-[#111827]">{application.variety}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Kelas Benih</span>
              <span className="font-medium text-[#111827]">{application.seedClass}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Volume Diajukan</span>
              <span className="font-semibold text-[#111827] tabular-nums">
                {application.quantityKg.toLocaleString('id-ID')} kg
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
