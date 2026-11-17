import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trendText: string;
  trendContext: string;
  trendPositive?: boolean;
  icon: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trendText,
  trendContext,
  trendPositive = true,
  icon: Icon,
}) => {
  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col justify-between"
      style={{
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] font-medium text-[#64748B] leading-snug">
          {title}
        </span>
        <div className="w-10 h-10 rounded-lg bg-[#F0FAF3] text-[#00843D] p-2.5 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 text-[28px] leading-[34px] font-bold text-[#111827] tabular-nums tracking-tight">
        {value}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[12px] leading-4">
        <span
          className={`font-semibold tabular-nums ${
            trendPositive ? 'text-[#16A34A]' : 'text-[#D97706]'
          }`}
        >
          {trendText}
        </span>
        <span className="text-[#64748B] truncate">{trendContext}</span>
      </div>
    </div>
  );
};
