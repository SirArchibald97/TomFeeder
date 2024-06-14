const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);

    const deploy = require("../deploy.js");
    await deploy(client);
    client.user.setActivity('the waves', { type: ActivityType.Watching });
}