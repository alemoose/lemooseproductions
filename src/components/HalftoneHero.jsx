import { useEffect, useRef, useState, useCallback } from 'react';

const HERO_IMAGE = '/uploads/automotive1.jpeg';

/**
 * Apply the equivalent of CSS `filter: saturate(0.45) brightness(0.38)` to a
 * canvas region via pixel math. We do this manually instead of using
 * ctx.filter so the effect renders identically on iOS Safari, where canvas
 * ctx.filter support is inconsistent.
 *
 * Matrix derived from the CSS Filters Level 1 spec:
 *   saturate(s): standard color matrix with s = 0.45
 *   brightness(b): multiplies each channel by b = 0.38
 * Combined matrix is precomputed below (brightness applied after saturate).
 */
function applySaturateBrightness(ctx, W, H) {
  const imgData = ctx.getImageData(0, 0, W, H);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    d[i]     = 0.21552 * r + 0.14944 * g + 0.01505 * b;
    d[i + 1] = 0.04452 * r + 0.32044 * g + 0.01505 * b;
    d[i + 2] = 0.04452 * r + 0.14944 * g + 0.18605 * b;
  }
  ctx.putImageData(imgData, 0, 0);
}

/** object-fit: cover math - same framing as full-bleed <img> in story sections */
function drawHalftone(ctx, img, logicalW, logicalH) {
  const W = logicalW;
  const H = logicalH;

  ctx.fillStyle = '#0B0C0E';
  ctx.fillRect(0, 0, W, H);

  const off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  const octx = off.getContext('2d');
  if (img) {
    const scale = Math.max(W / img.width, H / img.height);
    const sw = img.width * scale;
    const sh = img.height * scale;
    octx.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh);
    applySaturateBrightness(octx, W, H);
  }
  ctx.drawImage(off, 0, 0);

  const maskC = document.createElement('canvas');
  maskC.width = W;
  maskC.height = H;
  const mctx = maskC.getContext('2d');
  mctx.fillStyle = '#000';
  mctx.fillRect(0, 0, W, H);
  const TARGET_W = W * 0.84;
  let fontSize = Math.floor(W * 0.22);
  mctx.font = `900 ${fontSize}px 'Playfair Display', Georgia, serif`;
  const measured = mctx.measureText('LEMOOSE').width;
  if (measured > TARGET_W) {
    fontSize = Math.floor(fontSize * (TARGET_W / measured));
  }
  mctx.font = `900 ${fontSize}px 'Playfair Display', Georgia, serif`;
  mctx.fillStyle = '#fff';
  mctx.textAlign = 'center';
  mctx.textBaseline = 'middle';
  mctx.fillText('LEMOOSE', W / 2, H / 2);

  const maskData = mctx.getImageData(0, 0, W, H).data;

  const baseStep = 9;
  const dotStep = Math.max(6, Math.round(baseStep * (Math.min(W, 900) / 900)));
  const dotRadius = dotStep * 0.42;
  ctx.fillStyle = '#E8E4DC';
  for (let y = 0; y < H; y += dotStep) {
    for (let x = 0; x < W; x += dotStep) {
      const px = Math.min(Math.floor(x), W - 1);
      const py = Math.min(Math.floor(y), H - 1);
      const idx = (py * W + px) * 4;
      const brightness = maskData[idx];
      if (brightness > 55) {
        const r = dotRadius * (brightness / 255);
        ctx.beginPath();
        ctx.arc(x + dotStep / 2, y + dotStep / 2, Math.max(r, 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export default function HalftoneHero() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const paint = useCallback(() => {
    requestAnimationFrame(() => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      const w = Math.max(1, Math.floor(wrap.clientWidth));
      const h = Math.max(1, Math.floor(wrap.clientHeight));
      const dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHalftone(ctx, imgRef.current, w, h);
    });
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = HERO_IMAGE;
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
    img.onerror = () => setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const run = () => {
      if (document.fonts?.ready) {
        document.fonts.ready.then(paint);
      } else {
        paint();
      }
    };

    run();

    const wrap = wrapRef.current;
    if (!wrap) return;

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        paint();
      });
      ro.observe(wrap);
    } else {
      window.addEventListener('resize', paint);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', paint);
    };
  }, [loaded, paint]);

  return (
    <div ref={wrapRef} className="halftone-hero-wrap">
      <canvas ref={canvasRef} className="halftone-hero-canvas" />
    </div>
  );
}
