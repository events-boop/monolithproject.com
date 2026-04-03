import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  firstName?: string;
}

export const WelcomeEmail = ({
  firstName = "RESIDENT",
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>ACCESS GRANTED // THE INNER CIRCLE</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Text style={logoText}>MONOLITH</Text>
        </Section>
        <Section style={content}>
          <Text style={statusLabel}>STATUS: AUTHENTICATED</Text>
          <Heading style={h1}>SYSTEMS ONLINE, {firstName.toUpperCase()}.</Heading>
          <Text style={text}>
            You have successfully bypassed the perimeter. As a member of the **Inner Circle**, 
            you are now synced to the primary Monolith signal. 
          </Text>
          <Text style={text}>
            Expect first-priority access to line-ups, secret locations, and architectural audio 
            experiences before the digital crowd arrives.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href="https://monolithproject.com/schedule">
              SECURE UPCOMING RITUALS
            </Link>
          </Section>
          <Text style={text}>
            Your digital artifact is being generated. Keep this channel open.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            THE MONOLITH PROJECT // CHICAGO, IL<br />
            Curated Atmosphere. Return-Worthy Rooms.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "580px",
};

const logoContainer = {
  padding: "30px 0",
  textAlign: "center" as const,
};

const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "8px",
  margin: "0",
};

const content = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  padding: "40px",
  borderRadius: "0px",
};

const statusLabel = {
  color: "#00f0ff",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "2px",
  margin: "0 0 10px 0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "900",
  lineHeight: "1.2",
  margin: "0 0 20px 0",
};

const text = {
  color: "#a1a1aa",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 20px 0",
};

const btnContainer = {
  padding: "20px 0",
};

const button = {
  backgroundColor: "#ffffff",
  color: "#000000",
  fontSize: "14px",
  fontWeight: "900",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 24px",
  letterSpacing: "2px",
};

const hr = {
  borderColor: "#222",
  margin: "40px 0",
};

const footer = {
  color: "#52525b",
  fontSize: "12px",
  lineHeight: "20px",
  letterSpacing: "1px",
};
