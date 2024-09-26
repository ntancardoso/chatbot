import { CommandHelp, CommandRun, SlashCommandBuilder } from "discord.js";


export const run: CommandRun = async (client, interaction) => {
  const user = interaction.options.get("target")?.user;

  if (user) {
    const { username, id } = user;

    const infoStr = `
      **Username:** ${username}
      **ID:** ${id}
    `;
    await interaction.reply(infoStr);
  } else {
    await interaction.reply("User not found");
  }
};

export const help: CommandHelp = {
  allowedPerms: ["MEMBER"],
  allowedRoles: [],
  allowedUsers: [],
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("View information on a user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The target to view information on.")
        .setRequired(true)
    ) as SlashCommandBuilder,
};