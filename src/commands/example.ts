import { CommandHelp, CommandRun, SlashCommandBuilder } from "discord.js";


export const run: CommandRun = async (client, interaction) => {
  await interaction.reply({
    content: "This is an example command."
  });
};

export const help: CommandHelp = {
  allowedPerms: ["MEMBER"],
  allowedRoles: [],
  allowedUsers: [],
  data: new SlashCommandBuilder().setName("example").setDescription("Example command.")
};