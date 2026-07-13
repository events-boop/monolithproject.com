# Application Intake System

**Status:** Built for internal preview; production storage and legal launch gate remain.

## Public Flow

The application route is `/house-of-friends/apply`. It remains `noindex` until eligibility, dates, review terms, privacy language, and public announcement clearance are approved.

The form collects:

- Legal first and last name.
- Artist or stage name.
- Email, phone, city, state, Instagram, and optional artist URL.
- Years active and primary sound.
- Artist bio.
- House of Friends intent.
- Collaboration approach.
- One current artist photo.
- One uploaded DJ set, title, optional tracklist, and optional backup link.
- Age, availability, submission-rights, program-terms, and optional marketing consent.

No payment is collected by the current intake.

## Private Workspace Structure

Every prepared submission receives a reference code and private object prefix:

```text
house-of-friends/2026/applications/hof26-xxxxxxxx/
├── profile/
│   └── application.json
├── photo/
│   └── artist-photo.<ext>
└── dj-set/
    └── submission.<ext>
```

The object prefix is the applicant folder. Object storage creates each nested path when its file is written.

## Upload Architecture

1. The site validates the profile and file metadata.
2. The API creates the applicant reference and a signed one-hour upload session.
3. The browser uploads the photo and large audio directly to private Cloudflare R2 storage.
4. The API verifies that both stored objects exist and match the expected byte sizes.
5. The application profile is marked `submitted`.
6. The completed record is written to `house_of_friends_applications` when Neon is configured.
7. A configured webhook and/or Resend admin notification alerts the team.

Local development uses the same folder model under `var/uploads/house-of-friends/`. Local upload files are gitignored.

## Production Environment

Required for production uploads:

```text
HOF_R2_ACCOUNT_ID
HOF_R2_ACCESS_KEY_ID
HOF_R2_SECRET_ACCESS_KEY
HOF_R2_BUCKET
HOF_APPLICATION_SIGNING_SECRET
HOF_APPLICATIONS_OPEN
```

Optional delivery:

```text
HOF_APPLICATION_WEBHOOK_URL
RESEND_API_KEY
ADMIN_EMAIL
```

The R2 bucket must stay private. Its CORS policy must allow `PUT` with the `Content-Type` header from `https://monolithproject.com`, `https://www.monolithproject.com`, `https://houseoffriends.vip`, and `https://www.houseoffriends.vip`. Add localhost origins only for deliberate remote-storage testing.

After the bucket and scoped R2 credentials exist, load the variables locally and run:

```bash
npm run hof:storage:configure
```

The script verifies the bucket, writes the approved browser-upload origins, and reads the CORS rule back before reporting success. It never prints credentials.

`HOF_APPLICATIONS_OPEN` must remain `false` until the migration, storage configuration, public terms, and production upload test are complete. The public status endpoint fails closed and the application page shows a holding state until every production prerequisite exists.

## Limits

- Photo: JPG, PNG, or WebP; 10 MB maximum.
- DJ set: MP3, M4A, WAV, or FLAC; 1.5 GB maximum.
- Signed upload session: one hour.
- Preparation attempts: six per IP per hour.
- Completion attempts: twelve per IP per hour.

## Production Gate

Before removing `noindex` or linking the application in primary navigation:

- Apply the dedicated idempotent database migration with `npm run hof:db:migrate`.
- Configure and verify the private R2 bucket and CORS policy.
- Add `houseoffriends.vip` and `www.houseoffriends.vip` to the linked Netlify site before using the standalone host.
- Set every required environment variable in the production host.
- Complete one full production-like upload with a large audio file.
- Approve eligibility, opening and closing dates, review process, and privacy/retention terms.
- Confirm the artist submission-rights language with counsel.
- Establish applicant deletion and withdrawal procedures.
- Set `HOF_APPLICATIONS_OPEN=true` only after every preceding check passes.
