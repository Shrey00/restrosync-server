export function generateImagePaths(images: Express.Multer.File[]) {
  const imagePaths = images?.map((file) => {
    return `${
      process.env.NODE_ENV === "production"
        ? process.env.PUBLIC_URL
        : "http://localhost:4000"
    }/assets/menu/${file.filename}`;
  });
  return imagePaths;
}
  