# Monolith communications — Collection 01

Local design collection, November 13, 2026. Built in the canonical Monolith
checkout; independent of the SUNSETS.FM website and its signup systems.

Run `npm run email:preview`, then open **http://localhost:3041**. Choose a message,
switch Email / In-product, and use Desktop / Mobile to review the composition.
Plain-text and standalone email views are included. All recipient details and
receipt references in this preview are synthetic.

## Art direction

Charcoal masthead, warm paper, oversized sans headings with italic Georgia
emphasis, restrained project accents, and existing Monolith artwork. Chasing
Sunsets uses gold, Untold Story cyan, House of Friends green, and radio copper.
Typography and primary actions remain live text when images are unavailable.
Email layouts use React Email tables, inline styles and system font fallbacks.
Mobile styles remove the secondary masthead and reduce headings and gutters.

| Message                       | Intended trigger                                                 |
| ----------------------------- | ---------------------------------------------------------------- |
| Monolith welcome              | Confirmed newsletter subscription with email consent             |
| Chasing Sunsets welcome       | Confirmed event-list subscription                                |
| Untold Story welcome          | Confirmed relevant interest/subscription                         |
| House of Friends welcome      | Community-list subscription, separate from applications          |
| Chasing Sunsets Radio welcome | Confirmed radio subscription; powered by sunsets.fm              |
| Signup saved                  | Durable receipt exists, subscription still pending               |
| Application received          | Application and required uploads verified, not artist acceptance |
| Important event update        | Approved notice to affected ticket holders                       |
| Message received              | Inquiry durably accepted for team handling                       |

The matching in-product notices are visual prototypes inside the local collection.
They persist until dismissed, include one action, announce status politely, and
respect reduced motion. They are not browser push notifications or live site
integrations.

## Implementation boundary

- `server/emails/communications.ts` holds the message catalogue and trigger notes.
- `server/emails/MonolithMessage.tsx` provides the reusable email composition.
- `server/emails/render-message.tsx` renders subject, HTML and plain text without
  importing providers or the database. Delivery rendering requires real receipt
  references where applicable and, for marketing, an HTTPS unsubscribe URL and
  sender postal address. It rejects preview references and local artwork origins.
- `scripts/preview-emails.tsx` serves the collection on loopback only, with a
  fixed asset allowlist, no-store/noindex headers, and read-only methods.
- `scripts/email-preview/` contains the collection interface. It is not imported
  by the public application or server.

The existing `WelcomeEmail.tsx`, `services/email.ts`, signup routes, provider
settings and public pages are untouched. No message is sent by the preview.
Reviewing a template does not activate an automation.

## Verification and remaining inbox checks

TypeScript and the focused communications rendering tests pass locally. Tests
cover every template, plain text, escaped personalization, receipt truthfulness,
radio identity and delivery requirements. The preview script runs on Node 22.

The collection and main welcome were inspected in Safari, including Safari's
1440×900 responsive setting. The mobile-width control and corresponding mobile
email state were observed in Chrome. The full 390×844 gallery, every message's
mobile geometry, notification dismiss/replay and keyboard traversal still need
an uninterrupted browser pass; active browser use interrupted those checks.

Real Gmail, Outlook and Apple Mail delivery, dark-mode transformations, image
blocking, recipient-specific unsubscribe behavior and sender-domain verification
have not been tested. The radio uses the existing WebP cover; verify its inbox
support or supply an approved JPEG/PNG rendition before activating delivery.
The event notice reflects the September 19 postponed record and requires current
status/copy approval before sending. Project-specific list/interest mappings,
sender postal address, delivery deduplication, suppression handling, and actual
triggers must be connected and tested when email activation is separately scoped.
