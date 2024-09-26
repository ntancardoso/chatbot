import { EmbedBuilder, Message, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from "discord.js";

export default class Pagination {

  // Initialize variables
  private pages: EmbedBuilder[] = [];
  private currentPage = 0;
  private message?: Message = undefined;
  private channel: TextChannel;

  // Create our constructor
  constructor(display: TextChannel, startPage = 0) {
    this.currentPage = startPage;
    this.channel = display;
  }

  // Create the setPages method
  public setPages(pages: EmbedBuilder[]) {
    // Assign the pages to our pages variable
    this.pages = pages;
    // Get the embed associated with the page
    const embed = this.pages[this.currentPage];
    // Set the footer of the embed to be `Page currentPageIndex/PageLength
    embed.setFooter({
      text: `Page ${this.currentPage + 1}/${this.pages.length}`
    });

    // Create our ActionRow that will contain our buttons
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(
        // Create our buttons
        new ButtonBuilder().setCustomId("first").setLabel("First").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("previous").setLabel("Previous").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("next").setLabel("Next").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("last").setLabel("Last").setStyle(ButtonStyle.Primary)
      );

    // Send our message and assign it to our message variable
    this.channel.send({ embeds: [embed], components: [row] }).then(msg => this.message = msg);

    // Create our interaction collector, this will listen for button clicks
    // You could make this cleaner but this works and is readable enough
    const interactionCollector = this.channel.createMessageComponentCollector({ time: 60000, filter: (i) => i.isButton() && i.user.id === this.channel.client.user?.id && (i.customId === "first" || i.customId === "previous" || i.customId === "next" || i.customId === "last") });

    // Listen for clicks and reset the timer.
    interactionCollector.on("collect", async (i) => {
      if (i.customId == "first") {
        this.first();
      }
      else if (i.customId == "previous") {
        this.previous();
      }
      else if (i.customId == "next") {
        this.next();
      }
      else if (i.customId == "last") {
        this.last();
      }

      interactionCollector.resetTimer();
    });
  }

  // You will create all of our methods that will be used to change pages
  // They all follow the same basic layout
  // Check if we can change pages
  // incremebt/decrement the page
  // Get the embed associated with the page
  // Set the footer
  // Edit the message

  public next() {
    if (this.currentPage + 1 >= this.pages.length) return;
    this.currentPage++;
    const embed = this.pages[this.currentPage];
    embed.setFooter({
      text: `Page ${this.currentPage + 1}/${this.pages.length}`
    });
    this.message?.edit({ embeds: [embed] });
  }

  public previous() {
    if (this.currentPage - 1 < 0) return;
    this.currentPage--;
    const embed = this.pages[this.currentPage];
    embed.setFooter({
      text: `Page ${this.currentPage + 1}/${this.pages.length}`
    });
    this.message?.edit({ embeds: [embed] });
  }

  public first() {
    if (this.currentPage == 1) return;
    this.currentPage = 0;
    const embed = this.pages[this.currentPage];
    embed.setFooter({
      text: `Page ${this.currentPage + 1}/${this.pages.length}`
    });

    this.message?.edit({ embeds: [embed] });
  }

  public last() {
    if (this.currentPage == this.pages.length - 1) return;
    this.currentPage = this.pages.length - 1;
    const embed = this.pages[this.currentPage];
    embed.setFooter({
      text: `Page ${this.currentPage + 1}/${this.pages.length}`
    });

    this.message?.edit({ embeds: [embed] });
  }
}