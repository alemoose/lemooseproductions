import { Fragment, useRef } from 'react';
import HalftoneHero from '../components/HalftoneHero.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import StorySection from '../components/StorySection.jsx';

export default function HomePage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const s1Ref = useRef(null);
  const s2Ref = useRef(null);
  const s3Ref = useRef(null);

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
        imageBase="portrait4"
        imgPos="center 30%"
        containerRef={containerRef}
        sectionRef={s1Ref}
      />

      <StorySection
        num="02"
        cat="AUTOMOTIVE"
        titleLines={['Miami', 'Hours']}
        caption="EXOTICS · MOTORSPORT · STREET"
        linkTo="/work/automotive"
        imageBase="automotive3"
        imgPos="center center"
        containerRef={containerRef}
        sectionRef={s2Ref}
      />

      <StorySection
        num="03"
        cat="ATHLETES"
        titleLines={['In', 'Motion']}
        caption="SPORTS · GAMEDAY · TRAINING"
        linkTo="/work/athletes"
        imageBase="athletic1"
        imgPos="center 20%"
        containerRef={containerRef}
        sectionRef={s3Ref}
      />

      <section className="home-footer-section">
        <SiteFooter />
      </section>
    </div>
  );
}
