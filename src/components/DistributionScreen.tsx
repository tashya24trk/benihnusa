import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  PackageCheck,
  QrCode,
  Search,
  Truck,
} from 'lucide-react';
import { DistributionShipment } from '../types/seed';
import { MetricCard } from './ui/MetricCard';
import { QrCodeSvg } from './ui/QrCodeSvg';
import { StatusBadge } from './ui/StatusBadge';

interface DistributionScreenProps {
  shipments: DistributionShipment[];
  onConfirmDelivery: (shipmentId: string) => void;
  onSimulateQrScan: (shipmentId: string) => void;
}

export const DistributionScreen: React.FC<DistributionScreenProps> = ({
  shipments,
  onConfirmDelivery,
  onSimulateQrScan,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Aktif' | 'Selesai'>('Semua');
  const [selectedId, setSelectedId] = useState<string>(shipments[0]?.id ?? '');

  const filteredShipments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return shipments.filter((s) => {
      if (statusFilter === 'Aktif' && s.status === 'Distribusi Selesai') return false;
      if (statusFilter === 'Selesai' && s.status !== 'Distribusi Selesai') return false;
      if (!q) return true;
      return (
        s.waybillNumber.toLowerCase().includes(q) ||
        s.batchNumber.toLowerCase().includes(q) ||
        s.destinationEntity.toLowerCase().includes(q) ||
        s.destinationProvince.toLowerCase().includes(q)
      );
    });
  }, [shipments, search, statusFilter]);

  const activeShipment =
    shipments.find((s) => s.id === selectedId) ?? filteredShipments[0] ?? shipments[0];

  const stats = useMemo(() => {
    const activeCount = shipments.filter((s) => s.status !== 'Distribusi Selesai').length;
    const totalKg = shipments.reduce((sum, s) => sum + s.quantityKg, 0);
    const totalQrScans = shipments.reduce((sum, s) => sum + s.qrVerifiedCount, 0);
    const completedCount = shipments.filter((s) => s.status === 'Distribusi Selesai').length;
    return { activeCount, totalKg, totalQrScans, completedCount };
  }, [shipments]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Distribusi &amp; Logistik Rantai Pasok
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Pelacakan surat jalan pengiriman benih bersertifikat dan verifikasi pemindaian QR oleh kios tani penerima.
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Pengiriman Aktif"
          value={stats.activeCount.toString()}
          trendText="Dalam transit"
          trendContext="lintas hub provinsi"
          trendPositive={true}
          icon={Truck}
        />
        <MetricCard
          title="Volume Muatan Tercatat"
          value={`${(stats.totalKg / 1000).toFixed(1)} Ton`}
          trendText="+14.2%"
          trendContext="alokasi musim tanam"
          icon={PackageCheck}
        />
        <MetricCard
          title="Pemindaian QR Terverifikasi"
          value={stats.totalQrScans.toLocaleString('id-ID')}
          trendText="100% asli"
          trendContext="kemasan tersegel"
          icon={QrCode}
        />
        <MetricCard
          title="Pengiriman Selesai"
          value={stats.completedCount.toString()}
          trendText="Tepat waktu"
          trendContext="serah terima gapoktan"
          icon={CheckCircle2}
        />
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Shipments Table */}
        <div
          className="xl:col-span-7 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-[320px]">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari surat jalan, batch, atau tujuan..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div className="inline-flex items-center p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg self-start">
              {(['Semua', 'Aktif', 'Selesai'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === tab
                      ? 'bg-[#00843D] text-white'
                      : 'text-[#64748B] hover:text-[#111827]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                  <th className="py-3 px-4 whitespace-nowrap">Surat Jalan &amp; Batch</th>
                  <th className="py-3 px-4 whitespace-nowrap">Tujuan Distribusi</th>
                  <th className="py-3 px-4 whitespace-nowrap text-right">Muatan</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 px-4 text-center text-[13px] text-[#64748B]">
                      Tidak ada pengiriman yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => {
                    const isSelected = activeShipment?.id === shipment.id;
                    return (
                      <tr
                        key={shipment.id}
                        onClick={() => setSelectedId(shipment.id)}
                        className={`h-[56px] border-b border-[#F1F5F9] last:border-b-0 cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#F0FAF3]' : 'bg-white hover:bg-[#F0FAF3]/60'
                        }`}
                      >
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="text-[13px] font-semibold text-[#00843D] tabular-nums">
                            {shipment.waybillNumber}
                          </div>
                          <div className="text-[12px] text-[#64748B] tabular-nums">
                            {shipment.batchNumber} · {shipment.variety}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="text-[13px] font-medium text-[#111827] max-w-[220px] truncate">
                            {shipment.destinationEntity}
                          </div>
                          <div className="text-[12px] text-[#64748B]">
                            {shipment.destinationProvince}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap text-right text-[13px] font-medium text-[#111827] tabular-nums">
                          {shipment.quantityKg.toLocaleString('id-ID')} kg
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <StatusBadge status={shipment.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route & QR Verification Inspector */}
        {activeShipment && (
          <div
            className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
            style={{
              boxShadow:
                '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                  Manifes Pengiriman
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827] tabular-nums mt-0.5">
                  {activeShipment.waybillNumber}
                </h2>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  {activeShipment.carrierName} · Plat {activeShipment.vehiclePlate}
                </p>
              </div>
              <QrCodeSvg value={`${activeShipment.waybillNumber}-${activeShipment.batchNumber}`} size={84} />
            </div>

            {/* Key Route Details */}
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <div className="text-[12px] text-[#64748B]">Gudang Asal</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {activeShipment.originWarehouse}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#64748B]">Penerima Tujuan</div>
                <div className="font-medium text-[#111827] mt-0.5">
                  {activeShipment.destinationEntity}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#64748B]">Waktu Berangkat</div>
                <div className="font-medium text-[#111827] mt-0.5 tabular-nums">
                  {activeShipment.departureDate}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#64748B]">Scan QR Terverifikasi</div>
                <div className="font-semibold text-[#00843D] mt-0.5 tabular-nums">
                  {activeShipment.qrVerifiedCount.toLocaleString('id-ID')} kemasan
                </div>
              </div>
            </div>

            {/* Checkpoints Timeline */}
            <div className="pt-2">
              <h3 className="text-[13px] font-semibold text-[#111827] mb-3">
                Jejak Titik Pemeriksaan (Chain of Custody)
              </h3>
              <div className="space-y-4">
                {activeShipment.checkpoints.map((cp, idx) => (
                  <div key={cp.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          cp.completed
                            ? 'bg-[#00843D] text-white'
                            : 'bg-slate-100 border border-[#CBD5E1] text-[#64748B]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      {idx < activeShipment.checkpoints.length - 1 && (
                        <div className="w-px flex-1 bg-[#E2E8F0] my-1 min-h-[20px]" />
                      )}
                    </div>
                    <div className="pb-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-[#111827]">
                          {cp.location}
                        </span>
                        <span className="text-[11px] text-[#64748B] tabular-nums">
                          {cp.timestamp}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                        {cp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Actions */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => onSimulateQrScan(activeShipment.id)}
                className="h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#00843D]" />
                <span>Simulasi Scan QR (+1)</span>
              </button>

              {activeShipment.status !== 'Distribusi Selesai' && (
                <button
                  type="button"
                  onClick={() => onConfirmDelivery(activeShipment.id)}
                  className="h-9 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi Tiba</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
