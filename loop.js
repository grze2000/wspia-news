const dbService = require('./services/dbService');
const News = require('./models/News');
const Server = require('./models/Server');
const axios = require('axios');
const { parse } = require('node-html-parser');
const md5 = require('md5');
const Discord = require('discord.js');

exports.loop = async client => {
  const servers = await Server.find({});
  const root = parse((await axios.get('http://www.wspia.eu/uczelnia/aktualnosci')).data);
  const news = root.querySelectorAll('.pageListItem');
  for(singleNews of news) {
    const titleHash = md5(singleNews.querySelector('.pageListItemName a').text);
    try {
      const data = await News.findOne({hash: titleHash});
      if(!data) {
        for(server of servers) {
          const channel = await client.channels.fetch(server.channelID);
          if(!channel) continue;
          let embed = new Discord.MessageEmbed()
            .setColor('#28254F')
            .setTitle(singleNews.querySelector('.pageListItemName a').text)
            .setURL(`http://wspia.eu${singleNews.querySelector('.pageListItemName a').getAttribute('href')}`)
            .setDescription(singleNews.querySelector('.pageListItemDescription').text)
            .setThumbnail('http://www.wspia.eu/images/lay_new/logo.png')
            .setImage(`http://wspia.eu${singleNews.querySelector('.pageListItemImage img').getAttribute('src')}`)
            .setAuthor('WSPiA Rzeszowska Szkoła Wyższa', 'http://www.wspia.eu/images/lay_new/logo.png')
            .setFooter(`${singleNews.querySelector('.pageListItemDate').text}  -  www.wspia.eu`, 'http://www.wspia.eu/images/lay_new/logo.png')
          channel.send(embed);
          News.create({hash: titleHash}, err => {
            if(err) console.log(err);
          });
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }
};