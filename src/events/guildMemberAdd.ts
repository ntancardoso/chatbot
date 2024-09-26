import { Colors, EmbedBuilder, EventRun, GuildMember } from "discord.js";

export const name = "guildMemberAdd";

export const run: EventRun = async (bot, member: GuildMember) => {
  const welcomeEmbed = new EmbedBuilder()
    .setTitle("Welcome to the server!")
    .setDescription(`Welcome to the server, ${member.user.username}!`)
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(Colors.Green);

  bot.welcomeChannel.send({ content: member.toString(), embeds: [welcomeEmbed] });
};