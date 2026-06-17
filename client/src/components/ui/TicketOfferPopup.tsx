import React, { useState, useEffect } from 'react';

interface TicketOfferPopupProps {
  onClose: () => void;
}

export function TicketOfferPopup({ onClose }: TicketOfferPopupProps) {
  // 48 hours in seconds
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = timeLeft % 60;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={styles.heroImage}>
          {/* We will use the generated image */}
        </div>

        <div style={styles.content}>
          <h2 style={styles.title}>
            <span style={{ fontSize: '1rem', color: '#7dd3fc', letterSpacing: '0px', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              30 DAYS UNLIMITED
            </span>
            <span style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'Impact, sans-serif', letterSpacing: '1px', color: '#e0f2fe', textShadow: '0 0 10px rgba(186, 230, 253, 0.5)' }}>
              SEEDANCE
            </span>
          </h2>
          
          <p style={styles.subtitle}>
            Buy now and get 30 days of unlimited Seedance
          </p>

          <div style={styles.timerContainer}>
            <div style={styles.timerHeader}>⏳ Seedance Unlimited Offer Expires In...</div>
            <div style={styles.timerGrid}>
              <div style={styles.timeBox}>
                <div style={styles.timeValue}>{formatNumber(days)}</div>
                <div style={styles.timeLabel}>Days</div>
              </div>
              <div style={styles.timeBox}>
                <div style={styles.timeValue}>{formatNumber(hours)}</div>
                <div style={styles.timeLabel}>Hours</div>
              </div>
              <div style={styles.timeBox}>
                <div style={styles.timeValue}>{formatNumber(minutes)}</div>
                <div style={styles.timeLabel}>Minutes</div>
              </div>
              <div style={styles.timeBox}>
                <div style={styles.timeValue}>{formatNumber(seconds)}</div>
                <div style={styles.timeLabel}>Seconds</div>
              </div>
            </div>
            
            <button onClick={onClose} style={styles.ctaButton}>
              Get Unlimited Access Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    width: '420px',
    backgroundColor: '#0f172a',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, sans-serif',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'background-color 0.2s',
  },
  heroImage: {
    height: '260px',
    backgroundImage: 'url(/samurai_sword_hilt.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  content: {
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, #0f172a 30%)',
    marginTop: '-80px',
    position: 'relative',
    zIndex: 2,
  },
  title: {
    margin: '0 0 8px 0',
    lineHeight: 1.1,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    margin: '0 0 24px 0',
  },
  timerContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
  },
  timerHeader: {
    fontSize: '0.65rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  timerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  },
  timeBox: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '12px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1,
    marginBottom: '4px',
  },
  timeLabel: {
    fontSize: '0.6rem',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  ctaButton: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
    transition: 'transform 0.1s, box-shadow 0.1s',
  }
};
