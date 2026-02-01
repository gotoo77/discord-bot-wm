import PQueue from 'p-queue';
import '../logger.js';
import { loadUserLogoPng } from './wm_storage.js';
import { applyLogoWatermark } from './wm_image.js';

const queue = new PQueue({ concurrency: 2 });

const SUPPORTED = new Set(['image/jpeg', 'image/png', 'image/webp']); // GIF ignoré

export function installAutoWatermark(client, state) {
  client.on('messageCreate', async (message) => {
    try {
      LOGD(`WM msgCreate id=${message.id} author=${message.author?.id} bot=${message.author?.bot}`);
      if (!state.wm?.enabled || state.wm.mode !== 'auto') return;
      if (message.author.bot) return;

      const channelId = message.channelId;
      const isThread = typeof message.channel?.isThread === 'function' && message.channel.isThread();
      const parentId = isThread ? message.channel.parentId : null;

      const allowed =
        state.wm.channelIds.has(channelId) ||
        (parentId && state.wm.channelIds.has(parentId));

      LOGD(
        `WM check channel=${channelId} parent=${parentId || 'none'} allowed=${allowed} channels=[${[
          ...state.wm.channelIds,
        ].join(',')}]`
      );
      if (!allowed) return;
      if (!message.attachments?.size) return;

      const logo = await loadUserLogoPng(message.author.id);
      if (!logo) {
        await message.reply('⚠️ Pas de logo défini. Utilise `/setlogo` pour enregistrer ton logo perso.');
        return;
      }

      for (const att of message.attachments.values()) {
        const ctype = att.contentType || '';
        LOGD(`WM attachment name=${att.name} type=${ctype || 'none'} size=${att.size}`);
        if (!SUPPORTED.has(ctype)) continue;

        queue.add(async () => {
          LOGI(`WM auto user=${message.author.id} file=${att.name} bytes=${att.size}`);

          const res = await fetch(att.url);
          if (!res.ok) throw new Error(`Download failed: ${res.status}`);
          const input = Buffer.from(await res.arrayBuffer());

          const output = await applyLogoWatermark(input, logo, state.wm);

          await message.reply({
            files: [{ attachment: output, name: `wm_${att.name || 'image'}` }],
          });
        });
      }
    } catch (e) {
      LOGE(`WM auto failed: ${e?.stack ?? e}`);
    }
  });
}
