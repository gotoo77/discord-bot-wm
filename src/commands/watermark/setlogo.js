import sharp from 'sharp';
import '../../logger.js';
import { saveUserLogoPng } from '../../watermark/wm_storage.js';

export default {
  name: 'setlogo',
  description: 'Définit ton logo perso (PNG/JPG/WebP) pour watermark',
  options: [
    {
      type: 11, // Attachment
      name: 'logo',
      description: 'Fichier image (logo)',
      required: true,
    }
  ],
  async execute(interaction) {
    const att = interaction.options.getAttachment('logo', true);

    const res = await fetch(att.url);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    const png = await sharp(buf)
      .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    await saveUserLogoPng(interaction.user.id, png);
    LOGI(`setlogo user=${interaction.user.id} bytes=${png.length}`);

    await interaction.reply({ content: '✅ Logo enregistré. Poste des images dans le salon watermark pour obtenir la version watermarkée.', ephemeral: true });
  },
};
