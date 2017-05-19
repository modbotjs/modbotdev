// Set some JSHint stuff:
//jshint esversion: 6

// Import Discord.JS
const Discord = require('discord.js');
var client = new Discord.Client();

// Import filesystem
const fs = require('fs');

// Count of messages received
var count = 0;

// Array of messages received, kind of makes count redundant
var messages;
fs.readFile(`${__dirname}/messages.json`, function (err, data) {
  if (err) {
    messages = [];
  } else {
    data = JSON.parse(data);
    if (data.constructor === Array) {
      messages = data;
    } else {
      messages = [];
    }
  }
});

// When a new message is received - Might get way too large. Probably should remove it.
function logMessage(message) {
  // Add the message object to the array
  messages.push(message);
  // Write it to the messages.json file
  fs.writeFile(`${__dirname}/messages.json`, JSON.stringify(messages, null, 2), function(err) {
    if(err) console.log(err);
  });
}

// Configuration, might make a seperate JSON file in the future
var configuration = {
  token: 'MzEzMzg5NDA2Mzk4NzA5NzYw.C_zyvA.KFRiP9Jf4EwNT-DPjFytK_SeglI',
  prefix: '>'
};

// Log that the client is logged in and ready to reply!
client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

// When a new message is received
client.on('message', message => {
  // Log this message
  logMessage({
    author: {
      id: message.author.id,
      username: message.author.username,
      discriminator: message.author.discriminator
    },
    guild: {
      id: message.guild.id,
      name: message.guild.name
    },
    channel: {
      id: message.channel.id,
      name: message.channel.name
    },
    content: message.content
  });
  if (message.channel.type != 'text') {
    // Why does a moderation bot need to be in DMs?
    message.channel.send("Sorry. I don't work in DMs. Why would you want a modbot in a DM?");
  } else {
    // In a server, not a DM

    // No need to make the message lower case 50 times
    var contentLower = message.content.toLowerCase();

    // Kick command - Working
    if (contentLower.startsWith(configuration.prefix + 'kick')) {
      // Set who will be kicked
      var toBeKicked = message.mentions.members.first();
      // Make sure the person trying to kick has the permission, it'd be a bad fail if this weren't checked xD
      if (message.member.hasPermission('KICK_MEMBERS')) {
        // Kick the member
        toBeKicked.kick(`Kicked by ${message.author.username}!`);
        // Tell the moderator that the member has been kicked
        message.reply('Kicked ' + toBeKicked);
      } else {
        // The person attempting to kick someone is NOT a moderator
        message.reply("You do not have permission to issue that command.");
      }
      // Ban command - Working
    } else if (contentLower.startsWith(configuration.prefix + 'ban')) {
      // Set who will be banned
      var toBeBanned = message.mentions.members.first();
      // Don't let random people ban other people
      if (message.member.hasPermission('BAN_MEMBERS')){
        // Ban the person
        toBeBanned.ban(`Banned by ${message.author.username}!`);
        // Say that they have been banned
        message.reply('Banned ' + toBeBanned);
      } else {
        // Not a moderator
        msg.reply('You do not have permission to issue that command');
      }
      // Ping command - Working
    } else if (contentLower.startsWith(configuration.prefix + 'ping')) {
      // Reply with "Pong! (<ping in milliseconds> milliseconds)"
      message.reply(`Pong! (${client.ping} milliseconds)`);
      // Servers command - Working
    } else if (contentLower.startsWith(configuration.prefix + 'servers')) {
      // Reply with amount of servers
      message.reply(`I currently have ${client.guilds.size} servers.`);
    }
  }
});

client.login(configuration.token);
