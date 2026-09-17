import { useEffect, useState } from 'react';
import type { ResponsiveImageAsset } from '../../assets/image-types';
import { createSrcSet } from '../../assets/image-types';

interface OptimizedImageProps {
  asset: ResponsiveImageAsset;
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  fit?: 'cover' | 'contain';
  decorative?: boolean;
  onLoad?: () => void;
}

const OptimizedImage = ({
  asset,
  alt,
  className = '',
  imageClassName = '',
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
  fit = asset.role === 'chart' || asset.role === 'logo' ? 'contain' : 'cover',
  decorative = false,
  onLoad,
}: OptimizedImageProps) => {
  const [useFallback, setUseFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setUseFallback(false);
    setFailed(false);
  }, [asset.id, asset.fallback.src]);

  const resolvedAlt = decorative ? '' : (alt ?? asset.alt);
  const objectFitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const selectedSource = event.currentTarget.currentSrc;
    const fallbackUrl = new URL(asset.fallback.src, window.location.href).href;
    if (!useFallback && selectedSource !== fallbackUrl) {
      setUseFallback(true);
      return;
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-sm text-gray-500 ${className}`}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : `${resolvedAlt} (image unavailable)`}
      >
        {!decorative && 'Image unavailable'}
      </div>
    );
  }

  return (
    <picture className={`block overflow-hidden ${className}`}>
      {!useFallback && asset.sources.map((source) => (
        <source
          key={source.type}
          type={source.type}
          srcSet={createSrcSet(source.candidates)}
          sizes={sizes}
        />
      ))}
      <img
        src={asset.fallback.src}
        srcSet={createSrcSet(asset.fallbackCandidates)}
        alt={resolvedAlt}
        width={asset.width}
        height={asset.height}
        className={`block h-full w-full ${objectFitClass} ${imageClassName}`}
        style={{ objectPosition: asset.objectPosition }}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={sizes}
        onLoad={onLoad}
        onError={handleError}
      />
    </picture>
  );
};

export default OptimizedImage;
