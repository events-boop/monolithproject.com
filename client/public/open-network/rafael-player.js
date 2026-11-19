'use strict';
(() => {
  const stage = document.getElementById('rafael-stage');
  const mount = document.getElementById('rafael-mount');
  const poster = document.getElementById('rafael-poster');
  const close = document.getElementById('rafael-close');
  const feedback = document.getElementById('rafael-error');
  const status = document.getElementById('rafael-status');
  let apiPromise;
  let player;
  let ready = false;
  let request = 0;
  let pendingStart = 0;
  let timer;
  let loading = false;
  let providerRestricted = false; // Availability follows the current provider response.
  function youtubeAPI() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(fail, 12000);
      function fail() { clearTimeout(timeout); script.remove(); apiPromise = null; reject(new Error('Player connection failed')); }
      window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); resolve(window.YT); };
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = fail;
      document.head.append(script);
    });
    return apiPromise;
  }
  function stopVideo(restoreFocus = false) {
    request++;
    clearTimeout(timer);
    if (player && typeof player.destroy === 'function') player.destroy();
    player = null;
    ready = false;
    loading = false;
    mount.replaceChildren();
    mount.hidden = true;
    poster.hidden = false;
    feedback.hidden = true;
    close.hidden = true;
    stage.dataset.state = 'idle';
    stage.removeAttribute('aria-busy');
    status.textContent = providerRestricted ? 'Embedded playback is currently restricted. You can retry the player.' : 'Press play, or choose a moment from the tracklist.';
    document.querySelectorAll('[data-rafael-cue]').forEach(button => button.removeAttribute('aria-current'));
    if (restoreFocus) poster.focus({preventScroll:true});
  }
  function fail(message) {
    clearTimeout(timer);
    loading = false;
    ready = false;
    if (player && typeof player.destroy === 'function') player.destroy();
    player = null;
    mount.replaceChildren();
    mount.hidden = true;
    document.getElementById('rafael-error-message').textContent = message;
    feedback.hidden = false;
    stage.dataset.state = 'error';
    stage.removeAttribute('aria-busy');
    status.textContent = 'Playback unavailable here. You can retry in this player.';
  }
  async function playVideo(start = 0, cue = null) {
    document.dispatchEvent(new Event('sunsets:stop-radio'));
    pendingStart = Math.max(0, Number(start) || 0);
    document.querySelectorAll('[data-rafael-cue]').forEach(button => {
      if (button === cue) button.setAttribute('aria-current','true');
      else button.removeAttribute('aria-current');
    });
    if (ready && player) { player.seekTo(pendingStart,true); player.playVideo(); return; }
    if (loading) return;
    const currentRequest = ++request;
    loading = true;
    poster.hidden = true;
    feedback.hidden = true;
    close.hidden = false;
    stage.setAttribute('aria-busy','true');
    stage.dataset.state = 'loading';
    status.textContent = 'Connecting to the NORISH.FM recording…';
    try {
      const api = await youtubeAPI();
      if (currentRequest !== request) return;
      const frame = document.createElement('iframe');
      frame.title = 'RAFAEL — Live at NORISH.FM video player';
      frame.src = 'https://www.youtube-nocookie.com/embed/wz8wGOVTkhM?' + new URLSearchParams({enablejsapi:'1',playsinline:'1',rel:'0',origin:location.origin,start:String(pendingStart),autoplay:'1'});
      frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      mount.replaceChildren(frame);
      mount.hidden = false;
      timer = setTimeout(() => { if (currentRequest === request) fail('The video player is taking too long to connect. Please try again.'); },18000);
      player = new api.Player(frame, { events: {
        onReady(event) {
          if (currentRequest !== request || stage.dataset.state === 'error') return;
          clearTimeout(timer);
          ready = true;
          loading = false;
          stage.removeAttribute('aria-busy');
          stage.dataset.state = 'ready';
          status.textContent = 'Ready · press play in the video.';
          if (pendingStart > 0) event.target.seekTo(pendingStart,true);
          event.target.playVideo();
        },
        onStateChange(event) {
          if (currentRequest !== request || stage.dataset.state === 'error') return;
          if (event.data === 1) { providerRestricted = false; stage.dataset.state = 'playing'; status.textContent = 'Now playing · RAFAEL at NORISH.FM'; }
          else if (event.data === 2) { stage.dataset.state = 'paused'; status.textContent = 'Paused · RAFAEL at NORISH.FM'; }
          else if (event.data === 0) { stage.dataset.state = 'ended'; status.textContent = 'Set finished. Follow the next connection.'; }
          else if (event.data === 3) { stage.dataset.state = 'buffering'; status.textContent = 'Loading the selected moment…'; }
        },
        onError(event) {
          if (currentRequest !== request) return;
          stage.dataset.providerError = String(event.data);
          providerRestricted = [101,150].includes(event.data);
          fail([101,150].includes(event.data) ? 'The publisher has restricted playback in this browser. Try again here or explore another recording below.' : 'This recording could not play here right now. Please try again.');
        },
        onAutoplayBlocked() { if (currentRequest === request) status.textContent = 'Press play inside the video to begin.'; }
      }});
    } catch { if (currentRequest === request) fail('The player could not connect. Check your connection and try again.'); }
  }
  document.querySelectorAll('[data-rafael-play]').forEach(button => button.addEventListener('click', () => playVideo()));
  document.querySelectorAll('[data-rafael-cue]').forEach(button => button.addEventListener('click', () => {
    playVideo(button.dataset.rafaelCue,button);
    if (matchMedia('(max-width:760px)').matches) stage.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});
  }));
  close.addEventListener('click', () => stopVideo(true));
  document.addEventListener('sunsets:stop-video', () => stopVideo());
  window.addEventListener('pagehide', () => stopVideo());
})();
