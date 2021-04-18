require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');
const dbService = require('./services/dbService');
const { loop } = require('./loop');

mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
  console.log(`[${new Date().toLocaleString()}] Conected to database`);
}).catch((err) => {
  console.log(`Error: ${err.message}`);
});

client.on('ready', () => {
  console.log(`[${new Date().toLocaleString()}] Logged in as ${client.user.tag}!`);
  client.user.setActivity('wiadomości', {type: 'WATCHING'});
  loop(client);
  setInterval(() => { loop(client) }, 1000*60*60*24);
})

client.on('message', message => {
  if(!message.author.bot && message.channel.type === 'text' &&
      (message.member.hasPermission('ADMINISTRATOR') || message.author.id === '588438077354278934') &&
      message.content.toLowerCase().startsWith('wspianews') &&
      message.mentions.channels.size) {
    
    dbService.setChannel(message.guild.id, message.mentions.channels.first().id, err => {
      if(err) return console.log(err);
      message.channel.send(`Ustawiono kanał dla wiadomości: <#${message.mentions.channels.first().id}>`);
    });
  }
});

client.on('guildCreate', guild => {
  console.log(`[${new Date().toLocaleString()}] Added to ${guild.name}`);
});

client.on('guildDelete', guild => {
  console.log(`[${new Date().toLocaleString()}] Kicked from ${guild.name}`);
  dbService.removeServer(guild.id);
});

client.login(process.env.BOT_TOKEN);