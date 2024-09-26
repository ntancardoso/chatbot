import { EmbedBuilder, EventRun, Message } from "discord.js";

export const name = "messageUpdate";

export const run: EventRun = async (bot, oldMessage: Message, newMessage: Message) => {
  const oldContent = oldMessage.content;
  const newContent = newMessage.content;
  if (!oldContent || !newContent) return; // Sometimes this happens if a message with an attachment is updated - very rarely though. But we should check for it anyway and ensure that we have both old and new content.
  if (oldContent == newContent) return; // Yes, this sometimes happens too. If you include a URL in your message, the embedding of it counts as an "update" which fires this event. We don't want to log that as long as the content is the same!

  // You should always check the message length is suitable to fit. This number could vary based off info we add, whether we're using an embed description, field or plaintext message. This example will be an embed field.
  if (oldContent.length > 2048 || newContent.length > 2048) return;

  try {
    const embed = new EmbedBuilder()
      .setTitle("Message Edited")
      .addFields(
        { name: "Author", value: oldMessage.author.username },
        { name: "Old Content", value: oldContent },
        { name: "New Content", value: newContent }
      )
    await bot.embed(bot.logChannel, embed);
  } catch (e) {
    console.log("An error occurred logging a deleted message.\n", e);
  }
}