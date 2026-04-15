import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DealerInquiryEmailProps {
  name: string;
  email: string;
  phone: string;
  interest: string;
  company: string;
  city: string;
  state: string;
  zip: string;
  dob?: string;
  businessType: string; // From checkbox group
  turnover: string; // From checkbox group
  gstNumber: string;
  message: string;
}

export const DealerInquiryEmail = ({
  name,
  email,
  phone,
  company,
  city,
  state,
  zip,
  dob,
  businessType,
  turnover,
  gstNumber,
  message,
}: DealerInquiryEmailProps) => {
  const previewText = `New Dealer Application: ${name} - ${company}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Premium Header - Black Slate & Amber accent */}
          <Section style={header}>
            <Text style={brandText}>GOALS FLOORS</Text>
            <Text style={subHeaderText}>Premium B2B Partnership Application</Text>
          </Section>

          {/* Applicant Details */}
          <Section style={section}>
            <Heading style={heading}>Dealer Application Details</Heading>
            <Text style={paragraph}>
              A new dealership inquiry has been received. Here are the applicant details:
            </Text>

            <div style={detailsBox}>
              <Text style={detailRow}><strong>Applicant Name:</strong> {name}</Text>
              <Text style={detailRow}><strong>Company Name:</strong> {company}</Text>
              <Text style={detailRow}><strong>Email:</strong> {email}</Text>
              <Text style={detailRow}><strong>Phone:</strong> {phone}</Text>
            </div>
          </Section>

          <Section style={section}>
             <Heading style={subHeading}>Business Location</Heading>
             <div style={addressBox}>
                <Text style={detailRow}>{city}, {state} - {zip}</Text>
             </div>
          </Section>

          {/* B2B Qualifying Fields Section (Added implicit fields) */}
          <Section style={section}>
            <Heading style={subHeading}>Business Profile</Heading>
            <div style={detailsBoxB2B}>
              <Text style={detailRow}><strong>Date of Birth:</strong> {dob || 'Not Provided'}</Text>
              <Text style={detailRow}><strong>GST Number:</strong> {gstNumber}</Text>
              <Text style={detailRow}><strong>Type of Business:</strong> {businessType}</Text>
              <Text style={detailRow}><strong>Annual Turnover:</strong> {turnover}</Text>
            </div>
          </Section>

          <Hr style={divider} />

          {/* Message Section */}
          <Section style={section}>
            <Heading style={subHeading}>Additional Information / Message</Heading>
            <Text style={messageBox}>{message}</Text>
          </Section>

          {/* Business Card Section */}
          <Section style={section}>
             <Heading style={subHeading}>Verification Attachment</Heading>
             <Text style={paragraph}>The business card image is attached to this email for your review.</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated message from your Goals Floors dealer partnership page.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// ... (Premium Styling - Copy the inline styles from ContactEmail, but add specific ones for addressBox and detailsBoxB2B with slate/amber tones)
const main = { backgroundColor: "#fcfaf7", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "40px auto", padding: "0", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)", maxWidth: "600px" };
const header = { backgroundColor: "#0f172a", padding: "30px 40px", textAlign: "center" as const };
const brandText = { color: "#ffffff", fontSize: "24px", fontWeight: "bold", letterSpacing: "4px", margin: "0" };
const subHeaderText = { color: "#d1d5db", fontSize: "12px", textTransform: "uppercase" as const, letterSpacing: "2px", marginTop: "8px" };
const section = { padding: "0 40px" };
const heading = { fontSize: "20px", color: "#1e293b", fontWeight: "bold", marginTop: "30px" };
const subHeading = { fontSize: "16px", color: "#1e293b", fontWeight: "bold" };
const paragraph = { color: "#475569", fontSize: "15px", lineHeight: "1.6" };
const detailsBox = { backgroundColor: "#f8fafc", padding: "20px", borderRadius: "6px", borderLeft: "4px solid #d97706", marginTop: "20px" };
const detailsBoxB2B = { backgroundColor: "#fefce8", padding: "20px", borderRadius: "6px", borderLeft: "4px solid #d97706", marginTop: "20px" }; // Amber accent for B2B details
const addressBox = { backgroundColor: "#f1f5f9", padding: "15px", borderRadius: "6px", marginTop: "15px" };
const detailRow = { color: "#334155", fontSize: "14px", margin: "8px 0" };
const divider = { borderColor: "#e2e8f0", margin: "30px 0" };
const messageBox = { color: "#475569", fontSize: "14px", lineHeight: "1.8", fontStyle: "italic", padding: "15px", backgroundColor: "#f1f5f9", borderRadius: "6px" };
const footer = { backgroundColor: "#f8fafc", padding: "20px 40px", textAlign: "center" as const, borderTop: "1px solid #e2e8f0", marginTop: "30px" };
const footerText = { color: "#94a3b8", fontSize: "12px" };

export default DealerInquiryEmail;