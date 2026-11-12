import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  LoaderCircle,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "./Navigation";
import SEO from "./SEO";
import hostedForms from "@shared/signup-forms.json";
import "@/styles/first-access-intake.css";

const worlds = [
  {
    id: "chasing-sunsets",
    name: "CHASING SUN(SETS)",
    note: "Into the golden hour",
    edition: "IV",
    Icon: Sun,
  },
  {
    id: "untold-story",
    name: "UNTOLD STORY",
    note: "Closer to the after dark",
    edition: "SEASON III",
    Icon: Moon,
  },
  {
    id: "house-of-friends",
    name: "HOUSE OF FRIENDS",
    note: "Good people. New memories.",
    edition: "MORE TOGETHER",
    Icon: Users,
  },
] as const;
type World = (typeof worlds)[number]["id"];
type Availability = "checking" | "ready" | "hosted";

export default function FirstAccessIntake({
  designPreview = false,
}: {
  designPreview?: boolean;
}) {
  const [availability, setAvailability] = useState<Availability>("checking");
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<World[]>([]);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [consent, setConsent] = useState(false);
  const [adult, setAdult] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const signature = useRef({ value: "", key: "" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/first-access", { signal: controller.signal })
      .then(async response => (response.ok ? response.json() : null))
      .then(body => setAvailability(body?.available ? "ready" : "hosted"))
      .catch(() => {
        if (!controller.signal.aborted) setAvailability("hosted");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (step > 0 || success) {
      heading.current?.focus({ preventScroll: true });
      if (window.innerWidth <= 720) heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [step, success]);

  function toggle(id: World) {
    setInterests(previous =>
      previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id]
    );
    setErrors({});
  }
  function next() {
    const nextErrors: Record<string, string> = {};
    if (!interests.length)
      nextErrors.interests = "Choose at least one world to follow.";
    if (step === 1) {
      if (!firstName.trim()) nextErrors.firstName = "What should we call you?";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        nextErrors.email = "Enter a valid email address.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        panel.current
          ?.querySelector<HTMLElement>("[aria-invalid=true]")
          ?.focus()
      );
      return;
    }
    setStep(value => value + 1);
    setSubmitError("");
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step < 2) {
      next();
      return;
    }
    const nextErrors: Record<string, string> = {};
    if (!consent)
      nextErrors.consent = "Choose email updates to join First Access.";
    if (!adult) nextErrors.adult = "Please confirm you are 18 or older.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (availability !== "ready") {
      setSubmitError(
        "This design preview hasn’t sent your details. Use the secure signup link to join the live list."
      );
      return;
    }
    const payload = {
      firstName: firstName.trim(),
      email: email.trim(),
      city: city.trim(),
      interests,
      consent: true,
      adult: true,
      website,
    };
    const value = JSON.stringify(payload);
    if (signature.current.value !== value)
      signature.current = { value, key: crypto.randomUUID() };
    setBusy(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/first-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": signature.current.key,
        },
        body: value,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || body?.ok !== true || body.state !== "subscribed") {
        throw new Error(
          response.status === 429
            ? "A few too many attempts. Please wait 15 minutes, then try again."
            : body?.message ||
                "We couldn’t confirm your signup. Please try again."
        );
      }
      setSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "You appear to be offline. Your details haven’t been sent. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }
  const showFlow = designPreview || availability === "ready";
  const selected = worlds.filter(world => interests.includes(world.id));

  return (
    <div className="access-intake-page">
      <SEO
        title="First Access"
        description="Find your people. Choose your Monolith worlds and hear about new shows first."
        canonicalPath="/newsletter"
      />
      <Navigation variant="dark" />
      <main
        id="main-content"
        className="access-intake-main page-shell-start-loose"
      >
        {designPreview && (
          <p className="access-owner-preview">
            DESIGN PREVIEW · Live signup stays on the current secure form until
            connected.
          </p>
        )}
        <div className="access-intake-layout">
          <section
            className="access-story"
            aria-labelledby="access-story-title"
          >
            <p className="access-wordmark">THE MONOLITH PROJECT COLLECTIVE</p>
            <div className="access-story-copy">
              <span className="access-year">FIRST ACCESS / 2027</span>
              <h1 id="access-story-title">
                <span className="access-desktop-line">Good music.</span>
                <span className="access-desktop-line">Your people.</span>
                <em>You’re invited.</em>
              </h1>
              <p>Golden hours. Late nights. Moments that stay with you.</p>
            </div>
            <div className="access-story-foot">
              <span className="access-story-rule" aria-hidden="true" />
              <p>
                BE THERE FOR WHAT’S NEXT{" "}
                <ArrowDown size={15} aria-hidden="true" />
              </p>
            </div>
          </section>

          <div className="access-form-shell" ref={panel}>
            <div className="access-form-topline">
              <span>YOUR FIRST LOOK</span>
              <span>
                {success
                  ? "WELCOME IN"
                  : showFlow
                    ? `0${step + 1} / 03`
                    : "2027"}
              </span>
            </div>
            {showFlow && !success && (
              <ol
                className="access-progress"
                aria-label={`Step ${step + 1} of 3`}
              >
                {["Your world", "Your details", "You’re invited"].map(
                  (label, index) => (
                    <li
                      key={label}
                      aria-current={step === index ? "step" : undefined}
                      data-complete={index < step}
                    >
                      <span />
                      {label}
                    </li>
                  )
                )}
              </ol>
            )}

            {success ? (
              <div className="access-success">
                <span className="access-success-mark">
                  <Check size={30} aria-hidden="true" />
                </span>
                <p className="access-form-kicker">FIRST ACCESS, CONFIRMED</p>
                <h2 ref={heading} tabIndex={-1}>
                  You’re in,
                  <br />
                  <em>{firstName.trim()}.</em>
                </h2>
                <p>
                  New announcements will find you at{" "}
                  <strong>{email.trim()}</strong>.
                </p>
                <div className="access-receipt-tags">
                  {selected.map(world => (
                    <span key={world.id} data-world={world.id}>
                      {world.name}
                    </span>
                  ))}
                </div>
                <Link href="/radio" className="access-submit">
                  Stay for the music{" "}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
                <Link href="/schedule" className="access-secondary-link">
                  Explore the calendar{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            ) : !showFlow ? (
              <div className="access-provider-entry">
                <p className="access-form-kicker">GET CLOSER</p>
                <h2>
                  More nights.
                  <br />
                  <em>More stories.</em>
                </h2>
                <p>
                  The first announcements. The next chapter. Your invitation
                  starts here.
                </p>
                {availability === "checking" ? (
                  <p role="status" className="access-connecting">
                    <LoaderCircle size={18} aria-hidden="true" /> Getting your
                    invitation ready…
                  </p>
                ) : (
                  <a className="access-submit" href={hostedForms.newsletter}>
                    Get First Access{" "}
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </a>
                )}
                <p className="access-provider-note">
                  Email updates from MONOLITH. Unsubscribe whenever.
                </p>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                aria-busy={busy}
                className="access-form"
              >
                <div className="access-step" key={step}>
                  <p className="access-form-kicker">
                    {
                      [
                        "FIND YOUR FREQUENCY",
                        "MAKE IT PERSONAL",
                        "ONE LAST THING",
                      ][step]
                    }
                  </p>
                  <h2 ref={heading} tabIndex={-1}>
                    {step === 0 ? (
                      <>
                        Where do you
                        <br />
                        <em>want to be?</em>
                      </>
                    ) : step === 1 ? (
                      <>
                        Who’s coming
                        <br />
                        <em>with us?</em>
                      </>
                    ) : (
                      <>
                        Your next story
                        <br />
                        <em>starts here.</em>
                      </>
                    )}
                  </h2>
                  <p className="access-step-description">
                    {
                      [
                        "Pick your worlds. You can choose more than one.",
                        "A name, an email, and you’re almost there.",
                        "Your worlds. Your invitation. Just say the word.",
                      ][step]
                    }
                  </p>

                  {step === 0 && (
                    <fieldset
                      className="access-worlds"
                      aria-describedby={
                        errors.interests ? "access-error-interests" : undefined
                      }
                    >
                      <legend className="sr-only">
                        Which MONOLITH worlds interest you?
                      </legend>
                      {worlds.map(({ id, name, note, edition, Icon }) => (
                        <label
                          key={id}
                          className="access-world-option"
                          data-world={id}
                          data-selected={interests.includes(id)}
                        >
                          <input
                            type="checkbox"
                            checked={interests.includes(id)}
                            onChange={() => toggle(id)}
                            aria-invalid={!!errors.interests}
                          />
                          <span className="access-world-icon">
                            <Icon
                              size={23}
                              strokeWidth={1.2}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="access-world-label">
                            <span>{edition}</span>
                            <strong>{name}</strong>
                            <small>{note}</small>
                          </span>
                          <span
                            className="access-choice-check"
                            aria-hidden="true"
                          >
                            {interests.includes(id) && <Check size={13} />}
                          </span>
                        </label>
                      ))}
                      <button
                        type="button"
                        className="access-select-all"
                        onClick={() => {
                          setInterests(
                            interests.length === worlds.length
                              ? []
                              : worlds.map(world => world.id)
                          );
                          setErrors({});
                        }}
                        aria-pressed={interests.length === worlds.length}
                      >
                        {interests.length === worlds.length ? (
                          <>
                            <X size={14} aria-hidden="true" /> Clear selection
                          </>
                        ) : (
                          <>
                            All of it. I’m in.{" "}
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </>
                        )}
                      </button>
                      {errors.interests && (
                        <p
                          id="access-error-interests"
                          className="access-field-error"
                          role="alert"
                        >
                          {errors.interests}
                        </p>
                      )}
                    </fieldset>
                  )}
                  {step === 1 && (
                    <div className="access-fields">
                      <label htmlFor="access-first-name">
                        First name
                        <input
                          id="access-first-name"
                          name="given-name"
                          autoComplete="given-name"
                          value={firstName}
                          onChange={event => setFirstName(event.target.value)}
                          maxLength={80}
                          aria-invalid={!!errors.firstName}
                          aria-describedby={
                            errors.firstName ? "access-error-name" : undefined
                          }
                          required
                          placeholder="What should we call you?"
                        />
                      </label>
                      {errors.firstName && (
                        <p
                          id="access-error-name"
                          className="access-field-error"
                          role="alert"
                        >
                          {errors.firstName}
                        </p>
                      )}
                      <label htmlFor="access-email">
                        Email address
                        <input
                          id="access-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={event => setEmail(event.target.value)}
                          maxLength={254}
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email ? "access-error-email" : undefined
                          }
                          required
                          placeholder="you@example.com"
                        />
                      </label>
                      {errors.email && (
                        <p
                          id="access-error-email"
                          className="access-field-error"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                      <label htmlFor="access-city">
                        Your city <span>Optional</span>
                        <input
                          id="access-city"
                          name="address-level2"
                          autoComplete="address-level2"
                          value={city}
                          onChange={event => setCity(event.target.value)}
                          maxLength={100}
                          placeholder="Chicago, or wherever you call home"
                        />
                      </label>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="access-confirm">
                      <div className="access-summary">
                        <div>
                          <strong>{firstName.trim()}</strong>
                          <span>{email.trim()}</span>
                          {city.trim() && <small>{city.trim()}</small>}
                        </div>
                        <button type="button" onClick={() => setStep(1)}>
                          Edit details{" "}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="access-receipt-tags">
                        {selected.map(world => (
                          <span key={world.id} data-world={world.id}>
                            {world.name}
                          </span>
                        ))}
                      </div>
                      <label className="access-consent">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={event => setConsent(event.target.checked)}
                          aria-invalid={!!errors.consent}
                          aria-describedby={
                            errors.consent ? "access-error-consent" : undefined
                          }
                          required
                        />
                        <span>
                          I’d like email updates from THE MONOLITH PROJECT. I
                          can unsubscribe at any time.
                        </span>
                      </label>
                      {errors.consent && (
                        <p
                          id="access-error-consent"
                          className="access-field-error"
                          role="alert"
                        >
                          {errors.consent}
                        </p>
                      )}
                      <label className="access-consent">
                        <input
                          type="checkbox"
                          checked={adult}
                          onChange={event => setAdult(event.target.checked)}
                          aria-invalid={!!errors.adult}
                          aria-describedby={
                            errors.adult ? "access-error-adult" : undefined
                          }
                          required
                        />
                        <span>I’m 18 or older.</span>
                      </label>
                      {errors.adult && (
                        <p
                          id="access-error-adult"
                          className="access-field-error"
                          role="alert"
                        >
                          {errors.adult}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="access-trap" aria-hidden="true">
                    <label>
                      Website
                      <input
                        name="website"
                        value={website}
                        onChange={event => setWebsite(event.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>
                </div>
                {submitError && (
                  <div className="access-submit-error" role="alert">
                    <p>{submitError}</p>
                    <a href={hostedForms.newsletter}>
                      Secure signup{" "}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                    <a href="mailto:events@monolithproject.com?subject=First%20Access%20signup%20help">
                      Email the team
                    </a>
                  </div>
                )}
                <div className="access-form-actions">
                  {step > 0 && (
                    <button
                      type="button"
                      className="access-back"
                      onClick={() => {
                        setStep(value => value - 1);
                        setErrors({});
                        setSubmitError("");
                      }}
                      disabled={busy}
                      aria-label="Previous step"
                    >
                      <ArrowLeft size={20} aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="access-submit"
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="access-spinner"
                          aria-hidden="true"
                        />{" "}
                        Saving your spot…
                      </>
                    ) : (
                      <>
                        {step === 2 ? "Count me in" : "Continue"}
                        <ArrowRight size={19} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
                <p className="access-privacy">
                  Your details stay with MONOLITH.{" "}
                  <Link href="/privacy">Privacy policy</Link>
                </p>
              </form>
            )}
          </div>
        </div>
        <div className="access-bottom-line">
          <span>CHICAGO & BEYOND ↗</span>
          <a href={hostedForms.radio}>
            <img
              src="/brand/sunsets-fm/sunsets-fm-warm-signal-master.svg"
              width="32"
              height="32"
              alt=""
            />
            <span>
              SUNSETS.FM <small>Take the music with you.</small>
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <Link href="/schedule">
            Keep exploring <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  );
}
