import type { Collection, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, PermissionFlagsBits, ActionRowBuilder, MessageActionRowComponentBuilder, Webhook } from "discord.js";
import type { MongoClient } from "mongodb";


declare module "discord.js" {
  export type CommandHelp = {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
    guildId?: string,
    allowedPerms: PermissionFlagsBits[],
    allowedRoles: string[],
    allowedUsers: string[],
  }

  export type CommandRun = (client: Client, interaction: ChatInputCommandInteraction) => Promise<unknown>;

  export type InteractionRun<T> = (client: Client, interaction: T) => void;
  export type InteractionHelp = {
    name: string;
    desc: string;
  }
  export type InteractionHandler = {
    run: InteractionRun<T>,
    help: InteractionHelp
  }

  export interface Client {
    commands: Collection<string, Command>
    interactions: Collection<string, InteractionHandler>,
    db: MongoClient,
    // Task 4: Add a definition for the embed function
    embed: (sendTo: TextChannel, embed: MessageEmbed) => Promise<MessageEmbed>,
    logChannel: TextChannel,
    welcomeChannel: TextChannel,
    suggestionChannel: TextChannel,
  }

  export interface Command {
    run: CommandRun,
    help: CommandHelp
  }

  export type EventRun = (client: Client, ...args) => void;

  export interface DiscordEvent {
    name: string,
    run: EventRun
  }
}