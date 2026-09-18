import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export function renderSunsetsPage(event, template) {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (date, options) => new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago', ...options}).format(new Date(date));
  if (!['EventScheduled','EventPostponed','EventRescheduled','EventCancelled'].includes(event.status)) throw new Error('Unsupported event status');
  if (event.status !== 'EventScheduled' && !event.statusApproval) throw new Error('A named owner approval is required for a status change');
  if (event.status !== 'EventScheduled' && event.salesEnabled) throw new Error('Disable sales until ticket instructions for the status change are approved');
  if (!Number.isFinite(Date.parse(event.updatedAt)) || Date.parse(event.end) <= Date.parse(event.start)) throw new Error('Invalid event dates');
  // The artwork and venue photography contain location/date information too. A change
  // must include replacement assets/copy, not silently ship the previous poster.
  if (event.artworkApprovedFor.start !== event.start || event.artworkApprovedFor.venueName !== event.venueName) throw new Error('Review artwork, venue photos and copy for the revised date/location before publishing');
  const startTime=fmt(event.start,{hour:'numeric',minute: new Date(event.start).getUTCMinutes() ? '2-digit' : undefined});
  const endTime=fmt(event.end,{hour:'numeric',minute: new Date(event.end).getUTCMinutes() ? '2-digit' : undefined});
  const monthDay=fmt(event.start,{month:'long',day:'numeric'});
  const json={ '@context':'https://schema.org','@type':'MusicEvent',name:event.name,startDate:event.start,endDate:event.end,eventStatus:'https://schema.org/'+event.status,eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',url:event.canonical,image:event.socialImage,location:{'@type':'Place',name:event.venueName,address:{'@type':'PostalAddress',streetAddress:event.streetAddress,addressLocality:'Chicago',addressRegion:'IL',postalCode:'60611',addressCountry:'US'}},performer:[...event.headliners,...event.support].map(name=>({'@type':'MusicGroup',name})),organizer:{'@type':'Organization',name:'The Monolith Project',url:'https://monolithproject.com'}};
  let scheduleHtml='<p class="lineup-names">'+event.headliners.map(escape).join(' <span aria-hidden="true">/</span> ')+'</p><p class="support-names"><strong>WITH</strong>'+event.support.map(name=>'<span class="support-act">'+escape(name)+'</span>').join(' · ')+'</p>';
  if(event.schedule.length){
    let previous=Date.parse(event.start);
    scheduleHtml='<dl class="set-times-list">'+event.schedule.map(slot=>{
      if(![...event.headliners,...event.support].includes(slot.artist)||Date.parse(slot.start)<previous||Date.parse(slot.end)<=Date.parse(slot.start)||Date.parse(slot.end)>Date.parse(event.end))throw new Error('Invalid or overlapping approved schedule');
      previous=Date.parse(slot.end);
      return '<div><dt>'+escape(slot.artist)+'</dt><dd>'+escape(fmt(slot.start,{hour:'numeric',minute:'2-digit'})+'–'+fmt(slot.end,{hour:'numeric',minute:'2-digit'}))+'</dd></div>';
    }).join('')+'</dl>';
  }
  const statusDisplay = {
    EventScheduled: {statusTone:'green', statusLabel:'EVENT SCHEDULED'},
    EventPostponed: {statusTone:'amber', statusLabel:'EVENT POSTPONED'},
    EventRescheduled: {statusTone:'amber', statusLabel:'DATE UPDATED'},
    EventCancelled: {statusTone:'red', statusLabel:'EVENT CANCELLED'},
  }[event.status];
  const raw={eventJson:JSON.stringify(json).replace(/</g,'\\u003c'),scheduleHtml,heroArtwork:event.status==='EventScheduled'?event.heroArtwork:'',venueHeading:event.venueHeading};
  const values={...event,...statusDisplay,monthDay,monthDayUpper:monthDay.toUpperCase(),shortDate:fmt(event.start,{weekday:'short',month:'long',day:'numeric'}),longDate:fmt(event.start,{weekday:'long',month:'long',day:'numeric'}),fullDate:fmt(event.start,{month:'long',day:'numeric',year:'numeric'}),hours:startTime+'–'+endTime,startTime,endTime,updatedLabel:fmt(event.updatedAt,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'})+' (Chicago)',dockLabel:fmt(event.start,{month:'short',day:'numeric'}).toUpperCase()+' · '+event.venueName,ticketLabel:event.salesEnabled?'Official tickets via AllEvents':'Read the current ticket-holder notice',ticketUrl:event.salesEnabled?event.ticketUrl:'#event-update'};
  let html=template.replace(/\{\{(\w+)\}\}/g,(_,key)=>{
    if(key in raw)return raw[key];
    if(!(key in values))throw new Error('Unknown event field: '+key);
    return escape(values[key]);
  });
  if(!event.salesEnabled){
    html=html.replace(/<a\b[^>]*class="[^"]*ticket-link[^"]*"[^>]*>[\s\S]*?<\/a>/g, '<a class="button button-primary" href="#event-update">READ EVENT UPDATE</a>');
  }
  return html;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
 const event=JSON.parse(readFileSync('shared/events/sunsets-page.json','utf8'));
 const html=renderSunsetsPage(event,readFileSync('scripts/templates/sunsets.html','utf8'));
 writeFileSync('client/public/sunsets/index.html',html);
 const utc=value=>new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z');
 const icsEscape=value=>value.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//The Monolith Project//Sunsets//EN','BEGIN:VEVENT','UID:css-sep19@monolithproject.com','DTSTAMP:'+utc(event.updatedAt),'DTSTART:'+utc(event.start),'DTEND:'+utc(event.end),'SUMMARY:'+icsEscape(event.name),'LOCATION:'+icsEscape(event.venueName+', '+event.address),'URL:'+event.canonical,'STATUS:'+(event.status==='EventCancelled'?'CANCELLED':event.status==='EventPostponed'?'TENTATIVE':'CONFIRMED'),'END:VEVENT','END:VCALENDAR',''].join('\r\n');
 writeFileSync('client/public/sunsets/assets/chasing-sunsets-iii.ics',ics);
 console.log('Rendered Sunsets HTML, metadata, structured data and calendar from approved event data.');
}
