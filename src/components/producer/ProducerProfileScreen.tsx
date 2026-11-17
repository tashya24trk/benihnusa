import React, { useState } from 'react';
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ProducerOrganizationProfile } from '../../types/producer';

interface ProducerProfileScreenProps {
  profile: ProducerOrganizationProfile;
  onUpdateProfile: (updated: ProducerOrganizationProfile) => void;
}

export const ProducerProfileScreen: React.FC<ProducerProfileScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [operationalNotes, setOperationalNotes] = useState(profile.operationalNotes);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      phone: phone.trim(),
      address: address.trim(),
      operationalNotes: operationalNotes.trim(),
    });
  };

  return (
    <div className="space-y-6 max-w-[1040px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Profil Organisasi
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Informasi perizinan perbenihan resmi dan kontak operasional organisasi {profile.organizationName}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Official Regulated Identity */}
        <div
          className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="flex items-center gap-3.5 pb-4 border-b border-[#E2E8F0]">
            <div className="w-12 h-12 rounded-xl bg-[#F0FAF3] border border-[#BBF7D0] text-[#00843D] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#111827]">
                {profile.organizationName}
              </h2>
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#15803D] mt-0.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Produsen Terdaftar &amp; Disetujui</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-[13px]">
            <div>
              <div className="text-[#64748B]">Nomor Izin Usaha Perbenihan (IUP)</div>
              <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                {profile.iupNumber}
              </div>
            </div>
            <div>
              <div className="text-[#64748B]">Akreditasi Berlaku Hingga</div>
              <div className="font-semibold text-[#111827] tabular-nums mt-0.5">
                {profile.accreditedUntil}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F5F9]">
              <div>
                <div className="text-[#64748B]">Luas Lahan</div>
                <div className="font-bold text-[16px] text-[#111827] tabular-nums mt-0.5">
                  {profile.totalAcreageHa} Ha
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Kapasitas Gudang</div>
                <div className="font-bold text-[16px] text-[#111827] tabular-nums mt-0.5">
                  {profile.warehouseCapacityTon} Ton
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#F1F5F9]">
              <div className="text-[#64748B]">Komoditas Terdaftar</div>
              <div className="font-medium text-[#111827] mt-0.5">
                {profile.primaryCommodities.join(' · ')}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact & Editable Operational Information */}
        <div
          className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[16px] font-semibold text-[#111827] pb-4 border-b border-[#E2E8F0]">
            Informasi Akun &amp; Kontak Operasional
          </h2>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Penanggung Jawab</span>
                </div>
                <div className="font-semibold text-[#111827] mt-1">
                  {profile.representativeName}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Terdaftar</span>
                </div>
                <div className="font-semibold text-[#111827] mt-1 truncate">
                  {profile.email}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Nomor Telepon Operasional</span>
                </span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Alamat Kebun &amp; Gudang Induk</span>
                </span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Catatan Fasilitas Gudang
              </label>
              <textarea
                rows={3}
                value={operationalNotes}
                onChange={(e) => setOperationalNotes(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#E2E8F0] text-[14px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Kontak</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
