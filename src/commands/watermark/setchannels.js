import '../../logger.js';
import { updateEnvValue } from './wm_config_util.js';

function parseIds(input) {
  return input
    .split(/[,\s]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function isSnowflake(id) {
  return /^\d{17,20}$/.test(id);
}

export default {
  name: 'setchannels',
  description: 'Définit les IDs de salons autorisés (liste séparée par virgule)',
  options: [
    {
      type: 3, // String
      name: 'ids',
      description: 'IDs séparés par virgule ou espace',
      required: true,
    },
  ],
  async execute(interaction, state) {
    const raw = interaction.options.getString('ids', true);
    const ids = parseIds(raw);
    const invalid = ids.filter(id => !isSnowflake(id));

    if (!ids.length || invalid.length) {
      await interaction.reply({
        content: `❌ IDs invalides: ${invalid.join(', ') || '(aucun)'}`,
        ephemeral: true,
      });
      return;
    }

    state.wm.channelIds = new Set(ids);
    await updateEnvValue('WATERMARK_CHANNEL_IDS', ids.join(','));
    LOGI(`setchannels ids=${ids.join(',')}`);

    await interaction.reply({
      content: `✅ Salons autorisés mis à: ${ids.join(', ')}`,
      ephemeral: true,
    });
  },
};
