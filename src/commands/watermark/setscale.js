import '../../logger.js';
import { updateEnvValue } from './wm_config_util.js';

export default {
  name: 'setscale',
  description: 'Définit l’échelle du watermark (0.05 à 1.0)',
  options: [
    {
      type: 10, // Number
      name: 'value',
      description: 'Échelle entre 0.05 et 1.0',
      required: true,
    },
  ],
  async execute(interaction, state) {
    const value = interaction.options.getNumber('value', true);
    if (Number.isNaN(value) || value < 0.05 || value > 1) {
      await interaction.reply({ content: '❌ Échelle invalide. Valeur attendue: 0.05 à 1.0.', ephemeral: true });
      return;
    }

    state.wm.scale = value;
    await updateEnvValue('WATERMARK_SCALE', value);
    LOGI(`setscale value=${value}`);

    await interaction.reply({ content: `✅ Échelle mise à ${value}`, ephemeral: true });
  },
};
