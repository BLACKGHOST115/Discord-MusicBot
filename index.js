require('dotenv').config();

const { Client, Intents } = require('discord.js');
const fs = require('fs'); // Required for file system operations
const config = require('./config');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

async function changeBotAvatar(filePath) {
    try {
        const avatarData = fs.readFileSync(filePath); // Read the GIF file
        await client.user.setAvatar(avatarData); // Set the bot's avatar to the GIF
        console.log('Bot avatar changed successfully.');
    } catch (error) {
        console.error('Error changing bot avatar:', error);
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'changeavatar') {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const gifFilePath = args[0]; // Assuming the first argument is the path to the GIF file
        if (!gifFilePath) {
            return message.reply('Please provide a path to the GIF file.');
        }

        changeBotAvatar(gifFilePath);
        message.reply('Bot avatar change requested. Check the console for status.');
    }
});

client.login(config.token);
