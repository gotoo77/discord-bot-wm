import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config, assertConfig } from './config.js';
import './logger.js';

import { commandList } from './commands/index.js';
 
// Watermark
import { wmConfigFromEnv } from './watermark/wm_config.js';
import { installAutoWatermark } from './watermark/wm_auto.js';
import { ensureDataDirs } from './watermark/wm_storage.js';

assertConfig();
await ensureDataDirs();

const state = {
  shoukaku: null,
  wm: wmConfigFromEnv(),
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
for (const c of commandList) client.commands.set(c.name, c);

installAutoWatermark(client, state);

client.once('clientReady', async () => {
  LOGI(`Logged in as ${client.user.tag}`);
  LOGD(`Watermark ${state.wm.enabled ? 'enabled' : 'disabled'} (mode=${state.wm.mode}).`);
  LOGI('Bot ready.');
  LOGW('Si tu n’as pas encore enregistré les commandes slash: npm run register');
});

client.on('messageCreate', (message) => {
  LOGD(
    `MSG create id=${message.id} guild=${message.guildId} channel=${message.channelId} ` +
      `author=${message.author?.id} bot=${message.author?.bot} attachments=${message.attachments?.size || 0}`
  );
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user, guildId, channelId } = interaction;
  LOGI(`CMD /${commandName} by ${user.username} (${user.id}) guild=${guildId} channel=${channelId}`);

  const cmd = client.commands.get(commandName);
  if (!cmd) {
    LOGW(`Unknown command: ${commandName}`);
    return;
  }

  try {
    await cmd.execute(interaction, state);
    LOGI(`CMD /${commandName} executed successfully`);
  } catch (e) {
    LOGE(`CMD /${commandName} failed: ${e?.stack ?? e}`);
    const payload = { content: '❌ Erreur côté bot.', ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(payload);
    else await interaction.reply(payload);
  }
});

client.login(config.discord.token);
