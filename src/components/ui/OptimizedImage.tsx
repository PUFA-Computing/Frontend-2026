'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  unoptimized?: boolean;
  layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * SEO-optimized image component with proper loading, error handling, and alt text
 * - Provides better Core Web Vitals by handling proper image loading
 * - Includes structured data attributes for better SEO
 * - Handles loading and error states
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  objectFit = 'cover',
  onLoad,
  unoptimized = false,
  layout,
  placeholder,
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Default blur placeholder for better LCP
  const defaultBlurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  // Generate structured data attributes for better SEO
  const structuredDataAttributes = {
    'itemProp': 'image',
    'itemScope': true,
    'itemType': 'https://schema.org/ImageObject',
  };

  return (
    <div 
      className={`relative overflow-hidden ${isLoading ? 'bg-gray-200 animate-pulse' : ''} ${className}`}
      style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
      {...structuredDataAttributes}
    >
      {!error ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          style={{ objectFit }}
          priority={priority}
          sizes={sizes}
          quality={90}
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          unoptimized={unoptimized}
          placeholder={placeholder || 'blur'}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          {...(layout && { layout })}
          // Add metadata for SEO
          itemProp="contentUrl"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Image unavailable</span>
        </div>
      )}
      
      {/* Hidden metadata for search engines */}
      <meta itemProp="name" content={alt} />
      <meta itemProp="description" content={alt} />
    </div>
  );
}
