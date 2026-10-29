import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { reportTheme } from "./theme";
import { getBrandLogoBase64 } from "./brand-logo";
import { capitalizeWords } from "@/lib/utils";
import type { ClientActivityDossierData } from "./user-dossier-builder";

const styles = StyleSheet.create({
  page: {
    paddingTop: 96,
    paddingBottom: 52,
    paddingHorizontal: 32,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    lineHeight: 1.4,
    color: reportTheme.ink,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 82,
    paddingHorizontal: 32,
    paddingTop: 18,
    backgroundColor: reportTheme.ink,
  },
  brand: {
    color: reportTheme.cta,
    fontSize: 8.5,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerTitle: {
    marginTop: 4,
    color: reportTheme.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  headerMeta: {
    marginTop: 3,
    color: "#cbd5e1",
    fontSize: 7.5,
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
  hero: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 6,
    backgroundColor: reportTheme.zebra,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: reportTheme.ink,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 5,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  badge: {
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  telemetryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  telemetryBox: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 6,
    backgroundColor: reportTheme.white,
  },
  telemetryLabel: {
    color: reportTheme.muted,
    fontSize: 6.8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  telemetryValue: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "bold",
    color: reportTheme.primary,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: reportTheme.cta,
    color: reportTheme.ink,
    fontSize: 9.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  gridCellThird: {
    width: "33.333%",
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  gridCellHalf: {
    width: "50%",
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  label: {
    color: reportTheme.muted,
    fontSize: 6.8,
    fontWeight: "bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  value: {
    marginTop: 1.5,
    color: reportTheme.ink,
    fontSize: 8.2,
    fontWeight: "bold",
  },
  valueMono: {
    marginTop: 1.5,
    color: reportTheme.ink,
    fontSize: 8.2,
  },
  table: {
    marginTop: 4,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: reportTheme.ink,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontSize: 7.2,
    fontWeight: "bold",
    color: reportTheme.white,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: reportTheme.border,
    paddingVertical: 4.5,
    paddingHorizontal: 6,
  },
  tableRowAlt: {
    backgroundColor: reportTheme.zebra,
  },
  tableCell: {
    fontSize: 7.8,
    color: reportTheme.ink,
  },
  emptyNote: {
    padding: 10,
    borderWidth: 1,
    borderColor: reportTheme.border,
    borderRadius: 4,
    color: reportTheme.muted,
    fontSize: 7.8,
    textAlign: "center",
    backgroundColor: "#f8fafc",
  },
});

export function SingleClientActivityDossierDocument({ data }: { data: ClientActivityDossierData }) {
  const isWorking = data.workingStatus.toLowerCase().includes("working") || data.onlineStatus === "Online";
  const isActive = data.workingStatus.toLowerCase().includes("active");
  const isNever = data.workingStatus.toLowerCase().includes("never");

  const workingBadgeBg = isWorking ? "#dcfce7" : isActive ? "#dbeafe" : isNever ? "#fee2e2" : "#f1f5f9";
  const workingBadgeColor = isWorking ? "#15803d" : isActive ? "#1e40af" : isNever ? "#b91c1c" : "#475569";

  return (
    <Document
      title={`Client Activity Dossier - ${capitalizeWords(data.fullName)}`}
      author="Klick-Pro Administration"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <View
              style={{
                width: 26,
                height: 26,
                backgroundColor: "#ffffff",
                borderRadius: 5,
                padding: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {getBrandLogoBase64() ? (
                <Image src={getBrandLogoBase64()} style={{ width: 20, height: 20, objectFit: "contain" }} />
              ) : null}
            </View>
            <Text style={styles.brand}>KLICK-PRO · CLIENT ACTIVITY & SESSION DOSSIER</Text>
          </View>
          <Text style={styles.headerTitle}>Client Activity Telemetry & Engagement Audit</Text>
          <Text style={styles.headerMeta}>
            Confidential Compliance Record · Generated on{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            IST · Account ID: #{data.userId}
          </Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero} wrap={false}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.heroTitle}>{capitalizeWords(data.fullName)}</Text>
              <Text style={{ fontSize: 8, color: reportTheme.ink, marginTop: 1, fontWeight: "bold" }}>
                {capitalizeWords(data.companyName)}
              </Text>
              <Text style={{ fontSize: 7.5, color: reportTheme.muted, marginTop: 2 }}>
                Registered on {data.createdAt} · {data.daysActive} days active on platform
              </Text>
            </View>

            <View style={styles.badgesRow}>
              {/* Working Status Badge */}
              <View style={[styles.badge, { backgroundColor: workingBadgeBg }]}>
                <Text style={[styles.badgeText, { color: workingBadgeColor }]}>{data.workingStatus}</Text>
              </View>

              {/* Online/Offline Status */}
              <View style={[styles.badge, { backgroundColor: data.onlineStatus === "Online" ? "#dcfce7" : "#f1f5f9" }]}>
                <Text
                  style={[
                    styles.badgeText,
                    { color: data.onlineStatus === "Online" ? "#15803d" : "#64748b" },
                  ]}
                >
                  {data.onlineStatus}
                </Text>
              </View>

              {/* KYC Status Badge */}
              <View style={[styles.badge, { backgroundColor: data.isVerified ? "#e0f2fe" : "#f1f5f9" }]}>
                <Text
                  style={[
                    styles.badgeText,
                    { color: data.isVerified ? "#0369a1" : "#64748b" },
                  ]}
                >
                  {data.isVerified ? "KYC VERIFIED" : "PENDING KYC"}
                </Text>
              </View>

              {/* Account Status Badge */}
              <View style={[styles.badge, { backgroundColor: data.isActive ? "#f0fdf4" : "#fee2e2" }]}>
                <Text
                  style={[
                    styles.badgeText,
                    { color: data.isActive ? "#166534" : "#b91c1c" },
                  ]}
                >
                  {data.isActive ? "ACTIVE" : "SUSPENDED"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Activity Telemetry Highlight Ribbon (4 Cards) */}
        <View style={styles.telemetryRow} wrap={false}>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Working Status</Text>
            <Text style={[styles.telemetryValue, { color: workingBadgeColor, fontSize: 9.5 }]}>
              {data.workingStatus}
            </Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Platform Time Spent</Text>
            <Text style={styles.telemetryValue}>{data.timeSpent}</Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Lifetime Logins</Text>
            <Text style={styles.telemetryValue}>{data.totalLogins} Logins</Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>Visit Frequency</Text>
            <Text style={styles.telemetryValue}>{data.weeklyFrequency}</Text>
          </View>
        </View>

        {/* Section 1: Demographics & Account Information */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Account Profile & Contact Information</Text>
          <View style={styles.grid}>
            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{capitalizeWords(data.fullName)}</Text>
            </View>
            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.valueMono}>{data.email}</Text>
            </View>
            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.valueMono}>{data.phone || "—"}</Text>
            </View>

            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Location (State)</Text>
              <Text style={styles.value}>{capitalizeWords(data.state || data.location || "Maharashtra")}</Text>
            </View>
            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Category / Industry</Text>
              <Text style={styles.value}>{capitalizeWords(data.category || "General Services")}</Text>
            </View>
            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Registration Date</Text>
              <Text style={styles.value}>{data.createdAt}</Text>
            </View>

            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Last Active Timestamp</Text>
              <Text style={styles.value}>{data.lastActive}</Text>
            </View>
            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Platform Tenure</Text>
              <Text style={styles.value}>{data.daysActive} days active</Text>
            </View>
            <View style={styles.gridCellThird}>
              <Text style={styles.label}>Completed Projects</Text>
              <Text style={styles.value}>{data.completedProjectsCount} projects</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Recent Login Sessions & Activity History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Login Sessions & Working Telemetry ({data.sessions.length})
          </Text>
          {data.sessions.length === 0 ? (
            <Text style={styles.emptyNote}>
              No login session history recorded yet. Client registered on {data.createdAt} and has not yet established an interactive browser session.
            </Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableRowHeader} fixed>
                <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Session Ref</Text>
                <Text style={[styles.tableHeaderCell, { width: "35%" }]}>Session Date & Time (IST)</Text>
                <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Session Status</Text>
                <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Access Channel</Text>
              </View>
              {data.sessions.map((session, index) => (
                <View
                  key={session.id || index}
                  style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
                  wrap={false}
                >
                  <Text style={[styles.tableCell, { width: "20%", fontWeight: "bold" }]}>
                    #{session.id}
                  </Text>
                  <Text style={[styles.tableCell, { width: "35%" }]}>{session.date}</Text>
                  <Text style={[styles.tableCell, { width: "25%", color: session.status.includes("Working") ? "#15803d" : reportTheme.ink }]}>
                    {session.status}
                  </Text>
                  <Text style={[styles.tableCell, { width: "20%", color: reportTheme.muted }]}>
                    {session.channel}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section 3: Marketplace Jobs Posted by Client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Marketplace Jobs Posted by Client ({data.jobs.length})
          </Text>
          {data.jobs.length === 0 ? (
            <Text style={styles.emptyNote}>
              No marketplace jobs have been posted by this client to date.
            </Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableRowHeader} fixed>
                <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Job Ref</Text>
                <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Project Title</Text>
                <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Service Category</Text>
                <Text style={[styles.tableHeaderCell, { width: "13%" }]}>Budget</Text>
                <Text style={[styles.tableHeaderCell, { width: "12%" }]}>Status</Text>
              </View>
              {data.jobs.map((job, index) => (
                <View
                  key={job.id}
                  style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
                  wrap={false}
                >
                  <Text style={[styles.tableCell, { width: "15%", fontWeight: "bold" }]}>
                    #JOB-{job.id}
                  </Text>
                  <Text style={[styles.tableCell, { width: "40%" }]}>{capitalizeWords(job.title)}</Text>
                  <Text style={[styles.tableCell, { width: "20%" }]}>{capitalizeWords(job.category)}</Text>
                  <Text style={[styles.tableCell, { width: "13%" }]}>{job.budget}</Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: "12%",
                        fontWeight: "bold",
                        color:
                          job.status === "COMPLETED"
                            ? "#15803d"
                            : job.status === "OPEN"
                              ? "#0284c7"
                              : reportTheme.ink,
                      },
                    ]}
                  >
                    {job.status}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Klick-Pro Enterprise Platform · Official Compliance & Activity Audit Record · Confidential
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
