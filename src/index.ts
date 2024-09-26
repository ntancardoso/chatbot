import { Client, Partials, Collection, Command, DiscordEvent, IntentsBitField } from "discord.js";
import fs from "fs";
import deploycmds from "./deploycmds";
import { config } from "dotenv";


async function setup() {
  try {
    // configDotenv();
    config({
      path: `.env.${process.env.NODE_ENV}`
    });
    // This line will create your client
    // Intents can be added to the Client constructor to enable certain events and property access
    // Partials are similar to intents, but will emit when there's not enough data to construct a full object
    const client = new Client({
      intents: [IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages],
      partials: [Partials.GuildMember, Partials.Message],
    });

    // This line will deploy your commands to Discord
    await deploycmds();

    // These next line creates a collection for commands
    // Read more about collections in the task description
    client.commands = new Collection();

    // Create your embed function here. It should be a method of the client object.
    client.embed = async function(sendTo, embed) {
      // Modify embed for defaults
      if (!embed.data.color) {
        embed.setColor("#00ff00");
      }
      if (!embed.data.timestamp) {
        embed.setTimestamp();
      }
    
      const msg = await sendTo.send({embeds: [embed]});
      return msg;
    }

    /*
    This readdir function and the one below will read through the /commands/ and /events/ folders respectively. Their aim is to load all commands and events into the client.

    How it works is:
    - It reads the directory and returns an array of files.
    - It filters the array to only include files ending in .js (for when we loop through them in the dist folder - where all code will be transpiled to JavaScript).
    - It loops through the array of files.
    - It imports the file.
    - It adds the command to the collection, so we can process it in events/interactionCreate.ts.
    - It adds the event to the client so the exported function will be ran when the event is emitted.
    */
    fs.readdir(__dirname + "/commands/", (err, files) => {
      if (err) console.log(err);
      const file = files.filter((f) => f.split(".").pop() === "js");
      if (file.length <= 0) {
        return;
      }
      file.forEach(async (f) => {
        const cmd: Command = await import(`./commands/${f}`);
        client.commands.set(cmd.help.data.toJSON().name, cmd);
      });
    });

    fs.readdir(__dirname + "/events/", (err, files) => {
      if (err) console.log(err);
      const file = files.filter((f) => f.split(".").pop() === "js");
      if (file.length <= 0) {
        return;
      }
      file.forEach(async (f) => {
        const event: DiscordEvent = await import(`./events/${f}`);
        client.on(event.name, event.run.bind(null, client));
      });
    });
    
    // This will log your bot in.
     client.login(process.env.TOKEN);

  } catch (e) {
    console.error(e);
  }
}

setup();