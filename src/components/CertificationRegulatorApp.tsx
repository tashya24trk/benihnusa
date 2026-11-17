import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  INITIAL_CERT_APPLICATIONS,
  INITIAL_CERT_REGISTRY,
  INITIAL_REGULATED_BATCHES,
  INITIAL_REGULATOR_ACTIVITIES,
  INITIAL_REGULATOR_PROFILE,
} from '../data/certificationAuthorityData';
import { INITIAL_CORRECTION_REQUESTS } from '../data/farmerSeedData';
import {
  CertificationApplicationRecord,
  PortalMode,
  RegulatedSeedBatch,
  RegulatorActivityLog,
  RegulatorOrganizationProfile,
  RegulatorScreenId,
  SeedCertificationRecord,
} from '../types/certificationAuthority';
import { FarmerPlantingRecord, PlantingCorrectionRequest } from '../types/farmer';
import { RegulatorActivityLogScreen } from './regulator/RegulatorActivityLogScreen';
import { RegulatorApplicationReviewScreen } from './regulator/RegulatorApplicationReviewScreen';
import { RegulatorApplicationsScreen } from './regulator/RegulatorApplicationsScreen';
import { RegulatorBatchVerificationScreen } from './regulator/RegulatorBatchVerificationScreen';
import { RegulatorDashboardScreen } from './regulator/RegulatorDashboardScreen';
import { RegulatorHeader } from './regulator/RegulatorHeader';
import { RegulatorProfileScreen } from './regulator/RegulatorProfileScreen';
import { RegulatorRegistryScreen } from './regulator/RegulatorRegistryScreen';
import { RegulatorRevocationScreen } from './regulator/RegulatorRevocationScreen';
import { RegulatorSidebar } from './regulator/RegulatorSidebar';
import { RegulatorTraceabilityScreen } from './regulator/RegulatorTraceabilityScreen';

const STORAGE_KEYS = {
  profile: 'benihnusa_cert_auth_profile_v1',
  applications: 'benihnusa_cert_auth_apps_v1',
  certificates: 'benihnusa_cert_auth_certs_v1',
  batches: 'benihnusa_cert_auth_batches_v1',
  activities: 'benihnusa_cert_auth_activities_v1',
};

interface CertificationRegulatorAppProps {
  onSwitchPortal: (portal: PortalMode) => void;
  onLogout?: () => void;
}

export function CertificationRegulatorApp({
  onSwitchPortal,
  onLogout,
}: CertificationRegulatorAppProps) {
  const [activeScreen, setActiveScreen] = useState<RegulatorScreenId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState<RegulatorOrganizationProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profile);
      return saved ? (JSON.parse(saved) as RegulatorOrganizationProfile) : INITIAL_REGULATOR_PROFILE;
    } catch {
      return INITIAL_REGULATOR_PROFILE;
    }
  });

  const [applications, setApplications] = useState<CertificationApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.applications);
      return saved
        ? (JSON.parse(saved) as CertificationApplicationRecord[])
        : INITIAL_CERT_APPLICATIONS;
    } catch {
      return INITIAL_CERT_APPLICATIONS;
    }
  });

  const [certificates, setCertificates] = useState<SeedCertificationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.certificates);
      return saved ? (JSON.parse(saved) as SeedCertificationRecord[]) : INITIAL_CERT_REGISTRY;
    } catch {
      return INITIAL_CERT_REGISTRY;
    }
  });

  const [regulatedBatches, setRegulatedBatches] = useState<RegulatedSeedBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.batches);
      return saved ? (JSON.parse(saved) as RegulatedSeedBatch[]) : INITIAL_REGULATED_BATCHES;
    } catch {
      return INITIAL_REGULATED_BATCHES;
    }
  });

  const [activities, setActivities] = useState<RegulatorActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.activities);
      return saved ? (JSON.parse(saved) as RegulatorActivityLog[]) : INITIAL_REGULATOR_ACTIVITIES;
    } catch {
      return INITIAL_REGULATOR_ACTIVITIES;
    }
  });

  const [farmerCorrections, setFarmerCorrections] = useState<PlantingCorrectionRequest[]>(() => {
    try {
      const saved = localStorage.getItem('benihnusa_farmer_corrections_v1');
      return saved ? (JSON.parse(saved) as PlantingCorrectionRequest[]) : INITIAL_CORRECTION_REQUESTS;
    } catch {
      return INITIAL_CORRECTION_REQUESTS;
    }
  });

  const [selectedAppId, setSelectedAppId] = useState<string>(
    INITIAL_CERT_APPLICATIONS[0].id
  );
  const [selectedVerifyBatchId, setSelectedVerifyBatchId] = useState<string | null>(
    INITIAL_REGULATED_BATCHES[0].id
  );
  const [selectedTraceBatchId, setSelectedTraceBatchId] = useState<string | null>(
    INITIAL_REGULATED_BATCHES[0].id
  );
  const [preselectedRevokeCertId, setPreselectedRevokeCertId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
      localStorage.setItem(STORAGE_KEYS.certificates, JSON.stringify(certificates));
      localStorage.setItem(STORAGE_KEYS.batches, JSON.stringify(regulatedBatches));
      localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
    } catch {
      // Ignore storage quota issues
    }
  }, [profile, applications, certificates, regulatedBatches, activities]);

  // Merge any application/certificate batch missing from regulatedBatches so verification & traceability work for every batch
  const allInspectableBatches = useMemo<RegulatedSeedBatch[]>(() => {
    const existingMap = new Map(regulatedBatches.map((b) => [b.id, b]));
    const extras: RegulatedSeedBatch[] = [];

    applications.forEach((app) => {
      if (!existingMap.has(app.batchId)) {
        const mappedStatus: RegulatedSeedBatch['certificationStatus'] =
          app.status === 'Disetujui'
            ? 'Aktif'
            : app.status === 'Ditolak'
            ? 'Ditolak'
            : 'Menunggu Pemeriksaan';
        extras.push({
          id: app.batchId,
          batchNumber: app.batchNumber,
          producerName: app.producerName,
          producerProvince: app.producerProvince,
          producerLicense: app.producerLicense,
          commodity: app.commodity,
          variety: app.variety,
          seedClass: app.seedClass,
          quantityKg: app.quantityKg,
          productionDate: app.productionDate,
          productionLocation: app.productionLocation,
          seedSource: app.seedSource,
          certificateNumber: app.certificateNumber,
          certificationStatus: mappedStatus,
          germinationRate: app.germinationRate,
          moistureContent: app.moistureContent,
          physicalPurity: app.physicalPurity,
          documents: app.documents,
          ownershipHistory: [
            {
              id: `own-${app.batchId}`,
              timestamp: app.productionDate,
              fromParty: 'Registrasi Produksi Awal',
              toParty: app.producerName,
              quantityKg: app.quantityKg,
              transferType: 'Registrasi Lot Produsen',
              referenceCode: app.batchNumber,
              confirmed: true,
            },
          ],
          traceabilityEvents: [
            {
              id: `tr-reg-${app.batchId}`,
              stage: 'Registrasi Batch Produsen',
              eventClass: 'blockchain',
              txHash: `0x${app.batchId.replace(/[^a-z0-9]/gi, '').slice(0, 8)}...91b4`,
              timestamp: `${app.productionDate} 09:00 WIB`,
              actor: app.producerContact.split('·')[0].trim(),
              organization: app.producerName,
              title: `Registrasi Batch ${app.variety}`,
              details: `Lot ${app.quantityKg.toLocaleString('id-ID')} kg didaftarkan di ${app.productionLocation}.`,
            },
            {
              id: `tr-sub-${app.batchId}`,
              stage: 'Pengajuan Sertifikasi',
              eventClass: 'audit',
              timestamp: `${app.submissionDate} 10:00 WIB`,
              actor: app.producerContact.split('·')[0].trim(),
              organization: app.producerName,
              title: `Pengajuan Sertifikasi ${app.applicationNumber}`,
              details: `Berkas permohonan pemeriksaan dikirimkan ke ${profile.shortName}.`,
            },
          ],
        });
      }
    });

    certificates.forEach((cert) => {
      if (!existingMap.has(cert.batchId) && !extras.some((e) => e.id === cert.batchId)) {
        extras.push({
          id: cert.batchId,
          batchNumber: cert.batchNumber,
          producerName: cert.producerName,
          producerProvince: cert.producerProvince,
          producerLicense: 'Terdaftar Resmi',
          commodity: cert.commodity,
          variety: cert.variety,
          seedClass: cert.seedClass,
          quantityKg: cert.quantityKg,
          productionDate: cert.issueDate,
          productionLocation: `Wilayah Produksi ${cert.producerProvince}`,
          seedSource: 'Benih Sumber Terverifikasi',
          certificateNumber: cert.certificateNumber,
          certificationStatus: cert.status === 'Dicabut' ? 'Dicabut' : 'Aktif',
          germinationRate: cert.germinationRate,
          moistureContent: cert.moistureContent,
          physicalPurity: cert.physicalPurity,
          documents: [],
          ownershipHistory: [
            {
              id: `own-${cert.batchId}`,
              timestamp: cert.issueDate,
              fromParty: 'Registrasi Produksi Awal',
              toParty: cert.producerName,
              quantityKg: cert.quantityKg,
              transferType: 'Registrasi Lot Produsen',
              referenceCode: cert.batchNumber,
              confirmed: true,
            },
          ],
          traceabilityEvents: [
            {
              id: `tr-cert-${cert.batchId}`,
              stage: 'Persetujuan Sertifikasi',
              eventClass: 'blockchain',
              txHash: `0x${cert.id.replace(/[^a-z0-9]/gi, '').slice(0, 8)}...3f2a`,
              timestamp: `${cert.issueDate} 11:00 WIB`,
              actor: cert.issuedBy,
              organization: profile.shortName,
              title: `Penerbitan Sertifikat ${cert.certificateNumber}`,
              details: `Sertifikasi ${cert.variety} disetujui.`,
            },
          ],
        });
      }
    });

    return [...regulatedBatches, ...extras];
  }, [regulatedBatches, applications, certificates, profile.shortName]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const appendActivity = (
    category: RegulatorActivityLog['category'],
    title: string,
    description: string,
    referenceCode?: string,
    batchId?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newLog: RegulatorActivityLog = {
      id: `ract-${Date.now()}`,
      timestamp: `2026-11-16 ${timeStr} WIB`,
      category,
      actor: profile.activeInspectorName,
      title,
      description,
      referenceCode,
      batchId,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  const pendingApplicationCount = useMemo(
    () =>
      applications.filter(
        (a) => a.status === 'Menunggu Pemeriksaan' || a.status === 'Dalam Pemeriksaan'
      ).length,
    [applications]
  );

  const activeCertCount = useMemo(
    () => certificates.filter((c) => c.status === 'Aktif').length,
    [certificates]
  );

  const selectedApplication = useMemo(
    () => applications.find((a) => a.id === selectedAppId) ?? applications[0],
    [applications, selectedAppId]
  );

  const handleNavigate = (screen: RegulatorScreenId) => {
    if (screen !== 'revocation') {
      setPreselectedRevokeCertId(null);
    }
    setActiveScreen(screen);
  };

  const handleReviewApplication = (appId: string) => {
    setSelectedAppId(appId);
    setActiveScreen('application-review');
  };

  const handleQuickInspectPending = () => {
    const firstPending = applications.find(
      (a) =>
        (a.status === 'Menunggu Pemeriksaan' || a.status === 'Dalam Pemeriksaan') &&
        !a.isSelfSubmitted
    );
    if (firstPending) {
      setSelectedAppId(firstPending.id);
      setActiveScreen('application-review');
    } else {
      setActiveScreen('applications');
    }
  };

  const handleUpdateChecklist = (
    appId: string,
    checklist: CertificationApplicationRecord['checklist']
  ) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status:
                a.status === 'Menunggu Pemeriksaan' ? 'Dalam Pemeriksaan' : a.status,
              checklist,
            }
          : a
      )
    );
  };

  const handleApproveApplication = (
    appId: string,
    certificateNumber: string,
    expiryDate: string
  ) => {
    const target = applications.find((a) => a.id === appId);
    if (!target || target.isSelfSubmitted || target.producerName === profile.organizationName) {
      showToast('Persetujuan ditolak: Regulator tidak dapat menyetujui permohonannya sendiri.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'Disetujui',
              certificateNumber,
              reviewHistory: [
                {
                  id: `rh-${Date.now()}`,
                  timestamp: `2026-11-16 ${timeStr} WIB`,
                  actor: profile.activeInspectorName,
                  role: 'Regulator BPSB',
                  action: `Sertifikasi Disetujui (${certificateNumber})`,
                  note: `Sertifikat simulasi diterbitkan dan berlaku hingga ${expiryDate}.`,
                },
                ...a.reviewHistory,
              ],
            }
          : a
      )
    );

    const newCert: SeedCertificationRecord = {
      id: `cert-reg-${Date.now()}`,
      certificateNumber,
      applicationNumber: target.applicationNumber,
      batchId: target.batchId,
      batchNumber: target.batchNumber,
      producerName: target.producerName,
      producerProvince: target.producerProvince,
      commodity: target.commodity,
      variety: target.variety,
      seedClass: target.seedClass,
      quantityKg: target.quantityKg,
      issueDate: '2026-11-16',
      expiryDate,
      status: 'Aktif',
      issuedBy: profile.activeInspectorName,
      germinationRate: target.germinationRate,
      moistureContent: target.moistureContent,
      physicalPurity: target.physicalPurity,
    };
    setCertificates((prev) => [newCert, ...prev]);

    // Sync to regulatedBatches traceability timeline
    const approvalEvent = {
      id: `tr-app-${Date.now()}`,
      stage: 'Persetujuan Sertifikasi' as const,
      eventClass: 'blockchain' as const,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
        .toString(16)
        .slice(2, 6)}`,
      timestamp: `2026-11-16 ${timeStr} WIB`,
      actor: profile.activeInspectorName,
      organization: profile.shortName,
      title: `Persetujuan & Penerbitan Sertifikat ${certificateNumber}`,
      details: `Permohonan ${target.applicationNumber} disetujui resmi dengan masa berlaku s.d. ${expiryDate}.`,
    };

    setRegulatedBatches((prev) => {
      const exists = prev.some((b) => b.id === target.batchId);
      if (exists) {
        return prev.map((b) =>
          b.id === target.batchId
            ? {
                ...b,
                certificateNumber,
                certificationStatus: 'Aktif',
                traceabilityEvents: [...b.traceabilityEvents, approvalEvent],
              }
            : b
        );
      }
      const created = allInspectableBatches.find((b) => b.id === target.batchId);
      if (!created) return prev;
      return [
        {
          ...created,
          certificateNumber,
          certificationStatus: 'Aktif',
          traceabilityEvents: [...created.traceabilityEvents, approvalEvent],
        },
        ...prev,
      ];
    });

    appendActivity(
      'Persetujuan & Penolakan',
      `Menyetujui Sertifikasi ${certificateNumber}`,
      `Batch ${target.batchNumber} (${target.variety}) milik ${target.producerName} resmi tersertifikasi.`,
      target.batchNumber,
      target.batchId
    );
    showToast(`Sertifikat simulasi ${certificateNumber} diterbitkan.`);
  };

  const handleRejectApplication = (appId: string, reason: string) => {
    const target = applications.find((a) => a.id === appId);
    if (!target) return;

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'Ditolak',
              rejectionReason: reason,
              reviewHistory: [
                {
                  id: `rh-${Date.now()}`,
                  timestamp: `2026-11-16 ${timeStr} WIB`,
                  actor: profile.activeInspectorName,
                  role: 'Regulator BPSB',
                  action: 'Permohonan Sertifikasi Ditolak',
                  note: reason,
                },
                ...a.reviewHistory,
              ],
            }
          : a
      )
    );

    setRegulatedBatches((prev) =>
      prev.map((b) =>
        b.id === target.batchId ? { ...b, certificationStatus: 'Ditolak' } : b
      )
    );

    appendActivity(
      'Persetujuan & Penolakan',
      `Menolak Permohonan ${target.applicationNumber}`,
      `Batch ${target.batchNumber} ditolak. Alasan: ${reason}`,
      target.batchNumber,
      target.batchId
    );
    showToast(`Permohonan ${target.applicationNumber} resmi ditolak.`);
  };

  const handleRevokeCertificate = (payload: {
    certId: string;
    reason: string;
    revocationDate: string;
  }) => {
    const target = certificates.find((c) => c.id === payload.certId);
    if (!target || target.status !== 'Aktif') return;

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setCertificates((prev) =>
      prev.map((c) =>
        c.id === payload.certId
          ? {
              ...c,
              status: 'Dicabut',
              revocationReason: payload.reason,
              revocationDate: payload.revocationDate,
              revokedBy: profile.activeInspectorName,
            }
          : c
      )
    );

    const revokeEvent = {
      id: `tr-rev-${Date.now()}`,
      stage: 'Pencabutan Sertifikasi' as const,
      eventClass: 'blockchain' as const,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random()
        .toString(16)
        .slice(2, 6)}`,
      timestamp: `${payload.revocationDate} ${timeStr} WIB`,
      actor: profile.activeInspectorName,
      organization: profile.shortName,
      title: `Pencabutan Sertifikasi ${target.certificateNumber}`,
      details: payload.reason,
    };

    setRegulatedBatches((prev) => {
      const exists = prev.some((b) => b.id === target.batchId);
      if (exists) {
        return prev.map((b) =>
          b.id === target.batchId
            ? {
                ...b,
                certificationStatus: 'Dicabut',
                traceabilityEvents: [...b.traceabilityEvents, revokeEvent],
              }
            : b
        );
      }
      const created = allInspectableBatches.find((b) => b.id === target.batchId);
      if (!created) return prev;
      return [
        {
          ...created,
          certificationStatus: 'Dicabut',
          traceabilityEvents: [...created.traceabilityEvents, revokeEvent],
        },
        ...prev,
      ];
    });

    appendActivity(
      'Pencabutan Sertifikasi',
      `Mencabut Sertifikat ${target.certificateNumber}`,
      `Sertifikat batch ${target.batchNumber} dicabut efektif ${payload.revocationDate}. Alasan: ${payload.reason}`,
      target.batchNumber,
      target.batchId
    );
    showToast(`Sertifikat ${target.certificateNumber} telah dicabut dan dicatat ke blockchain.`);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex">
      <RegulatorSidebar
        activeScreen={activeScreen}
        onSelectScreen={handleNavigate}
        onSwitchPortal={onSwitchPortal}
        onLogout={onLogout}
        organizationShortName={profile.shortName}
        roleLabel={profile.roleLabel}
        inspectorName={profile.activeInspectorName}
        pendingApplicationCount={pendingApplicationCount}
        activeCertCount={activeCertCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <RegulatorHeader
          activeScreen={activeScreen}
          organizationShortName={profile.shortName}
          activeAppNumber={selectedApplication?.applicationNumber}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={handleNavigate}
          onQuickInspectPending={handleQuickInspectPending}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {activeScreen === 'dashboard' && (
            <RegulatorDashboardScreen
              organizationName={profile.organizationName}
              inspectorName={profile.activeInspectorName}
              applications={applications}
              certificates={certificates}
              activities={activities}
              onNavigate={handleNavigate}
              onReviewApplication={handleReviewApplication}
              onQuickInspectPending={handleQuickInspectPending}
            />
          )}

          {activeScreen === 'applications' && (
            <RegulatorApplicationsScreen
              applications={applications}
              farmerCorrections={farmerCorrections}
              onReviewApplication={handleReviewApplication}
              onDecideFarmerCorrection={(payload) => {
                const target = farmerCorrections.find((c) => c.id === payload.correctionId);
                if (!target) return;
                const updatedCorrections = farmerCorrections.map((c) =>
                  c.id === payload.correctionId
                    ? {
                        ...c,
                        status: payload.decision,
                        regulatorNote: payload.note,
                      }
                    : c
                );
                setFarmerCorrections(updatedCorrections);
                try {
                  localStorage.setItem(
                    'benihnusa_farmer_corrections_v1',
                    JSON.stringify(updatedCorrections)
                  );
                  const rawPlantings = localStorage.getItem('benihnusa_farmer_plantings_v1');
                  if (rawPlantings) {
                    const parsed = JSON.parse(rawPlantings) as FarmerPlantingRecord[];
                    const nextPlantings = parsed.map((p) =>
                      p.id === target.plantingRecordId
                        ? {
                            ...p,
                            status:
                              payload.decision === 'Disetujui'
                                ? 'Koreksi Disetujui'
                                : 'Tercatat',
                          }
                        : p
                    );
                    localStorage.setItem(
                      'benihnusa_farmer_plantings_v1',
                      JSON.stringify(nextPlantings)
                    );
                  }
                } catch {
                  // Ignore storage quota issues
                }
                appendActivity(
                  'Persetujuan & Penolakan',
                  `${
                    payload.decision === 'Disetujui' ? 'Menyetujui' : 'Menolak'
                  } Koreksi Tanam ${target.requestCode}`,
                  `Koreksi catatan ${target.recordCode} (${target.batchNumber}): ${payload.note}`,
                  target.requestCode
                );
                showToast(
                  `Permintaan koreksi ${target.requestCode} telah ${
                    payload.decision === 'Disetujui' ? 'disetujui' : 'ditolak'
                  } oleh Regulator.`
                );
              }}
            />
          )}

          {activeScreen === 'application-review' && selectedApplication && (
            <RegulatorApplicationReviewScreen
              key={selectedApplication.id}
              application={selectedApplication}
              regulatorOrgName={profile.organizationName}
              onBack={() => setActiveScreen('applications')}
              onUpdateChecklist={handleUpdateChecklist}
              onApprove={handleApproveApplication}
              onReject={handleRejectApplication}
            />
          )}

          {activeScreen === 'registry' && (
            <RegulatorRegistryScreen
              certificates={certificates}
              onInspectBatchVerification={(batchId) => {
                setSelectedVerifyBatchId(batchId);
                setActiveScreen('verification');
              }}
              onInspectTraceability={(batchId) => {
                setSelectedTraceBatchId(batchId);
                setActiveScreen('traceability');
              }}
              onOpenRevocation={(certId) => {
                setPreselectedRevokeCertId(certId);
                setActiveScreen('revocation');
              }}
            />
          )}

          {activeScreen === 'verification' && (
            <RegulatorBatchVerificationScreen
              key={selectedVerifyBatchId ?? 'verify-default'}
              batches={allInspectableBatches}
              initialBatchId={selectedVerifyBatchId}
              onOpenTraceability={(batchId) => {
                setSelectedTraceBatchId(batchId);
                setActiveScreen('traceability');
              }}
            />
          )}

          {activeScreen === 'revocation' && (
            <RegulatorRevocationScreen
              key={preselectedRevokeCertId ?? 'revoke-default'}
              certificates={certificates}
              preselectedCertId={preselectedRevokeCertId}
              onRevokeCertificate={handleRevokeCertificate}
            />
          )}

          {activeScreen === 'traceability' && (
            <RegulatorTraceabilityScreen
              key={selectedTraceBatchId ?? 'trace-default'}
              batches={allInspectableBatches}
              initialBatchId={selectedTraceBatchId}
            />
          )}

          {activeScreen === 'activity' && (
            <RegulatorActivityLogScreen
              organizationShortName={profile.shortName}
              activities={activities}
              onOpenBatchVerification={(batchId) => {
                setSelectedVerifyBatchId(batchId);
                setActiveScreen('verification');
              }}
            />
          )}

          {activeScreen === 'profile' && (
            <RegulatorProfileScreen
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile(updated);
                showToast('Informasi kontak layanan lembaga sertifikasi berhasil diperbarui.');
              }}
            />
          )}
        </main>
      </div>

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#111827] text-white px-4 py-3 rounded-xl border border-slate-700 flex items-center gap-3"
          style={{
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
          <span className="text-[13px] font-medium flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
