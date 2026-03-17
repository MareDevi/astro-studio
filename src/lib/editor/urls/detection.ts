// Combined regex for performance and cleaner code
export const urlRegex = /https?:\/\/[^\s)]+/;

// List of common image file extensions
const IMAGE_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'webp',
  'avif',
  'bmp',
  'ico',
];
const IMAGE_EXTENSIONS_WITH_DOTS = IMAGE_EXTENSIONS.map((ext) => `.${ext}`);

export interface UrlMatch {
  url: string;
  from: number;
  to: number;
}

/**
 * Find all URLs in a string
 * @param text - Text to search for URLs
 * @param offset - Offset to add to positions
 * @returns Array of URL matches with positions
 */
export const findUrlsInText = (
  text: string,
  offset: number = 0,
): UrlMatch[] => {
  const urls: UrlMatch[] = [];
  const markdownRanges: Array<{ from: number; to: number }> = [];

  // First, find all markdown link ranges to avoid duplicates
  const markdownLinkRegex = /!?\[([^\]]*)\]\(([^)]+)\)/g;
  let match = markdownLinkRegex.exec(text);
  while (match !== null) {
    const linkUrl = match[2];
    const linkText = match[1];
    const isImage = match[0].startsWith('!');

    if (linkUrl?.startsWith('http') && match.index !== undefined) {
      // Position of the URL part within the markdown link/image
      // For images: ![alt](url) - need to account for the extra ! character
      const urlStart =
        match.index + (linkText?.length || 0) + (isImage ? 4 : 3); // after "!](" or "]("
      const urlEnd = urlStart + linkUrl.length;

      urls.push({
        url: linkUrl,
        from: offset + urlStart,
        to: offset + urlEnd,
      });

      // Track the entire markdown link range to avoid plain URL detection inside it
      markdownRanges.push({
        from: match.index,
        to: match.index + match[0].length,
      });
    }
    match = markdownLinkRegex.exec(text);
  }

  // Find plain URLs, but skip those inside markdown links
  const plainUrlRegex = /https?:\/\/[^\s)]+/g;
  match = plainUrlRegex.exec(text);
  while (match !== null) {
    const urlStart = match.index;
    const urlEnd = match.index + match[0].length;

    // Check if this URL is inside a markdown link
    const isInsideMarkdown = markdownRanges.some(
      (range) => urlStart >= range.from && urlEnd <= range.to,
    );

    if (!isInsideMarkdown) {
      urls.push({
        url: match[0],
        from: offset + urlStart,
        to: offset + urlEnd,
      });
    }
    match = plainUrlRegex.exec(text);
  }

  return urls;
};

/**
 * Check if a string is a valid URL
 * @param text - Text to check
 * @returns true if text is a valid URL
 */
export const isValidUrl = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const match = trimmed.match(urlRegex);
  return match !== null && match[0] === trimmed;
};

/**
 * Check if a URL or path points to an image based on its file extension
 * Handles query parameters and fragments by only checking the path portion
 * @param urlOrPath - URL or path to check
 * @returns true if the URL/path ends with an image extension
 */
export const isImageUrl = (urlOrPath: string): boolean => {
  // Remove query parameters and fragments to check only the path
  const cleanPath = (urlOrPath.split('?')[0] ?? '').split('#')[0] ?? '';
  return IMAGE_EXTENSIONS_WITH_DOTS.some((ext) =>
    cleanPath.toLowerCase().endsWith(ext),
  );
};

/**
 * Find all image URLs and paths in text, regardless of syntax
 * Detects three types of image references:
 * 1. Remote URLs: https://example.com/image.png
 * 2. Relative paths: ./image.png or ../images/photo.jpg
 * 3. Absolute paths: /src/assets/image.png
 *
 * This works across any syntax: markdown, HTML, MDX components, or plain text
 *
 * @param text - Text to search for image URLs and paths
 * @param offset - Offset to add to positions (for line-based searching)
 * @returns Array of image URL/path matches with positions
 */
export const findImageUrlsAndPathsInText = (
  text: string,
  offset: number = 0,
): UrlMatch[] => {
  const matches: UrlMatch[] = [];
  const processedRanges: Array<{ from: number; to: number }> = [];

  // Helper to check if a range overlaps with already processed ranges
  const isOverlapping = (start: number, end: number): boolean => {
    return processedRanges.some(
      (range) => start < range.to && end > range.from,
    );
  };

  // 1. Find remote URLs (http/https) with image extensions
  // Stop at whitespace, quotes, brackets, or commas
  const remoteUrlRegex = /https?:\/\/[^\s<>"'(),]+/g;
  let match = remoteUrlRegex.exec(text);
  while (match !== null) {
    const url = match[0];
    const start = match.index;
    const end = start + url.length;

    if (isImageUrl(url) && !isOverlapping(start, end)) {
      matches.push({
        url,
        from: offset + start,
        to: offset + end,
      });
      processedRanges.push({ from: start, to: end });
    }
    match = remoteUrlRegex.exec(text);
  }

  // 2. Find relative paths (./... or ../...) with image extensions
  // Stop at whitespace, quotes, brackets, or commas
  const relativePathRegex = /\.\.?\/[^\s<>"'(),]+/g;
  match = relativePathRegex.exec(text);
  while (match !== null) {
    const path = match[0];
    const start = match.index;
    const end = start + path.length;

    if (isImageUrl(path) && !isOverlapping(start, end)) {
      matches.push({
        url: path,
        from: offset + start,
        to: offset + end,
      });
      processedRanges.push({ from: start, to: end });
    }
    match = relativePathRegex.exec(text);
  }

  // 3. Find absolute paths (/...) with image extensions
  // Must start with / but not // (to avoid matching URLs)
  // Stop at whitespace, quotes, brackets, or commas
  const absolutePathRegex = /\/(?!\/)[^\s<>"'(),]+/g;
  match = absolutePathRegex.exec(text);
  while (match !== null) {
    const path = match[0];
    const start = match.index;
    const end = start + path.length;

    if (isImageUrl(path) && !isOverlapping(start, end)) {
      matches.push({
        url: path,
        from: offset + start,
        to: offset + end,
      });
      processedRanges.push({ from: start, to: end });
    }
    match = absolutePathRegex.exec(text);
  }

  return matches;
};
