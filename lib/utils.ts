/**
 * Convert Google Drive view/share URL to direct thumbnail URL
 * @param url - Google Drive URL in format: https://drive.google.com/file/d/FILE_ID/view?usp=...
 * @returns Direct thumbnail URL or original URL if not a Google Drive link
 */
export function getGoogleDriveThumbnail(url: string, size: string = 'w640'): string {
  if (!url) return url

  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com/file/d/')) {
    // Extract file ID from URL
    const match = url.match(/\/file\/d\/([^\/\?]+)/)
    if (match && match[1]) {
      const fileId = match[1]
      return `https://drive.google.com/thumbnail?sz=${size}&id=${fileId}`
    }
  }

  // If already a thumbnail URL or not a Google Drive URL, return as is
  return url
}
