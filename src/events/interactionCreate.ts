import { 
    ChatInputCommandInteraction, 
    EventRun,
    GuildMember,
    GuildMemberRoleManager,
    PermissionsBitField,
} from "discord.js";
import { hasPerm } from "../modules/services/PermissionService";

export const name = "interactionCreate";

export const run: EventRun = async (
    bot, 
    interaction: ChatInputCommandInteraction
) => {
    if (!interaction.isCommand()) return;
    const commandFile = bot.commands.get(interaction.commandName);

    if (!commandFile) {
        interaction.reply({ content: "Command not found", ephemeral: true });
        return;
    }

    const { user, member } = interaction;
    const { allowedPerms, allowedRoles, allowedUsers } = commandFile.help;
    // get the user's roles
    await interaction.guild?.roles.fetch();
    const mem = await (member as GuildMember).fetch();
    const roles: string[] =
        (mem?.roles as GuildMemberRoleManager).cache.map((role) => role.id) ?? [];
    const perms: string[] =
        (mem?.permissions as PermissionsBitField).toArray() ?? [];
    perms.push("MEMBER");

    if (user.id == `${process.env.DEV_ID}`) {
        perms.push("DEVELOPER");
    }

    if (allowedUsers.length > 0 && !allowedUsers.includes(user.id)) {
        interaction.reply({
            content: "You are not allowed to use this command",
            ephemeral: true,
        });
        return;
    }

    if (allowedRoles.length > 0 && !hasPerm(roles, allowedRoles)) {
        interaction.reply({
            content: "You are not allowed to use this command",
            ephemeral: true,
        });
        return;
    }

    if (allowedPerms.length > 0 && !hasPerm(perms, allowedPerms)) {
        interaction.reply({
            content: "You are not allowed to use this command",
            ephemeral: true,
        });
        return;
    }

    try {
        await commandFile.run(bot, interaction);
    } catch (e) {
        console.error(e);
        interaction.reply({
            content: "An error occured while executing this command",
            ephemeral: true,
        });
    }
 };