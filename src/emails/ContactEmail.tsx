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

interface ContactEmailProps {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  interest: string;
  message: string;
}

export const ContactEmail = ({
  name,
  email,
  phone,
  company,
  address,
  interest,
  message,
}: ContactEmailProps) => {
  const previewText = `Shubh Agaman: A Noble Prospect for Goals Floors - ${name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Ornate Header */}
          <Section style={header}>
            <Text style={ornamentTitle}>✨ ✨ ✨</Text>
            <Text style={brandText}>GOALS FLOORS</Text>
            <Text style={subHeaderText}>ARCHITECTURAL MANUSCRIPT</Text>
            <Text style={ornamentTitle}>✨ ✨ ✨</Text>
          </Section>

          {/* Opening Proclamation */}
          <Section style={section}>
             <Text style={proclamationText}>
                We are honored to announce the arrival of a prestigious new alliance. 
                A distinguished patron seeks your expert counsel.
             </Text>
            
            <Hr style={goldDivider} />
            
            <Heading style={cardHeading}>CUSTOMER DETAILS</Heading>
            
            <div style={biodataBox}>
              <table style={{ width: "100%" }}>
                <tr>
                  <td style={labelCell}>FULL NAME</td>
                  <td style={valueCell}>{name}</td>
                </tr>
                <tr>
                  <td style={labelCell}>EMAIL ADDRESS</td>
                  <td style={valueCell}>{email}</td>
                </tr>
                <tr>
                  <td style={labelCell}>PHONE NUMBER</td>
                  <td style={valueCell}>{phone}</td>
                </tr>
                <tr>
                    <td style={labelCell}>COMPANY / FIRM</td>
                    <td style={valueCell}>{company || "Private Citizen"}</td>
                </tr>
                <tr>
                    <td style={labelCell}>SITE LOCATION</td>
                    <td style={valueCell}>{address}</td>
                </tr>
                <tr>
                  <td style={labelCell}>PRODUCT INTEREST</td>
                  <td style={interestValue}>{interest.replace('_', ' ').toUpperCase()}</td>
                </tr>
              </table>
            </div>
          </Section>

          <Hr style={goldDivider} />

          {/* The Narrative / Message */}
          <Section style={section}>
            <Heading style={subHeading}>PROJECT MESSAGE</Heading>
            <div style={messageContainer}>
                <Text style={messageText}>
                    &ldquo;{message}&rdquo;
                </Text>
            </div>
          </Section>

          {/* Closing */}
          <Section style={footer}>
            <Text style={footerOrnaments}>❈ ❈ ❈</Text>
            <Text style={footerText}>
              This auspicious notification has been delivered by the Digital Herald of Goals Floors.
            </Text>
            <Text style={footerDate}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- Traditional Wedding Card Styling ---
const main = {
  backgroundColor: "#fff9f2", // Light Cream/Paper background
  padding: "40px 0",
  fontFamily: 'serif', // Or standard fonts that feel more formal
};

const container = {
  backgroundColor: "#fffdfa",
  margin: "0 auto",
  padding: "0",
  border: "double 6px #800000", // Royal Maroon double border
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  borderRadius: "2px",
};

const header = {
  backgroundColor: "#ffffff",
  padding: "40px 20px",
  textAlign: "center" as const,
  borderBottom: "1px solid #eee",
};

const brandText = {
  color: "#800000", // Maroon
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "10px 0",
  textTransform: "uppercase" as const,
};

const subHeaderText = {
  color: "#d4af37", // Aureate Gold
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "4px",
  marginTop: "10px",
  textTransform: "uppercase" as const,
};

const ornamentTitle = {
  color: "#d4af37",
  fontSize: "14px",
  margin: "0",
};

const section = { padding: "30px 50px" };

const proclamationText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "1.8",
  textAlign: "center" as const,
  fontStyle: "italic",
  margin: "0 0 30px 0",
};

const cardHeading = {
  fontSize: "20px",
  color: "#800000",
  fontWeight: "bold",
  textAlign: "center" as const,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  marginBottom: "30px",
};

const subHeading = {
  fontSize: "16px",
  color: "#d4af37",
  fontWeight: "bold",
  textAlign: "center" as const,
  letterSpacing: "2px",
  marginBottom: "20px",
  textTransform: "uppercase" as const,
};

const goldDivider = { 
  borderColor: "#d4af37", 
  margin: "30px auto",
  width: "60%",
  borderTop: "1px solid #d4af37",
};

const biodataBox = {
  backgroundColor: "#fffcf5",
  padding: "30px",
  border: "1px solid #f2e6d9",
  borderRadius: "4px",
};

const labelCell = {
  color: "#800000", // Maroon
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "1px",
  width: "40%",
  padding: "8px 0",
  borderBottom: "1px solid #f9f0e6",
};

const valueCell = {
  color: "#444",
  fontSize: "14px",
  fontWeight: "medium",
  padding: "8px 0",
  borderBottom: "1px solid #f9f0e6",
};

const interestValue = {
  color: "#d4af37", // Gold
  fontSize: "13px",
  fontWeight: "bold",
  padding: "8px 0",
  borderBottom: "1px solid #f9f0e6",
};

const messageContainer = {
  backgroundColor: "#800000",
  padding: "40px",
  borderRadius: "2px",
};

const messageText = {
  color: "#ffffff",
  fontSize: "16px",
  lineHeight: "1.8",
  textAlign: "center" as const,
  fontStyle: "italic",
  margin: "0",
};

const footer = {
  padding: "40px 50px",
  textAlign: "center" as const,
  backgroundColor: "#f9f1e8",
};

const footerOrnaments = {
  color: "#d4af37",
  fontSize: "20px",
  marginBottom: "15px",
};

const footerText = { 
  color: "#800000", // Maroon
  fontSize: "11px", 
  letterSpacing: "1px",
  lineHeight: "1.6",
  textTransform: "uppercase" as const,
};

const footerDate = {
  color: "#d4af37",
  fontSize: "10px",
  fontWeight: "bold",
  marginTop: "15px",
};

export default ContactEmail;