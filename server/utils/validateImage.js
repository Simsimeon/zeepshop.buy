const { BadRequestError } = require("../errors");

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const BASE64_DATA_URL = /^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/]+={0,2})$/i;
const REMOTE_URL = /^https?:\/\/\S+$/i;

function matchesBytes(buffer, bytes, offset = 0) {
  if (!buffer || buffer.length < offset + bytes.length) return false;
  return bytes.every((byte, index) => buffer[offset + index] === byte);
}

function matchesAscii(buffer, text, offset = 0) {
  if (!buffer || buffer.length < offset + text.length) return false;
  return buffer.subarray(offset, offset + text.length).toString("ascii") === text;
}

const IMAGE_TYPES = [
  {
    extension: "jpg",
    mime: "image/jpeg",
    detect: (buffer) => matchesBytes(buffer, [0xff, 0xd8, 0xff]),
  },
  {
    extension: "png",
    mime: "image/png",
    detect: (buffer) =>
      matchesBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  {
    extension: "gif",
    mime: "image/gif",
    detect: (buffer) => matchesAscii(buffer, "GIF87a") || matchesAscii(buffer, "GIF89a"),
  },
  {
    extension: "webp",
    mime: "image/webp",
    detect: (buffer) => matchesAscii(buffer, "RIFF") && matchesAscii(buffer, "WEBP", 8),
  },
  {
    extension: "bmp",
    mime: "image/bmp",
    detect: (buffer) => matchesAscii(buffer, "BM"),
  },
  {
    extension: "tiff",
    mime: "image/tiff",
    detect: (buffer) =>
      matchesBytes(buffer, [0x49, 0x49, 0x2a, 0x00]) ||
      matchesBytes(buffer, [0x4d, 0x4d, 0x00, 0x2a]),
  },
];

const MIME_ALIASES = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
  "image/x-ms-bmp": "image/bmp",
};

function detectImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  return IMAGE_TYPES.find((type) => type.detect(buffer)) || null;
}

function normalizeMime(mime) {
  if (!mime) return null;
  const lowerMime = mime.toLowerCase().trim();
  return MIME_ALIASES[lowerMime] || lowerMime;
}

function assertRealImage(buffer, declaredMime, maxBytes) {
  if (!buffer || buffer.length === 0) {
    throw new BadRequestError("The provided image is empty");
  }

  if (buffer.length > maxBytes) {
    throw new BadRequestError(
      `Image is too large. Maximum allowed size is ${Math.floor(maxBytes / (1024 * 1024))}MB`
    );
  }

  const detected = detectImageType(buffer);

  if (!detected) {
    throw new BadRequestError(
      "The provided file is not a valid image. Allowed formats: JPEG, PNG, GIF, WebP, BMP, TIFF"
    );
  }

  const expectedMime = normalizeMime(declaredMime);

  if (expectedMime && expectedMime !== detected.mime) {
    throw new BadRequestError(
      `Image content does not match the declared type (${declaredMime})`
    );
  }

  return {
    mime: detected.mime,
    extension: detected.extension,
    sizeInBytes: buffer.length,
  };
}

async function validateRemoteImage(url, maxBytes) {
  let response;

  try {
    response = await fetch(url, { method: "GET", redirect: "follow" });
  } catch (error) {
    throw new BadRequestError("Unable to reach the provided image URL");
  }

  if (!response.ok) {
    throw new BadRequestError(`Image URL responded with status ${response.status}`);
  }

  const contentType = normalizeMime(
    (response.headers.get("content-type") || "").split(";")[0]
  );

  if (!contentType || !contentType.startsWith("image/")) {
    throw new BadRequestError("The provided URL does not point to an image");
  }

  const contentLength = Number(response.headers.get("content-length") || 0);

  if (contentLength && contentLength > maxBytes) {
    throw new BadRequestError(
      `Image is too large. Maximum allowed size is ${Math.floor(maxBytes / (1024 * 1024))}MB`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  return assertRealImage(buffer, contentType, maxBytes);
}

async function validateImageInput(image, maxBytes = MAX_IMAGE_BYTES) {
  if (typeof image !== "string" || !image.trim()) {
    throw new BadRequestError("Image is required and must be a string");
  }

  const value = image.trim();
  const dataUrlMatch = value.match(BASE64_DATA_URL);

  if (dataUrlMatch) {
    const [, declaredMime, base64Payload] = dataUrlMatch;
    const buffer = Buffer.from(base64Payload, "base64");

    return {
      image: value,
      ...assertRealImage(buffer, declaredMime, maxBytes),
    };
  }

  if (value.startsWith("data:")) {
    throw new BadRequestError("Only base64 encoded image data URLs are supported");
  }

  if (REMOTE_URL.test(value)) {
    return {
      image: value,
      ...(await validateRemoteImage(value, maxBytes)),
    };
  }

  throw new BadRequestError(
    "Image must be an http(s) URL or a base64 encoded image data URL"
  );
}

module.exports = {
  MAX_IMAGE_BYTES,
  detectImageType,
  validateImageInput,
};
