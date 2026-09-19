/*
 * Existing production identifiers, recovered from monolithproject.com/sunsets/
 * on 2026-09-16. Retain these IDs and the existing consent storage key.
 * Analytics is intentionally inactive on localhost/file previews.
 */
(() => {
  'use strict';
  const GA_ID = 'G-DE8Z8VS263';
  const META_ID = '1049241148606250';
  const CONSENT_KEY = 'monolith_cookie_consent';
  const hosts = ['sunsets.vip', 'www.sunsets.vip', 'monolithproject.com', 'www.monolithproject.com', 'themonolithproject.com', 'www.themonolithproject.com'];
  const production = hosts.includes(window.location.hostname);
  let consent = null;
  let initialized = false;
  try { consent = localStorage.getItem(CONSENT_KEY); } catch { /* Storage may be blocked. */ }
  const allowed = () => production && consent !== 'declined';

  function loadScript(src) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }
  function initialize() {
    if (!allowed() || initialized) return;
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window['ga-disable-' + GA_ID] = false;
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    window.gtag('event', 'event_view', {event_id:'css-sep19', source:'sunsets_guide'});
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
    if (!window.fbq) {
      const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = window._fbq = fbq;
      window.fbq('init', META_ID);
      loadScript('https://connect.facebook.net/en_US/fbevents.js');
    }
    window.fbq('track', 'PageView');
  }
  function setConsent(choice) {
    if (!['accepted', 'declined'].includes(choice)) return;
    consent = choice;
    try { localStorage.setItem(CONSENT_KEY, choice); } catch { /* Use in-memory choice. */ }
    window['ga-disable-' + GA_ID] = choice === 'declined';
    window.gtag?.('consent', 'update', {
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
      ad_storage: choice === 'accepted' ? 'granted' : 'denied',
      ad_user_data: choice === 'accepted' ? 'granted' : 'denied',
      ad_personalization: choice === 'accepted' ? 'granted' : 'denied'
    });
    window.fbq?.('consent', choice === 'accepted' ? 'grant' : 'revoke');
    if (choice === 'accepted') initialize();
    window.dispatchEvent(new CustomEvent('monolith:cookie-consent-resolved', { detail: choice }));
  }
  window.sunsetsTracking = { setConsent, subscriptionResult(audience, state) {
    if (!allowed() || !['event','radio'].includes(audience) || !['subscribed','confirmation_required'].includes(state)) return;
    window.gtag?.('event', state === 'subscribed' ? 'subscription_confirmed' : 'subscription_confirmation_requested', {audience, event_id:'css-sep19'});
  } };
  window.addEventListener('storage', (event) => {
    if (event.key === CONSENT_KEY && ['accepted', 'declined'].includes(event.newValue)) setConsent(event.newValue);
  });
  initialize();

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !allowed()) return;
    const common = { event_id: 'css-sep19', content_name: 'Chasing Sun(Sets) III — JOEZI × MASSUMA' };
    if (link.classList.contains('ticket-link')) {
      const details = { ...common, provider:'AllEvents', placement: link.dataset.placement, link_url: link.href.split("?")[0] };
      window.gtag?.('event', 'outbound_ticket_click', details);
      // Preserve the live Meta custom-event name. A click is not a purchase.
      window.fbq?.('trackCustom', 'OutboundTicketClick', details);
    } else if (link.id === 'updates-request') {
      // An email request is not a completed signup: do not emit Lead.
      window.gtag?.('event', 'updates_request_click', common);
      window.fbq?.('trackCustom', 'UpdatesRequestClick', common);
    } else if (link.dataset.track) {
      window.gtag?.('event', link.dataset.track, { ...common, artist: link.dataset.artist || '' });
    }
  });
})();
