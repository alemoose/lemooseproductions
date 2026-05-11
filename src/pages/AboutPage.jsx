const PORTRAIT = '/uploads/portrait.jpeg';
const WORK_PHOTO = '/uploads/portrait5.jpeg';

const DETAILS = [
  { label: 'EST.', value: 'SHOOTING SINCE 2021' },
  { label: 'BACKGROUND', value: 'FORMER COLLEGIATE RUNNER' },
  { label: 'EQUIPMENT', value: 'SONY A7 IV · GFX 50R' },
  { label: 'TURNAROUND', value: '5-7 DAYS' },
  { label: 'LANGUAGES', value: 'EN · ES' },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero" aria-label="About hero">
        <img className="about-hero__photo" src={PORTRAIT} alt="Andres, photographer" />
        <div className="about-hero__overlay" aria-hidden />
        <div className="story-section__edge-label">ABOUT - 04</div>
        <div className="about-hero__block">
          <h1 className="story-title about-hero__title">Andres</h1>
          <p className="about-hero__subtitle">SHOOTING AS LEMOOSE</p>
        </div>
      </section>

      <section className="about-article" aria-labelledby="about-article-heading">
        <div className="about-article__grid">
          <div className="about-article__prose">
            <p id="about-article-heading" className="about-article__label">
              - ABOUT
            </p>
            <p className="about-article__copy">
              I&apos;m a photographer based in Tuscaloosa. I shoot portraits, automotive, and athletics. The through-line is light, motion, and what people look like when they think no one&apos;s watching. I&apos;m available for sessions in Alabama and travel work elsewhere.
            </p>
            <p className="about-article__copy">
              I build frames around tension and ease in the same breath, whether it&apos;s a driver at dusk, a portrait in hard window light, or a body mid-stride. My approach stays quiet on set: small cues, room to breathe, then we chase what feels honest before it slips away.
            </p>
          </div>
          <div className="about-article__figure-wrap">
            <figure className="about-article__figure">
              <img
                className="about-article__photo about-article__photo--full-frame"
                src={WORK_PHOTO}
                alt="Andres working on a shoot"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="about-details" aria-label="Session details">
        <dl className="about-details__grid">
          {DETAILS.map(({ label, value }) => (
            <div key={label} className="about-details__pair">
              <dt className="about-details__label">{label}</dt>
              <dd className="about-details__value">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
