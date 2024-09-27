module.exports.rarities = {
    Sunlight: "Sunlight",
    Twilight: "Twilight",
    Midnight: "Midnight"
}

module.exports.fish = {
    // COMMON
    "clownfish": {
        name: "Clownfish",
        rarity: this.rarities.Sunlight
    },
    "catfish": {
        name: "Catfish :3",
        rarity: this.rarities.Sunlight
    },
    "trout": {
        name: "Just Trout",
        rarity: this.rarities.Sunlight
    },

    // RARE
    "blahaj": {
        name: "Blahaj",
        rarity: this.rarities.Twilight
    },
    "flounder": {
        name: "Flounder",
        rarity: this.rarities.Twilight
    },
    "mr_krabs": {
        name: "Mr Krabs",
        rarity: this.rarities.Sunlight
    },

    // LEGENDARY
    "angler": {
        name: "Angler Fish",
        rarity: this.rarities.Midnight
    },
    "sea_spirit": {
        name: "Spirit of the Sea",
        rarity: this.rarities.Midnight
    },
    "sea_dragon": {
        name: "Sea Dragon",
        rarity: this.rarities.Midnight
    }
}

module.exports.perks = {
    "prof_angling": {
        id: "prof_angling",
        name: "Professional Angling",
        description: "Gain %AMOUNT% more XP for every fish caught",
        tiers: [1, 2, 3, 4, 5],
        type: "add"
    },
    "super_bait": {
        id: "super_bait",
        name: "Super Bait",
        description: "Gain a %AMOUNT% chance to catch a shiny fish",
        tiers: [5, 10, 15, 20, 25],
        type: "percent"
    },
    "magnet_fishing": {
        id: "magnet_fishing",
        name: "Magnet Fishing",
        description: "Gain a %AMOUNT% chance to earn a Perk Token when catching a fish",
        tiers: [3, 5, 7, 10, 12],
        type: "percent"
    },
    "quality_catches": {
        id: "quality_matches",
        name: "Quality Catches",
        description: "Increases the chance of getting double Tokens from your Token Meter by %AMOUNT%",
        tiers: [5, 10, 15, 20, 25],
        type: "percent"
    },
    "bigger_boosts": {
        id: "bigger_boosts",
        name: "Bigger Boosts",
        description: "Increases the length of active boosts by %AMOUNT%",
        tiers: [30, 60, 90, 120, 240],
        type: "time"
    },
}

module.exports.boosts = {

}