import sharp from 'sharp';

export async function applyLogoWatermark(imageBuffer, logoPngBuffer, opts) {
  const img = sharp(imageBuffer, { failOn: 'none' });
  const meta = await img.metadata();

  if (!meta.width || !meta.height) {
    throw new Error('Image metadata missing (width/height)');
  }

  const targetLogoWidth = Math.max(64, Math.floor(meta.width * opts.scale));

  const logo = await sharp(logoPngBuffer)
    .resize({ width: targetLogoWidth, withoutEnlargement: true })
    .ensureAlpha()
    .toBuffer();

  const logoWithOpacity = await sharp(logo)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = Math.round(data[i + 3] * opts.opacity);
      }
      return sharp(data, { raw: info }).png().toBuffer();
    });

  const logoMeta = await sharp(logoWithOpacity).metadata();
  const lw = logoMeta.width || targetLogoWidth;
  const lh = logoMeta.height || targetLogoWidth;

  const { left, top } = computePlacement(meta.width, meta.height, lw, lh, opts.margin, opts.position);

  return await img
    .composite([{ input: logoWithOpacity, left, top }])
    .toBuffer();
}

function computePlacement(W, H, w, h, m, pos) {
  switch (pos) {
    case 'northwest': return { left: m, top: m };
    case 'northeast': return { left: W - w - m, top: m };
    case 'southwest': return { left: m, top: H - h - m };
    case 'center':    return { left: Math.floor((W - w) / 2), top: Math.floor((H - h) / 2) };
    case 'southeast':
    default:          return { left: W - w - m, top: H - h - m };
  }
}
