import { EmbedBuilder, EventRun, Message } from "discord.js";

export const name = "messageDelete";

export const run: EventRun = async (bot, message: Message) => {
  const content = message.content;
  if (!content) return; 

    // You should always check the message length is suitable to fit. This number could vary based off info we add, whether we're using an embed description, field or plaintext message. This example will be an embed field.
  if (content.length > 2048) return;

  try {
    const embed = new EmbedBuilder()
      .setTitle("Message Edited")
      .addFields(
        { name: "Author", value: message.author.username },
        { name: "Content Content", value: content }
      )
    await bot.embed(bot.logChannel, embed);
  } catch (e) {
    console.log("An error occurred logging a deleted message.\n", e);
  }
}