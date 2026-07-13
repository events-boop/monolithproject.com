import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  FileAudio,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import HoneypotField from "@/components/HoneypotField";
import {
  submitHouseOfFriendsApplication,
  type HouseOfFriendsSubmissionStatus,
  type HouseOfFriendsUploadProgress,
} from "@/lib/api";
import { honeypotFieldName } from "@shared/generated/hardening";
import {
  HOUSE_OF_FRIENDS_AUDIO_MAX_BYTES,
  HOUSE_OF_FRIENDS_AUDIO_TYPES,
  HOUSE_OF_FRIENDS_PHOTO_MAX_BYTES,
  HOUSE_OF_FRIENDS_PHOTO_TYPES,
  houseOfFriendsProfileSchema,
} from "@shared/house-of-friends";
import { ROUTES } from "@shared/routes";

const applicationFormSchema = houseOfFriendsProfileSchema.extend({
  [honeypotFieldName]: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const initialProgress: HouseOfFriendsUploadProgress = {
  photo: 0,
  "dj-set": 0,
};

const statusCopy: Record<HouseOfFriendsSubmissionStatus, string> = {
  preparing: "Creating your private artist workspace",
  "uploading-photo": "Securing your artist photo",
  "uploading-dj-set": "Uploading your DJ set — keep this window open",
  verifying: "Verifying files and registering your application",
};

const fieldClass = "hof-application-field";

function normalizeFileType(file: File, assetType: "photo" | "dj-set") {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  const photoTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  const audioTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    wav: "audio/wav",
    flac: "audio/flac",
  };
  return assetType === "photo"
    ? photoTypes[extension || ""] || ""
    : audioTypes[extension || ""] || "";
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function fieldError(message?: string) {
  if (!message) return null;
  return <span className="hof-application-error">{message}</span>;
}

function UploadField({
  accept,
  assetType,
  description,
  error,
  file,
  icon: Icon,
  label,
  onChange,
  previewUrl,
}: {
  accept: string;
  assetType: "photo" | "dj-set";
  description: string;
  error?: string;
  file: File | null;
  icon: typeof ImagePlus;
  label: string;
  onChange: (file: File | null) => void;
  previewUrl?: string;
}) {
  const inputId = `hof-${assetType}-upload`;
  return (
    <div
      className="hof-upload-control"
      data-error={Boolean(error) || undefined}
    >
      <div className="hof-upload-heading">
        <div>
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </div>
        <strong>{assetType === "photo" ? "01" : "02"}</strong>
      </div>

      {file ? (
        <div className="hof-upload-selected">
          {previewUrl ? (
            <img src={previewUrl} alt="Selected artist photo preview" />
          ) : (
            <div className="hof-upload-audio-mark" aria-hidden="true">
              <FileAudio />
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
          <div>
            <strong>{file.name}</strong>
            <span>{formatBytes(file.size)} · Ready to upload</span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label htmlFor={inputId} className="hof-upload-dropzone">
          <UploadCloud aria-hidden="true" />
          <strong>
            Choose {assetType === "photo" ? "photo" : "audio file"}
          </strong>
          <span>{description}</span>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={event => onChange(event.target.files?.[0] || null)}
      />
      {fieldError(error)}
    </div>
  );
}

export default function HouseOfFriendsApply() {
  const shouldReduceMotion = useReducedMotion();
  const [photo, setPhoto] = useState<File | null>(null);
  const [djSet, setDjSet] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [djSetError, setDjSetError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [status, setStatus] = useState<HouseOfFriendsSubmissionStatus | null>(
    null
  );
  const [progress, setProgress] =
    useState<HouseOfFriendsUploadProgress>(initialProgress);
  const [referenceCode, setReferenceCode] = useState("");

  const photoPreview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : undefined),
    [photo]
  );
  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      stageName: "",
      email: "",
      phone: "",
      city: "Chicago",
      state: "Illinois",
      instagram: "",
      artistUrl: "",
      yearsActive: "1-2",
      genres: "",
      bio: "",
      whyHouseOfFriends: "",
      collaborationStyle: "",
      setTitle: "",
      setTracklist: "",
      setUrl: "",
      ageConfirmed: false,
      availabilityConfirmed: false,
      rightsConfirmed: false,
      termsAccepted: false,
      marketingConsent: false,
      [honeypotFieldName]: "",
    },
  });

  const isSubmitting = status !== null;
  const bioLength = watch("bio")?.length || 0;
  const whyLength = watch("whyHouseOfFriends")?.length || 0;
  const collaborationLength = watch("collaborationStyle")?.length || 0;

  function selectPhoto(next: File | null) {
    setPhotoError("");
    if (!next) {
      setPhoto(null);
      return;
    }
    const type = normalizeFileType(next, "photo");
    if (!(HOUSE_OF_FRIENDS_PHOTO_TYPES as readonly string[]).includes(type)) {
      setPhotoError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (next.size > HOUSE_OF_FRIENDS_PHOTO_MAX_BYTES) {
      setPhotoError("Artist photo must be 10 MB or smaller.");
      return;
    }
    setPhoto(next);
  }

  function selectDjSet(next: File | null) {
    setDjSetError("");
    if (!next) {
      setDjSet(null);
      return;
    }
    const type = normalizeFileType(next, "dj-set");
    if (!(HOUSE_OF_FRIENDS_AUDIO_TYPES as readonly string[]).includes(type)) {
      setDjSetError("Use an MP3, M4A, WAV, or FLAC audio file.");
      return;
    }
    if (next.size > HOUSE_OF_FRIENDS_AUDIO_MAX_BYTES) {
      setDjSetError("DJ set must be 1.5 GB or smaller.");
      return;
    }
    setDjSet(next);
  }

  const onSubmit = async (values: ApplicationFormValues) => {
    setSubmitError("");
    let hasFileError = false;
    if (!photo) {
      setPhotoError("Add one current artist photo.");
      hasFileError = true;
    }
    if (!djSet) {
      setDjSetError("Add the DJ set you want the selection team to hear.");
      hasFileError = true;
    }
    if (hasFileError || !photo || !djSet) return;

    const photoType = normalizeFileType(photo, "photo");
    const djSetType = normalizeFileType(djSet, "dj-set");
    setStatus("preparing");
    setProgress(initialProgress);

    try {
      const completed = await submitHouseOfFriendsApplication(
        {
          ...values,
          photo: {
            name: photo.name,
            size: photo.size,
            type: photoType,
            lastModified: photo.lastModified,
          },
          djSet: {
            name: djSet.name,
            size: djSet.size,
            type: djSetType,
            lastModified: djSet.lastModified,
          },
        },
        { photo, djSet },
        {
          onProgress: (nextProgress, nextStatus) => {
            setProgress(nextProgress);
            setStatus(nextStatus);
          },
        }
      );
      setReferenceCode(completed.referenceCode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The application could not be registered. Try again."
      );
      setStatus(null);
    }
  };

  if (referenceCode) {
    return (
      <div className="hof-page hof-application-page min-h-screen bg-black text-white">
        <SEO
          title="Application Registered | House of Friends"
          description="House of Friends Founding Class application confirmation."
          absoluteTitle
          canonicalPath={ROUTES.houseOfFriendsApply}
          noIndex
        />
        <Navigation variant="dark" brand="monolith" />
        <main id="main-content" tabIndex={-1} className="hof-success-shell">
          <div className="hof-success-etch" aria-hidden="true">
            <span>HOF</span>
            <span />
            <span />
          </div>
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hof-success-card"
          >
            <CheckCircle2 aria-hidden="true" />
            <p className="hof-kicker">
              Registration complete / Founding Class 2026
            </p>
            <h1>Your work is in the house.</h1>
            <p>
              Your profile, artist photo, and DJ set are secured together in one
              private applicant workspace. The selection team will review the
              complete submission as one story.
            </p>
            <div className="hof-success-reference">
              <span>Applicant reference</span>
              <strong>{referenceCode}</strong>
            </div>
            <p className="hof-success-note">
              Save this code. Application updates and selection timing will be
              sent to the email address you registered.
            </p>
            <Link href={ROUTES.houseOfFriends} className="btn-pill-neutral">
              Return to House of Friends
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </motion.section>
        </main>
      </div>
    );
  }

  return (
    <div className="hof-page hof-application-page min-h-screen bg-black text-white">
      <SEO
        title="Apply | House of Friends Founding Class 2026"
        description="Register for the House of Friends Founding Class 2026 and submit your artist profile, photo, and DJ set."
        absoluteTitle
        canonicalPath={ROUTES.houseOfFriendsApply}
        noIndex
      />
      <Navigation variant="dark" brand="monolith" />

      <main id="main-content" tabIndex={-1}>
        <header className="hof-application-hero">
          <div className="hof-application-etch" aria-hidden="true">
            <span>APPLICATION</span>
            <span />
            <span />
          </div>
          <div className="container layout-wide relative z-10 px-6">
            <Link href={ROUTES.houseOfFriends} className="hof-application-back">
              <ArrowLeft aria-hidden="true" />
              House of Friends
            </Link>
            <div className="hof-application-hero-grid">
              <div>
                <p className="hof-kicker">
                  Founding Class 2026 / Artist registration
                </p>
                <h1>
                  Bring us the artist.
                  <span>Not just the mix.</span>
                </h1>
              </div>
              <div className="hof-application-hero-copy">
                <p>
                  One profile. One current photo. One DJ set that represents
                  where you are now—and where you want to go next.
                </p>
                <dl>
                  <div>
                    <dt>Launch performance</dt>
                    <dd>August 22, 2026</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>Castaways / Chicago</dd>
                  </div>
                  <div>
                    <dt>Submission fee</dt>
                    <dd>No payment collected</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </header>

        <section className="hof-application-body">
          <div className="container layout-wide px-6">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <HoneypotField {...register(honeypotFieldName)} />

              <div className="hof-application-layout">
                <div className="hof-application-form-stack">
                  <section
                    className="hof-form-section"
                    aria-labelledby="hof-form-identity"
                  >
                    <div className="hof-form-section-head">
                      <span>01</span>
                      <div>
                        <p>Artist identity</p>
                        <h2 id="hof-form-identity">
                          Who is entering the house?
                        </h2>
                      </div>
                    </div>
                    <div className="hof-form-grid">
                      <label>
                        <span>First name</span>
                        <input
                          {...register("firstName")}
                          className={fieldClass}
                          autoComplete="given-name"
                        />
                        {fieldError(errors.firstName?.message)}
                      </label>
                      <label>
                        <span>Last name</span>
                        <input
                          {...register("lastName")}
                          className={fieldClass}
                          autoComplete="family-name"
                        />
                        {fieldError(errors.lastName?.message)}
                      </label>
                      <label className="hof-form-span-2">
                        <span>Artist / stage name</span>
                        <input
                          {...register("stageName")}
                          className={fieldClass}
                          placeholder="The name we should publish"
                        />
                        {fieldError(errors.stageName?.message)}
                      </label>
                      <label>
                        <span>Email</span>
                        <input
                          {...register("email")}
                          className={fieldClass}
                          type="email"
                          autoComplete="email"
                        />
                        {fieldError(errors.email?.message)}
                      </label>
                      <label>
                        <span>Phone</span>
                        <input
                          {...register("phone")}
                          className={fieldClass}
                          type="tel"
                          autoComplete="tel"
                        />
                        {fieldError(errors.phone?.message)}
                      </label>
                      <label>
                        <span>City</span>
                        <input
                          {...register("city")}
                          className={fieldClass}
                          autoComplete="address-level2"
                        />
                        {fieldError(errors.city?.message)}
                      </label>
                      <label>
                        <span>State / region</span>
                        <input
                          {...register("state")}
                          className={fieldClass}
                          autoComplete="address-level1"
                        />
                        {fieldError(errors.state?.message)}
                      </label>
                      <label>
                        <span>Instagram</span>
                        <input
                          {...register("instagram")}
                          className={fieldClass}
                          placeholder="@artistname"
                        />
                        {fieldError(errors.instagram?.message)}
                      </label>
                      <label>
                        <span>
                          Artist link <small>optional</small>
                        </span>
                        <input
                          {...register("artistUrl")}
                          className={fieldClass}
                          type="url"
                          placeholder="https://soundcloud.com/..."
                        />
                        {fieldError(errors.artistUrl?.message)}
                      </label>
                      <label>
                        <span>Years actively DJing</span>
                        <select
                          {...register("yearsActive")}
                          className={fieldClass}
                        >
                          <option value="under-1">Under 1 year</option>
                          <option value="1-2">1–2 years</option>
                          <option value="3-5">3–5 years</option>
                          <option value="6-plus">6+ years</option>
                        </select>
                      </label>
                      <label>
                        <span>Primary sound / genres</span>
                        <input
                          {...register("genres")}
                          className={fieldClass}
                          placeholder="Afro House, Melodic House..."
                        />
                        {fieldError(errors.genres?.message)}
                      </label>
                    </div>
                  </section>

                  <section
                    className="hof-form-section"
                    aria-labelledby="hof-form-story"
                  >
                    <div className="hof-form-section-head">
                      <span>02</span>
                      <div>
                        <p>Artist story</p>
                        <h2 id="hof-form-story">What are you building?</h2>
                      </div>
                    </div>
                    <div className="hof-form-long-fields">
                      <label>
                        <span>
                          Artist bio <small>{bioLength}/1500</small>
                        </span>
                        <textarea
                          {...register("bio")}
                          className={fieldClass}
                          rows={7}
                          placeholder="Tell us where you come from, what shapes your sound, and what matters in your work."
                        />
                        {fieldError(errors.bio?.message)}
                      </label>
                      <label>
                        <span>
                          Why House of Friends? <small>{whyLength}/1500</small>
                        </span>
                        <textarea
                          {...register("whyHouseOfFriends")}
                          className={fieldClass}
                          rows={7}
                          placeholder="What would this pathway mean to you, and what do you hope to contribute to the community?"
                        />
                        {fieldError(errors.whyHouseOfFriends?.message)}
                      </label>
                      <label>
                        <span>
                          How do you collaborate?{" "}
                          <small>{collaborationLength}/1000</small>
                        </span>
                        <textarea
                          {...register("collaborationStyle")}
                          className={fieldClass}
                          rows={5}
                          placeholder="Tell us how you listen, prepare, share space, and build a B2B or B3B with other artists."
                        />
                        {fieldError(errors.collaborationStyle?.message)}
                      </label>
                    </div>
                  </section>

                  <section
                    className="hof-form-section"
                    aria-labelledby="hof-form-media"
                  >
                    <div className="hof-form-section-head">
                      <span>03</span>
                      <div>
                        <p>Media workspace</p>
                        <h2 id="hof-form-media">
                          Give the work a place to live.
                        </h2>
                      </div>
                    </div>
                    <div className="hof-upload-grid">
                      <UploadField
                        accept="image/jpeg,image/png,image/webp"
                        assetType="photo"
                        description="JPG, PNG, or WebP · 10 MB max"
                        error={photoError}
                        file={photo}
                        icon={ImagePlus}
                        label="Current artist photo"
                        onChange={selectPhoto}
                        previewUrl={photoPreview}
                      />
                      <UploadField
                        accept=".mp3,.m4a,.wav,.flac,audio/mpeg,audio/mp4,audio/wav,audio/flac"
                        assetType="dj-set"
                        description="MP3, M4A, WAV, or FLAC · 1.5 GB max"
                        error={djSetError}
                        file={djSet}
                        icon={FileAudio}
                        label="DJ set submission"
                        onChange={selectDjSet}
                      />
                    </div>
                    <div className="hof-form-grid hof-set-details">
                      <label className="hof-form-span-2">
                        <span>Set title</span>
                        <input
                          {...register("setTitle")}
                          className={fieldClass}
                          placeholder="Artist Name — House of Friends Submission 2026"
                        />
                        {fieldError(errors.setTitle?.message)}
                      </label>
                      <label className="hof-form-span-2">
                        <span>
                          Tracklist / set notes <small>optional</small>
                        </span>
                        <textarea
                          {...register("setTracklist")}
                          className={fieldClass}
                          rows={5}
                          placeholder="Tracklist, timestamps, recording context, or anything the selection team should know."
                        />
                        {fieldError(errors.setTracklist?.message)}
                      </label>
                      <label className="hof-form-span-2">
                        <span>
                          Backup streaming link <small>optional</small>
                        </span>
                        <input
                          {...register("setUrl")}
                          className={fieldClass}
                          type="url"
                          placeholder="https://soundcloud.com/..."
                        />
                        {fieldError(errors.setUrl?.message)}
                      </label>
                    </div>
                    <div
                      className="hof-storage-map"
                      aria-label="Applicant folder structure"
                    >
                      <div>
                        <LockKeyhole aria-hidden="true" />
                        <span>Private applicant workspace</span>
                      </div>
                      <code>
                        <span>profile/</span> application + bio
                        <span>photo/</span> artist image
                        <span>dj-set/</span> submitted audio
                      </code>
                    </div>
                  </section>

                  <section
                    className="hof-form-section"
                    aria-labelledby="hof-form-agreements"
                  >
                    <div className="hof-form-section-head">
                      <span>04</span>
                      <div>
                        <p>Before you send</p>
                        <h2 id="hof-form-agreements">
                          Clear expectations. No hidden turn.
                        </h2>
                      </div>
                    </div>
                    <div className="hof-consent-stack">
                      <label>
                        <input type="checkbox" {...register("ageConfirmed")} />
                        <span>
                          <Check aria-hidden="true" />
                        </span>
                        <p>I will be 21 or older on August 22, 2026.</p>
                      </label>
                      {fieldError(errors.ageConfirmed?.message)}
                      <label>
                        <input
                          type="checkbox"
                          {...register("availabilityConfirmed")}
                        />
                        <span>
                          <Check aria-hidden="true" />
                        </span>
                        <p>
                          I am available for the full Chasing Sun(Sets) II event
                          day and required preparation.
                        </p>
                      </label>
                      {fieldError(errors.availabilityConfirmed?.message)}
                      <label>
                        <input
                          type="checkbox"
                          {...register("rightsConfirmed")}
                        />
                        <span>
                          <Check aria-hidden="true" />
                        </span>
                        <p>
                          I created or control this recording and authorize its
                          use for private selection review. Public release
                          requires a separate written agreement.
                        </p>
                      </label>
                      {fieldError(errors.rightsConfirmed?.message)}
                      <label>
                        <input type="checkbox" {...register("termsAccepted")} />
                        <span>
                          <Check aria-hidden="true" />
                        </span>
                        <p>
                          I understand that applying does not guarantee
                          selection, booking, equipment, or future performance.
                        </p>
                      </label>
                      {fieldError(errors.termsAccepted?.message)}
                      <label>
                        <input
                          type="checkbox"
                          {...register("marketingConsent")}
                        />
                        <span>
                          <Check aria-hidden="true" />
                        </span>
                        <p>
                          Keep me informed about House of Friends artist
                          opportunities. <small>Optional</small>
                        </p>
                      </label>
                    </div>
                  </section>

                  {submitError && (
                    <div className="hof-submit-error" role="alert">
                      <ShieldCheck aria-hidden="true" />
                      <div>
                        <strong>Application not sent</strong>
                        <p>{submitError}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="hof-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="hof-spin" aria-hidden="true" />{" "}
                        Upload in progress
                      </>
                    ) : (
                      <>
                        Register + submit application{" "}
                        <ArrowUpRight aria-hidden="true" />
                      </>
                    )}
                  </button>
                  <p className="hof-submit-footnote">
                    Your files are private and used for House of Friends
                    selection review. Large audio uploads may take several
                    minutes. By submitting, you agree to our{" "}
                    <Link href={ROUTES.terms}>terms</Link> and acknowledge our{" "}
                    <Link href={ROUTES.privacy}>privacy policy</Link>.
                  </p>
                </div>

                <aside
                  className="hof-application-rail"
                  aria-label="Application checklist"
                >
                  <div>
                    <p className="hof-kicker">Application / 2026</p>
                    <h2>One complete signal.</h2>
                    <ul>
                      <li>
                        <span>01</span>
                        <p>
                          <strong>Identity</strong>Contact + artist details
                        </p>
                      </li>
                      <li>
                        <span>02</span>
                        <p>
                          <strong>Story</strong>Bio + collaborative intent
                        </p>
                      </li>
                      <li>
                        <span>03</span>
                        <p>
                          <strong>Proof</strong>Photo + uploaded DJ set
                        </p>
                      </li>
                      <li>
                        <span>04</span>
                        <p>
                          <strong>Clarity</strong>Availability + permissions
                        </p>
                      </li>
                    </ul>
                    <div className="hof-application-rail-note">
                      <ShieldCheck aria-hidden="true" />
                      <p>
                        <strong>Private by default.</strong>Your materials are
                        not published by this application.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </form>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {status && (
          <motion.div
            className="hof-upload-overlay"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={
                shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="hof-upload-progress-card"
            >
              <div className="hof-upload-progress-mark" aria-hidden="true">
                <span>H</span>
                <span>F</span>
              </div>
              <p className="hof-kicker">Secure artist intake</p>
              <h2>{statusCopy[status]}</h2>
              <div className="hof-progress-list">
                <div>
                  <span>Artist photo</span>
                  <strong>{progress.photo}%</strong>
                  <i>
                    <b style={{ width: `${progress.photo}%` }} />
                  </i>
                </div>
                <div>
                  <span>DJ set</span>
                  <strong>{progress["dj-set"]}%</strong>
                  <i>
                    <b style={{ width: `${progress["dj-set"]}%` }} />
                  </i>
                </div>
              </div>
              <p>
                Keep this window open until your applicant reference appears.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
