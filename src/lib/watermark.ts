/**
 * Watermark utility for applying watermarks to images
 */

export const applyWatermark = (imageUrl: string): string => {
  // For now, return the original URL
  // This should be implemented to add watermark overlay
  // Either through CSS overlay or image processing
  return imageUrl;
};

export const getWatermarkedThumbnail = (originalUrl: string): string => {
  // Apply watermark to thumbnail URLs
  return applyWatermark(originalUrl);
};

/**
 * CSS class for watermark overlay
 */
export const watermarkOverlayCss = `
  .watermarked-image {
    position: relative;
  }
  
  .watermarked-image::before {
    content: "SozaiLocker";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 24px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.6);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    z-index: 1;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;