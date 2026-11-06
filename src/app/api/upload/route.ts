import { adminRoute, ApiError, json } from "@/lib/api";
import { detectImageType, isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";
import { isPexelsConfigured } from "@/lib/pexels";

const MAX_BYTES = 5 * 1024 * 1024;

/** Tells the admin image field which sources are available. */
export const GET = adminRoute(async () =>
  json({ uploads: isCloudinaryConfigured(), pexels: isPexelsConfigured() }),
);

export const POST = adminRoute(async (request) => {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      503,
      "Image uploads are not set up yet. Add your Cloudinary keys to the environment variables.",
    );
  }

  // Multipart overhead is small, so this rejects oversized bodies before they are read.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 1024 * 64) {
    throw new ApiError(413, "Images must be 5 MB or smaller.");
  }

  const form = await request.formData().catch(() => {
    throw new ApiError(400, "Send the image as multipart form data.");
  });
  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "Choose an image to upload.");
  if (file.size > MAX_BYTES) throw new ApiError(413, "Images must be 5 MB or smaller.");

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!detectImageType(buffer)) {
    throw new ApiError(415, "Use a JPG, PNG, WebP, GIF or ICO image.");
  }

  const url = await uploadImage(buffer, "techpro").catch((error: unknown) => {
    console.error("[upload]", error);
    throw new ApiError(502, "The image host rejected the upload. Please try again.");
  });
  return json({ url }, 201);
});
