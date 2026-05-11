import { Fragment, useEffect, useRef, useState } from 'react';
import HalftoneHero from '../components/HalftoneHero.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import StorySection from '../components/StorySection.jsx';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const s1Ref = useRef(null);
  const s2Ref = useRef(null);
  const s3Ref = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="snap-container home-page" ref={containerRef}>
      <section className="snap-section" ref={heroRef}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
          }}
        >
          <div className="hero-photo-zoom" style={{ width: '100%', height: '100%' }}>
            <HalftoneHero />
          </div>
        </div>

        <div className="hero-copy">
          <div className="hero-copy__scrim" aria-hidden />

          <div className="hero-copy__body">
            <div className="hero-copy__rule" />
            <div className="hero-meta">
              {['PORTRAIT', 'AUTOMOTIVE', 'ATHLETIC'].map((item, i, arr) => (
                <Fragment key={item}>
                  <span>{item}</span>
                  {i < arr.length - 1 && <span className="hero-meta__dot">·</span>}
                </Fragment>
              ))}
              <span className="hero-meta__dash">-</span>
              <span>TUSCALOOSA, AL</span>
            </div>
            <span className="hero-scroll-hint">↓ SCROLL TO EXPLORE</span>
          </div>
        </div>
      </section>

      <StorySection
        num="01"
        cat="PORTRAITS"
        titleLines={['The Cast']}
        caption="LIFESTYLE · CREATORS · GRADS"
        linkTo="/work/portraits"
        img="/uploads/portrait4.jpeg"
        imgPos="center 30%"
        scrollY={scrollY}
        sectionRef={s1Ref}
      />

      <StorySection
        num="02"
        cat="AUTOMOTIVE"
        titleLines={['Miami', 'Hours']}
        caption="EXOTICS · MOTORSPORT · STREET"
        linkTo="/work/automotive"
        img="/uploads/automotive3.jpg"
        imgPos="center center"
        scrollY={scrollY}
        sectionRef={s2Ref}
      />

      <StorySection
        num="03"
        cat="ATHLETES"
        titleLines={['In', 'Motion']}
        caption="SPORTS · GAMEDAY · TRAINING"
        linkTo="/work/athletes"
        img="/uploads/athletic1.jpg"
        imgPos="center 20%"
        scrollY={scrollY}
        sectionRef={s3Ref}
      />

      <section className="home-footer-section">
        <SiteFooter />
      </section>
    </div>
  );
}
