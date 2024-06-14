const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { fish } = require("../fish.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("fishopedia")
        .setDescription("Look up the details of any fish that Tom has information on!")
        .addStringOption(option =>
            option.setName('fish')
                .setDescription('The fish name you would like information on')
                .setRequired(true)),
    
    async execute(client, interaction) {
        const foundFish = fish.find(f => f.name.toLowerCase().includes(interaction.options.getString("fish").toLowerCase()));
        if (!foundFish) return await interaction.reply({ embeds: [new EmbedBuilder().setDescription(":x: I cannot find any fish with that name!").setColor("Red")], ephemeral: true });
        const fishEmbed = new EmbedBuilder()
            .setColor("#46c7d3")
            .setTitle('Fishopedia')
            .setThumbnail('https://i.imgur.com/KIq43jU.png')
            .addFields({
                name: foundFish.name,
                value: foundFish.description
            })
            .setImage(foundFish.image)

        interaction.reply({ embeds: [fishEmbed] });
    }
}