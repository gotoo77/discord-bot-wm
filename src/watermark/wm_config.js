export function wmConfigFromEnv() {
  const enabled = (process.env.ENABLE_WATERMARK || 'false').toLowerCase() === 'true';
  const mode = (process.env.WATERMARK_MODE || 'auto').toLowerCase(); // auto | manual
  const channelIds = (process.env.WATERMARK_CHANNEL_IDS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return {
    enabled,
    mode,
    channelIds: new Set(channelIds),
    opacity: Number(process.env.WATERMARK_OPACITY || 0.35),
    scale: Number(process.env.WATERMARK_SCALE || 0.18),
    margin: Number(process.env.WATERMARK_MARGIN || 24),
    position: (process.env.WATERMARK_POSITION || 'southeast').toLowerCase(),
  };
}
