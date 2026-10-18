import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { MonolithSignup } from "./MonolithSignup";
import "./monolith-signup.css";

// Development-only display proposal. No live policy/release is approved by this page.
export default function MonolithSignupPreview() {
  return (
    <div
      style={{ minHeight: "100vh", background: "#050505", color: "#F5F1E8" }}
    >
      <SEO title="Signup preview" canonicalPath="/newsletter" noIndex />
      <Navigation variant="dark" />
      <main
        className="page-shell-start-loose layout-default"
        style={{ paddingBottom: 64 }}
      >
        <p style={{ padding: "16px 24px", fontSize: 14 }} role="note">
          Local signup preview. Live capture is not configured yet.
        </p>
        <MonolithSignup
          privacyUrl="https://monolithproject.com/privacy"
          emailDisclosure="I would like email updates from The Monolith Project. I can unsubscribe at any time."
          smsDisclosure="I would like text updates from The Monolith Project. I can opt out at any time."
        />
      </main>
    </div>
  );
}
