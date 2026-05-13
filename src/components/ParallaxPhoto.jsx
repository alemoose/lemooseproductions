import { useEffect, useRef } from 'react';

const SPEED = 0.3;

/**
 * Parallax photo that bypasses React entirely for scroll updates.
 *
 * Instead of being driven by a React `scrollY` prop (which forces the whole
 * homepage subtree to re-render on every scroll event), this component
 * attaches its own passive scroll listener to the scroll container and writes
 * `transform: translate3d(...)` directly to the <img> element inside a
 * requestAnimationFrame. That keeps scroll handling on the compositor thread
 * and prevents React reconciliation from running while scrolling - which is
 * what was causing the text to look jumpy on mobile.
 */
export default function ParallaxPhoto({
  src,
  alt,
  objectPosition = 'center',
  containerRef,
  sectionRef,
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

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className="parallax-photo"
      style={{ objectPosition }}
    />
  );
}
