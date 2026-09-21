/* Sunsets.vip — show-page interactions. Tracking lives in tracking.js. */
(() => {
  'use strict';
  const heroButton = document.getElementById('hero-tickets-btn');
  const dock = document.querySelector('.booking-dock');
  const closing = document.querySelector('.closing-card');

  // Keep tickets available while the main booking button is outside the viewport.
  function updateDock() {
    const editing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    const dialogOpen = Boolean(document.getElementById('privacy-dialog')?.open);
    const notice = document.querySelector('.event-status-float');
    if (notice) {
      const updates = document.getElementById('updates')?.getBoundingClientRect();
      const updatesVisible = updates && updates.top < innerHeight && updates.bottom > 0;
      notice.hidden = editing || dialogOpen || Boolean(updatesVisible);
      notice.inert = notice.hidden;
    }
    if (!heroButton || !dock || document.body.dataset.eventStatus === 'EventPostponed') {
      if (dock) { dock.classList.remove('is-visible'); dock.inert = true; }
      return;
    }
    const heroRect = heroButton.getBoundingClientRect();
    const heroOutside = heroRect.bottom < 0 || heroRect.top >= window.innerHeight;
    const rect = closing.getBoundingClientRect();
    const closingVisible = rect.top < window.innerHeight && rect.bottom > 0;
    const visible = heroOutside && !closingVisible && !editing && !document.getElementById('privacy-dialog')?.open;
    dock.classList.toggle('is-visible', visible);
    dock.inert = !visible;
  }
  let framePending = false;
  function scheduleDockUpdate() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => { updateDock(); framePending = false; });
  }
  window.addEventListener('scroll', scheduleDockUpdate, { passive: true });
  window.addEventListener('resize', scheduleDockUpdate);
  document.addEventListener('focusin', scheduleDockUpdate);
  document.addEventListener('focusout', scheduleDockUpdate);
  updateDock();

  const dialog = document.getElementById('privacy-dialog');
  document.getElementById('privacy-open').addEventListener('click', () => { dialog.showModal(); scheduleDockUpdate(); });
  for (const [id, choice] of [['privacy-accept', 'accepted'], ['privacy-decline', 'declined']]) {
    document.getElementById(id).addEventListener('click', () => {
      window.sunsetsTracking?.setConsent(choice);
      dialog.close();
    });
  }
  dialog.addEventListener('close', scheduleDockUpdate);
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
})();

/* Only campaign taxonomy is forwarded; personal data and arbitrary parameters are discarded. */
(() => {
  const incoming = new URLSearchParams(location.search);
  for (const link of document.querySelectorAll('.ticket-link')) {
    if (!link.href.startsWith('https://allevents.in/')) continue;
    const url = new URL(link.href);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      const value = incoming.get(key);
      if (value && /^[a-zA-Z0-9_.~-]{1,100}$/.test(value) && !/\d{7,}/.test(value)) url.searchParams.set(key,value);
    }
    link.href = url.href;
  }
  const forms = [...document.querySelectorAll('.signup-form')];
  fetch('/api/sunsets/subscriptions', {headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)})
    .then(response => {if(!response.ok)throw new Error();return response.json();})
    .then(data => {for(const form of forms){if(data.audiences?.[form.dataset.audience]===true){form.querySelector('fieldset').disabled=false;form.querySelector('fieldset').hidden=false;form.parentElement.querySelector('.signup-fallback').hidden=true;form.querySelector('.form-feedback').textContent='Enter your email and choose this list above. We’ll confirm here when your signup is saved.';}}})
    .catch(()=>{}); // The initial markup includes a working email-request alternative.
  for (const form of forms) form.addEventListener('submit', async event => {
    event.preventDefault();
    if(!form.reportValidity())return;
    const fieldset=form.querySelector('fieldset');
    if(fieldset.disabled)return;
    const fields=new FormData(form);
    const feedback=form.querySelector('.form-feedback');
    fieldset.disabled=true;form.setAttribute('aria-busy','true');feedback.textContent='Sending your request…';
    try {
      const response=await fetch('/api/sunsets/subscriptions',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email:fields.get('email'),audience:form.dataset.audience,consent:fields.get('consent')==='on',website:fields.get('website')}),signal:AbortSignal.timeout(12000)});
      const result=await response.json();
      if(!response.ok || result.ok!==true)throw new Error(result.message || result.error?.message || 'We couldn’t confirm your signup. Please try again.');
      feedback.textContent=result.message;
      window.sunsetsTracking?.subscriptionResult(form.dataset.audience,result.state);
      form.reset();
    } catch(error){form.parentElement.querySelector('.signup-fallback').hidden=false;feedback.textContent=error.name==='TimeoutError'?'We couldn’t confirm your signup. Please try again.':error.message || 'Signup is unavailable. Please try again.';}
    finally{fieldset.disabled=false;form.removeAttribute('aria-busy');}
  });
})();
