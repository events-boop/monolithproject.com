// Adapted from the approved Open Network page; rendered inside the Monolith shell.

export function NetworkHero({ onListen }: { onListen: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-orbits" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="small-sun" aria-hidden="true">
            ✳
          </span>{" "}
          THE MONOLITH PROJECT × SUNSETS.FM
        </p>
        <h1 id="hero-title">
          Find your frequency.
          <br />
          <em>Through togetherness.</em>
        </h1>
        <p className="hero-description">
          From our shared nights to a world of music, people &amp; places.
        </p>
        <p className="hero-sub">
          Chasing SUN(SETS) Radio was the beginning.
          <br />
          SUNSETS.FM carries the Monolith connection further.
        </p>
        <div className="actions">
          <a className="button cream" href="#radio">
            Explore the radio <span aria-hidden="true">↗</span>
          </a>
          <a className="text-link" href="#vision">
            Discover the vision <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div
        className="device-scene"
        aria-label="A preview of listening and discovery on SUNSETS"
      >
        <div className="scene-caption left">
          <span className="caption-line"></span>INDEPENDENT VOICES.
          <br />
          CONNECTED WORLDS.
        </div>
        <div className="phone phone-discover">
          <div className="phone-status">
            <span>9:41</span>
            <span>••• ▰</span>
          </div>
          <div className="phone-heading">
            <img src="/open-network/assets/wordmark.svg" alt="SUNSETS.FM" />
            <span>↗</span>
          </div>
          <p className="phone-eyebrow">A WORLD OF SOUND</p>
          <h2>
            Find your
            <br />
            next frequency.
          </h2>
          <a href="#radio" className="phone-feature">
            <img
              src="/media/chasing-radio/series-main-640.webp"
              alt="Chasing SUN(SETS) Radio series artwork"
            />
            <span>CHASING SUNSETS RADIO</span>
          </a>
          <div className="phone-small-grid">
            <img
              src="/media/open-network/covers/karma-karma-108-8cb174.webp"
              alt="Shimza Karma Karma Radio artwork"
            />
            <img
              src="/media/open-network/covers/drumcode-437-b364d6.webp"
              alt="Drumcode Radio artwork"
            />
          </div>
          <div className="phone-tabs" aria-hidden="true">
            <span>⌂</span>
            <span>◎</span>
            <span>◷</span>
            <span>♡</span>
          </div>
        </div>
        <div className="phone phone-player">
          <div className="phone-status">
            <span>9:41</span>
            <span>••• ▰</span>
          </div>
          <div className="phone-now">
            <span>⌄</span>
            <span>CHASING SUNSETS RADIO</span>
            <span>···</span>
          </div>
          <img
            className="phone-cover"
            src="/media/chasing-radio/sommers-uk-episode-011-640.webp"
            alt="SOMMERS (UK), Chasing Sunsets episode 011 cover"
          />
          <div className="phone-track">
            <div>
              <h2>SOMMERS (UK)</h2>
              <p>Chasing Sunsets · Episode 011</p>
            </div>
            <span aria-hidden="true">♡</span>
          </div>
          <div className="waveform" aria-hidden="true">
            {Array.from({ length: 44 }, (_, i) => (
              <i
                key={i}
                style={{
                  height: `${5 + Math.abs(Math.sin(i * 1.87) * Math.cos(i * 0.34)) * 22}px`,
                }}
              />
            ))}
          </div>
          <button
            className="phone-play"
            aria-label="Listen to SOMMERS (UK) in the radio player"
            onClick={onListen}
          >
            <span aria-hidden="true">▶</span>
          </button>
          <p className="phone-bottom">TOGETHERNESS IS THE FREQUENCY</p>
        </div>
        <div className="phone phone-map">
          <div className="phone-status">
            <span>9:41</span>
            <span>••• ▰</span>
          </div>
          <div className="phone-heading">
            <span>Atlas</span>
            <span>◎</span>
          </div>
          <p className="phone-eyebrow">DISCOVER WHERE MUSIC LIVES</p>
          <h2>
            Every city
            <br />
            has a sound.
          </h2>
          <div className="map-preview">
            <img
              src="/open-network/assets/globe.webp"
              alt="Illustration of the Earth for the planned music map"
            />
            <span className="map-pin chicago">Chicago</span>
            <span className="map-pin ibiza">Ibiza</span>
            <span className="map-pin london">London</span>
          </div>
          <div className="map-place">
            <img
              src="/media/open-network/arodes.webp"
              alt="ARODES performing by the Pacific"
            />
            <div>
              <strong>Follow the music.</strong>
              <p>Artists. Places. Connections.</p>
            </div>
          </div>
          <p className="phone-bottom">OPEN MAPS · IN DEVELOPMENT</p>
        </div>
        <div className="scene-caption right">
          ONE SET.
          <br />A WORLD OF CONNECTIONS.<span className="caption-line"></span>
        </div>
      </div>
      <div className="hero-foot">
        <span>01 — AN OPEN INVITATION</span>
        <span>App interface concepts · Network in development</span>
        <a href="#vision" aria-label="Scroll to the vision">
          ↓
        </a>
      </div>
    </section>
  );
}

export function NetworkVision() {
  return (
    <section
      className="vision paper section-pad"
      id="vision"
      aria-labelledby="vision-title"
    >
      <div className="section-kicker">
        <span className="eyebrow">THE VISION</span>
        <span>01 / 05</span>
      </div>
      <div className="vision-layout">
        <h2 id="vision-title">
          Every set has a story.
          <br />
          Every city has a sound.
          <br />
          <em>Every connection matters.</em>
        </h2>
        <div className="vision-copy">
          <p>
            Behind every great musical moment is a network of people, places,
            and communities that made it possible.
          </p>
          <p>
            Those connections live across streaming platforms, social media,
            ticketing systems, radio stations, and disconnected databases.
          </p>
          <p className="statement">SUNSETS.FM is bringing them together.</p>
          <p>
            An open-to-contribution, human-curated music discovery network. Find
            the music you love, meet the people behind it, and explore the
            places that shape it.
          </p>
        </div>
      </div>
      <div className="vision-bottom">
        <img
          src="/open-network/assets/mark.svg"
          width="82"
          height="82"
          alt="SUNSETS frequency and sunset symbol"
        />
        <p>
          More music to discover. More stories to uncover.
          <br />
          <strong>More ways to belong.</strong>
        </p>
        <span className="eyebrow">
          HUMAN CURATED.
          <br />
          OPEN TO CONTRIBUTION.
        </span>
      </div>
    </section>
  );
}

export function NetworkPillars() {
  return (
    <section
      className="pillars paper section-pad"
      id="network"
      aria-labelledby="network-title"
    >
      <div className="section-kicker">
        <span className="eyebrow">THREE PILLARS</span>
        <span>ONE CONNECTED WORLD</span>
      </div>
      <h2 className="section-title" id="network-title">
        A shared world.
        <br />
        <em>Built to stay open.</em>
      </h2>
      <div className="pillar-grid">
        <article className="pillar">
          <div className="pillar-visual radio-visual" aria-hidden="true">
            <span className="orbit r1"></span>
            <span className="orbit r2"></span>
            <span className="orbit r3"></span>
            <img src="/open-network/assets/mark.svg" alt="" />
          </div>
          <p className="eyebrow">01 / OPEN RADIO</p>
          <h3>
            Every frequency
            <br />
            has a home.
          </h3>
          <p>
            A connected ecosystem of independent stations, DJs, selectors,
            collectives, and curators. Authentic voices, brought together
            through the music.
          </p>
          <details>
            <summary>
              The radio vision <span>+</span>
            </summary>
            <p>
              From our flagship Chasing Sun(Sets) Radio to future independent
              community stations: curated programming, broadcasts, archives,
              artist profiles, and shareable listening experiences.
            </p>
            <p>
              The next great selector shouldn’t need a massive following to be
              discovered. They need a place where their taste, craft, and story
              can reach the right people.
            </p>
          </details>
        </article>
        <article className="pillar">
          <div className="pillar-visual map-visual" aria-hidden="true">
            <svg viewBox="0 0 300 180">
              <g fill="none" stroke="currentColor" strokeWidth=".7">
                <ellipse cx="150" cy="90" rx="86" ry="72"></ellipse>
                <ellipse cx="150" cy="90" rx="52" ry="72"></ellipse>
                <ellipse cx="150" cy="90" rx="20" ry="72"></ellipse>
                <path d="M64 90h172M73 58h154M73 122h154M150 18v144"></path>
                <path
                  d="M86 105Q136 23 186 66T221 115"
                  strokeDasharray="3 4"
                ></path>
              </g>
              <g fill="currentColor">
                <circle cx="86" cy="105" r="4"></circle>
                <circle cx="186" cy="66" r="4"></circle>
                <circle cx="221" cy="115" r="4"></circle>
              </g>
            </svg>
          </div>
          <p className="eyebrow">02 / OPEN MAPS</p>
          <h3>
            Discover where
            <br />
            music lives.
          </h3>
          <p>
            Explore the connections between artists, venues, festivals, radio
            stations, recordings, and local scenes through a living global music
            map.
          </p>
          <details>
            <summary>
              The maps vision <span>+</span>
            </summary>
            <p>
              From an underground Chicago DJ set to a beachside session in
              Ibiza, every verified connection offers another way to discover a
              city and its culture.
            </p>
            <p>
              A world of musical stories, not just pins on a map. Open Maps is
              in development.
            </p>
          </details>
        </article>
        <article className="pillar">
          <div className="pillar-visual platform-visual" aria-hidden="true">
            <svg viewBox="0 0 300 180">
              <g fill="none" stroke="currentColor">
                <path
                  d="m150 28 75 42v54l-75 35-75-35V70Z M75 70l75 40 75-40 M150 110v49 M150 28v52 M75 124l75-44 75 44"
                  strokeWidth=".8"
                ></path>
                <circle cx="150" cy="28" r="7"></circle>
                <circle cx="225" cy="70" r="7"></circle>
                <circle cx="225" cy="124" r="7"></circle>
                <circle cx="150" cy="159" r="7"></circle>
                <circle cx="75" cy="124" r="7"></circle>
                <circle cx="75" cy="70" r="7"></circle>
              </g>
              <circle cx="150" cy="80" r="12" fill="currentColor"></circle>
            </svg>
          </div>
          <p className="eyebrow">03 / OPEN PLATFORM</p>
          <h3>
            Discovery
            <br />
            without walls.
          </h3>
          <p>
            A shared foundation designed to make trusted, approved public music
            information accessible beyond SUNSETS.FM.
          </p>
          <details>
            <summary>
              The platform vision <span>+</span>
            </summary>
            <p>
              Through future open interfaces, embeddable experiences, attributed
              records, and responsible integrations, communities can contribute
              to and distribute a connected world of music.
            </p>
            <p>
              Build your identity. Share your knowledge. Extend your reach. Your
              community stays yours. The connections can travel.
            </p>
          </details>
        </article>
      </div>
    </section>
  );
}

export function NetworkCreators() {
  return (
    <section
      className="creators section-pad"
      id="creators"
      aria-labelledby="creators-title"
    >
      <div className="section-kicker">
        <span className="eyebrow">BUILT FOR THE PEOPLE WHO CREATE CULTURE</span>
        <span>04 / 05</span>
      </div>
      <div className="creator-heading">
        <h2 className="section-title" id="creators-title">
          Discovery should
          <br />
          <em>open doors.</em>
        </h2>
        <p>
          For the next great selector.
          <br />
          The independent producer.
          <br />
          The people making a scene possible.
        </p>
      </div>
      <div className="creator-grid">
        <article>
          <span className="creator-symbol" aria-hidden="true">
            ↗
          </span>
          <h3>Open Music</h3>
          <p>
            A pathway for independent producers and artists to present original
            work, receive accurate credits, connect recordings to official
            releases, and help listeners support the people who make the music.
          </p>
        </article>
        <article>
          <span className="creator-symbol" aria-hidden="true">
            ✳
          </span>
          <h3>Open Discovery</h3>
          <p>
            A place for emerging DJs, photographers, filmmakers, producers, and
            creatives to submit work for review and document their
            journeys—without fame, follower counts, or paid status as the
            starting point.
          </p>
        </article>
        <article>
          <span className="creator-symbol" aria-hidden="true">
            ↔
          </span>
          <h3>Opportunity Exchange</h3>
          <p>
            Being designed to connect verified opportunities from promoters,
            venues, festivals, brands, and radio hosts with creatives ready to
            contribute. Transparent requirements. Applications by choice.
          </p>
        </article>
      </div>
      <p className="development-note">
        The network is taking shape. These are the pathways we’re building
        toward.
      </p>
    </section>
  );
}

export function NetworkPrinciples() {
  return (
    <section
      className="trust paper section-pad"
      id="trust"
      aria-labelledby="trust-title"
    >
      <div className="section-kicker">
        <span className="eyebrow">
          THE PRINCIPLES BEHIND SUN(SETS) PROTOCOL
        </span>
        <span>05 / 05</span>
      </div>
      <div className="trust-heading">
        <h2 className="section-title" id="trust-title">
          Trust is
          <br />
          <em>the infrastructure.</em>
        </h2>
        <div>
          <p>
            An open network needs people, evidence, and responsibility behind
            it.
          </p>
          <p>
            These five principles guide the network we’re designing.
            Participation should preserve ownership, privacy, and the freedom to
            choose.
          </p>
        </div>
      </div>
      <div className="trust-list">
        <details open>
          <summary>
            <span>01</span>
            <h3>Attribution</h3>
            <span className="toggle">+</span>
          </summary>
          <p>The people behind the music receive appropriate credit.</p>
        </details>
        <details>
          <summary>
            <span>02</span>
            <h3>Provenance</h3>
            <span className="toggle">+</span>
          </summary>
          <p>Information can be traced to evidence and its source.</p>
        </details>
        <details>
          <summary>
            <span>03</span>
            <h3>Accountability</h3>
            <span className="toggle">+</span>
          </summary>
          <p>
            Contributions and corrections can be reviewed, challenged, and
            responsibly recorded.
          </p>
        </details>
        <details>
          <summary>
            <span>04</span>
            <h3>Consent</h3>
            <span className="toggle">+</span>
          </summary>
          <p>
            Creators, listeners, and organizations control their participation
            and private information.
          </p>
        </details>
        <details>
          <summary>
            <span>05</span>
            <h3>Integrity</h3>
            <span className="toggle">+</span>
          </summary>
          <p>
            Editorial discovery is earned through relevance and human judgment,
            not secretly purchased ranking.
          </p>
        </details>
      </div>
    </section>
  );
}

export function NetworkClosing() {
  return (
    <section
      className="closing"
      id="participate"
      aria-labelledby="closing-title"
    >
      <img
        className="closing-mark"
        src="/open-network/assets/mark.svg"
        alt=""
        width="100"
        height="100"
      />
      <p className="eyebrow">BE PART OF WHAT COMES NEXT</p>
      <h2 id="closing-title">
        Togetherness
        <br />
        is the <em>frequency.</em>
      </h2>
      <p>Music is the guide.</p>
      <div className="actions">
        <a
          className="button cream"
          href="mailto:events@monolithproject.com?subject=SUNSETS%20Open%20Network"
        >
          Let’s connect <span aria-hidden="true">↗</span>
        </a>
        <a className="text-link" href="#radio">
          Find your frequency <span aria-hidden="true">↑</span>
        </a>
      </div>
    </section>
  );
}
