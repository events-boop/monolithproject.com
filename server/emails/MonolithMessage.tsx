import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { COMMUNICATIONS, type CommunicationId } from "./communications";

export interface MonolithMessageProps {
  messageId: CommunicationId;
  firstName?: string;
  reference?: string;
  assetOrigin?: string;
  unsubscribeUrl?: string;
  postalAddress?: string;
  preview?: boolean;
}

const origin = "https://monolithproject.com";
const sans = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
const mono = '"Courier New", Courier, monospace';
const serif = 'Georgia, "Times New Roman", serif';
const paper = "#F2EFE6";
const black = "#111715";
const label: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "11px",
  lineHeight: "17px",
  fontWeight: 700,
  letterSpacing: "1.1px",
  margin: 0,
};
const bodyCopy: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 18px",
  color: "#465049",
};

function Worlds() {
  return (
    <Section style={{ borderTop: "1px solid #CFD0C5", marginTop: "28px" }}>
      {[
        {
          n: "01",
          title: "CHASING SUNSETS",
          detail: "Follow the light",
          href: "/chasing-sunsets",
          color: "#8A5D26",
        },
        {
          n: "02",
          title: "UNTOLD STORY",
          detail: "Find your after dark",
          href: "/untold-story",
          color: "#276874",
        },
        {
          n: "03",
          title: "HOUSE OF FRIENDS",
          detail: "Make room to create",
          href: "/house-of-friends",
          color: "#42613F",
        },
      ].map(world => (
        <Row key={world.n} style={{ borderBottom: "1px solid #CFD0C5" }}>
          <Column
            style={{ width: "32px", padding: "17px 0", verticalAlign: "top" }}
          >
            <Text style={{ ...label, color: world.color }}>{world.n}</Text>
          </Column>
          <Column style={{ padding: "17px 0" }}>
            <Link
              href={`${origin}${world.href}`}
              style={{
                fontSize: "12px",
                lineHeight: "18px",
                color: black,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "1px",
              }}
            >
              {world.title}
            </Link>
            <Text
              style={{
                color: "#697168",
                fontSize: "13px",
                lineHeight: "20px",
                margin: "2px 0 0",
              }}
            >
              {world.detail}
            </Text>
          </Column>
          <Column style={{ width: "24px", textAlign: "right" }}>
            <Link
              aria-label={`Explore ${world.title}`}
              href={`${origin}${world.href}`}
              style={{
                fontSize: "22px",
                color: world.color,
                textDecoration: "none",
              }}
            >
              ↗
            </Link>
          </Column>
        </Row>
      ))}
    </Section>
  );
}

/** Rendering is separate from delivery. The current live WelcomeEmail is untouched. */
export function MonolithMessage({
  messageId,
  firstName,
  reference,
  assetOrigin = origin,
  unsubscribeUrl,
  postalAddress,
  preview = false,
}: MonolithMessageProps) {
  const message = COMMUNICATIONS[messageId];
  const name = firstName?.trim().slice(0, 80);
  const isRadio = messageId === "radio-welcome";
  const isFriends = messageId === "friends-welcome";
  const receipt = message.category === "transactional";
  const showReference = [
    "application-received",
    "contact-received",
    "signup-saved",
  ].includes(messageId);

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          body { margin: 0; padding: 0; }
          a:focus-visible { outline: 3px solid #276874; outline-offset: 4px; }
          @media only screen and (max-width: 620px) {
            .message-outer { padding: 0 !important; }
            .message-inset { padding-left: 26px !important; padding-right: 26px !important; }
            .message-title { font-size: 41px !important; line-height: 43px !important; letter-spacing: -2px !important; }
            .message-emphasis { font-size: 43px !important; line-height: 46px !important; }
            .message-masthead { font-size: 20px !important; letter-spacing: 3px !important; }
            .message-location { display: none !important; }
            .message-hero { padding-top: 30px !important; padding-bottom: 30px !important; }
            .message-cta { display: block !important; text-align: center !important; }
            .message-footer { padding-left: 26px !important; padding-right: 26px !important; }
          }
        `}</style>
      </Head>
      <Preview>{message.preheader}</Preview>
      <Body
        style={{
          backgroundColor: "#DDDCD4",
          fontFamily: sans,
          color: black,
          margin: 0,
          padding: 0,
        }}
      >
        <Section className="message-outer" style={{ padding: "28px 12px" }}>
          <Container
            style={{
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
              backgroundColor: paper,
            }}
          >
            <Section style={{ backgroundColor: black, padding: "0" }}>
              <Row aria-hidden="true">
                <Column
                  style={{
                    backgroundColor: message.accent,
                    height: "5px",
                    width: "50%",
                  }}
                />
                <Column
                  style={{
                    backgroundColor: "#6E8575",
                    height: "5px",
                    width: "28%",
                  }}
                />
                <Column
                  style={{
                    backgroundColor: "#F2EFE6",
                    height: "5px",
                    width: "22%",
                  }}
                />
              </Row>
              <Section
                className="message-inset"
                style={{ padding: "30px 42px 28px" }}
              >
                <Row>
                  <Column>
                    <Text
                      style={{
                        ...label,
                        color: "#A3B0A4",
                        letterSpacing: "2px",
                        margin: "0 0 4px",
                      }}
                    >
                      THE
                    </Text>
                    <Link
                      href={origin}
                      className="message-masthead"
                      style={{
                        fontFamily: sans,
                        fontSize: "25px",
                        lineHeight: "30px",
                        fontWeight: 900,
                        letterSpacing: "4px",
                        color: "#F2EFE6",
                        textDecoration: "none",
                      }}
                    >
                      MONOLITH
                    </Link>
                    <Text
                      style={{
                        ...label,
                        color: "#A3B0A4",
                        letterSpacing: "3.4px",
                        margin: "4px 0 0",
                      }}
                    >
                      PROJECT
                    </Text>
                  </Column>
                  <Column
                    className="message-location"
                    style={{ textAlign: "right", verticalAlign: "bottom" }}
                  >
                    <Text style={{ ...label, color: message.accent }}>
                      CHICAGO, IL ↗
                    </Text>
                    <Text
                      style={{
                        ...label,
                        color: "#A3B0A4",
                        fontWeight: 400,
                        marginTop: "4px",
                      }}
                    >
                      MUSIC BRINGS US HERE.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section
              className="message-inset message-hero"
              style={{ padding: "40px 42px 34px" }}
            >
              <Row>
                <Column>
                  <Text style={{ ...label, color: message.ink }}>
                    {message.eyebrow}
                  </Text>
                </Column>
                <Column style={{ width: "32px", textAlign: "right" }}>
                  <Text style={{ ...label, color: "#758075" }}>
                    {message.number}
                  </Text>
                </Column>
              </Row>
              <Heading
                className="message-title"
                as="h1"
                style={{
                  fontFamily: sans,
                  color: black,
                  fontWeight: 800,
                  fontSize: "53px",
                  lineHeight: "55px",
                  letterSpacing: "-2.8px",
                  margin: "25px 0 0",
                }}
              >
                {message.heading}
                <br />
                <span
                  className="message-emphasis"
                  style={{
                    fontFamily: serif,
                    fontSize: "55px",
                    lineHeight: "59px",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: message.ink,
                    letterSpacing: "-2.4px",
                  }}
                >
                  {message.emphasis}
                </span>
              </Heading>
              <Text
                style={{
                  ...bodyCopy,
                  color: black,
                  margin: "27px 0 13px",
                  fontWeight: 700,
                }}
              >
                {name ? `Hey ${name}. ` : "Hey there. "}
                {message.intro}
              </Text>
              <Text style={bodyCopy}>{message.body}</Text>
              <Button
                className="message-cta"
                href={`${origin}${message.href}`}
                style={{
                  backgroundColor: black,
                  color: "#F7F2E9",
                  borderRadius: "3px",
                  fontFamily: sans,
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: "20px",
                  padding: "17px 23px",
                  textDecoration: "none",
                  marginTop: "9px",
                }}
              >
                {message.cta}{" "}
                <span style={{ paddingLeft: "14px", color: message.accent }}>
                  ↗
                </span>
              </Button>
            </Section>

            {message.image && !isRadio && (
              <Section>
                <Img
                  src={`${assetOrigin}${message.image}`}
                  width="600"
                  alt={message.imageAlt}
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "600px",
                    height: "auto",
                    border: 0,
                  }}
                />
                <Section
                  className="message-inset"
                  style={{ backgroundColor: black, padding: "12px 42px" }}
                >
                  <Text
                    style={{
                      ...label,
                      color: message.accent,
                      fontSize: "11px",
                    }}
                  >
                    {message.imageCaption}
                  </Text>
                </Section>
              </Section>
            )}

            {isRadio && (
              <Section
                className="message-inset"
                style={{ backgroundColor: black, padding: "26px 42px" }}
              >
                <Row>
                  <Column style={{ width: "112px", verticalAlign: "top" }}>
                    <Img
                      src={`${assetOrigin}${message.image}`}
                      alt={message.imageAlt}
                      width="112"
                      height="112"
                      style={{ display: "block", border: 0 }}
                    />
                  </Column>
                  <Column
                    style={{ paddingLeft: "22px", verticalAlign: "middle" }}
                  >
                    <Text
                      style={{
                        ...label,
                        color: message.accent,
                        marginBottom: "10px",
                      }}
                    >
                      THE FEELING, ON REPEAT.
                    </Text>
                    <Text
                      style={{
                        color: paper,
                        fontSize: "21px",
                        lineHeight: "26px",
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      Chasing Sunsets
                      <br />
                      Radio
                    </Text>
                    <Text
                      style={{
                        color: "#B7C1B6",
                        fontSize: "12px",
                        lineHeight: "18px",
                        margin: "9px 0 0",
                      }}
                    >
                      Powered by sunsets.fm
                    </Text>
                  </Column>
                </Row>
              </Section>
            )}

            {isFriends && (
              <Section
                className="message-inset"
                style={{ backgroundColor: "#203C2F", padding: "34px 42px" }}
              >
                <Text
                  style={{
                    ...label,
                    color: message.accent,
                    marginBottom: "16px",
                  }}
                >
                  A MONOLITH PROJECT
                </Text>
                <Text
                  style={{
                    fontFamily: serif,
                    fontStyle: "italic",
                    color: paper,
                    fontSize: "35px",
                    lineHeight: "39px",
                    margin: 0,
                  }}
                >
                  More than a stage.
                  <br />A place to grow.
                </Text>
                <Hr style={{ borderColor: "#708A6E", margin: "25px 0 14px" }} />
                <Text style={{ ...label, color: message.accent }}>
                  {message.imageCaption}
                </Text>
              </Section>
            )}

            <Section
              className="message-inset"
              style={{ padding: "32px 42px 36px" }}
            >
              <Section
                style={{
                  borderLeft: `3px solid ${message.ink}`,
                  backgroundColor: message.surface,
                  padding: "18px 20px",
                }}
              >
                <Text
                  style={{ ...label, color: message.ink, marginBottom: "8px" }}
                >
                  {message.detailTitle}
                </Text>
                <Text
                  style={{
                    color: "#3F4B42",
                    fontSize: "14px",
                    lineHeight: "22px",
                    margin: 0,
                  }}
                >
                  {message.detail}
                </Text>
                {showReference && reference && (
                  <Text
                    style={{
                      ...label,
                      color: black,
                      letterSpacing: "0.7px",
                      marginTop: "16px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    REFERENCE / {reference}
                  </Text>
                )}
              </Section>
              {messageId === "monolith-welcome" && <Worlds />}
              {!receipt && messageId !== "radio-welcome" && (
                <Text
                  style={{
                    fontSize: "14px",
                    lineHeight: "23px",
                    color: "#465049",
                    margin: "25px 0 0",
                  }}
                >
                  Until we meet on the floor,{" "}
                  <Link
                    href={`${origin}/radio`}
                    style={{ color: message.ink, fontWeight: 700 }}
                  >
                    take the music with you ↗
                  </Link>
                </Text>
              )}
              <Text
                style={{
                  color: black,
                  fontFamily: serif,
                  fontSize: "24px",
                  lineHeight: "29px",
                  fontStyle: "italic",
                  margin: "29px 0 5px",
                }}
              >
                See you in the music,
              </Text>
              <Text style={{ ...label, color: "#465049" }}>
                THE MONOLITH PROJECT
              </Text>
            </Section>
          </Container>

          <Container
            className="message-footer"
            style={{
              maxWidth: "600px",
              width: "100%",
              padding: "25px 42px 20px",
              margin: "0 auto",
            }}
          >
            <Text
              style={{ ...label, color: "#4B554C", letterSpacing: "0.8px" }}
            >
              MADE OF MUSIC. MADE OF PEOPLE.
            </Text>
            <Text
              style={{
                color: "#566057",
                fontSize: "11px",
                lineHeight: "18px",
                margin: "12px 0",
              }}
            >
              {receipt
                ? "This message relates to your request or an event update. It doesn’t subscribe you to marketing."
                : "You’re receiving this because you signed up for these email updates. You can unsubscribe at any time."}
              <br />
              THE MONOLITH PROJECT ·{" "}
              {postalAddress ||
                (preview
                  ? "Chicago · postal address required before sending"
                  : "Chicago, IL")}
            </Text>
            <Text
              style={{
                color: "#465049",
                fontSize: "12px",
                lineHeight: "20px",
                margin: 0,
              }}
            >
              {!receipt && unsubscribeUrl && (
                <>
                  <Link
                    href={unsubscribeUrl}
                    style={{ color: "#465049", textDecoration: "underline" }}
                  >
                    Email preferences / unsubscribe
                  </Link>
                  {" · "}
                </>
              )}
              <Link href={`${origin}/privacy`} style={{ color: "#465049" }}>
                Privacy
              </Link>
              {" · "}
              <Link href={`${origin}/contact`} style={{ color: "#465049" }}>
                Contact the team
              </Link>
            </Text>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export default MonolithMessage;
