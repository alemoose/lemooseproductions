import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import NavLogo from './NavLogo.jsx';

const SHOT_FOR_NAMES = [
  '@frankystainnn',
  '@msixtv',
  '@motorized.empire',
  'COLBY ATHLETICS',
  'RISEMARK',
];

/* Enough repeats so the strip stays wider than ultra-wide viewports (seamless loop). */
const MARQUEE_REPEAT = 22;

function MarqueeGroup({ suffix }) {
  return (
    <>
      {Array.from({ length: MARQUEE_REPEAT }, (_, i) => (
        <Fragment key={`${suffix}-${i}`}>
          <span className="footer-marquee__phrase">BOOK A SESSION</span>
          <span className="footer-marquee__sep" aria-hidden>
            {' '}
            ·{' '}
          </span>
        </Fragment>
      ))}
    </>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__shot-for">
        <p className="site-footer__shot-for-label">SHOT FOR</p>
        <p className="site-footer__shot-for-names">
          {SHOT_FOR_NAMES.map((name, i) => (
            <Fragment key={name}>
              {i > 0 && <span className="site-footer__shot-for-dot">·</span>}
              <span className="site-footer__shot-for-name">{name}</span>
            </Fragment>
          ))}
        </p>
      </div>

      <div className="site-footer__marquee-bleed footer-book-session-marquee">
        <Link to="/contact" className="footer-marquee-capsule" aria-label="Book a session - go to contact">
          <div className="footer-marquee__track">
            <div className="footer-marquee__group">
              <MarqueeGroup suffix="a" />
            </div>
            <div className="footer-marquee__group" aria-hidden>
              <MarqueeGroup suffix="b" />
            </div>
          </div>
        </Link>
      </div>

      <div className="site-footer__rule" />
      <div className="site-footer__bottom">
        <NavLogo className="site-footer__bottom-logo" alt="Lemoose watermark" />
        <span className="site-footer__copyright">© 2026 LEMOOSE PRODUCTIONS - TUSCALOOSA</span>
      </div>
    </footer>
  );
}
