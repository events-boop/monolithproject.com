# First Access CTA map

Owner-directed local UX update, November 10, 2026. No production activation or
deployment is implied by this map.

The signup page's **Get First Access** action opens the existing hosted newsletter
form directly. If that URL is absent, it targets the inline `#newsletter-signup`
fallback. **Get music updates** opens the separate radio signup form. Both hosted
forms open in a new tab, preserving playback in the Monolith tab.

| Entry point                                                       | CTA                                | Destination                                          | Signup path                                                      |
| ----------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Home permanent entry row                                          | **Get First Access**               | `/newsletter`                                        | Existing Monolith newsletter signup                              |
| Home Calendar / 2027 preview                                      | **Be the first to know**           | `/newsletter`                                        | Same signup; no new event inventory                              |
| Main navigation overlay / 2027                                    | **Get First Access**               | `/newsletter`                                        | Opens the full signup page in-app                                |
| Home event card, details pending                                  | **Get First Access**               | `/newsletter`                                        | Same signup, rather than event details                           |
| Shows menu item and featured card, details pending                | **Get First Access**               | `/newsletter`                                        | Same signup, rather than `/tickets` or a dossier                 |
| Untold Story menu feature, no checkout                            | **Get First Access**               | `/newsletter`                                        | Same signup, rather than the series hub                          |
| Artist roster footer                                              | **First Access**                   | `/newsletter`                                        | Same signup, rather than checkout                                |
| Schedule / Tickets fallback                                       | **Get First Access**               | `/newsletter`                                        | Same signup                                                      |
| Shared event CTA, first access                                    | **Get First Access**               | `/newsletter`                                        | Same signup for all catalog series                               |
| Legacy event CTA overrides labelled First Access / Unlock Presale | **Get First Access**               | `/newsletter`                                        | Normalized to signup; never checkout                             |
| `/newsletter`                                                     | **Get First Access**              | `shared/signup-forms.json` → `newsletter` hosted URL | Existing Brevo form; email confirmation remains provider-managed |
| `/newsletter` SUNSETS.FM signal                                   | **Get music updates**             | `shared/signup-forms.json` → `radio` hosted URL      | Separate radio audience; provider retains consent and confirmation |
| Existing Lake List                                                | **Register for First Access**      | Existing Lake List form / Laylo destination          | Preserve the event-specific audience and consent                 |
| Existing `/sunsets#updates`                                       | Show updates / SUNSETS.FM releases | Separate event and radio forms                       | Preserve distinct audiences; these are not the 2027 newsletter   |

`shared/home-next-chapter.ts` supplies both the client 2027 preview and static
homepage content. The year is display copy on `/`, never a replacement URL.
Untold Story Season III, Chasing Sunsets IV, House of Friends and SUNSETS.FM
tiles lead to their existing permanent series pages. Artists and dates remain
unannounced; the preview creates no on-sale event or contract assertion.

`client/src/styles/first-access.css` makes newsletter links and marked First
Access CTAs bold across light and dark surfaces. `ConversionCTA` and the menus
mark dynamic labels explicitly. Existing campaign form controls already use
bold text.

Ticket-holder updates keep their support destinations. Real on-sale CTAs keep
their verified checkout destinations. Historical dossiers and artist pages are
preserved. Hosted signup rendering and route reachability do not prove delivery;
no subscriber was submitted during this design pass.
