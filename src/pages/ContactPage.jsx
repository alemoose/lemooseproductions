const FORMSPREE_ACTION = 'https://formspree.io/f/xykoezyd';

export default function ContactPage() {
  const thanksUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/thanks` : '/thanks';

  return (
    <div className="contact-page">
      <p className="story-section__edge-label contact-page__edge-label">[ CONTACT - 04 ]</p>

      <div className="contact-page__inner">
        <header className="contact-page__pub" aria-label="Publication">
          <p className="contact-page__pub-line contact-page__pub-line--primary">Lemoose Productions</p>
          <p className="contact-page__pub-line contact-page__pub-line--meta">Tuscaloosa, AL</p>
          <p className="contact-page__pub-line contact-page__pub-line--meta">Est. 2026</p>
        </header>

        <div className="contact-page__below-pub">
          <hr className="contact-page__rule" aria-hidden />

          <section className="contact-page__form-section" aria-labelledby="contact-form-heading">
            <p id="contact-form-heading" className="contact-page__form-eyebrow">
              Start a project
            </p>

            <form className="contact-form" action={FORMSPREE_ACTION} method="POST">
              <input type="hidden" name="_subject" value="New inquiry from lemooseproductions.com" />
              <input type="hidden" name="_next" value={thanksUrl} />

              <div className="contact-form__field">
                <label className="contact-form__label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  className="contact-form__input"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="contact-form__field">
                <label className="contact-form__label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  className="contact-form__input"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="contact-form__field contact-form__field--select">
                <label className="contact-form__label" htmlFor="contact-project-type">
                  Project type
                </label>
                <div className="contact-form__select-wrap">
                  <select
                    id="contact-project-type"
                    className="contact-form__select"
                    name="project_type"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    <option value="Portrait">Portrait</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Commercial / Editorial">Commercial / Editorial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="contact-form__field contact-form__field--message">
                <label className="contact-form__label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="contact-form__textarea"
                  name="message"
                  rows={6}
                  required
                />
              </div>

              <div className="contact-form__actions">
                <button type="submit" className="contact-form__submit">
                  Send message →
                </button>
              </div>
            </form>
          </section>
        </div>

        <hr className="contact-page__rule" aria-hidden />

        <p className="contact-page__colophon">© Lemoose Productions / 2026</p>
      </div>
    </div>
  );
}
