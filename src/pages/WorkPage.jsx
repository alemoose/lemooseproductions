import { Link } from 'react-router-dom';

const TILES = [
  {
    slug: 'portraits',
    to: '/work/portraits',
    num: '[ 01 ]',
    title: 'Portraits',
    img: '/uploads/portrait2.jpeg',
    imgAlt: 'Portraits collection',
    variant: 'portraits',
  },
  {
    slug: 'automotive',
    to: '/work/automotive',
    num: '[ 02 ]',
    title: 'Automotive',
    img: '/uploads/automotive2.jpeg',
    imgAlt: 'Automotive collection',
    variant: 'auto',
  },
  {
    slug: 'athletes',
    to: '/work/athletes',
    num: '[ 03 ]',
    title: 'Athletes',
    img: '/uploads/athletic2.jpg',
    imgAlt: 'Athletes collection',
    variant: 'athletes',
  },
];

export default function WorkPage() {
  const [portraits, automotive, athletes] = TILES;

  return (
    <div className="work-page">
      <header className="work-page__header">
        <span className="work-page__index-label">[ INDEX - 02 ]</span>
      </header>

      <div className="work-page__grid">
        <Link
          className={`work-tile work-tile--${portraits.variant}`}
          to={portraits.to}
          reloadDocument={portraits.to.replace(/\/$/, '') === '/work/portraits' || /\.html$/i.test(portraits.to)}
          aria-label={`${portraits.title} - view collection`}
        >
          <img className="work-tile__photo" src={portraits.img} alt="" />
          <div className="work-tile__gradient" aria-hidden />
          <span className="work-tile__num">{portraits.num}</span>
          <span className="work-tile__name">{portraits.title}</span>
          <span className="work-tile__cta">VIEW STORY →</span>
        </Link>

        <div className="work-page__rail">
          <Link
            className={`work-tile work-tile--${automotive.variant}`}
            to={automotive.to}
            reloadDocument={automotive.to.replace(/\/$/, '') === '/work/automotive' || /\.html$/i.test(automotive.to)}
            aria-label={`${automotive.title} - view collection`}
          >
            <img className="work-tile__photo" src={automotive.img} alt="" />
            <div className="work-tile__gradient" aria-hidden />
            <span className="work-tile__num">{automotive.num}</span>
            <span className="work-tile__name">{automotive.title}</span>
            <span className="work-tile__cta">VIEW STORY →</span>
          </Link>
          <Link
            className={`work-tile work-tile--${athletes.variant}`}
            to={athletes.to}
            reloadDocument={athletes.to.replace(/\/$/, '') === '/work/athletes' || /\.html$/i.test(athletes.to)}
            aria-label={`${athletes.title} - view collection`}
          >
            <img className="work-tile__photo" src={athletes.img} alt="" />
            <div className="work-tile__gradient" aria-hidden />
            <span className="work-tile__num">{athletes.num}</span>
            <span className="work-tile__name">{athletes.title}</span>
            <span className="work-tile__cta">VIEW STORY →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
