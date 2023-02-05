export const validateFile = (file: any): boolean => {
  // convert bytes to megabytes
  const fileSizeMb = file.size / 1000000;

  // check if file size is less than 50 MB
  return fileSizeMb <= 50;
};
