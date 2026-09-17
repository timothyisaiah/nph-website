export interface ImageCandidate {
  src: string;
  width: number;
  bytes: number;
}

export interface ImageSourceSet {
  type: 'image/avif' | 'image/webp';
  candidates: readonly ImageCandidate[];
}

export type ImageRole = 'photo' | 'banner' | 'chart' | 'logo';

export interface ResponsiveImageAsset {
  id: string;
  alt: string;
  credit?: string;
  role: ImageRole;
  width: number;
  height: number;
  fallback: ImageCandidate & { type: 'image/jpeg' | 'image/png' };
  fallbackCandidates: readonly ImageCandidate[];
  sources: readonly ImageSourceSet[];
  objectPosition?: string;
}

export const createSrcSet = (candidates: readonly ImageCandidate[]): string =>
  candidates.map(({ src, width }) => `${src} ${width}w`).join(', ');
