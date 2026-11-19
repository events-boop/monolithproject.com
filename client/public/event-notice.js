/* Event details open only when a visitor explicitly requests them. Dismissal is keyed by updateId in localStorage. */
export function mountEventNotice(dialog) {
  if (!dialog) return () => {};
  const updateId = dialog.dataset.updateId || dialog.dataset.revision || 'current';
  const key = 'monolith:event-notice:' + updateId;
  const legacyKey = dialog.dataset.revision ? 'monolith:event-notice:' + dialog.dataset.revision : null;
  let previousFocus, previousOverflow;
  const isDismissed = () => {
    try {
      return localStorage.getItem(key) === 'seen' || (legacyKey ? localStorage.getItem(legacyKey) === 'seen' || sessionStorage.getItem(legacyKey) === 'seen' : false);
    } catch {
      return false;
    }
  };
  const remember = () => {
    try { localStorage.setItem(key, 'seen'); } catch {}
  };
  const open = () => {
    if (dialog.open || document.querySelector('dialog[open]')) return;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.body.classList.add('event-notice-open');
    dialog.querySelector('[data-notice-close]')?.focus();
  };
  const closed = () => {
    remember();
    document.body.style.overflow = previousOverflow || '';
    document.body.classList.remove('event-notice-open');
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
  };
  dialog.dataset.dismissed = String(isDismissed());
  const click = event => {
    if (event.target.closest('[data-open-event-notice]')) { event.preventDefault(); open(); }
    if (dialog.contains(event.target) && event.target.closest('[data-notice-close], [data-notice-link]')) { remember(); dialog.close(); }
  };
  const keydown = event => {
    if (event.key !== 'Tab') return;
    const items = Array.from(dialog.querySelectorAll('button, a[href]')).filter(el => el.getClientRects().length);
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last?.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus();}
  };
  document.addEventListener('click', click);
  dialog.addEventListener('close', closed);
  dialog.addEventListener('cancel', remember);
  dialog.addEventListener('keydown', keydown);
  return () => {
    document.removeEventListener('click', click);
    dialog.removeEventListener('keydown', keydown);
    if (dialog.open) { dialog.close(); closed(); }
    dialog.removeEventListener('close', closed);
    dialog.removeEventListener('cancel', remember);
  };
}
mountEventNotice(document.querySelector('[data-standalone-notice]'));
