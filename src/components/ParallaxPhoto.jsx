import { useEffect, useRef } from 'react';

const SPEED = 0.3;

/**
 * Parallax photo with responsive srcset. Scroll updates run outside React
 * via rAF; section offset is cached and only remeasured on resize.
 */
export default function ParallaxPhoto({
  imageBase,
  alt,
  objectPosition = 'center',
  containerRef,
  sectionRef,
  loading = 'lazy',
  fetchPriority,
}) {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    const section = sectionRef?.current;
    const container = containerRef?.current;
    if (!img || !section || !container) return undefined;

    let sectionTop = section.offsetTop;
    let rafId = 0;
    let pending = false;

    const apply = () => {
      pending = false;
      const offset = (container.scrollTop - sectionTop) * SPEED;
      img.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(apply);
    };

    const measure = () => {
      sectionTop = section.offsetTop;
      apply();
    };

    apply();

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(section);
    }

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef, sectionRef]);

  const avifSrcSet = `/uploads/${imageBase}-768.avif 768w, /uploads/${imageBase}-1280.avif 1280w, /uploads/${imageBase}-1920.avif 1920w`;
  const jpgSrcSet = `/uploads/${imageBase}-768.jpg 768w, /uploads/${imageBase}-1280.jpg 1280w, /uploads/${imageBase}-1920.jpg 1920w`;

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes="100vw" />
      <img
        ref={imgRef}
        src={`/uploads/${imageBase}-1280.jpg`}
        srcSet={jpgSrcSet}
        sizes="100vw"
        alt={alt}
        className="parallax-photo"
        style={{ objectPosition }}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  );
}
