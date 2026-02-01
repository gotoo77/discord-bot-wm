import { REST, Routes } from 'discord.js';
import { commandList } from './commands/index.js';
import { config, assertConfig } from './config.js';
import './logger.js';

assertConfig();

const rest = new REST({ version: '10' }).setToken(config.discord.token);

const body = commandList.map(c => ({
  name: c.name,
  description: c.description,
  options: c.options || [],
}));

try {
  await rest.put(
    Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
    { body }
  );
  LOGI('Slash commands registered (guild)');
} catch (e) {
  LOGE(`Failed to register commands: ${e?.stack ?? e}`);
  process.exitCode = 1;
}
