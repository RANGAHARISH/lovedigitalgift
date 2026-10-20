import QRCode from "qrcode";

export type QrShape = "heart" | "square";

export type QrStyle = {
  shape: QrShape;
  fg: string;
  bg: string;
  logo?: boolean;
};

export const DEFAULT_QR_STYLE: QrStyle = {
  shape: "heart",
  // Deep enough to keep a >4.5:1 contrast ratio against white, which phone
  // scanners need. The hero brand pink (#D7263D) is available as a preset but
  // triggers a contrast warning.
  fg: "#A4122A",
  bg: "#FFFFFF",
  logo: true,
};

function channelLuminance(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string) {
  const safe = safeColor(hex, "#000000").slice(1);
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrastRatio(foreground: string, background: string) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string, fallback: string) {
  return HEX.test(value) ? value : fallback;
}

/** A heart centred on (cx, cy); r is roughly half its width. */
function heartPath(cx: number, cy: number, r: number) {
  return [
    `M ${cx.toFixed(2)} ${(cy + r * 0.9).toFixed(2)}`,
    `C ${(cx - r * 1.5).toFixed(2)} ${(cy - r * 0.15).toFixed(2)} ${(cx - r * 0.62).toFixed(2)} ${(cy - r * 1.02).toFixed(2)} ${cx.toFixed(2)} ${(cy - r * 0.34).toFixed(2)}`,
    `C ${(cx + r * 0.62).toFixed(2)} ${(cy - r * 1.02).toFixed(2)} ${(cx + r * 1.5).toFixed(2)} ${(cy - r * 0.15).toFixed(2)} ${cx.toFixed(2)} ${(cy + r * 0.9).toFixed(2)}`,
    "Z",
  ].join(" ");
}

export type QrBuild = { svg: string; moduleCount: number };

/**
 * Builds a QR code as an SVG string. Data modules are drawn as hearts or
 * rounded squares; the three finder "eyes" stay square-ish so scanners lock on.
 */
export function buildQrSvg(text: string, style: QrStyle, pixelSize = 1024): QrBuild {
  const fg = safeColor(style.fg, "#D7263D");
  const bg = safeColor(style.bg, "#FFFFFF");

  const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
  const count = qr.modules.size;
  const data = qr.modules.data;
  const margin = 4;
  const total = count + margin * 2;
  const unit = pixelSize / total;

  const isFinder = (row: number, col: number) => {
    const topLeft = row <= 6 && col <= 6;
    const topRight = row <= 6 && col >= count - 7;
    const bottomLeft = row >= count - 7 && col <= 6;
    return topLeft || topRight || bottomLeft;
  };

  const modules: string[] = [];

  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!data[row * count + col]) continue;
      if (isFinder(row, col)) continue;

      const x = (col + margin) * unit;
      const y = (row + margin) * unit;

      if (style.shape === "heart") {
        // Soft, nearly-round dots. True heart silhouettes leave too much of the
        // module light for reliable scanning, so the heart lives in the centre
        // logo (and the rounded, romantic styling) instead.
        modules.push(
          `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(unit * 1.02).toFixed(2)}" height="${(unit * 1.02).toFixed(
            2,
          )}" rx="${(unit * 0.46).toFixed(2)}"/>`,
        );
      } else {
        modules.push(
          `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(unit * 1.02).toFixed(2)}" height="${(unit * 1.02).toFixed(
            2,
          )}" rx="${(unit * 0.12).toFixed(2)}"/>`,
        );
      }
    }
  }

  const eyes: string[] = [];
  const eye = (x: number, y: number) => {
    const seven = unit * 7;
    const five = unit * 5;
    const three = unit * 3;
    eyes.push(
      `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${seven.toFixed(2)}" height="${seven.toFixed(
        2,
      )}" rx="${(unit * 1.5).toFixed(2)}" fill="${fg}"/>`,
    );
    eyes.push(
      `<rect x="${(x + unit).toFixed(2)}" y="${(y + unit).toFixed(2)}" width="${five.toFixed(2)}" height="${five.toFixed(
        2,
      )}" rx="${(unit * 1.05).toFixed(2)}" fill="${bg}"/>`,
    );
    eyes.push(
      `<rect x="${(x + unit * 2).toFixed(2)}" y="${(y + unit * 2).toFixed(2)}" width="${three.toFixed(
        2,
      )}" height="${three.toFixed(2)}" rx="${(unit * 0.6).toFixed(2)}" fill="${fg}"/>`,
    );
  };

  eye(margin * unit, margin * unit);
  eye((margin + count - 7) * unit, margin * unit);
  eye(margin * unit, (margin + count - 7) * unit);

  let logo = "";
  if (style.logo) {
    const centre = pixelSize / 2;
    const radius = pixelSize * 0.115;
    logo = [
      `<circle cx="${centre}" cy="${centre}" r="${(radius * 1.18).toFixed(2)}" fill="${bg}"/>`,
      `<path d="${heartPath(centre, centre, radius * 0.62)}" fill="${fg}"/>`,
    ].join("");
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${pixelSize} ${pixelSize}">`,
    `<rect width="${pixelSize}" height="${pixelSize}" fill="${bg}"/>`,
    `<g fill="${fg}">${modules.join("")}</g>`,
    eyes.join(""),
    logo,
    "</svg>",
  ].join("");

  return { svg, moduleCount: count };
}

export function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadQrPng(svg: string, filename: string, size = 1200) {
  const image = new Image();
  const dataUrl = svgToDataUrl(svg);
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not render the QR image"));
    image.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser");
  context.drawImage(image, 0, 0, size, size);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not create the PNG");
  downloadBlob(blob, filename);
}

export function downloadQrSvg(svg: string, filename: string) {
  downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), filename);
}
