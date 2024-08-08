import { GuildMember, Events } from "discord.js";
import Event from "../utils/commons/Event";
import autoRole from "../utils/autoRole";

export default new Event({
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember): Promise<void> {
        autoRole(member);
    },
});
