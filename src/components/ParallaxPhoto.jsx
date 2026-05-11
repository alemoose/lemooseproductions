export default function ParallaxPhoto({ src, alt, objectPosition = 'center', scrollY, sectionTop }) {
  const SPEED = 0.3;
  const offset = (scrollY - sectionTop) * SPEED;
  return (
    <img
      src={src}
      alt={alt}
      className="parallax-photo"
      style={{
        objectPosition,
        transform: `translateY(${offset}px)`,
      }}
    />
  );
}
