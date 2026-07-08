function dataUrlFromBlob(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the file."));
    reader.readAsDataURL(blob);
  });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to open image."));
    };
    image.src = objectUrl;
  });
}

function renameWithExtension(filename: string, extension: string) {
  const base = filename.replace(/\.[^.]+$/, "").trim() || "image";
  return `${base}.${extension}`;
}

export async function optimizeImageForInlineStorage(
  file: File,
  options?: {
    maxSide?: number;
    quality?: number;
    outputType?: "image/jpeg" | "image/webp";
  },
) {
  const image = await loadImage(file);
  const maxSide = options?.maxSide ?? 1600;
  const quality = options?.quality ?? 0.82;
  const outputType = options?.outputType ?? "image/jpeg";
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process the image.");
  }

  context.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, outputType, quality);
  });

  if (!blob) {
    throw new Error("Unable to optimize the image.");
  }

  const dataUrl = await dataUrlFromBlob(blob);
  const extension = outputType === "image/webp" ? "webp" : "jpg";

  return {
    blob,
    dataUrl,
    mimeType: outputType,
    fileName: renameWithExtension(file.name, extension),
  };
}
