import { Colors, CommandHelp, CommandRun, EmbedBuilder, SlashCommandBuilder } from "discord.js";



export const run: CommandRun = async (client, interaction) => {
  const suggestion = interaction.options.get("suggestion", true).value as string; // Get the information provided.

  // Create an embed
  const embed = new EmbedBuilder()
  .setTitle("New Suggestion")
  .setDescription(suggestion)
  .setColor(Colors.White)
  .setTimestamp();

  // Send it to the new suggestion channel
  client.embed(client.suggestionChannel, embed);

  await interaction.reply({
    content: "Suggestion sent!"
  });
};

export const help: CommandHelp = {
  allowedPerms: ["MEMBER"],
  allowedRoles: [],
  allowedUsers: [],
  data: new SlashCommandBuilder()
    .setName("suggest").setDescription("Suggest something for the server or bot!").addStringOption(option => option.setName("suggestion").setDescription("The suggestion.").setRequired(true)) as SlashCommandBuilder,
};