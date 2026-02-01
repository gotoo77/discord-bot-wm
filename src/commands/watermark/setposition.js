import '../../logger.js';
import { updateEnvValue } from './wm_config_util.js';

const POSITIONS = ['northwest', 'northeast', 'southwest', 'southeast', 'center'];

export default {
  name: 'setposition',
  description: 'Définit la position du watermark',
  options: [
    {
      type: 3, // String
      name: 'value',
      description: 'northwest | northeast | southwest | southeast | center',
      required: true,
      choices: POSITIONS.map(p => ({ name: p, value: p })),
    },
  ],
  async execute(interaction, state) {
    const value = interaction.options.getString('value', true).toLowerCase();
    if (!POSITIONS.includes(value)) {
      await interaction.reply({ content: '❌ Position invalide.', ephemeral: true });
      return;
    }

    state.wm.position = value;
    await updateEnvValue('WATERMARK_POSITION', value);
    LOGI(`setposition value=${value}`);

    await interaction.reply({ content: `✅ Position mise à ${value}`, ephemeral: true });
  },
};
