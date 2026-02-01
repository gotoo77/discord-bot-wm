import '../../logger.js';
import { formatWmConfig } from './wm_config_util.js';
import { loadUserLogoPng } from '../../watermark/wm_storage.js';

export default {
  name: 'getconfig',
  description: 'Affiche la configuration watermark active',
  options: [
    {
      type: 5, // Boolean
      name: 'ephemeral',
      description: 'Réponse privée (true) ou publique (false)',
      required: false,
    },
  ],
  async execute(interaction, state) {
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
    const logoBuf = await loadUserLogoPng(interaction.user.id);
    const logoLine = logoBuf
      ? `logo: set (${logoBuf.length} bytes)`
      : 'logo: not set';
    const content = '```' + '\n' + formatWmConfig(state) + '\n' + logoLine + '\n' + '```';
    LOGI(`getconfig ephemeral=${ephemeral}`);
    if (logoBuf) {
      await interaction.reply({
        content,
        ephemeral,
        files: [{ attachment: logoBuf, name: 'logo.png' }],
      });
      return;
    }
    await interaction.reply({ content, ephemeral });
  },
};
