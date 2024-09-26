import { EventRun, TextChannel } from "discord.js";
import { MongoClient } from "mongodb";


export const name = "ready";

export const run: EventRun = async (bot) => {
  bot.db = new MongoClient(process.env.MONGO_URI!, { serverApi: "1" }); // Create the database object, and assign it to your bot's object for easy access

  await bot.db.connect(); // Connect to the database so that you can run operations on it

  bot.logChannel = await bot.channels.fetch(`${process.env.LOG_CHANNEL}`) as TextChannel
  bot.welcomeChannel = await bot.channels.fetch(`${process.env.WELCOME_CHANNEL}`) as TextChannel
  bot.suggestionChannel = await bot.channels.fetch(`${process.env.SUGGEST_CHANNEL}`) as TextChannel
}