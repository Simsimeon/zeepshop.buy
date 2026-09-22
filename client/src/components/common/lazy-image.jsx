import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image with native lazy loading.
 *
 * - Defers offscreen loading via `loading="lazy"`
 * - Decodes off the main thread via `decoding="async"`
 * - Use `eager` for above-the-fold images (hero banners, dialogs) to avoid
 *   delaying the largest contentful paint.
 * - If the source fails, it renders a neutral placeholder instead of a broken
 *   image icon, so layout stays stable.
 */
export function LazyImage({
  src,
  alt = "",
  className,
  eager = false,
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn("block bg-muted", className)}
      />
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export default LazyImage;
