import ParallaxPhoto from './ParallaxPhoto.jsx';
import { Link } from 'react-router-dom';

export default function StorySection({
  num,
  cat,
  titleLines,
  caption,
  linkTo,
  imageBase,
  imgPos,
  containerRef,
  sectionRef,
}) {
  const idx = parseInt(num, 10) - 1;
  const linked = Boolean(linkTo);
  const staticStoryPaths = ['/work/portraits', '/work/automotive', '/work/athletes'];
  const linkReloadDocument = Boolean(
    linkTo &&
      (/\.html$/i.test(linkTo) || staticStoryPaths.includes(linkTo.replace(/\/$/, ''))),
  );
  const panelLabel = `${titleLines.join(' ')} - open collection`;

  return (
    <section
      className={`snap-section story-section${linked ? ' story-panel--linked' : ''}`}
      ref={sectionRef}
      data-screen-label={`0${num} ${cat}`}
    >
      <ParallaxPhoto
        imageBase={imageBase}
        alt={cat}
        objectPosition={imgPos}
        containerRef={containerRef}
        sectionRef={sectionRef}
        loading="lazy"
      />
      <div
        className="story-section__overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(11,12,14,0.55)',
        }}
      />

      <div className="story-section__edge-label">
        {cat} - {num}
      </div>

      <div className="story-section__block">
        <div className="story-section__kicker">
          <span className="story-section__kicker-num">{num}</span>
          <span className="story-section__kicker-sep">-</span>
          <span className="story-section__kicker-cat">{cat}</span>
        </div>

        {linked ? (
          <Link to={linkTo} reloadDocument={linkReloadDocument} className="story-title-hit" aria-label={panelLabel}>
            <h2 className="story-title">
              {titleLines.map((line, li) => (
                <span key={li} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
            </h2>
            {caption ? (
              <p className="story-section__caption">
                <span className="story-section__caption-text">{caption}</span>
                <span className="story-section__caption-cta">
                  <span className="story-section__caption-cta-label">VIEW STORY</span>
                  <span className="story-section__caption-arrow">→</span>
                </span>
              </p>
            ) : null}
          </Link>
        ) : (
          <>
            <h2 className="story-title">
              {titleLines.map((line, li) => (
                <span key={li} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
            </h2>
            {caption ? (
              <p className="story-section__caption">
                <span className="story-section__caption-text">{caption}</span>
                <span className="story-section__caption-cta">
                  <span className="story-section__caption-cta-label">VIEW STORY</span>
                  <span className="story-section__caption-arrow">→</span>
                </span>
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="side-rail">
        {['01', '02', '03'].map((n, si) => (
          <div key={n} className={`rail-num${si === idx ? ' active' : ''}`}>
            {n}
          </div>
        ))}
        <div className="rail-bar" />
      </div>
    </section>
  );
}
