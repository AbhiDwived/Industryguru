import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, style, placeholder = '/assets/img/placeholder.jpg' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }}>
      {!loaded && !error && (
        <div 
          className={className}
          style={{
            ...style,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Loading...
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          display: loaded ? 'block' : 'none'
        }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {error && (
        <div 
          className={className}
          style={{
            ...style,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          No Image
        </div>
      )}
    </div>
  );
};

export default LazyImage;