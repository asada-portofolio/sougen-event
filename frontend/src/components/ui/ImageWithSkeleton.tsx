import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '../../lib/utils';
import { getImageUrl } from '../../utils/getImageUrl';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number | string;
  height?: number | string;
  containerClassName?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Jika width/height disediakan (Mode 1), kita gunakan untuk set style container
  // Jika tidak (Mode 2), kita asumsikan containerClassName memiliki aspect ratio, misal 'aspect-square'
  const containerStyle = width && height ? { width, height } : undefined;

  return (
    <div
      className={cn('relative overflow-hidden', containerClassName)}
      style={containerStyle}
    >
      {/* Skeleton overlay yang tampil selama gambar belum di-load */}
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}

      {/* Jika gambar gagal diload */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 text-rpo-black/30 text-xs">
          Image not found
        </div>
      )}

      {src && (
        <img
          src={getImageUrl(src)}
          alt={alt || ''}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
