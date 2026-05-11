import { Link, useParams } from 'react-router-dom';

const TITLES = {
  portraits: 'The Cast',
  automotive: 'Automotive',
  athletes: 'Athletes',
};

export default function WorkCollectionPlaceholder() {
  const { slug } = useParams();
  if (slug === 'portraits') {
    window.location.replace('/work/portraits');
    return null;
  }
  if (slug === 'automotive') {
    window.location.replace('/work/automotive');
    return null;
  }
  if (slug === 'athletes') {
    window.location.replace('/work/athletes');
    return null;
  }
  const title = (slug && TITLES[slug]) || 'Collection';

  return (
    <div className="work-collection-placeholder">
      <p className="work-collection-placeholder__eyebrow">Work</p>
      <h1 className="work-collection-placeholder__title">{title}</h1>
      <p className="work-collection-placeholder__lead">Collection page - coming soon.</p>
      <Link className="work-collection-placeholder__back" to="/work">
        ← Work index
      </Link>
    </div>
  );
}
