import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1, // Compress to 1MB
    maxWidthOrHeight: 1920, // Maximum dimensions
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error; // Re-throw for handling in the calling function
  }
};
