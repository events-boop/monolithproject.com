/* One acknowledgement per published update, per browser session. No analytics. */
export function mountEventNotice(dialog) {
  if (!dialog) return () => {};
  const key = 'monolith:event-notice:' + dialog.dataset.revision;
  let previousFocus, previousOverflow, timer;
  const remember = () => { try { sessionStorage.setItem(key, 'seen'); } catch {} };
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
  let seen = false;
  try { seen = sessionStorage.getItem(key) === 'seen'; } catch {}
  if (!seen && dialog.dataset.autoOpen === 'true' && !['#event-update','#event-status'].includes(location.hash)) timer = setTimeout(open, 250);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('click', click);
    dialog.removeEventListener('keydown', keydown);
    if (dialog.open) { dialog.close(); closed(); }
    dialog.removeEventListener('close', closed);
    dialog.removeEventListener('cancel', remember);
  };
}
mountEventNotice(document.querySelector('[data-standalone-notice]'));
