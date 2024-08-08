import { Collection } from "discord.js";

const cooldowns = new Collection<string, Collection<string, number>>();

export function checkCooldown(command: { name: string; cooldown: number; }, user_id: string): number | false {
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection<string, number>());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name)!;

    const cooldownAmount = (command.cooldown || 5) * 1000;

    if (timestamps.has(user_id)) {
        const expiration = timestamps.get(user_id)!;
        if (now < expiration) {
            const timeLeft = Math.round((expiration - now) / 1000);
            return timeLeft;
        }
        timestamps.delete(user_id);
    }

    timestamps.set(user_id, now + cooldownAmount);
    setTimeout(() => timestamps.delete(user_id), cooldownAmount);

    return false;
}
