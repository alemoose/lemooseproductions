export default function NavLogo({ className = 'nav-logo', alt = 'Lemoose Productions' }) {
  return (
    <picture>
      <source type="image/avif" srcSet="/uploads/newlogo-80.avif" />
      <img
        src="/uploads/newlogo-80.png"
        alt={alt}
        className={className}
        width={40}
        height={40}
        decoding="async"
      />
    </picture>
  );
}
