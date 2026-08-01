const allowedImageMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

export const isAllowedImageMimeType = (mimeType: string) => {
    return allowedImageMimeTypes.has(mimeType);
};
