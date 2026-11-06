"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE, isAllowedImageUrl } from "@/lib/images";

type SafeImageProps = Omit<ImageProps, "src"> & { src: string };

/**
 * next/image with a fallback for images that are missing, fail to load, or come
 * from a host next/image is not configured for.
 */
export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const usable = src && isAllowedImageUrl(src) && failedSrc !== src;
  const resolved = usable ? src : FALLBACK_IMAGE;

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      unoptimized={resolved.endsWith(".svg")}
      onError={() => setFailedSrc(src)}
    />
  );
}
