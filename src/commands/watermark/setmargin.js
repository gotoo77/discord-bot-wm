import '../../logger.js';
import { updateEnvValue } from './wm_config_util.js';

export default {
  name: 'setmargin',
  description: 'Définit la marge du watermark (en pixels)',
  options: [
    {
      type: 4, // Integer
      name: 'value',
      description: 'Marge (>= 0)',
      required: true,
    },
  ],
  async execute(interaction, state) {
    const value = interaction.options.getInteger('value', true);
    if (!Number.isInteger(value) || value < 0 || value > 2000) {
      await interaction.reply({ content: '❌ Marge invalide. Valeur attendue: 0 à 2000.', ephemeral: true });
      return;
    }

    state.wm.margin = value;
    await updateEnvValue('WATERMARK_MARGIN', value);
    LOGI(`setmargin value=${value}`);

    await interaction.reply({ content: `✅ Marge mise à ${value}px`, ephemeral: true });
  },
};
