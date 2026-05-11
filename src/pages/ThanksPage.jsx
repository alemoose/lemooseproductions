import { Link } from 'react-router-dom';

export default function ThanksPage() {
  return (
    <div className="thanks-page">
      <p className="thanks-page__message">Message received. I&apos;ll be in touch soon.</p>
      <Link to="/" className="thanks-page__back">
        ← Back to home
      </Link>
    </div>
  );
}
