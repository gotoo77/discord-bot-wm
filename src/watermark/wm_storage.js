import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve('data');
const LOGO_DIR = path.join(DATA_DIR, 'logos');

export async function ensureDataDirs() {
  await fs.mkdir(LOGO_DIR, { recursive: true });
}

export function userLogoPath(userId) {
  return path.join(LOGO_DIR, `${userId}.png`);
}

export async function saveUserLogoPng(userId, pngBuffer) {
  await ensureDataDirs();
  await fs.writeFile(userLogoPath(userId), pngBuffer);
}

export async function loadUserLogoPng(userId) {
  try {
    return await fs.readFile(userLogoPath(userId));
  } catch {
    return null;
  }
}
