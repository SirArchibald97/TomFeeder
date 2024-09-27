const { ActivityType, EmbedBuilder } = require('discord.js');

module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);

    const deploy = require("../deploy.js");
    await deploy(client);
    client.user.setActivity('the waves', { type: ActivityType.Watching });

    // RULES
    /*
    const embeds = [
        new EmbedBuilder()
            .setTitle("<:fishopedia:1255255412064653323> Welcome to the Island Fishing Club")
            .setDescription(
                "Whilst you are participating in our community, we ask you adhere to the following rules:\n\n" +
                "> **1. Always be respectful.** Inappropriate language and behaviour such as disrespect, discrimination and harassment will not be tolerated.\n\n" + 
                "> **2. PG-13 only.** Swearing is allowed but please keep profanity to a minimum. NSFW content is strictly disallowed.\n\n" + 
                "> **3. No advertising.** Exceptions will be made for interesting Island-related projects and community partners, but promoting your own social media is not allowed.\n\n" + 
                "We reserve the right to remove **anyone** from the community for ruining the vibe. This is a chill space to meet people and hang out. Anyone inciting or participating in drama, harassment or otherwise inappropriate behaviour will be banned."
            ).setColor("#31bdaf")
    ];
    await client.guilds.cache.get("1250208188373012581").channels.cache.get("1266352471207313539").send({ embeds: embeds });
    */
}