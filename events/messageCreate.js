const { EmbedBuilder } = require("discord.js");
const { fish, perks, rarities } = require("../idleFishing");
const db = require("../db");

module.exports = async (client, message) => {
    let player = await db.collection("players").findOne({ id: message.member.id });
    if (!player) {
        await db.collection("players").insertOne({ 
            id: message.member.id, 
            xp: { current: 0, total: 0 }, 
            tokens: 0, 
            perks: {
                prof_angling: 0,
                super_bait: 0,
                magnet_fishing: 0,
                quality_catches: 0,
                bigger_boosts: 0
            },
            activeBoost: { type: "null", started: "0" },
            stats: { fishCaught: {}, boostsUsed: {} },
            boosts: {}
        });
    }
    player = await db.collection("players").findOne({ id: message.member.id });

    const random = Math.floor(Math.random() * 100) + 1;
    if (random > 0 && message.author.id !== client.user.id && message.channel.id === "1250841301415628840") catchFish(client, message, player);
}

async function catchFish(client, message, player) {    
    const randomRarity = Math.floor(Math.random() * 100) + 1;
    const rarity = randomRarity > 90 ? rarities.Midnight : (randomRarity > 60 ? rarities.Twilight : rarities.Sunlight);
    const possibleFish = Object.entries(fish).filter(([id, fish]) => fish.rarity === rarity);

    const chosenFish = possibleFish[Math.floor(Math.random() * possibleFish.length)];
    const actualFish = { id: chosenFish[0], ...chosenFish[1] };
    const xp = Math.floor(Math.random() * 5) + 1;

    const exclamations = [
        { text: "Wowzer!", weight: "normal" }, 
        { text: "Cowabunga!", weight: "normal" },
        { text: "It's a big one!", weight: "normal" },
        { text: "Holy guacamole!", weight: "normal" },
        { text: "That's what we like to see!", weight: "normal" },
        { text: "🤯 ", weight: "normal" }, 
        { text: "Yowzers!", weight: "normal" },
        { text: "Hot diggity dog!", weight: "normal" },

        { text: "Chat, is this rizz?", weight: "brainrot" }, 
        { text: "The fish are freaky this time of night... ", weight: "brainrot" }
    ];
    const randomWeight = Math.floor(Math.random() * 100) + 1;
    const possibleExclamations = exclamations.filter(e => e.weight === (randomWeight > 80 ? "brainrot" : "normal"));

    const colours = { "Sunlight": "#629af5", "Twilight": "#275aab", "Midnight": "#032457" };
    await message.reply({
        embeds: [new EmbedBuilder()
            .setDescription(`### ${possibleExclamations[Math.floor(Math.random() * possibleExclamations.length)].text}\nYou caught a **${actualFish.name}** and earned ${xp} XP!`)
            .setColor(colours[actualFish.rarity])
        ],
    });

    await db.collection("players").updateOne({ id: message.member.id }, { $set: { 
        [`stats.fishCaught.${actualFish.id}`]: (player.stats.fishCaught[actualFish.id] + 1 || 1), 
        [`xp.current`]: player.xp.current + xp,
        [`xp.total`]: player.xp.total + xp
    } });

    if (player.xp.current + xp >= 100) {
        await db.collection("players").updateOne({ id: message.member.id }, { $set: {
            [`xp.current`]: (player.xp.current + xp) - 100,
            [`tokens`]: (player.tokens + 1 || 1)
        } });
        await message.reply({ embeds: [new EmbedBuilder().setDescription("You earned a **Token**! Spend it on perks or boosts!")] })
    }
}