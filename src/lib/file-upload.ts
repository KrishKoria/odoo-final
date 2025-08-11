/**
 * Utility functions for handling file uploads locally
 */

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Convert a File object to a data URL for local storage/preview
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Save file to localStorage with a unique key
 * In a real app, you'd upload to a cloud storage service
 */
export async function uploadFileLocally(file: File): Promise<UploadedFile> {
  try {
    const dataUrl = await fileToDataUrl(file);
    const fileId = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store the file data in localStorage
    const fileData = {
      url: dataUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    localStorage.setItem(`file_${fileId}`, JSON.stringify(fileData));

    return {
      url: dataUrl, // Return the data URL directly for local usage
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file");
  }
}

/**
 * Validate file before upload
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Please upload a JPEG, PNG, or WebP image",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size must be less than 5MB",
    };
  }

  return { isValid: true };
}

/**
 * Get a stored file from localStorage
 */
export function getStoredFile(fileId: string): UploadedFile | null {
  try {
    const stored = localStorage.getItem(`file_${fileId}`);
    if (!stored) return null;

    const fileData = JSON.parse(stored) as {
      url: string;
      name: string;
      size: number;
      type: string;
      uploadedAt: string;
    };

    return {
      url: fileData.url,
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
    };
  } catch {
    return null;
  }
}

/**
 * Remove a file from localStorage
 */
export function removeStoredFile(fileId: string): void {
  localStorage.removeItem(`file_${fileId}`);
}
