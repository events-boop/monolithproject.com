'use strict';
const episodes = JSON.parse(document.getElementById('radio-data').textContent);
const slot = document.getElementById('embed-slot');
const room = document.getElementById('listening-room');
const status = document.getElementById('player-status');
const stop = document.getElementById('stop-player');
const shelf = document.getElementById('radio-grid');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let selected = 0;
let active = -1;
let collection = episodes[0]?.collection || 'chasing';
let loadTimer;
let playerTrigger;
const formatDate = value => value ? new Intl.DateTimeFormat('en', {month:'short', day:'numeric', year:'numeric', timeZone:'UTC'}).format(new Date(value + 'T12:00:00Z')) : '';
function text(id, value) { document.getElementById(id).textContent = value; }
function switchProfileTab(name, focus = false) {
  ['episode','artist'].forEach(key => {
    const tab = document.getElementById(key + '-tab');
    const isSelected = key === name;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    document.getElementById(key + '-panel').hidden = !isSelected;
    if (focus && isSelected) tab.focus();
  });
}
function renderIdle() {
  const button = document.createElement('button');
  button.className = 'episode-play';
  button.dataset.play = String(selected);
  button.setAttribute('aria-label', 'Play ' + episodes[selected].artist + ', ' + episodes[selected].title);
  const icon = document.createElement('span'); icon.className='episode-play-icon'; icon.setAttribute('aria-hidden','true'); icon.textContent='▶';
  const label = document.createElement('span'); label.textContent='Listen to the episode';
  const detail = document.createElement('small'); detail.textContent = episodes[selected].duration ? episodes[selected].duration + ' · Plays here' : 'Full recording · Plays here';
  label.append(detail); button.append(icon,label); slot.replaceChildren(button);
}
function selectEpisode(index, trigger, start = false, scroll = true) {
  const episode = episodes[index];
  if (!episode) return;
  const changed = selected !== index;
  if (changed) stopRadio();
  selected = index;
  const profile = episode.profile;
  const art = document.getElementById('player-art');
  art.src=episode.image; art.alt=episode.artist + ' — ' + episode.title + ' cover';
  text('player-series', episode.series.toUpperCase());
  text('player-edition', episode.stamp || (episode.episode ? 'EP. ' + episode.episode.padStart(3,'0') : 'SPECIAL SESSION'));
  text('player-title', episode.artist);
  text('profile-location', episode.locationLabel || profile.location + ' · ' + profile.sound);
  text('episode-description', episode.description);
  text('episode-duration', episode.duration ? episode.duration + ' / FULL MIX' : 'FULL RECORDING');
  text('episode-date', formatDate(episode.publishedAt));
  const bpm = document.getElementById('episode-bpm'); bpm.hidden = !episode.bpm; bpm.textContent = episode.bpm ? episode.bpm + ' BPM' : '';
  text('artist-bio', profile.bio);
  const link = document.getElementById('artist-profile-link');
  link.hidden = !profile.url;
  if (profile.url) { link.href=profile.url; link.textContent=profile.linkLabel + ' ↗'; } else { link.removeAttribute('href'); link.textContent=''; }
  const bioSource = document.getElementById('bio-source-link'); bioSource.href=profile.bioSource; bioSource.title=profile.bioCredit;
  text('episode-credit', 'CURATED BY ' + episode.publisher.toUpperCase());
  document.getElementById('episode-source').href=episode.source;
  document.querySelectorAll('.radio-sleeve').forEach(card => card.setAttribute('aria-pressed', String(Number(card.dataset.selectEpisode) === index)));
  if (changed || !trigger) switchProfileTab('episode');
  if (active < 0) { renderIdle(); status.textContent='Press play. Stay a while.'; text('player-label','ON DEMAND / FULL EPISODE'); }
  if (trigger) playerTrigger=trigger;
  if (start) playEpisode();
  if (scroll) { room.scrollIntoView({behavior:'instant', block:'start'}); room.focus({preventScroll:true}); }
}
function playEpisode() {
  if (active === selected) return;
  document.dispatchEvent(new Event('sunsets:stop-video'));
  clearTimeout(loadTimer);
  const episode = episodes[selected];
  active = selected;
  const frame = document.createElement('iframe');
  frame.title = episode.artist + ' — ' + episode.title + ' audio player';
  frame.allow='autoplay; encrypted-media';
  frame.referrerPolicy='strict-origin-when-cross-origin';
  if (episode.provider==='mixcloud') {
    frame.src='https://www.mixcloud.com/widget/iframe/?'+new URLSearchParams({feed:new URL(episode.source).pathname,hide_cover:'1',light:'0',mini:'0',autoplay:'1'});
  } else {
    frame.src='https://w.soundcloud.com/player/?'+new URLSearchParams({url:episode.source,color:'#bd9d64',auto_play:'true',hide_related:'true',show_comments:'false',show_user:'true',show_reposts:'false',show_teaser:'false',visual:'false',buying:'false',sharing:'false',download:'false'});
  }
  status.textContent='Opening the episode…';
  text('player-label','EPISODE PLAYER / '+episode.provider.toUpperCase());
  frame.addEventListener('load',()=>{
    if (!frame.isConnected) return;
    clearTimeout(loadTimer);
    status.textContent='Listen here. If needed, tap Play once more in the player.';
  },{once:true});
  slot.replaceChildren(frame); stop.hidden=false;
  loadTimer=setTimeout(()=>{if(frame.isConnected)status.textContent='Still connecting. Try Stop, then play again.';},16000);
}
function stopRadio(restoreFocus = false) {
  clearTimeout(loadTimer);
  if (active < 0) return;
  active=-1;
  renderIdle(); stop.hidden=true;
  status.textContent='Playback stopped. Your episode is ready when you are.';
  text('player-label','ON DEMAND / FULL EPISODE');
  if(restoreFocus)slot.querySelector('button')?.focus({preventScroll:true});
}
function renderShelf() {
  const query=document.getElementById('radio-search').value.trim().toLowerCase();
  const items=episodes.map((episode,index)=>({episode,index})).filter(({episode})=>episode.collection===collection && (episode.artist+' '+episode.title+' '+episode.profile.sound).toLowerCase().includes(query));
  shelf.replaceChildren();
  for(const {episode,index} of items) {
    const button=document.createElement('button'); button.className='radio-sleeve'; button.dataset.selectEpisode=String(index);
    button.setAttribute('aria-label','Explore '+episode.artist+', '+episode.title);
    button.setAttribute('aria-pressed',String(index===selected));
    const imageBox=document.createElement('span'); imageBox.className='sleeve-image';
    const img=document.createElement('img'); img.src=episode.image; img.alt=''; img.loading='lazy'; img.width=640; img.height=640;
    const arrow=document.createElement('span'); arrow.className='sleeve-arrow'; arrow.setAttribute('aria-hidden','true'); arrow.textContent='↗';
    imageBox.append(img,arrow);
    const meta=document.createElement('span'); meta.className='sleeve-meta';
    const artist=document.createElement('strong'); artist.textContent=episode.artist;
    const title=document.createElement('small');title.textContent=episode.title.replace('Chasing Sunsets · ','');
    meta.append(artist,title);button.append(imageBox,meta);shelf.append(button);
  }
  document.getElementById('library-empty').hidden=items.length>0;
  text('library-count',items.length+' '+(items.length===1?'episode':'episodes')+' in '+(episodes.find(e=>e.collection===collection)?.series || 'this collection'));
  shelf.scrollLeft=0; updateShelfControls();
}
function updateShelfControls() {
  document.getElementById('shelf-prev').disabled=shelf.scrollLeft<=1;
  document.getElementById('shelf-next').disabled=shelf.scrollLeft+shelf.clientWidth>=shelf.scrollWidth-2;
}
document.addEventListener('click', event=>{
  const cover=event.target.closest('[data-select-episode]');
  if(cover)selectEpisode(Number(cover.dataset.selectEpisode),cover);
  const play=event.target.closest('[data-play]');
  if(play)selectEpisode(Number(play.dataset.play),play,true,!room.contains(play));
});
stop.addEventListener('click',()=>stopRadio(true));
document.addEventListener('sunsets:stop-radio',()=>stopRadio());
window.addEventListener('pagehide',()=>stopRadio());
document.querySelectorAll('.profile-tabs [role=tab]').forEach(tab=>{
  tab.addEventListener('click',()=>switchProfileTab(tab.id.split('-')[0]));
  tab.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    switchProfileTab(event.key==='Home'?'episode':event.key==='End'?'artist':tab.id==='episode-tab'?'artist':'episode',true);
  });
});
document.querySelectorAll('[data-collection]').forEach(button=>button.addEventListener('click',()=>{
  collection=button.dataset.collection;
  document.querySelectorAll('[data-collection]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  renderShelf();
}));
document.getElementById('radio-search').addEventListener('input',renderShelf);
for(const [id,direction] of [['shelf-prev',-1],['shelf-next',1]])document.getElementById(id).addEventListener('click',()=>shelf.scrollBy({left:direction*shelf.clientWidth*.8,behavior:reducedMotion.matches?'instant':'smooth'}));
shelf.addEventListener('scroll',updateShelfControls,{passive:true});
window.addEventListener('resize',updateShelfControls);
const band=document.querySelector('.frequency-band');
for(let i=0;i<31;i++){const bar=document.createElement('i');bar.style.height=(3+Math.abs(Math.sin(i*1.21)*Math.cos(i*.47))*17)+'px';band.append(bar);}
selectEpisode(0,null,false,false);
renderShelf();

const journeys = [
  { image: 'assets/series-main.webp', alt: 'Chasing Sunsets Radio golden sun artwork', caption: '01 / IT STARTS WITH A SOUND', description: 'A listener discovers a set. A new sound becomes the beginning of something bigger.' },
  { image: 'assets/sommers-uk-episode-011.webp', alt: 'SOMMERS (UK) on their Chasing Sunsets episode cover', caption: '02 / THE PEOPLE BEHIND THE FREQUENCY', description: 'That set introduces an artist. Their taste, craft, and story reveal another side of the music.' },
  { image: 'assets/arodes.webp', alt: 'ARODES playing a set at Santa Monica Pier', caption: '03 / EVERY PLACE HAS A STORY', description: 'An artist reveals a scene. A scene leads to a city, a station, a venue, a gathering, or another creator.' },
  { image: 'assets/landscape.webp', alt: 'A golden sunset across the landscape', caption: '04 / THE NEXT CHAPTER IS YOURS', description: 'Someone new joins the journey. The network becomes richer because more meaningful connections become possible.' }
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  const item = journeys[Number(button.dataset.step)];
  const img = document.getElementById('journey-image');
  img.src = item.image;
  img.alt = item.alt;
  document.getElementById('journey-caption').textContent = item.caption;
  document.getElementById('journey-description').textContent = item.description;
  document.querySelectorAll('[data-step]').forEach(step => step.setAttribute('aria-pressed', String(step === button)));
}));
const wave = document.querySelector('.waveform');
for (let i = 0; i < 44; i++) {
  const bar = document.createElement('i');
  bar.style.height = (5 + Math.abs(Math.sin(i * 1.87) * Math.cos(i * .34)) * 22) + 'px';
  if (wave) wave.append(bar);
}

const archiveToggle=document.getElementById('archive-toggle');
if(archiveToggle)archiveToggle.addEventListener('click',()=>{const expanded=shelf.classList.toggle('archive-expanded');archiveToggle.setAttribute('aria-pressed',String(expanded));archiveToggle.textContent=expanded?'Compact view':'Show all '+episodes.length;document.querySelector('.shelf-controls').hidden=expanded;});
