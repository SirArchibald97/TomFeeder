const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { fish, perks, boosts } = require("../idleFishing");
const db = require("../db");

module.exports = {
    data: new SlashCommandBuilder().setName("fishing").setDescription("View your Idle Fishing profile").addUserOption(member => member.setName("user").setDescription("Select a user").setRequired(false)),

    async execute(client, interaction) {
        const user = interaction.options.getUser("member") || interaction.member;
        const player = await db.collection("players").findOne({ id: user.id });

        const embed = new EmbedBuilder().setTitle(`${user.user.displayName} - Idle Fishing`).setColor("#31bdaf").setTimestamp().setThumbnail(user.user.avatarURL());
        const reply = await interaction.reply({ 
            embeds: [getPage(player, "profile", embed)], 
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`page-profile`).setEmoji("🎣").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId(`page-perks`).setEmoji("⏫").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId(`page-trophies`).setEmoji("🏆").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId(`page-boosts`).setEmoji("🌠").setStyle(ButtonStyle.Secondary),
            )], 
            fetchReply: true 
        });

        const filter = int => int.member.id === interaction.member.id && int.customId.startsWith("page");
        const collector = await reply.createMessageComponentCollector({ filter: filter, time: 5 * 60_000 });
        collector.on("collect", async int => {
            await int.update({ 
                embeds: [getPage(player, int.customId.split("-")[1], embed)], 
                components: [new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`page-profile`).setEmoji("🎣").setStyle(int.customId.split("-")[1] === "profile" ? ButtonStyle.Primary : ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId(`page-perks`).setEmoji("⏫").setStyle(int.customId.split("-")[1] === "perks" ? ButtonStyle.Primary : ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId(`page-trophies`).setEmoji("🏆").setStyle(int.customId.split("-")[1] === "trophies" ? ButtonStyle.Primary : ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId(`page-boosts`).setEmoji("🌠").setStyle(int.customId.split("-")[1] === "boosts" ? ButtonStyle.Primary : ButtonStyle.Secondary),
                )] 
            });
        });
        collector.on("end", async collected => {
            await reply.edit({ components: [ActionRowBuilder.from(reply.components[0]).setComponents(reply.components[0].components.map(c => ButtonBuilder.from(c).setDisabled(true)))] });
        });
    }
}

function getPage(player, page, embed) {
    if (page === "profile") {
        let tokenMeterProgress = Math.round((player.xp.current / 100) * 10);
        let progressBar = "";
        for (let i = 1; i <= tokenMeterProgress; i++) { progressBar += "🟪"; }
        for (let i = 1; i <= (10 - tokenMeterProgress); i++) { progressBar += "⬜"; }

        return embed.setDescription("### Profile\n```ansi\n" +
            `[0mTokens [0;30m> [0m${player.tokens.toLocaleString()}\n` +
            `[0mTotal XP [0;30m> [0m${player.xp.total.toLocaleString()}\n\n` +
            `[0mToken Meter [0;30m> [0m${player.xp.current} / 100XP\n` +
            `${progressBar} [0;30m(${Math.round((player.xp.current / 100) * 100)}%)\n` +
            "```"
        );

    } else if (page === "perks") {
        let message = "### Perks\n```ansi\n";
        const costs = [1, 2, 4, 7, 10];

        for (const [id, perk] of Object.entries(perks)) {
            message += `[1;37m${perk.name} `;
            if (player.perks[id] === 0) {
                message += "[0;31m[LOCKED]\n";
            } else if (player.perks[id] === perk.tiers.length) {
                message += "[0;32m[MAX]\n";
            } else {
                message += `[0;34m[${player.perks[id]}/${perk.tiers.length}]\n`;
            }

            let perkAmount;
            let nextUpgrade;
            if (perk.type === "add") {
                perkAmount = `+${player.perks[id] === 0 ? perk.tiers[0] : perk.tiers[player.perks[id] - 1]}`;
                if (player.perks[id] !== perk.tiers.length) nextUpgrade = `+${perk.tiers[player.perks[id]]} (${costs[player.perks[id]]} token${costs[player.perks[id]] === 1 ? "" : "s"})`;
                else nextUpgrade = "Max Level";
            } else if (perk.type === "percent") {
                perkAmount = `${player.perks[id] === 0 ? perk.tiers[0] : perk.tiers[player.perks[id] - 1]}%`;
                if (player.perks[id] !== perk.tiers.length) nextUpgrade = `${perk.tiers[player.perks[id]]}% (${costs[player.perks[id]]} token${costs[player.perks[id]] === 1 ? "" : "s"})`;
                else nextUpgrade = "Max Level";
            } else if (perk.type === "time") {
                perkAmount = `+${player.perks[id] === 0 ? perk.tiers[0] : perk.tiers[player.perks[id] - 1]}m`;
                if (player.perks[id] !== perk.tiers.length) nextUpgrade = `+${perk.tiers[player.perks[id]]}m (${costs[player.perks[id]]} token${costs[player.perks[id]] === 1 ? "" : "s"})`;
                else nextUpgrade = "Max Level";
            }
            message += `[0m${perk.description.replace("%AMOUNT%", `[0;34m${perkAmount}[0m`)}\n`;
            message += `[0;30mNext Upgrade: ${nextUpgrade}\n\n`;
        }
        return embed.setDescription(message + "\n```" + "\nUse `/perk` to purchase and upgrade perks!");

    } else if (page === "trophies") {
        let message = "### Trophies\n```ansi\n";

        const trophies = [
            { name: "DIAMOND", amount: 10_000, colours: "[1;35m" },
            { name: "PLATINUM", amount: 3_000, colours: "[1;37m" },
            { name: "GOLD", amount: 1_500, colours: "[1;33m" },
            { name: "SILVER", amount: 500, colours: "[1;36m" },
            { name: "BRONZE", amount: 100, colours: "[1;31m" },
            { name: "NONE", amount: 0, colours: "[0;30m" }
        ];
        for (const [id, entry] of Object.entries(fish)) {
            let currentTrophy = trophies[trophies.length - 1];
            for (const trophy of trophies) {
                if (trophy.amount <= player.stats.fishCaught[id]) currentTrophy = trophy;
            }

            message += `[1;37m${entry.name} `;
            if (player.stats.fishCaught[id] >= 10_000) {
                message += `${currentTrophy.colours}[${currentTrophy.name}]\n[0;37m${player.stats.fishCaught[id].toLocaleString()} [0;30m>(MAX)\n\n`;
            } else {
                const nextTrophy = trophies[trophies.indexOf(currentTrophy) - 1];
                message += `${currentTrophy.colours}[${currentTrophy.name}]\n[0;37m${player.stats.fishCaught[id]?.toLocaleString() || 0}/${nextTrophy.amount} to ${nextTrophy.name}\n\n`;
            }
        }

        return embed.setDescription(message + "\n```");

    } else if (page === "boosts") {
        return embed;
    }
}