import { Fragment, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import SiteFooter from './SiteFooter.jsx';
import NavLogo from './NavLogo.jsx';

const IG_PLACEHOLDER = 'https://www.instagram.com/lemoose.prod/';
const MAIL_ADDRESS = 'lemooseproductions@gmail.com';
const MAIL_SUBJECT = 'New Inquiry - Lemoose Productions';
const MAIL_BODY = [
  'Hi Lemoose Productions,',
  '',
  "I'd love to chat about a potential project. A quick rundown:",
  '',
  '• Project type (portrait / athlete / automotive / other): ',
  '• Preferred date(s): ',
  '• Location: ',
  '• Anything else I should know: ',
  '',
  'Looking forward to hearing back!',
  '',
  'Thanks,',
  '____________',
  '',
].join('\n');
const MAIL_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAIL_ADDRESS)}&su=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;
const BOOK_SESSION_REPEAT = 22;

/** @typedef {'closed' | 'open' | 'closing'} MenuState */

export default function SiteLayout() {
  const { pathname } = useLocation();
  const showGlobalFooter = pathname !== '/';
  const workNavActive = pathname === '/work' || pathname.startsWith('/work/');

  const [menuState, setMenuState] = useState(/** @type {MenuState} */ ('closed'));
  const [menuLinksReady, setMenuLinksReady] = useState(false);

  const menuOpen = menuState === 'open';
  const menuClosing = menuState === 'closing';
  const menuVisible = menuState !== 'closed';

  const requestClose = useCallback(() => {
    setMenuState((s) => {
      if (s === 'closed' || s === 'closing') return s;
      return 'closing';
    });
  }, []);

  const openMenu = useCallback(() => {
    setMenuState('open');
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (menuState === 'closing') return;
    if (menuState === 'open') requestClose();
    else if (menuState === 'closed') openMenu();
  }, [menuState, requestClose, openMenu]);

  /* React Router does not reset window scroll; long pages (e.g. Work) leave scrollY stuck when opening Contact. */
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const cls = 'page-contact';
    if (pathname === '/contact') {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => document.body.classList.remove(cls);
  }, [pathname]);

  useEffect(() => {
    if (menuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuVisible]);

  useEffect(() => {
    if (menuState !== 'open') {
      setMenuLinksReady(false);
      return undefined;
    }
    setMenuLinksReady(false);
    const t = window.setTimeout(() => setMenuLinksReady(true), 250);
    return () => window.clearTimeout(t);
  }, [menuState]);

  useEffect(() => {
    if (menuState !== 'closing') return undefined;
    const t = window.setTimeout(() => {
      setMenuState('closed');
    }, 200);
    return () => window.clearTimeout(t);
  }, [menuState]);

  useEffect(() => {
    setMenuState('closed');
    setMenuLinksReady(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuVisible) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuVisible, requestClose]);

  const mobileLinkClass = (active) =>
    `nav-mobile-overlay__link${active ? ' nav-mobile-overlay__link--active' : ''}`;

  const mobileLinks = [
    { to: '/', label: 'Home', active: pathname === '/', stagger: 'nav-mobile-overlay__link--stagger-0' },
    { to: '/work', label: 'Work', active: workNavActive, stagger: 'nav-mobile-overlay__link--stagger-1' },
    { to: '/about', label: 'About', active: pathname === '/about', stagger: 'nav-mobile-overlay__link--stagger-2' },
    { to: '/contact', label: 'Contact', active: pathname === '/contact', stagger: 'nav-mobile-overlay__link--stagger-3' },
  ];

  return (
    <div className="site-layout">
      <div className="grain-overlay" />

      <nav className="nav-bar" aria-label="Primary">
        <Link to="/" className="nav-logo-link" aria-label="Home">
          <NavLogo alt="" />
        </Link>

        <div className="nav-capsule">
          <NavLink to="/" end className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            HOME
          </NavLink>
          <NavLink to="/work" className={() => `nav-btn${workNavActive ? ' active' : ''}`}>
            WORK
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
            CONTACT
          </NavLink>
        </div>

        <div className="nav-icons">
          <a href={IG_PLACEHOLDER} className="nav-icon-btn" title="Instagram" target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href={MAIL_HREF} className="nav-icon-btn" title="Email" target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
        </div>
      </nav>

      <button
        type="button"
        className="nav-mobile-trigger"
        aria-expanded={menuVisible}
        aria-controls="nav-mobile-overlay"
        aria-hidden={menuVisible}
        tabIndex={menuVisible ? -1 : 0}
        aria-label="Open menu"
        onClick={toggleMobileMenu}
      >
        <span className="nav-mobile-trigger__lines" aria-hidden>
          <span className="nav-mobile-trigger__line" />
          <span className="nav-mobile-trigger__line" />
          <span className="nav-mobile-trigger__line" />
        </span>
      </button>

      <div
        id="nav-mobile-overlay"
        className={`nav-mobile-overlay${menuVisible ? ' nav-mobile-overlay--open' : ''}${menuClosing ? ' nav-mobile-overlay--closing' : ''}${menuLinksReady && menuOpen && !menuClosing ? ' nav-mobile-overlay--links-ready' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuVisible}
      >
        <div className="nav-mobile-overlay__panel">
          <button type="button" className="nav-mobile-overlay__close" onClick={requestClose}>
            Close
          </button>

          <nav className="nav-mobile-overlay__nav" aria-label="Mobile">
            <ul className="nav-mobile-overlay__list">
              {mobileLinks.map(({ to, label, active, stagger }) => (
                <Fragment key={to}>
                  <li className="nav-mobile-overlay__hairline" aria-hidden="true">
                    <span className="nav-mobile-overlay__hairline-inner" />
                  </li>
                  <li className="nav-mobile-overlay__item">
                    <Link
                      to={to}
                      className={`${mobileLinkClass(active)} ${stagger}`}
                      onClick={requestClose}
                    >
                      {active ? <span className="nav-mobile-overlay__arrow">→</span> : null}
                      {active ? ' ' : null}
                      {label}
                    </Link>
                  </li>
                </Fragment>
              ))}
            </ul>

            <div className="nav-mobile-overlay__social" aria-label="Social links">
              <a href={IG_PLACEHOLDER} className="nav-icon-btn nav-mobile-overlay__social-link" title="Instagram" target="_blank" rel="noreferrer" onClick={requestClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href={MAIL_HREF} className="nav-icon-btn nav-mobile-overlay__social-link" title="Email" target="_blank" rel="noreferrer" onClick={requestClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </nav>

          <div className="nav-mobile-overlay__footer-marquee">
            <Link to="/contact" className="footer-marquee-capsule" onClick={requestClose}>
              <div className="footer-marquee__track">
                <div className="footer-marquee__group">
                  {Array.from({ length: BOOK_SESSION_REPEAT }, (_, i) => (
                    <Fragment key={`mobile-marquee-a-${i}`}>
                      <span className="footer-marquee__phrase">BOOK A SESSION</span>
                      <span className="footer-marquee__sep" aria-hidden>
                        {' '}
                        ·{' '}
                      </span>
                    </Fragment>
                  ))}
                </div>
                <div className="footer-marquee__group" aria-hidden>
                  {Array.from({ length: BOOK_SESSION_REPEAT }, (_, i) => (
                    <Fragment key={`mobile-marquee-b-${i}`}>
                      <span className="footer-marquee__phrase">BOOK A SESSION</span>
                      <span className="footer-marquee__sep" aria-hidden>
                        {' '}
                        ·{' '}
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <main className="site-layout__main">
        <Outlet />
      </main>

      {showGlobalFooter ? <SiteFooter /> : null}
    </div>
  );
}
