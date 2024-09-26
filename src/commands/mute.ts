import { CommandHelp, CommandRun, SlashCommandBuilder, GuildMember } from "discord.js";
import { ModLog } from "../definitions/types";

// Parse “6h,” “30m” etc. to milliseconds
function parseTime(time: string) {
  console.log(`time ${time}`)
  const unit = time.slice(-1);
  const amount = parseInt(time.slice(0, -1));

  switch (unit) {
    case "s": // Seconds
      return amount * 1000;
    case "m": // Minutes
      return amount * 1000 * 60;
    case "h": // Hours
      return amount * 1000 * 60 * 60;
    default:
      return null;
  }
}

const sixHours = 1000 * 60 * 60 * 6; // 6 hours in milliseconds

export const run: CommandRun = async (client, interaction) => {
  // Obtain arguments
  const target = interaction.options.get("target")?.member as (GuildMember | null);
  const time = parseTime(interaction.options.get("time", true).value as string);
  const reason = interaction.options.get("reason", false)?.value;

  console.log(`target ${target} time ${time}`)
  // Validate everything exists and meets requirements. 
  // Some of these could be merged into one conditional if you want to provide the same error
  if (!target) {
    return interaction.reply({
      content: "Target could not be found in this server.",
      ephemeral: true
    });
  } else if (!time) {
    return interaction.reply({
      content: "Time provided is undefined.",
      ephemeral: true
    });
  } else if (time > sixHours) {
    return interaction.reply({
      content: "Time provided is too long. It can only be up to 6 hours.",
      ephemeral: true
    });
  } else if (time < 1000) {
    return interaction.reply({
      content: "Time provided is too short. It must be at least 1 second.",
      ephemeral: true
    });
  }

  // Create your `modlog` object
  const log: ModLog = {
    type: "mute",
    targetId: target.id,
    moderatorId: interaction.user.id,
    length: time.toString() + "ms",
    reason: reason as string || "No reason provided."
  };

  try {
    // Try to mute the user and save to your database
    target.timeout(time, reason as string || "No reason provided.");
    client.db.db("user-data").collection("infractions").insertOne(log);
  } catch (err) {
    // If an error occurs, log it and reply to the interaction
    console.log(err);
    return interaction.reply({
      content: "An error occurred while muting the user.",
      ephemeral: true
    });
  }
};

export const help: CommandHelp = {
  allowedPerms: ["DEVELOPER"],
  allowedRoles: [],
  allowedUsers: [],
  data: new SlashCommandBuilder()
    .setName("mute").setDescription("Mute a user.")
    .addUserOption(option => option.setName("target").setDescription("The user to mute.").setRequired(true))
    .addStringOption(option => option.setName("time").setDescription("The time to mute the user for.").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for muting the user.").setRequired(false)) as SlashCommandBuilder
};