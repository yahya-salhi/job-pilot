import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#101828",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e7eaf3",
    paddingBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
    color: "#101828",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    fontSize: 9,
    color: "#6a7282",
  },
  contactSeparator: {
    marginHorizontal: 2,
    color: "#dfe1e7",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#7c5cfc",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#364153",
  },
  experienceBlock: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  expTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#101828",
  },
  expCompany: {
    fontSize: 10,
    fontWeight: 500,
    color: "#7c5cfc",
    marginBottom: 1,
  },
  expDate: {
    fontSize: 9,
    color: "#99a1af",
  },
  bulletList: {
    marginTop: 2,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    color: "#6a7282",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
    color: "#364153",
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillBadge: {
    backgroundColor: "#faf5ff",
    color: "#7c5cfc",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 500,
  },
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 600,
    color: "#101828",
  },
  eduInstitution: {
    fontSize: 10,
    color: "#364153",
  },
  eduYear: {
    fontSize: 9,
    color: "#99a1af",
  },
});

type ResumeContentExperience = {
  company: string;
  title: string;
  dateRange: string;
  bullets: string[];
};

type ResumeContent = {
  summary: string;
  experience: ResumeContentExperience[];
  skills: string[];
  education: {
    degree: string;
    field: string;
    institution: string;
    year: string;
  };
};

type ContactInfo = {
  email?: string;
  phone?: string;
  location?: string;
};

type ResumePDFProps = {
  content: ResumeContent;
  fullName: string;
  contact: ContactInfo;
};

function ResumePDF({ content, fullName, contact }: ResumePDFProps) {
  const contactParts: string[] = [];
  if (contact.email) contactParts.push(contact.email);
  if (contact.phone) contactParts.push(contact.phone);
  if (contact.location) contactParts.push(contact.location);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          {contactParts.length > 0 && (
            <View style={styles.contactRow}>
              <Text>{contactParts.join("  |  ")}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summaryText}>{content.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {content.experience.map((exp, i) => (
            <View key={i} style={styles.experienceBlock}>
              <Text style={styles.expCompany}>{exp.company}</Text>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>{exp.title}</Text>
                <Text style={styles.expDate}>{exp.dateRange}</Text>
              </View>
              <View style={styles.bulletList}>
                {exp.bullets.map((bullet, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletPoint}>{"\u2022"}</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {content.skills.map((skill, i) => (
                <Text key={i} style={styles.skillBadge}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {(content.education.degree || content.education.field || content.education.institution) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.eduRow}>
              <View>
                <Text style={styles.eduDegree}>
                  {content.education.degree}
                  {content.education.field ? ` in ${content.education.field}` : ""}
                </Text>
                <Text style={styles.eduInstitution}>
                  {content.education.institution}
                </Text>
              </View>
              {content.education.year && (
                <Text style={styles.eduYear}>{content.education.year}</Text>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

export function renderResumePdf(
  content: ResumeContent,
  fullName: string,
  contact: ContactInfo,
) {
  return renderToBuffer(
    <ResumePDF content={content} fullName={fullName} contact={contact} />,
  );
}

export type { ResumeContent, ResumeContentExperience, ContactInfo };
