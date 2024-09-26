import { REST, Routes, Command, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import fs from "fs";

export default async function () {
  const token = process.env.TOKEN;

  const clientId = process.env.CLIENT_ID as string;

  const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  const guildCommands: Record<string, RESTPostAPIApplicationCommandsJSONBody[]> = {};
  const commandFiles = fs.readdirSync(__dirname + "/commands").filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command: Command = await import(__dirname + `/commands/${file}`);
    console.log(JSON.stringify(command));
    if (command.help.data && !command?.help?.guildId) {
      globalCommands.push(command.help?.data?.toJSON());
    } else if (command.help.data && command.help.guildId) {
      if (!guildCommands[command.help.guildId]) guildCommands[command.help.guildId] = [];
      guildCommands[command.help.guildId].push(command?.help?.data?.toJSON());
    }
  }

  const rest = new REST({ version: "10" }).setToken(token as string);
  
  rest.put(Routes.applicationCommands(clientId), { body: globalCommands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);

  for (const guildCommand of Object.keys(guildCommands)) {
    rest.put(Routes.applicationGuildCommands(clientId, guildCommand), { body: guildCommands[guildCommand as keyof typeof guildCommands] })
      .then(() => console.log("Successfully registered commands for " + guildCommand))
      .catch(console.error);
  }
}