import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  INITIAL_ACCOUNT_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MEMBERSHIP_REQUESTS,
  INITIAL_ORG_REQUESTS,
  INITIAL_SYSTEM_USERS,
} from '../data/adminGovernanceData';
import {
  AccountApprovalRequest,
  AdminScreenId,
  AuditLogEntry,
  MembershipApprovalRequest,
  OrganizationApprovalRequest,
  SystemUserRecord,
} from '../types/admin';
import { PortalMode } from '../types/certificationAuthority';
import { AdminAccountApprovalsScreen } from './admin/AdminAccountApprovalsScreen';
import { AdminAuditLogScreen } from './admin/AdminAuditLogScreen';
import { AdminDashboardScreen } from './admin/AdminDashboardScreen';
import { AdminHeader } from './admin/AdminHeader';
import { AdminMembershipApprovalsScreen } from './admin/AdminMembershipApprovalsScreen';
import { AdminOrganizationApprovalsScreen } from './admin/AdminOrganizationApprovalsScreen';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminUsersScreen } from './admin/AdminUsersScreen';
import { AccessDeniedView } from './ui/SystemStateViews';

interface AdminAppProps {
  onSwitchPortal: (portal: PortalMode) => void;
  onLogout?: () => void;
}

const STORAGE_KEYS = {
  accounts: 'benihnusa_admin_accounts_v1',
  orgs: 'benihnusa_admin_orgs_v1',
  memberships: 'benihnusa_admin_memberships_v1',
  users: 'benihnusa_admin_users_v1',
  audits: 'benihnusa_admin_audits_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function nowTimeLabel(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `2026-11-16 ${hh}:${mm}:00 WIB`;
}

export const AdminApp: React.FC<AdminAppProps> = ({
  onSwitchPortal,
  onLogout,
}) => {
  const [activeScreen, setActiveScreen] = useState<AdminScreenId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [accountRequests, setAccountRequests] = useState<
    AccountApprovalRequest[]
  >(() => readStorage(STORAGE_KEYS.accounts, INITIAL_ACCOUNT_REQUESTS));

  const [orgRequests, setOrgRequests] = useState<OrganizationApprovalRequest[]>(
    () => readStorage(STORAGE_KEYS.orgs, INITIAL_ORG_REQUESTS)
  );

  const [membershipRequests, setMembershipRequests] = useState<
    MembershipApprovalRequest[]
  >(() => readStorage(STORAGE_KEYS.memberships, INITIAL_MEMBERSHIP_REQUESTS));

  const [users, setUsers] = useState<SystemUserRecord[]>(() =>
    readStorage(STORAGE_KEYS.users, INITIAL_SYSTEM_USERS)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    readStorage(STORAGE_KEYS.audits, INITIAL_AUDIT_LOGS)
  );

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedMembershipId, setSelectedMembershipId] = useState<
    string | null
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accountRequests));
      localStorage.setItem(STORAGE_KEYS.orgs, JSON.stringify(orgRequests));
      localStorage.setItem(
        STORAGE_KEYS.memberships,
        JSON.stringify(membershipRequests)
      );
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.audits, JSON.stringify(auditLogs));
    } catch {
      // Ignore storage quota errors
    }
  }, [accountRequests, orgRequests, membershipRequests, users, auditLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  const appendAudit = (
    entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'dateKey'>
  ) => {
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: nowTimeLabel(),
        dateKey: '2026-11-16',
        ...entry,
      },
      ...prev,
    ]);
  };

  const pendingAccountsCount = useMemo(
    () =>
      accountRequests.filter((r) => r.status === 'Menunggu Persetujuan').length,
    [accountRequests]
  );
  const pendingOrgsCount = useMemo(
    () => orgRequests.filter((r) => r.status === 'Menunggu Persetujuan').length,
    [orgRequests]
  );
  const pendingMembershipsCount = useMemo(
    () =>
      membershipRequests.filter((r) => r.status === 'Menunggu Persetujuan')
        .length,
    [membershipRequests]
  );

  const handleAccountDecision = (payload: {
    requestId: string;
    decision: 'Disetujui' | 'Ditolak';
    rejectionReason?: string;
  }) => {
    const target = accountRequests.find((r) => r.id === payload.requestId);
    if (!target) return;

    setAccountRequests((prev) =>
      prev.map((r) =>
        r.id === payload.requestId
          ? {
              ...r,
              status: payload.decision,
              reviewedBy: 'Raka Pratama (Admin Sistem)',
              reviewedAt: nowTimeLabel(),
              rejectionReason: payload.rejectionReason,
            }
          : r
      )
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.email.toLowerCase() === target.email.toLowerCase()
          ? { ...u, accountStatus: payload.decision }
          : u
      )
    );

    appendAudit({
      actorName: 'Raka Pratama',
      actorRole: 'Administrator Sistem',
      activity:
        payload.decision === 'Disetujui'
          ? `Persetujuan Akun ${target.fullName}`
          : `Penolakan Akun ${target.fullName}`,
      actionType: 'ACCOUNT_APPROVAL',
      entityLabel: target.requestNumber,
      source: 'ADMIN_GOVERNANCE',
      eventKind: 'PERAN_SISTEM',
      blockchainStatus: 'NOT_REQUIRED',
      details:
        payload.decision === 'Disetujui'
          ? 'Akun pengguna diaktifkan (administrasi sistem, tidak dicatat on-chain).'
          : `Ditolak: ${payload.rejectionReason}`,
    });

    showToast(
      `Permohonan akun ${target.fullName} berhasil ${
        payload.decision === 'Disetujui' ? 'disetujui' : 'ditolak'
      }.`
    );
  };

  const handleOrgDecision = (payload: {
    orgId: string;
    decision: 'Disetujui' | 'Ditolak';
    rejectionReason?: string;
  }) => {
    const target = orgRequests.find((o) => o.id === payload.orgId);
    if (!target) return;

    setOrgRequests((prev) =>
      prev.map((o) =>
        o.id === payload.orgId
          ? {
              ...o,
              status: payload.decision,
              reviewedBy: 'Raka Pratama (Admin Sistem)',
              reviewedAt: nowTimeLabel(),
              rejectionReason: payload.rejectionReason,
            }
          : o
      )
    );

    appendAudit({
      actorName: 'Raka Pratama',
      actorRole: 'Administrator Sistem',
      activity:
        payload.decision === 'Disetujui'
          ? `Persetujuan Organisasi ${target.organizationName}`
          : `Penolakan Organisasi ${target.organizationName}`,
      actionType: 'ORG_APPROVAL',
      entityLabel: target.requestNumber,
      source: 'ADMIN_GOVERNANCE',
      eventKind: 'PERAN_SISTEM',
      blockchainStatus: 'NOT_REQUIRED',
      details:
        payload.decision === 'Disetujui'
          ? `Entitas ${target.organizationType} terverifikasi.`
          : `Ditolak: ${payload.rejectionReason}`,
    });

    showToast(
      `Organisasi ${target.organizationName} berhasil ${
        payload.decision === 'Disetujui' ? 'disetujui' : 'ditolak'
      }.`
    );
  };

  const handleMembershipDecision = (payload: {
    membershipId: string;
    decision: 'Disetujui' | 'Ditolak';
    rejectionReason?: string;
  }) => {
    const target = membershipRequests.find(
      (m) => m.id === payload.membershipId
    );
    if (!target) return;

    setMembershipRequests((prev) =>
      prev.map((m) =>
        m.id === payload.membershipId
          ? {
              ...m,
              status: payload.decision,
              reviewedBy: 'Raka Pratama (Admin Sistem)',
              reviewedAt: nowTimeLabel(),
              rejectionReason: payload.rejectionReason,
            }
          : m
      )
    );

    if (payload.decision === 'Disetujui') {
      setUsers((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === target.userEmail.toLowerCase()
            ? {
                ...u,
                memberships: [
                  ...u.memberships,
                  {
                    id: `m-${Date.now()}`,
                    organizationName: target.organizationName,
                    role: target.requestedRole,
                    approvedAt: '2026-11-16',
                  },
                ],
              }
            : u
        )
      );
    }

    appendAudit({
      actorName: 'Raka Pratama',
      actorRole: 'Administrator Sistem',
      activity:
        payload.decision === 'Disetujui'
          ? `Persetujuan Membership ${target.userName} (${target.requestedRole})`
          : `Penolakan Membership ${target.userName}`,
      actionType: 'MEMBERSHIP_APPROVAL',
      entityLabel: target.requestNumber,
      source: 'ADMIN_GOVERNANCE',
      eventKind: 'PERAN_SISTEM',
      blockchainStatus: 'NOT_REQUIRED',
      details:
        payload.decision === 'Disetujui'
          ? `Hak peran ${target.requestedRole} pada ${target.organizationName} diberikan.`
          : `Ditolak: ${payload.rejectionReason}`,
    });

    showToast(
      `Membership ${target.userName} (${target.requestedRole}) berhasil ${
        payload.decision === 'Disetujui' ? 'disetujui' : 'ditolak'
      }.`
    );
  };

  const selectedAccount =
    accountRequests.find((r) => r.id === selectedAccountId) ??
    accountRequests[0] ??
    null;
  const selectedOrg =
    orgRequests.find((o) => o.id === selectedOrgId) ?? orgRequests[0] ?? null;
  const selectedMembership =
    membershipRequests.find((m) => m.id === selectedMembershipId) ??
    membershipRequests[0] ??
    null;
  const selectedUser =
    users.find((u) => u.id === selectedUserId) ?? users[0] ?? null;

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <AdminDashboardScreen
            users={users}
            accountRequests={accountRequests}
            orgRequests={orgRequests}
            membershipRequests={membershipRequests}
            onNavigate={setActiveScreen}
          />
        );

      case 'account-approvals':
      case 'account-detail':
        return (
          <AdminAccountApprovalsScreen
            mode={activeScreen}
            requests={accountRequests}
            selectedRequest={selectedAccount}
            onOpenDetail={(id) => {
              setSelectedAccountId(id);
              setActiveScreen('account-detail');
            }}
            onBackToList={() => setActiveScreen('account-approvals')}
            onDecision={handleAccountDecision}
          />
        );

      case 'organization-approvals':
      case 'organization-detail':
        return (
          <AdminOrganizationApprovalsScreen
            mode={activeScreen}
            requests={orgRequests}
            selectedOrg={selectedOrg}
            onOpenDetail={(id) => {
              setSelectedOrgId(id);
              setActiveScreen('organization-detail');
            }}
            onBackToList={() => setActiveScreen('organization-approvals')}
            onDecision={handleOrgDecision}
          />
        );

      case 'membership-approvals':
      case 'membership-detail':
        return (
          <AdminMembershipApprovalsScreen
            mode={activeScreen}
            requests={membershipRequests}
            selectedMembership={selectedMembership}
            onOpenDetail={(id) => {
              setSelectedMembershipId(id);
              setActiveScreen('membership-detail');
            }}
            onBackToList={() => setActiveScreen('membership-approvals')}
            onDecision={handleMembershipDecision}
          />
        );

      case 'users':
      case 'user-detail':
        return (
          <AdminUsersScreen
            mode={activeScreen}
            users={users}
            selectedUser={selectedUser}
            onOpenDetail={(id) => {
              setSelectedUserId(id);
              setActiveScreen('user-detail');
            }}
            onBackToList={() => setActiveScreen('users')}
          />
        );

      case 'audit-log':
        return <AdminAuditLogScreen logs={auditLogs} />;

      case 'access-denied':
        return (
          <AccessDeniedView
            currentRoleLabel="Administrator Sistem"
            attemptedArea="Operasi Bisnis Benih / Persetujuan Sertifikasi BPSB"
            reason="Sesuai prinsip pemisahan kewenangan BenihNusa Track, Administrator Sistem hanya mengelola persetujuan akun, organisasi, membership, pengguna, dan audit log. Administrator tidak dapat mengedit batch benih atau menyetujui/mencabut sertifikasi."
            onReturnSafe={() => setActiveScreen('dashboard')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#111827] flex">
      <AdminSidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onSwitchPortal={onSwitchPortal}
        onLogout={onLogout}
        pendingAccountsCount={pendingAccountsCount}
        pendingOrgsCount={pendingOrgsCount}
        pendingMembershipsCount={pendingMembershipsCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        <AdminHeader
          activeScreen={activeScreen}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={setActiveScreen}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] w-full mx-auto">
          {renderScreen()}
        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#111827] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
