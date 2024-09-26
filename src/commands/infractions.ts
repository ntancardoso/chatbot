import { APIEmbedField, CommandHelp, CommandRun, EmbedBuilder, SlashCommandBuilder, TextChannel, GuildMember } from "discord.js";
import { ModLog } from "../definitions/types";
import Pagination from "../modules/helpers/pagination"

export const run: CommandRun = async (client, interaction) => {
  await interaction.deferReply({
    ephemeral: true
  });

  const target = interaction.options.get("target", true).member as GuildMember;

  const infractions: ModLog[] = await client.db.db("user-data").collection("infractions").find({ targetId: target.id }).toArray() as unknown as ModLog[];

  if (infractions.length === 0) {
    return interaction.editReply({
      content: "This user has no infractions."
    });
  };

  const pages: EmbedBuilder[] = [];

  // Make a new page for each infraction
  for (const infraction of infractions) {
    const fields: APIEmbedField[] = [
      {
        name: "Type",
        value: infraction.type,
        inline: true
      },
      {
        name: "Moderator",
        value: `<@${infraction.moderatorId}>`,
        inline: true
      },
      {
        name: "Reason",
        value: infraction.reason || "No reason provided.",
        inline: true
      }
    ];

    if (infraction.length) {
      fields.push({
        name: "Length",
        value: infraction.length,
        inline: true
      });
    }

    const page = new EmbedBuilder()
      .setTitle(`Infraction #${infractions.indexOf(infraction) + 1}`)
      .addFields(fields)
      .setColor("Red");

    pages.push(page);
  };

  const pagination = new Pagination(interaction.channel as TextChannel, 0);

  pagination.setPages(pages);
}

export const help: CommandHelp = {
  allowedPerms: ["DEVELOPER"],
  allowedRoles: [],
  allowedUsers: [],
  data: new SlashCommandBuilder()
    .setName("infractions").setDescription("Get a user's infractions.")
    .addUserOption(option => option.setName("target").setDescription("The user to get infractions for.").setRequired(true)) as SlashCommandBuilder
};