import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, style, width, height }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate WebP and AVIF sources
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return '';
    const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    return {
      avif: `${baseSrc}.avif`,
      webp: `${baseSrc}.webp`,
      original: originalSrc
    };
  };

  const sources = getOptimizedSrc(src);

  return (
    <div style={{ position: 'relative', ...style }}>
      {!loaded && !error && (
        <div 
          className={className}
          style={{
            ...style,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width,
            height
          }}
        >
          <div style={{ fontSize: '12px', color: '#999' }}>Loading...</div>
        </div>
      )}
      
      <picture>
        <source srcSet={sources.avif} type="image/avif" />
        <source srcSet={sources.webp} type="image/webp" />
        <img
          src={sources.original}
          alt={alt}
          className={className}
          style={{
            ...style,
            display: loaded ? 'block' : 'none'
          }}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </picture>
      
      {error && (
        <div 
          className={className}
          style={{
            ...style,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width,
            height
          }}
        >
          <div style={{ fontSize: '12px', color: '#999' }}>Image unavailable</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;