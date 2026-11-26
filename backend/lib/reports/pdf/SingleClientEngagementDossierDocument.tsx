import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { reportTheme } from "./theme";
import { getBrandLogoBase64 } from "./brand-logo";
import { capitalizeWords } from "@/lib/utils";
import type { ClientEngagementItemized } from "./DetailedReportsDocuments";

const styles = StyleSheet.create({
  page: {
    paddingTop: 96,
    paddingBottom: 52,
    paddingHorizontal: 32,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    lineHeight: 1.4,
    color: reportTheme.ink,
    backgroundColor: "#ffffff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 82,
    paddingHorizontal: 32,
    paddingTop: 16,
    backgroundColor: reportTheme.ink,
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
    marginBottom: 4,
  },
  logoBox: {
    width: 24,
    height: 24,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoImage: {
    width: 18,
    height: 18,
    objectFit: "contain",
  },
  brandName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1.2,
  },
  brandSub: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: reportTheme.cta,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 7,
    color: "#cbd5e1",
    marginTop: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    minWidth: 160,
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
    fontSize: 6.8,
    color: "#cbd5e1",
    lineHeight: 1.3,
    textAlign: "right",
  },
  accentBar: {
    position: "absolute",
    top: 82,
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
    paddingHorizontal: 32,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: reportTheme.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    color: reportTheme.muted,
    fontSize: 7.2,
  },
  // Hero Card
  hero: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 6,
    backgroundColor: "#f8fafc",
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: reportTheme.ink,
  },
  heroSubtitle: {
    fontSize: 7.5,
    color: reportTheme.muted,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 4,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  modulesStrip: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
  },
  modulesLabel: {
    fontSize: 6.8,
    fontWeight: "bold",
    color: reportTheme.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginRight: 6,
  },
  modulesText: {
    fontSize: 7.2,
    color: reportTheme.ink,
  },
  // Telemetry Grid
  telemetryGrid: {
    flexDirection: "row",
    marginBottom: 12,
    marginHorizontal: -3,
  },
  telemetryBox: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  telemetryLabel: {
    color: reportTheme.muted,
    fontSize: 6.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  telemetryValue: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "bold",
    color: reportTheme.primary,
  },
  // Sections
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: reportTheme.cta,
    color: reportTheme.ink,
    fontSize: 8.8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Tables
  table: {
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: reportTheme.ink,
    paddingVertical: 5,
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
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 7.2,
    color: reportTheme.ink,
  },
  tableCellBold: {
    fontSize: 7.2,
    fontWeight: "bold",
    color: reportTheme.ink,
  },
  statusPill: {
    paddingVertical: 1.5,
    paddingHorizontal: 5,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  statusPillText: {
    fontSize: 6,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  emptyNote: {
    padding: 10,
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 4,
    color: reportTheme.muted,
    fontSize: 7.5,
    textAlign: "center",
    backgroundColor: "#f8fafc",
  },
});

function formatMoney(amount: unknown): string {
  if (typeof amount === "number") {
    return `INR ${amount.toLocaleString("en-IN")}`;
  }
  if (!amount || amount === "Unspecified" || amount === "0") {
    return "Unspecified";
  }
  const cleanStr = String(amount).replace(/^[₹Rs.\s]+/, "").trim();
  const num = Number(cleanStr.replace(/,/g, ""));
  if (!isNaN(num) && num > 0) {
    return `INR ${num.toLocaleString("en-IN")}`;
  }
  return String(amount);
}

export function SingleClientEngagementDossierDocument({
  client,
}: {
  client: ClientEngagementItemized;
}) {
  const brandLogo = getBrandLogoBase64();
  const phoneText = client.phone && client.phone !== "—" && client.phone !== "-" ? client.phone : null;

  return (
    <Document
      title={`Client Engagement Dossier - ${capitalizeWords(client.name)}`}
      author="Klick-Pro Administration"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Persistent Header */}
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
            <Text style={styles.headerTitle}>Client Engagement & Workflow Dossier</Text>
            <Text style={styles.headerSubtitle}>
              Full Itemized Audit · Submitted Jobs, Milestone Deliverables & Verification Documents
            </Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.confidentialBadge}>
              <Text style={styles.confidentialText}>Confidential Audit</Text>
            </View>
            <Text style={styles.meta}>Generated: {new Date().toLocaleString("en-IN")} IST</Text>
            <Text style={styles.meta}>Scope: Individual Client Engagement Dossier</Text>
          </View>
        </View>
        <View style={styles.accentBar} fixed />

        {/* Hero & Client Profile Card */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.heroTitle}>{capitalizeWords(client.name)}</Text>
              <Text style={styles.heroSubtitle}>
                {client.email}
                {phoneText ? ` · ${phoneText}` : ""} · Location: {capitalizeWords(client.location)}
              </Text>
            </View>
            <View style={styles.badgesRow}>
              <View style={[styles.badge, { backgroundColor: "#e0f2fe" }]}>
                <Text style={[styles.badgeText, { color: "#0369a1" }]}>
                  Score: {client.engagementScore} / 100 PTS
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: "#dcfce7" }]}>
                <Text style={[styles.badgeText, { color: "#15803d" }]}>
                  Primary: {capitalizeWords(client.primaryFeature)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modulesStrip}>
            <Text style={styles.modulesLabel}>Active Modules:</Text>
            <Text style={styles.modulesText}>
              {client.featuresList.length > 0 ? client.featuresList.join("  ·  ") : "General Browsing"}
            </Text>
          </View>
        </View>

        {/* Telemetry Metric Cards */}
        <View style={styles.telemetryGrid}>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Total Documents</Text>
            <Text style={styles.telemetryValue}>{client.documents.length}</Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Jobs Posted</Text>
            <Text style={styles.telemetryValue}>{client.forms.length}</Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Milestones Completed</Text>
            <Text style={styles.telemetryValue}>{client.tasks.length}</Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Active Workflows</Text>
            <Text style={styles.telemetryValue}>
              {client.featuresList.length > 0 ? client.featuresList.length : 1}
            </Text>
          </View>
        </View>

        {/* Section 1: Jobs Posted Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Jobs Posted & Operational Requirements ({client.forms.length})
          </Text>
          {client.forms.length === 0 ? (
            <Text style={styles.emptyNote}>No jobs posted by this client</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <Text style={[styles.tableHeaderCell, { width: "6%" }]}>#</Text>
                <Text style={[styles.tableHeaderCell, { width: "38%" }]}>Job Title</Text>
                <Text style={[styles.tableHeaderCell, { width: "22%" }]}>Category</Text>
                <Text style={[styles.tableHeaderCell, { width: "16%" }]}>Budget</Text>
                <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Status</Text>
              </View>
              {client.forms.map((form, fIdx) => {
                const isAlt = fIdx % 2 === 1;
                const status = (form.status || "OPEN").toUpperCase();
                const isClosed = status === "CLOSED" || status === "COMPLETED";
                const isProgress = status === "IN_PROGRESS" || status === "ACTIVE";
                const pillBg = isClosed ? "#f1f5f9" : isProgress ? "#fef3c7" : "#dbeafe";
                const pillColor = isClosed ? "#475569" : isProgress ? "#b45309" : "#1e40af";

                return (
                  <View
                    key={fIdx}
                    style={[styles.tableRow, isAlt ? styles.tableRowAlt : {}]}
                    wrap={false}
                  >
                    <Text style={[styles.tableCell, { width: "6%", color: reportTheme.muted }]}>
                      {fIdx + 1}
                    </Text>
                    <Text style={[styles.tableCellBold, { width: "38%" }]}>
                      {capitalizeWords(form.title)}
                    </Text>
                    <Text style={[styles.tableCell, { width: "22%", color: reportTheme.muted }]}>
                      {capitalizeWords(form.category || "General")}
                    </Text>
                    <Text style={[styles.tableCell, { width: "16%", fontWeight: "bold" }]}>
                      {formatMoney(form.budget)}
                    </Text>
                    <View style={{ width: "18%" }}>
                      <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
                        <Text style={[styles.statusPillText, { color: pillColor }]}>
                          {status}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Section 2: Completed Milestones Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Completed Milestones & Deliverables ({client.tasks.length})
          </Text>
          {client.tasks.length === 0 ? (
            <Text style={styles.emptyNote}>No completed milestones recorded</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <Text style={[styles.tableHeaderCell, { width: "6%" }]}>#</Text>
                <Text style={[styles.tableHeaderCell, { width: "42%" }]}>Milestone Title</Text>
                <Text style={[styles.tableHeaderCell, { width: "22%" }]}>Project Ref</Text>
                <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Amount</Text>
                <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Status</Text>
              </View>
              {client.tasks.map((task, tIdx) => {
                const isAlt = tIdx % 2 === 1;
                const status = (task.status || "COMPLETED").toUpperCase();
                const isSuccess = status === "COMPLETED" || status === "APPROVED" || status === "RELEASED";
                const pillBg = isSuccess ? "#dcfce7" : "#f1f5f9";
                const pillColor = isSuccess ? "#15803d" : "#475569";

                return (
                  <View
                    key={tIdx}
                    style={[styles.tableRow, isAlt ? styles.tableRowAlt : {}]}
                    wrap={false}
                  >
                    <Text style={[styles.tableCell, { width: "6%", color: reportTheme.muted }]}>
                      {tIdx + 1}
                    </Text>
                    <Text style={[styles.tableCellBold, { width: "42%" }]}>
                      {capitalizeWords(task.title)}
                    </Text>
                    <Text style={[styles.tableCell, { width: "22%", color: reportTheme.muted }]}>
                      {task.projectRef || "—"}
                    </Text>
                    <Text style={[styles.tableCell, { width: "18%", fontWeight: "bold" }]}>
                      {formatMoney(task.amount)}
                    </Text>
                    <View style={{ width: "12%" }}>
                      <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
                        <Text style={[styles.statusPillText, { color: pillColor }]}>
                          {status}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Section 3: Uploaded Documents Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Documents Uploaded & Verification Files ({client.documents.length})
          </Text>
          {client.documents.length === 0 ? (
            <Text style={styles.emptyNote}>No verification documents uploaded</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <Text style={[styles.tableHeaderCell, { width: "6%" }]}>#</Text>
                <Text style={[styles.tableHeaderCell, { width: "54%" }]}>File Name</Text>
                <Text style={[styles.tableHeaderCell, { width: "22%" }]}>Project Reference</Text>
                <Text style={[styles.tableHeaderCell, { width: "18%" }]}>Uploaded Date</Text>
              </View>
              {client.documents.map((doc, dIdx) => {
                const isAlt = dIdx % 2 === 1;
                return (
                  <View
                    key={dIdx}
                    style={[styles.tableRow, isAlt ? styles.tableRowAlt : {}]}
                    wrap={false}
                  >
                    <Text style={[styles.tableCell, { width: "6%", color: reportTheme.muted }]}>
                      {dIdx + 1}
                    </Text>
                    <Text style={[styles.tableCellBold, { width: "54%" }]}>
                      {doc.fileName}
                    </Text>
                    <Text style={[styles.tableCell, { width: "22%", color: reportTheme.muted }]}>
                      {doc.jobRef || "—"}
                    </Text>
                    <Text style={[styles.tableCell, { width: "18%", color: reportTheme.muted }]}>
                      {doc.date || "—"}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Persistent Footer with Page Numbers */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Klick-Pro Enterprise Platform · Official Compliance & Financial Audit Record
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
