"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  prepareMonolithSignup,
  submitMonolithSignup,
  type SignupPayload,
} from "./browser.mjs";
export type SignupResult = {
  ok: boolean;
  message?: string;
  retryable?: boolean;
  fieldErrors?: Record<string, string>;
};
export type MonolithSignupProps = {
  heading?: string;
  description?: string;
  buttonText?: string;
  privacyUrl: string;
  emailDisclosure: string | null;
  smsDisclosure: string | null;
  // Optional injection for the private design/validation preview. Production uses the same-site bridge.
  submit?: (payload: SignupPayload) => Promise<SignupResult>;
};
function safePrivacy(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function MonolithSignup({
  heading = "Stay in the loop.",
  description = "Show announcements, ticket windows and new music. One direct connection to Monolith.",
  buttonText = "Get updates",
  privacyUrl,
  emailDisclosure,
  smsDisclosure,
  submit = submitMonolithSignup,
}: MonolithSignupProps) {
  const uid = useId(),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [instagram, setInstagram] = useState(""),
    [honeypot, setHoneypot] = useState("");
  const [choices, setChoices] = useState({ email: false, sms: false }),
    [busy, setBusy] = useState(false),
    [hydrated, setHydrated] = useState(false),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [failure, setFailure] = useState(""),
    [success, setSuccess] = useState("");
  const pending = useRef<SignupPayload | null>(null),
    locked = useRef(false),
    firstField = useRef<HTMLInputElement>(null);
  const config = JSON.stringify({
      heading,
      description,
      buttonText,
      privacyUrl,
      emailDisclosure,
      smsDisclosure,
    }),
    latest = useRef(config);
  latest.current = config;
  const privacy = safePrivacy(privacyUrl),
    ready = !!privacy;
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    pending.current = null;
    setChoices({ email: false, sms: false });
    setErrors({});
    setFailure("");
    setSuccess("");
  }, [config]);
  function edit(update: () => void) {
    update();
    pending.current = null;
    setErrors({});
    setFailure("");
    setSuccess("");
  }
  function reset() {
    pending.current = null;
    setEmail("");
    setPhone("");
    setInstagram("");
    setHoneypot("");
    setChoices({ email: false, sms: false });
    setSuccess("");
    setFailure("");
    setErrors({});
  }
  async function send(e: FormEvent) {
    e.preventDefault();
    if (locked.current || !ready || !hydrated) return;
    const fieldErrors: Record<string, string> = {};
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      email.trim().length > 320
    )
      fieldErrors.email = "Enter a valid email address.";
    const handle = instagram.trim().replace(/^@/, "");
    if (
      handle &&
      (!/^[A-Za-z0-9_](?:[A-Za-z0-9_.]{0,28}[A-Za-z0-9_])?$/.test(handle) ||
        handle.includes(".."))
    )
      fieldErrors.instagram = "Use your Instagram username, such as @yourname.";
    if (phone.trim() && !/^[+()\d.\s-]{7,40}$/.test(phone.trim()))
      fieldErrors.phone = "Enter a phone number, including country code.";
    if (choices.sms && !phone.trim())
      fieldErrors.phone = "Add your phone number to request text updates.";
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      setFailure("Check the highlighted details and try again.");
      if (fieldErrors.email) firstField.current?.focus();
      return;
    }
    locked.current = true;
    setBusy(true);
    setErrors({});
    setFailure("");
    const checked = config;
    try {
      pending.current ||= prepareMonolithSignup({
        email: email.trim(),
        phone: phone.trim(),
        instagram: instagram.trim(),
        choices: {
          email: !!emailDisclosure && choices.email,
          sms: !!smsDisclosure && choices.sms,
        },
        honeypot,
      });
      const result = await submit(pending.current);
      if (latest.current !== checked) return;
      if (result.ok) {
        pending.current = null;
        setSuccess(result.message || "Thanks — we’ve received your signup.");
      } else if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        setFailure("Check the highlighted details and try again.");
      } else
        setFailure(
          result.retryable === false
            ? "We couldn’t accept this signup. Check your details or try again later."
            : "We couldn’t confirm your signup. Your details are still here—please try again.",
        );
    } catch {
      if (latest.current === checked)
        setFailure(
          "We couldn’t confirm your signup. Your details are still here—please try again.",
        );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  const fieldError = (key: string) =>
    errors[key] ? (
      <span className="ms-field-error" id={`${uid}-${key}-error`}>
        {errors[key]}
      </span>
    ) : null;
  return (
    <section className="monolith-signup" aria-labelledby={`${uid}-heading`}>
      <div className="ms-topline">
        <span>THE MONOLITH PROJECT</span>
        <span>EVENTS / MUSIC / PEOPLE</span>
      </div>
      <div className="ms-grid">
        <div className="ms-story">
          <p className="ms-kicker">Between the shows</p>
          <h2 id={`${uid}-heading`}>{heading}</h2>
          <p className="ms-intro">{description}</p>
          <div className="ms-benefits">
            <span>
              <small>01</small> Ticket windows.
            </span>
            <span>
              <small>02</small> Lineup news.
            </span>
            <span>
              <small>03</small> Fresh music.
            </span>
          </div>
          <span className="ms-signature">
            A direct connection to what’s next.
          </span>
        </div>
        <div className="ms-form-side">
          {success ? (
            <div className="ms-success" role="status">
              <span className="ms-kicker">Received</span>
              <h3>Thank you.</h3>
              <p>{success}</p>
              <button type="button" className="ms-submit" onClick={reset}>
                Back to form <span aria-hidden="true">↗</span>
              </button>
            </div>
          ) : (
            <form onSubmit={send} noValidate>
              <p className="ms-kicker">Your connection to Monolith</p>
              <fieldset disabled={busy || !ready || !hydrated}>
                <label htmlFor={`${uid}-email`}>
                  Email <span>Required</span>
                </label>
                <input
                  id={`${uid}-email`}
                  ref={firstField}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  required
                  maxLength={320}
                  value={email}
                  onChange={(e) => edit(() => setEmail(e.target.value))}
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? `${uid}-email-error` : undefined
                  }
                />
                {fieldError("email")}
                <div className="ms-optional-grid">
                  <div>
                    <label htmlFor={`${uid}-phone`}>
                      Phone <span>Optional</span>
                    </label>
                    <input
                      id={`${uid}-phone`}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 312 555 0123"
                      maxLength={40}
                      value={phone}
                      onChange={(e) => edit(() => setPhone(e.target.value))}
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? `${uid}-phone-error` : undefined
                      }
                    />
                    {fieldError("phone")}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-instagram`}>
                      Instagram <span>Optional</span>
                    </label>
                    <input
                      id={`${uid}-instagram`}
                      name="instagram"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="@yourname"
                      maxLength={31}
                      value={instagram}
                      onChange={(e) => edit(() => setInstagram(e.target.value))}
                      aria-invalid={!!errors.instagram}
                      aria-describedby={
                        errors.instagram ? `${uid}-instagram-error` : undefined
                      }
                    />
                    {fieldError("instagram")}
                  </div>
                </div>
                <div className="ms-choices">
                  {emailDisclosure && (
                    <label className="ms-choice">
                      <input
                        type="checkbox"
                        name="emailUpdates"
                        checked={choices.email}
                        onChange={(e) =>
                          edit(() =>
                            setChoices({ ...choices, email: e.target.checked }),
                          )
                        }
                        aria-describedby={
                          errors.emailConsent
                            ? `${uid}-emailConsent-error`
                            : undefined
                        }
                      />
                      <span>{emailDisclosure}</span>
                    </label>
                  )}
                  {fieldError("emailConsent")}
                  {smsDisclosure && (
                    <label className="ms-choice">
                      <input
                        type="checkbox"
                        name="smsUpdates"
                        checked={choices.sms}
                        onChange={(e) =>
                          edit(() =>
                            setChoices({ ...choices, sms: e.target.checked }),
                          )
                        }
                        aria-describedby={
                          errors.smsConsent
                            ? `${uid}-smsConsent-error`
                            : undefined
                        }
                      />
                      <span>{smsDisclosure}</span>
                    </label>
                  )}
                  {fieldError("smsConsent")}
                </div>
                <div className="ms-honeypot" aria-hidden="true">
                  <label htmlFor={`${uid}-company`}>Company</label>
                  <input
                    id={`${uid}-company`}
                    name="company"
                    autoComplete="off"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => edit(() => setHoneypot(e.target.value))}
                  />
                </div>
                {failure && (
                  <p className="ms-submit-error" role="alert">
                    {failure}
                  </p>
                )}
                <button type="submit" className="ms-submit">
                  {busy ? "Submitting…" : buttonText}
                  <span aria-hidden="true">↗</span>
                </button>
              </fieldset>
              <p className="ms-privacy">
                Choose the updates you want.{" "}
                {privacy && (
                  <a href={privacy} target="_blank" rel="noopener noreferrer">
                    Privacy policy ↗
                  </a>
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
