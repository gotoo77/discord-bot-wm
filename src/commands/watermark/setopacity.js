import '../../logger.js';
import { updateEnvValue } from './wm_config_util.js';

export default {
  name: 'setopacity',
  description: 'Définit l’opacité du watermark (0.0 à 1.0)',
  options: [
    {
      type: 10, // Number
      name: 'value',
      description: 'Opacité entre 0.0 et 1.0',
      required: true,
    },
  ],
  async execute(interaction, state) {
    const value = interaction.options.getNumber('value', true);
    if (Number.isNaN(value) || value < 0 || value > 1) {
      await interaction.reply({ content: '❌ Opacité invalide. Valeur attendue: 0.0 à 1.0.', ephemeral: true });
      return;
    }

    state.wm.opacity = value;
    await updateEnvValue('WATERMARK_OPACITY', value);
    LOGI(`setopacity value=${value}`);

    await interaction.reply({ content: `✅ Opacité mise à ${value}`, ephemeral: true });
  },
};
