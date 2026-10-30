import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { reportTheme } from "./theme";
import { getBrandLogoBase64 } from "./brand-logo";
import { capitalizeWords, capitalizeFirst } from "@/lib/utils";
import type { ReportPageSize } from "./types";

// ============================================================================
// STYLES & LAYOUT CONSTANTS
// ============================================================================
const styles = StyleSheet.create({
  page: {
    paddingTop: 92,
    paddingBottom: 48,
    paddingHorizontal: 28,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: reportTheme.ink,
    backgroundColor: "#ffffff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: reportTheme.ink,
    paddingHorizontal: 28,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  brandCapsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  logoBox: {
    width: 26,
    height: 26,
    backgroundColor: reportTheme.white,
    borderRadius: 5,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  brandName: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: reportTheme.white,
    letterSpacing: 1.2,
  },
  brandSub: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: reportTheme.cta,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 2,
    fontSize: 13.5,
    fontWeight: "bold",
    color: reportTheme.white,
  },
  subtitle: {
    marginTop: 1,
    fontSize: 7.2,
    color: "#cbd5e1",
  },
  headerRight: {
    alignItems: "flex-end",
    minWidth: 150,
  },
  confidentialBadge: {
    backgroundColor: "#1e293b",
    borderWidth: 0.8,
    borderColor: "#334155",
    borderRadius: 3,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  confidentialText: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#38bdf8",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  meta: {
    fontSize: 7,
    color: "#cbd5e1",
    lineHeight: 1.3,
    textAlign: "right",
  },
  accentBar: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: reportTheme.cta,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    paddingHorizontal: 28,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: reportTheme.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7.2,
    color: reportTheme.muted,
  },
  summaryRibbon: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: reportTheme.zebra,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: reportTheme.border,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 6.2,
    fontWeight: "bold",
    color: reportTheme.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: reportTheme.ink,
    marginTop: 1.5,
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#f8fafc",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: reportTheme.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: reportTheme.ink,
  },
  cardSub: {
    fontSize: 7,
    color: reportTheme.muted,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontSize: 6.5,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  badgeGreen: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  badgeBlue: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
  },
  badgeAmber: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
  },
  badgeRose: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  badgeSlate: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
  },
  cardBody: {
    padding: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  gridCellCol3: {
    width: "33.333%",
    paddingHorizontal: 4,
    marginBottom: 5,
  },
  gridCellCol4: {
    width: "25%",
    paddingHorizontal: 4,
    marginBottom: 5,
  },
  gridCellCol2: {
    width: "50%",
    paddingHorizontal: 4,
    marginBottom: 5,
  },
  gridCellCol1: {
    width: "100%",
    paddingHorizontal: 4,
    marginBottom: 5,
  },
  label: {
    fontSize: 6.2,
    fontWeight: "bold",
    color: reportTheme.muted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  value: {
    marginTop: 1.5,
    fontSize: 7.8,
    fontWeight: "bold",
    color: reportTheme.ink,
  },
  valueMono: {
    marginTop: 1.5,
    fontSize: 7.5,
    color: "#334155",
  },
  sectionTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: reportTheme.primary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
    marginTop: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.8,
    borderBottomColor: "#e2e8f0",
  },
  subCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 0.8,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 6,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  itemText: {
    fontSize: 7.2,
    color: reportTheme.ink,
  },
  itemTextMuted: {
    fontSize: 6.8,
    color: reportTheme.muted,
  },
  emptyNote: {
    fontSize: 7,
    fontStyle: "italic",
    color: reportTheme.muted,
    paddingVertical: 3,
  },
  twoPartContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 5,
  },
  twoPartColumn: {
    flex: 1,
    padding: 7,
    borderRadius: 4,
    borderWidth: 0.8,
  },
  twoPartLeft: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
  twoPartRight: {
    backgroundColor: "#fdf4ff",
    borderColor: "#f5d0fe",
  },
  twoPartTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.8,
  },
  table: {
    marginTop: 4,
    borderWidth: 0.8,
    borderColor: reportTheme.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: reportTheme.ink,
    paddingVertical: 4.5,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontSize: 6.8,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: reportTheme.border,
  },
  tableRowAlt: {
    backgroundColor: reportTheme.zebra,
  },
  tableCell: {
    fontSize: 7.2,
    color: reportTheme.ink,
  },
});

function formatReportDate(date?: string | Date | null) {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(date);
  }
}

// Common Shared Header Component
function SharedReportHeader({
  title,
  subtitle,
  generatedFor,
  filterSummary,
}: {
  title: string;
  subtitle: string;
  generatedFor?: string;
  filterSummary?: string;
}) {
  const brandLogo = getBrandLogoBase64();
  return (
    <>
      <View style={styles.header} fixed>
        <View style={styles.headerLeft}>
          <View style={styles.brandCapsule}>
            <View style={styles.logoBox}>
              {brandLogo ? (
                <Image src={brandLogo} style={styles.logoImage} />
              ) : (
                <Text style={{ fontSize: 9, fontWeight: "bold", color: reportTheme.ink }}>KP</Text>
              )}
            </View>
            <View>
              <Text style={styles.brandName}>KLICK-PRO</Text>
              <Text style={styles.brandSub}>Enterprise Operations & Audit Division</Text>
            </View>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.confidentialBadge}>
            <Text style={styles.confidentialText}>Confidential Audit</Text>
          </View>
          <Text style={styles.meta}>Generated: {new Date().toLocaleString("en-IN")} IST</Text>
          {generatedFor ? <Text style={styles.meta}>Auditor: {generatedFor}</Text> : null}
          {filterSummary ? <Text style={styles.meta}>Scope: {filterSummary}</Text> : null}
        </View>
      </View>
      <View style={styles.accentBar} fixed />
    </>
  );
}

// Common Shared Footer Component
function SharedReportFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Klick-Pro Enterprise Platform · Official Compliance & Financial Audit Record
      </Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
}

// ============================================================================
// 1. CLIENT REGISTRATIONS DETAILED DOCUMENT (DEEP ENTERPRISE DOSSIER)
// ============================================================================
export type ClientRegistrationRow = {
  id: number | string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  state: string;
  kyc: string;
  jobsCount: number;
  createdAt: string | Date;
  address?: string;
  accountType?: string;
  spendAmount?: string | number;
  lastActive?: string | Date | null;
  recentJobs?: Array<{ id: number | string; title: string; category?: string; budget?: string; status?: string }>;
};

export function ClientRegistrationsDetailedDocument({
  rows,
  summaryStats,
  filterSummary,
  pageSize = "A4",
}: {
  rows: ClientRegistrationRow[];
  summaryStats?: Array<{ label: string; value: string }>;
  filterSummary?: string;
  pageSize?: ReportPageSize;
}) {
  return (
    <Document title="Klick-Pro Client Registrations Audit Report">
      <Page size={pageSize} orientation="landscape" style={styles.page}>
        <SharedReportHeader
          title="New Client Registrations Audit Dossier"
          subtitle="Enterprise Acquisition Dossier · Demographics · KYC Verification · Job Postings Ledger"
          filterSummary={filterSummary || `${rows.length} total client records`}
        />

        {summaryStats && summaryStats.length > 0 && (
          <View style={styles.summaryRibbon}>
            {summaryStats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {rows.map((r, i) => (
          <View key={i} style={styles.card} wrap={false}>
            {/* Card Header: Client Identity, Company, KYC & Date */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>
                  {capitalizeWords(r.name)} {r.company ? `· ${capitalizeWords(r.company)}` : ""}
                </Text>
                <Text style={styles.cardSub}>
                  ID: #{r.id} · {r.accountType || (r.company?.toLowerCase().includes("individual") ? "Individual Client" : "Corporate Enterprise")} · Registered: {formatReportDate(r.createdAt)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                <Text
                  style={[
                    styles.badge,
                    r.kyc === "Verified" ? styles.badgeGreen : styles.badgeAmber,
                  ]}
                >
                  {r.kyc === "Verified" ? "Verified KYC" : "Pending Verification"}
                </Text>
                <Text style={[styles.badge, styles.badgeBlue]}>
                  {r.jobsCount} {r.jobsCount === 1 ? "Job" : "Jobs"} Posted
                </Text>
              </View>
            </View>

            {/* Card Body: Contact Grid + Jobs & Activity Ledger */}
            <View style={styles.cardBody}>
              <View style={styles.grid}>
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Email Address</Text>
                  <Text style={styles.valueMono}>{r.email || "—"}</Text>
                </View>
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Phone Number</Text>
                  <Text style={styles.valueMono}>{r.phone || "—"}</Text>
                </View>
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Location (State)</Text>
                  <Text style={styles.value}>{capitalizeWords(r.state || r.location || "Maharashtra")}</Text>
                </View>
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Industry Sector</Text>
                  <Text style={styles.value}>{capitalizeWords(r.industry || "General Services")}</Text>
                </View>

                {/* Operational Job Ledger Sub-Section */}
                <View style={styles.gridCellCol1}>
                  <View style={[styles.subCard, { marginTop: 3 }]}>
                    <Text style={styles.sectionTitle}>
                      Job Postings Ledger & Recent Projects ({r.jobsCount} Total)
                    </Text>
                    {r.recentJobs && r.recentJobs.length > 0 ? (
                      r.recentJobs.map((j, jIdx) => (
                        <View key={jIdx} style={styles.itemRow}>
                          <Text style={[styles.itemText, { flex: 2, fontWeight: "bold" }]}>
                            • {capitalizeWords(j.title)}
                          </Text>
                          <Text style={[styles.itemTextMuted, { flex: 1.2 }]}>
                            {capitalizeWords(j.category || "General")}
                          </Text>
                          <Text style={[styles.itemText, { flex: 1, fontWeight: "bold" }]}>
                            {j.budget || "Negotiable"}
                          </Text>
                          <Text style={[styles.badge, styles.badgeSlate, { fontSize: 6 }]}>
                            {j.status || "OPEN"}
                          </Text>
                        </View>
                      ))
                    ) : r.jobsCount > 0 ? (
                      <Text style={styles.itemText}>
                        {r.jobsCount} jobs created under client portfolio. Escrow tracking active.
                      </Text>
                    ) : (
                      <Text style={styles.emptyNote}>
                        No job postings created yet. Account profile registered and onboarding verified.
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        <SharedReportFooter />
      </Page>
    </Document>
  );
}

// ============================================================================
// 2. CLIENT ACTIVITY DETAILED DOCUMENT (DEEP TELEMETRY CARD)
// ============================================================================
export type ClientActivityDetailedRow = {
  id: number | string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  status: string;
  workingStatus?: string;
  logins: number;
  frequency: string;
  timeSpent: string;
  lastActive: string;
  createdAt: string;
  activeProjectsCount?: number;
  totalProjectsCount?: number;
  recentSessions?: Array<{ createdAt: string; duration?: string }>;
};

export function ClientActivityDetailedDocument({
  rows,
  summaryStats,
  filterSummary,
  pageSize = "A4",
}: {
  rows: ClientActivityDetailedRow[];
  summaryStats?: Array<{ label: string; value: string }>;
  filterSummary?: string;
  pageSize?: ReportPageSize;
}) {
  return (
    <Document title="Klick-Pro Client Activity & Working Status Report">
      <Page size={pageSize} orientation="landscape" style={styles.page}>
        <SharedReportHeader
          title="Client Activity & Working Status Audit"
          subtitle="Enterprise Session Analytics · Working Status · Login Timestamps · Platform Time Spent"
          filterSummary={filterSummary || `${rows.length} tracked client accounts`}
        />

        {summaryStats && summaryStats.length > 0 && (
          <View style={styles.summaryRibbon}>
            {summaryStats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {rows.map((r, i) => {
          const isOnline = r.workingStatus?.toLowerCase().includes("working") || r.status === "ONLINE";
          const isActive = r.workingStatus?.toLowerCase().includes("active") || r.status === "Active";
          return (
            <View key={i} style={styles.card} wrap={false}>
              {/* Card Header: Client Name, Company, Status & Tier */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>
                    {capitalizeWords(r.name)} {r.company ? `· ${capitalizeWords(r.company)}` : ""}
                  </Text>
                  <Text style={styles.cardSub}>
                    ID: #{r.id} · Location: {capitalizeWords(r.location)} · Sector: {capitalizeWords(r.category)} · Registered: {r.createdAt}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                  <Text
                    style={[
                      styles.badge,
                      isOnline ? styles.badgeGreen : isActive ? styles.badgeBlue : styles.badgeSlate,
                    ]}
                  >
                    {r.workingStatus || r.status}
                  </Text>
                  <Text style={[styles.badge, styles.badgeBlue]}>
                    {r.frequency}
                  </Text>
                </View>
              </View>

              {/* Card Body: 4-Column Stat Grid + Session Audit */}
              <View style={styles.cardBody}>
                <View style={styles.grid}>
                  <View style={styles.gridCellCol4}>
                    <Text style={styles.label}>Weekly Login Frequency</Text>
                    <Text style={[styles.value, { color: "#0369a1" }]}>{r.frequency}</Text>
                  </View>
                  <View style={styles.gridCellCol4}>
                    <Text style={styles.label}>Total Lifetime Logins</Text>
                    <Text style={styles.value}>{r.logins} sessions recorded</Text>
                  </View>
                  <View style={styles.gridCellCol4}>
                    <Text style={styles.label}>Estimated Time Spent</Text>
                    <Text style={[styles.value, { fontWeight: "bold" }]}>{r.timeSpent}</Text>
                  </View>
                  <View style={styles.gridCellCol4}>
                    <Text style={styles.label}>Last Active Timestamp</Text>
                    <Text style={styles.valueMono}>{r.lastActive}</Text>
                  </View>

                  {/* Deep Telemetry Sub-Card */}
                  <View style={styles.gridCellCol1}>
                    <View style={[styles.subCard, { marginTop: 3 }]}>
                      <Text style={styles.sectionTitle}>
                        Session Audit & Supervision Overview
                      </Text>
                      <View style={styles.grid}>
                        <View style={styles.gridCellCol2}>
                          <Text style={styles.itemText}>
                            • Working State: <Text style={{ fontWeight: "bold" }}>{r.workingStatus || r.status}</Text>
                          </Text>
                          <Text style={[styles.itemTextMuted, { marginTop: 2 }]}>
                            Contact: {r.email} {r.phone !== "—" ? `· ${r.phone}` : ""}
                          </Text>
                        </View>
                        <View style={styles.gridCellCol2}>
                          <Text style={styles.itemText}>
                            • Supervised Postings: <Text style={{ fontWeight: "bold" }}>{r.activeProjectsCount ?? (r.status === "ONLINE" ? 1 : 0)} active projects</Text> · {r.totalProjectsCount ?? 0} total postings
                          </Text>
                          <Text style={[styles.itemTextMuted, { marginTop: 2 }]}>
                            Session Verification: {isOnline ? "Active Web Session (Live)" : isActive ? "Recent Activity Verified" : "Idle Account"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <SharedReportFooter />
      </Page>
    </Document>
  );
}

// ============================================================================
// 3. CLIENT ENGAGEMENT DETAILED DOCUMENT (FULL ITEMIZATION)
// ============================================================================
export type ClientEngagementItemized = {
  id: number | string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  primaryFeature: string;
  featuresList: string[];
  engagementScore: number;
  documents: Array<{ id: string | number; fileName: string; jobRef?: string; date?: string }>;
  forms: Array<{ id: string | number; title: string; category?: string; status: string; budget?: string; date?: string }>;
  tasks: Array<{ id: string | number; title: string; amount: number | string; projectRef?: string; status?: string }>;
};

export function ClientEngagementDetailedDocument({
  clients,
  summaryStats,
  filterSummary,
  pageSize = "A4",
}: {
  clients: ClientEngagementItemized[];
  summaryStats?: Array<{ label: string; value: string }>;
  filterSummary?: string;
  pageSize?: ReportPageSize;
}) {
  return (
    <Document title="Klick-Pro Client Engagement & Workflow Report">
      <Page size={pageSize} orientation="landscape" style={styles.page}>
        <SharedReportHeader
          title="Client Engagement & Workflow Audit"
          subtitle="Full Itemized Audit · Uploaded Documents · Submitted Job Forms · Completed Tasks"
          filterSummary={filterSummary || `${clients.length} active client profiles`}
        />

        {summaryStats && summaryStats.length > 0 && (
          <View style={styles.summaryRibbon}>
            {summaryStats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {clients.map((c, idx) => (
          <View key={idx} style={styles.card} wrap={false}>
            {/* Client Card Header */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{capitalizeWords(c.name)}</Text>
                <Text style={styles.cardSub}>
                  {capitalizeWords(c.company)} · {c.email} · {c.phone || "No phone"} · Location: {capitalizeWords(c.location)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                <Text style={[styles.badge, styles.badgeBlue]}>Score: {c.engagementScore} pts</Text>
                <Text style={[styles.badge, styles.badgeGreen]}>Primary: {c.primaryFeature}</Text>
              </View>
            </View>

            {/* Client Detailed Itemized Sections in 3 Columns */}
            <View style={styles.cardBody}>
              <View style={styles.grid}>
                {/* 1. Uploaded Documents */}
                <View style={styles.gridCellCol3}>
                  <View style={styles.subCard}>
                    <Text style={styles.sectionTitle}>
                      Documents Uploaded ({c.documents.length})
                    </Text>
                    {c.documents.length === 0 ? (
                      <Text style={styles.emptyNote}>No documents uploaded yet</Text>
                    ) : (
                      c.documents.map((d, dIdx) => (
                        <View key={dIdx} style={styles.itemRow}>
                          <Text style={[styles.itemText, { flex: 1 }]}>
                            • {d.fileName}
                          </Text>
                          {d.jobRef ? (
                            <Text style={[styles.itemTextMuted, { fontSize: 6 }]}>{d.jobRef}</Text>
                          ) : null}
                        </View>
                      ))
                    )}
                  </View>
                </View>

                {/* 2. Submitted Job Forms */}
                <View style={styles.gridCellCol3}>
                  <View style={styles.subCard}>
                    <Text style={styles.sectionTitle}>
                      Job Forms Submitted ({c.forms.length})
                    </Text>
                    {c.forms.length === 0 ? (
                      <Text style={styles.emptyNote}>No job forms submitted</Text>
                    ) : (
                      c.forms.map((f, fIdx) => (
                        <View key={fIdx} style={styles.itemRow}>
                          <Text style={[styles.itemText, { flex: 1, fontWeight: "bold" }]}>
                            • {capitalizeWords(f.title)}
                          </Text>
                          <Text style={[styles.itemTextMuted, { fontSize: 6.2, marginLeft: 4 }]}>
                            [{f.status || "OPEN"}]
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </View>

                {/* 3. Completed Milestone Tasks */}
                <View style={styles.gridCellCol3}>
                  <View style={styles.subCard}>
                    <Text style={styles.sectionTitle}>
                      Tasks Completed ({c.tasks.length})
                    </Text>
                    {c.tasks.length === 0 ? (
                      <Text style={styles.emptyNote}>No milestone tasks completed</Text>
                    ) : (
                      c.tasks.map((t, tIdx) => (
                        <View key={tIdx} style={styles.itemRow}>
                          <Text style={[styles.itemText, { flex: 1 }]}>
                            • {capitalizeWords(t.title)}
                          </Text>
                          <Text style={[styles.itemText, { fontWeight: "bold", fontSize: 6.8 }]}>
                            {typeof t.amount === "number" ? `₹${t.amount.toLocaleString("en-IN")}` : String(t.amount)}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </View>

                {/* Enabled Features Strip */}
                <View style={styles.gridCellCol1}>
                  <Text style={[styles.itemTextMuted, { fontSize: 6.8 }]}>
                    Active Platform Modules: {c.featuresList.length > 0 ? c.featuresList.join(" · ") : "General Browsing"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <SharedReportFooter />
      </Page>
    </Document>
  );
}

// ============================================================================
// 4. SUPPORT & COMPLAINTS DETAILED DOCUMENT (2-PART SIDE-BY-SIDE + PROJECT)
// ============================================================================
export type DisputePartyInfo = {
  name: string;
  email: string;
  phone: string;
  state: string;
  statement: string;
  claimAmount: string | number;
};

export type SupportComplaintDetailedRow = {
  id: string | number;
  source: string;
  priority: string;
  status: string;
  createdAt: string | Date;
  resolvedAt?: string | Date | null;
  turnaroundTime?: string;
  totalExposure: string | number;
  project: {
    jobId?: string | number;
    title: string;
    category: string;
    budget: string | number;
    milestoneTitle: string;
    milestoneAmount: string | number;
  };
  client: DisputePartyInfo;
  professional: DisputePartyInfo;
  arbitration: {
    stage?: string;
    decision: string;
    clientSplit?: string | number;
    proSplit?: string | number;
  };
};

export function SupportComplaintsDetailedDocument({
  cases,
  summaryStats,
  filterSummary,
  pageSize = "A4",
}: {
  cases: SupportComplaintDetailedRow[];
  summaryStats?: Array<{ label: string; value: string }>;
  filterSummary?: string;
  pageSize?: ReportPageSize;
}) {
  return (
    <Document title="Klick-Pro Support & Complaints Audit Report">
      <Page size={pageSize} orientation="landscape" style={styles.page}>
        <SharedReportHeader
          title="Support & Complaints Resolution Audit"
          subtitle="Two-Sided Resolution Audit · Dual-Party Details · Job Milestones & Decision Records"
          filterSummary={filterSummary || `${cases.length} arbitration records`}
        />

        {summaryStats && summaryStats.length > 0 && (
          <View style={styles.summaryRibbon}>
            {summaryStats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {cases.map((c, i) => (
          <View key={i} style={styles.card} wrap={false}>
            {/* 1. Case & Website Header Details */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>
                  Case #{c.id} · {c.project.title || "Marketplace Project"}
                </Text>
                <Text style={styles.cardSub}>
                  Channel: {c.source} · Filed: {formatReportDate(c.createdAt)} · Category: {capitalizeWords(c.project.category)}
                  {c.turnaroundTime ? ` · Turnaround: ${c.turnaroundTime}` : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={[
                    styles.badge,
                    c.priority === "CRITICAL" ? styles.badgeRose : c.priority === "HIGH" ? styles.badgeAmber : styles.badgeBlue,
                  ]}
                >
                  {c.priority} Priority
                </Text>
                <Text
                  style={[
                    styles.badge,
                    c.status === "RESOLVED" ? styles.badgeGreen : styles.badgeAmber,
                  ]}
                >
                  {c.status}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              {/* 2. Side-by-Side Dual Party Breakdown */}
              <View style={styles.twoPartContainer}>
                {/* Left Side: Client */}
                <View style={[styles.twoPartColumn, styles.twoPartLeft]}>
                  <Text style={[styles.twoPartTitle, { color: "#0369a1", borderColor: "#bae6fd" }]}>
                    Client Side Details & Claim
                  </Text>
                  <View style={styles.grid}>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Full Name</Text>
                      <Text style={styles.value}>{capitalizeWords(c.client.name)}</Text>
                    </View>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Location (State)</Text>
                      <Text style={styles.value}>{capitalizeWords(c.client.state)}</Text>
                    </View>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Phone Number</Text>
                      <Text style={styles.valueMono}>{c.client.phone || "—"}</Text>
                    </View>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Email Address</Text>
                      <Text style={styles.valueMono}>{c.client.email || "—"}</Text>
                    </View>
                    <View style={styles.gridCellCol1}>
                      <Text style={styles.label}>Grievance / Formal Statement</Text>
                      <Text style={[styles.valueMono, { fontStyle: "italic", marginTop: 2 }]}>
                        &quot;{capitalizeFirst(c.client.statement || "No formal statement filed.")}&quot;
                      </Text>
                    </View>
                    <View style={styles.gridCellCol1}>
                      <Text style={styles.label}>Refund Claimed</Text>
                      <Text style={[styles.value, { color: "#0284c7" }]}>
                        {typeof c.client.claimAmount === "number"
                          ? `₹${c.client.claimAmount.toLocaleString("en-IN")}`
                          : String(c.client.claimAmount)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Side: Professional */}
                <View style={[styles.twoPartColumn, styles.twoPartRight]}>
                  <Text style={[styles.twoPartTitle, { color: "#7e22ce", borderColor: "#f5d0fe" }]}>
                    Professional Side Details & Response
                  </Text>
                  <View style={styles.grid}>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Full Name</Text>
                      <Text style={styles.value}>{capitalizeWords(c.professional.name)}</Text>
                    </View>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Location (State)</Text>
                      <Text style={styles.value}>{capitalizeWords(c.professional.state)}</Text>
                    </View>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Phone Number</Text>
                      <Text style={styles.valueMono}>{c.professional.phone || "—"}</Text>
                    </View>
                    <View style={styles.gridCellCol2}>
                      <Text style={styles.label}>Email Address</Text>
                      <Text style={styles.valueMono}>{c.professional.email || "—"}</Text>
                    </View>
                    <View style={styles.gridCellCol1}>
                      <Text style={styles.label}>Response Statement</Text>
                      <Text style={[styles.valueMono, { fontStyle: "italic", marginTop: 2 }]}>
                        &quot;{capitalizeFirst(c.professional.statement || "No response statement on record.")}&quot;
                      </Text>
                    </View>
                    <View style={styles.gridCellCol1}>
                      <Text style={styles.label}>Payout Claimed</Text>
                      <Text style={[styles.value, { color: "#9333ea" }]}>
                        {typeof c.professional.claimAmount === "number"
                          ? `₹${c.professional.claimAmount.toLocaleString("en-IN")}`
                          : String(c.professional.claimAmount)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* 3. Job & Milestone Details + Arbitration Ruling */}
              <View style={[styles.subCard, { marginTop: 6, backgroundColor: "#f8fafc" }]}>
                <View style={styles.grid}>
                  <View style={styles.gridCellCol3}>
                    <Text style={styles.label}>Project Budget</Text>
                    <Text style={styles.value}>
                      {typeof c.project.budget === "number" ? `₹${c.project.budget.toLocaleString("en-IN")}` : String(c.project.budget)}
                    </Text>
                  </View>
                  <View style={styles.gridCellCol3}>
                    <Text style={styles.label}>Disputed Milestone</Text>
                    <Text style={styles.value}>{capitalizeWords(c.project.milestoneTitle || "General Escrow Milestone")}</Text>
                  </View>
                  <View style={styles.gridCellCol3}>
                    <Text style={styles.label}>Disputed Amount</Text>
                    <Text style={[styles.value, { color: "#b91c1c" }]}>
                      {typeof c.project.milestoneAmount === "number"
                        ? `₹${c.project.milestoneAmount.toLocaleString("en-IN")}`
                        : String(c.project.milestoneAmount)}
                    </Text>
                  </View>
                  <View style={styles.gridCellCol1}>
                    <Text style={styles.label}>Arbitration Decision & Settlement Finding</Text>
                    <Text style={[styles.value, { color: "#0f172a", marginTop: 2 }]}>
                      {capitalizeFirst(c.arbitration.decision || "Pending formal mediation decision.")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        <SharedReportFooter />
      </Page>
    </Document>
  );
}

// ============================================================================
// 5. SYSTEM RELIABILITY DETAILED DOCUMENT (ALL 5 CATEGORIES)
// ============================================================================
export type TelemetryIncident = {
  id: string | number;
  timestamp: string;
  eventType: "UPTIME" | "FAILED_LOGIN" | "API_FAILURE" | "SERVER_ERROR" | "SLOW_PAGE" | string;
  target: string;
  details: string;
  severity: string;
  ipAddress: string;
  status: string;
};

export function SystemReliabilityDetailedDocument({
  incidents,
  summaryStats,
  filterSummary,
  pageSize = "A4",
}: {
  incidents: TelemetryIncident[];
  summaryStats?: Array<{ label: string; value: string }>;
  filterSummary?: string;
  pageSize?: ReportPageSize;
}) {
  const uptimes = incidents.filter((i) => i.eventType === "UPTIME");
  const serverErrors = incidents.filter((i) => i.eventType === "SERVER_ERROR");
  const failedLogins = incidents.filter((i) => i.eventType === "FAILED_LOGIN");
  const apiFailures = incidents.filter((i) => i.eventType === "API_FAILURE");
  const slowPages = incidents.filter((i) => i.eventType === "SLOW_PAGE");

  const categories = [
    { title: "1. Core System Uptime & Availability Engine", items: uptimes, color: "#15803d", bg: "#f0fdf4" },
    { title: "2. Server Exceptions & 500 Failure Logs", items: serverErrors, color: "#b91c1c", bg: "#fef2f2" },
    { title: "3. Failed Authentication & Security Challenges", items: failedLogins, color: "#c2410c", bg: "#fff7ed" },
    { title: "4. API Gateway & External Webhook Failures", items: apiFailures, color: "#a21caf", bg: "#fdf4ff" },
    { title: "5. Query Latency & Slow Endpoint Warnings", items: slowPages, color: "#b45309", bg: "#fefce8" },
  ];

  return (
    <Document title="Klick-Pro System Reliability Audit Report">
      <Page size={pageSize} orientation="landscape" style={styles.page}>
        <SharedReportHeader
          title="System Reliability & Incident Telemetry Audit"
          subtitle="Full Telemetry Audit · Uptime · Server Errors · Failed Logins · API Failures · Slow Pages"
          filterSummary={filterSummary || `${incidents.length} telemetry records logged`}
        />

        {summaryStats && summaryStats.length > 0 && (
          <View style={styles.summaryRibbon}>
            {summaryStats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {categories.map((cat, cIdx) => (
          <View key={cIdx} style={[styles.card, { marginBottom: 8 }]} wrap={false}>
            <View style={[styles.cardHeader, { backgroundColor: cat.bg }]}>
              <Text style={[styles.cardTitle, { color: cat.color }]}>{cat.title}</Text>
              <Text style={styles.badge}>{cat.items.length} Events Logged</Text>
            </View>
            <View style={styles.cardBody}>
              {cat.items.length === 0 ? (
                <Text style={styles.emptyNote}>No telemetry incidents detected in this window.</Text>
              ) : (
                <View>
                  {cat.items.map((it, itIdx) => (
                    <View key={itIdx} style={[styles.subCard, { marginBottom: 4 }]} wrap={false}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <Text style={[styles.value, { fontSize: 8.5 }]}>{it.target}</Text>
                          <Text style={[styles.itemTextMuted, { fontSize: 6.5 }]}>#{it.id}</Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 4 }}>
                          <Text
                            style={[
                              styles.badge,
                              it.severity === "CRITICAL"
                                ? styles.badgeRose
                                : it.severity === "HIGH"
                                  ? styles.badgeAmber
                                  : styles.badgeSlate,
                              { fontSize: 6 },
                            ]}
                          >
                            {it.severity}
                          </Text>
                          <Text style={[styles.badge, styles.badgeBlue, { fontSize: 6 }]}>
                            {it.status}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.itemText, { marginBottom: 3 }]}>
                        {it.details}
                      </Text>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderTopColor: "#e2e8f0", paddingTop: 2 }}>
                        <Text style={[styles.itemTextMuted, { fontSize: 6 }]}>
                          Origin / IP: {it.ipAddress}
                        </Text>
                        <Text style={[styles.itemTextMuted, { fontSize: 6 }]}>
                          Timestamp: {it.timestamp}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        <SharedReportFooter />
      </Page>
    </Document>
  );
}

// ============================================================================
// 6. CLIENT GROWTH DETAILED DOCUMENT (COHORTS + FULL CLIENT ROSTER)
// ============================================================================
export type ClientGrowthCohort = {
  cohortPeriod: string;
  startingClients: number;
  newClients: number;
  inactiveClients: number;
  netGrowth: number;
  growthPercent: string;
};

export function ClientGrowthDetailedDocument({
  cohorts,
  newClientsRoster,
  summaryStats,
  filterSummary,
  pageSize = "A4",
}: {
  cohorts: ClientGrowthCohort[];
  newClientsRoster: ClientRegistrationRow[];
  summaryStats?: Array<{ label: string; value: string }>;
  filterSummary?: string;
  pageSize?: ReportPageSize;
}) {
  return (
    <Document title="Klick-Pro Client Growth & Cohort Audit Report">
      <Page size={pageSize} orientation="landscape" style={styles.page}>
        <SharedReportHeader
          title="Client Growth & Cohort Expansion Audit"
          subtitle="Weekly Cohorts · Retention Metrics · Complete Itemized New Client Registration Roster"
          filterSummary={filterSummary || `${newClientsRoster.length} new client accounts`}
        />

        {summaryStats && summaryStats.length > 0 && (
          <View style={styles.summaryRibbon}>
            {summaryStats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Part 1: Weekly Cohort Overview */}
        <View style={styles.card} wrap={false}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Growth Cohorts Analytics</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Cohort Interval</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Starting Base</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>New Clients</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Inactive</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Net Growth</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: "right" }]}>Growth Rate</Text>
              </View>
              {cohorts.map((c, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, { flex: 2, fontWeight: "bold" }]}>{c.cohortPeriod}</Text>
                  <Text style={[styles.tableCell, { flex: 1.2, textAlign: "right" }]}>{c.startingClients}</Text>
                  <Text style={[styles.tableCell, { flex: 1.2, textAlign: "right", color: "#15803d", fontWeight: "bold" }]}>
                    +{c.newClients}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.2, textAlign: "right", color: "#b91c1c" }]}>
                    -{c.inactiveClients}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.2, textAlign: "right", fontWeight: "bold" }]}>
                    {c.netGrowth >= 0 ? `+${c.netGrowth}` : c.netGrowth}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.2, textAlign: "right", fontWeight: "bold", color: "#0369a1" }]}>
                    {c.growthPercent}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Part 2: Full Itemized Roster of New Clients */}
        <View style={styles.card} wrap={false}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Itemized Roster of New Client Registrations ({newClientsRoster.length})
            </Text>
          </View>
          <View style={styles.cardBody}>
            {newClientsRoster.length === 0 ? (
              <Text style={styles.emptyNote}>No new client accounts registered in this interval.</Text>
            ) : (
              newClientsRoster.map((r, i) => (
                <View key={i} style={[styles.subCard, { marginBottom: 4 }]} wrap={false}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <View>
                      <Text style={[styles.value, { fontSize: 8.5 }]}>{capitalizeWords(r.name)}</Text>
                      <Text style={[styles.itemTextMuted, { fontSize: 6.5 }]}>{capitalizeWords(r.company || "Individual Client")}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 4 }}>
                      <Text
                        style={[
                          styles.badge,
                          r.kyc === "Verified" ? styles.badgeGreen : styles.badgeAmber,
                          { fontSize: 6 },
                        ]}
                      >
                        {r.kyc}
                      </Text>
                      <Text style={[styles.badge, styles.badgeBlue, { fontSize: 6 }]}>
                        {r.jobsCount} {r.jobsCount === 1 ? "Job" : "Jobs"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.grid}>
                    <View style={styles.gridCellCol4}>
                      <Text style={styles.label}>Email Address</Text>
                      <Text style={styles.valueMono}>{r.email || "—"}</Text>
                    </View>
                    <View style={styles.gridCellCol4}>
                      <Text style={styles.label}>Phone Number</Text>
                      <Text style={styles.valueMono}>{r.phone || "—"}</Text>
                    </View>
                    <View style={styles.gridCellCol4}>
                      <Text style={styles.label}>Location (State)</Text>
                      <Text style={styles.value}>{capitalizeWords(r.state || r.location)}</Text>
                    </View>
                    <View style={styles.gridCellCol4}>
                      <Text style={styles.label}>Registered At</Text>
                      <Text style={styles.valueMono}>{formatReportDate(r.createdAt)}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <SharedReportFooter />
      </Page>
    </Document>
  );
}

// ============================================================================
// 7. POSTING GROWTH DETAILED DOCUMENT (FULL JOB SPECIFICATIONS)
// ============================================================================
export type PostingGrowthDetailedRow = {
  id: string | number;
  reference: string;
  title: string;
  category: string;
  description?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  location: string;
  workMode: string;
  budget: string | number;
  status: string;
  proposalsCount: number | string;
  milestonesCount: number | string;
  createdAt: string | Date;
};

export function PostingGrowthDetailedDocument({
  postings,
  summaryStats,
  filterSummary,
  pageSize = "A4",
}: {
  postings: PostingGrowthDetailedRow[];
  summaryStats?: Array<{ label: string; value: string }>;
  filterSummary?: string;
  pageSize?: ReportPageSize;
}) {
  return (
    <Document title="Klick-Pro Posting Growth & Marketplace Jobs Report">
      <Page size={pageSize} orientation="landscape" style={styles.page}>
        <SharedReportHeader
          title="Marketplace Posting Growth & Job Specifications Audit"
          subtitle="Full Project Specifications · Budgets · Client Details · Proposal Volumes & Milestones"
          filterSummary={filterSummary || `${postings.length} marketplace postings`}
        />

        {summaryStats && summaryStats.length > 0 && (
          <View style={styles.summaryRibbon}>
            {summaryStats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {postings.map((p, i) => (
          <View key={i} style={styles.card} wrap={false}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>
                  {p.reference} · {capitalizeWords(p.title)}
                </Text>
                <Text style={styles.cardSub}>
                  Category: {capitalizeWords(p.category)} · Mode: {p.workMode || "Remote / On-site"} · Posted:{" "}
                  {formatReportDate(p.createdAt)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text style={[styles.badge, styles.badgeBlue]}>
                  {typeof p.budget === "number" ? `₹${p.budget.toLocaleString("en-IN")}` : String(p.budget)}
                </Text>
                <Text style={[styles.badge, p.status === "COMPLETED" ? styles.badgeGreen : styles.badgeAmber]}>
                  {p.status}
                </Text>
              </View>
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <View style={styles.grid}>
                {/* Client Details */}
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Client Owner</Text>
                  <Text style={styles.value}>{capitalizeWords(p.clientName)}</Text>
                </View>
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Email Address</Text>
                  <Text style={styles.valueMono}>{p.clientEmail || "—"}</Text>
                </View>
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Phone Number</Text>
                  <Text style={styles.valueMono}>{p.clientPhone || "—"}</Text>
                </View>
                <View style={styles.gridCellCol4}>
                  <Text style={styles.label}>Location (State)</Text>
                  <Text style={styles.value}>{capitalizeWords(p.location)}</Text>
                </View>

                {/* Scope Description */}
                <View style={styles.gridCellCol1}>
                  <Text style={styles.label}>Project Scope & Description</Text>
                  <Text style={[styles.valueMono, { marginTop: 2, fontSize: 7.2 }]}>
                    {capitalizeFirst(p.description || "Full job specification provided in digital brief.")}
                  </Text>
                </View>

                {/* Proposals & Milestones */}
                <View style={styles.gridCellCol2}>
                  <Text style={styles.label}>Marketplace Proposals</Text>
                  <Text style={styles.value}>{p.proposalsCount} proposals submitted</Text>
                </View>
                <View style={styles.gridCellCol2}>
                  <Text style={styles.label}>Milestone Milestones Progress</Text>
                  <Text style={styles.value}>{p.milestonesCount} milestones configured</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <SharedReportFooter />
      </Page>
    </Document>
  );
}


export { SingleClientActivityDossierDocument } from "./SingleClientActivityDossierDocument";
