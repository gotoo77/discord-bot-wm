import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function updateEnvValue(key, value) {
  let text = '';
  try {
    text = await readFile(envPath, 'utf8');
  } catch {
    text = '';
  }

  const lines = text.split(/\r?\n/);
  const re = new RegExp(`^\\s*${escapeRegExp(key)}\\s*=`);
  let found = false;

  const updated = lines.map((line) => {
    if (line.trim().startsWith('#')) return line;
    if (re.test(line)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });

  if (!found) {
    if (updated.length && updated[updated.length - 1] !== '') updated.push('');
    updated.push(`${key}=${value}`);
  }

  await writeFile(envPath, updated.join('\n'), 'utf8');
}

export function formatWmConfig(state) {
  return [
    `enabled: ${state.wm.enabled}`,
    `mode: ${state.wm.mode}`,
    `channels: ${[...state.wm.channelIds].join(', ') || '(none)'}`,
    `opacity: ${state.wm.opacity}`,
    `scale: ${state.wm.scale}`,
    `margin: ${state.wm.margin}`,
    `position: ${state.wm.position}`,
  ].join('\n');
}
