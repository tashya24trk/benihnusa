import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { FarmerProfile } from '../../types/farmer';

interface FarmerProfileScreenProps {
  profile: FarmerProfile;
  onUpdateProfile: (updated: Partial<FarmerProfile>) => void;
}

export const FarmerProfileScreen: React.FC<FarmerProfileScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [phone, setPhone] = useState(profile.phone);
  const [villageDistrict, setVillageDistrict] = useState(profile.villageDistrict);
  const [managedLandHa, setManagedLandHa] = useState(String(profile.managedLandHa));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const area = Number(managedLandHa);
    onUpdateProfile({
      phone: phone.trim() || profile.phone,
      villageDistrict: villageDistrict.trim() || profile.villageDistrict,
      managedLandHa: Number.isFinite(area) && area > 0 ? area : profile.managedLandHa,
    });
  };

  return (
    <div className="space-y-6 max-w-[900px]">
      <div>
        <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#111827]">
          Profil Petani
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Informasi akun anggota kelompok tani dan data wilayah lahan Anda.
        </p>
      </div>

      {/* Top Identity Summary Card */}
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#F0FAF3] border border-[#BBF7D0] flex items-center justify-center text-[#00843D] shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#111827]">
              {profile.fullName}
            </div>
            <div className="text-[13px] text-[#64748B] mt-0.5">
              {profile.farmerGroup}
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-[12px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{profile.accountStatus}</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
            Nomor Anggota Terdaftar
          </div>
          <div className="text-[15px] font-bold text-[#00843D] tabular-nums mt-0.5">
            {profile.membershipCode}
          </div>
          <div className="text-[12px] text-[#64748B] tabular-nums mt-0.5">
            Terdaftar sejak {profile.joinedDate}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Read-only Membership & Organization Info */}
        <div
          className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Informasi Keanggotaan
          </h2>

          <div className="space-y-3.5 text-[13px]">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#64748B]">Nama Lengkap</div>
                <div className="font-semibold text-[#111827]">{profile.fullName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#64748B]">Email Akun</div>
                <div className="font-medium text-[#111827]">{profile.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#64748B]">Kelompok Tani / Organisasi</div>
                <div className="font-semibold text-[#111827]">{profile.farmerGroup}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#00843D] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#64748B]">Penyalur / Koperasi Mitra Utama</div>
                <div className="font-semibold text-[#111827]">
                  {profile.primaryDistributor}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#64748B]">Provinsi</div>
                <div className="font-medium text-[#111827]">{profile.province}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Contact & Land Info */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4"
          style={{
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <h2 className="text-[16px] font-semibold text-[#111827] pb-3 border-b border-[#E2E8F0]">
            Perbarui Kontak &amp; Alamat Lahan
          </h2>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Nomor Telepon / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Alamat Desa &amp; Kecamatan
            </label>
            <input
              type="text"
              value={villageDistrict}
              onChange={(e) => setVillageDistrict(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#111827] mb-1.5">
              Total Luas Lahan Kelola (Ha)
            </label>
            <input
              type="number"
              min={0.1}
              step="0.1"
              value={managedLandHa}
              onChange={(e) => setManagedLandHa(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#111827] tabular-nums focus:outline-none focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/20"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] rounded-xl bg-[#00843D] hover:bg-[#006B32] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Profil</span>
          </button>
        </form>
      </div>
    </div>
  );
};
