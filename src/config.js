import 'dotenv/config';

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.GUILD_ID,
  } 
};

export function assertConfig() {
  const missing = [];
  if (!config.discord.token) missing.push('DISCORD_TOKEN');
  if (!config.discord.clientId) missing.push('DISCORD_CLIENT_ID');
  if (!config.discord.guildId) missing.push('GUILD_ID');

  if (missing.length) {
    throw new Error(
      `Configuration incomplète: ${missing.join(', ')}. Copie .env.example en .env et renseigne les valeurs.`
    );
  }
}
