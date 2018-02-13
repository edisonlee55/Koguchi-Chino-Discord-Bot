/**
 * Copyright (c) 2018 MING-CHIEN LEE
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const express = require('express');
const Discord = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');
var Jimp = require("jimp");
var glitchButton = "<html><head><title>Koguchi Chino Discord Bot</title></head><body><h1>Koguchi Chino Discord Bot</h1><script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";
let app = express();
app.get('/', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(glitchButton);
  res.end();
});
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Koguchi Chino Discord Bot v1.0.0");
  console.log("Copyright (c) 2018 MING-CHIEN LEE. All rights reserved.\n");
  console.log("Listening express on port %s", server.address().port);
});
// Initialize Discord Bot
const client = new Discord.Client();
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('@kc.loli | !help');
});
client.on('message', message => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.content.substring(0, 1) == '!') {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case 'help':
        message.channel.send({
          embed: {
            color: 3447003,
            title: "Koguchi Chino Discord Bot - Help",
            description: "Below you can see all the commands:",
            fields: [
              {
                name: "Koguchi Chino",
                value: "`!help`"
              },
              {
                name: "Images",
                value: "`!chino`**,**`!loli`"
              }, {
                name: "Need Support?",
                value: "Contact <@213656926414831616>:\nhttps://www.edisonlee55.com/#contact"
              }
            ]
          }
        });
        break;
      case 'chino':
        sendChinoPhoto(message);
        break;
      case 'loli':
        sendLoliPhoto(message);
        break;
    }
  }
});
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('welcome');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  Jimp.read("template.png", function (err, image) {
    if (err) throw err;
    Jimp.loadFont("avenir.fnt").then(function (font) {
      image.print(font, 45, 275, member);
      image.write("welcome.png");
    });
  });
  setTimeout(function () {
    var resWelcome = new Discord.Attachment("welcome.png");
    message.reply(resWelcome);
  }, 2000);
  channel.send(`Welcome to edisonlee55 Discord Server, ${member}!\nPlease read <#412453219264888832> carefully and having fun!`);
});
client.login(process.env.TOKEN);

function getPixivImgLink(url, message, callback) {
  console.log("Pixiv Img List Link: " + url);
  var illustIdList = [];
  var option = {
    url: url,
    headers: {
      'Cookie': process.env.PIXIV_COOKIE,
    }
  };
  request(option, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      var $ = cheerio.load(body);
      $("#js-mount-point-search-result-list").each(function (index, element) {
        var data = element.attribs['data-items'];
        data = JSON.parse(data);
        for (var i = 0; i < data.length; i++) {
          illustIdList.push(data[i].illustId);
        }
      });
      callback(illustIdList);
    } else {
      console.error("getPixivImgLink " + err);
      callback("error");
    }
  });
}

function sendChinoPhoto(message) {
  getPixivImgLink('https://www.pixiv.net/search.php?word=%E6%99%BA%E4%B9%83&order=date_d&p=' + Math.round(1 + Math.random() * 150), message, function (illustIdList) {
    if (illustIdList !== "error") {
      console.log(illustIdList);
      var illustId = illustIdList[Math.round(Math.random() * illustIdList.length - 1)];
      var imgurl = "https://pixiv.cat/" + illustId + ".png";
      console.log("Chino Pixiv Img Link: " + imgurl);
      function check() {
        request(imgurl, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            var resImg = new Discord.Attachment(imgurl);
            message.channel.send({
              embed: {
                file: resImg,
                footer: {
                  text: "Pixiv illust_id: " + illustId
                }
              }
            });
          } else {
            illustId = illustIdList[Math.round(Math.random() * illustIdList.length - 1)];
            imgurl = "https://pixiv.cat/" + illustId + ".png";
            console.log("Chino Pixiv Img Link: " + imgurl);
            check();
          }
        });
      }
      check();
    }
  });
}

function sendLoliPhoto(message) {
  getPixivImgLink('https://www.pixiv.net/search.php?word=%E3%83%AD%E3%83%AA%20OR%20(%20loli%20)&order=date_d&p=' + Math.round(1 + Math.random() * 1000), message, function (illustIdList) {
    if (illustIdList !== "error") {
      console.log(illustIdList);
      var illustId = illustIdList[Math.round(Math.random() * illustIdList.length - 1)];
      var imgurl = "https://pixiv.cat/" + illustId + ".png";
      console.log("Loli Pixiv Img Link: " + imgurl);
      function check() {
        request(imgurl, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            var resImg = new Discord.Attachment(imgurl);
            message.channel.send({
              embed: {
                file: resImg,
                footer: {
                  text: "Pixiv illust_id: " + illustId
                }
              }
            });
          } else {
            illustId = illustIdList[Math.round(Math.random() * illustIdList.length - 1)];
            imgurl = "https://pixiv.cat/" + illustId + ".png";
            console.log("Loli Pixiv Img Link: " + imgurl);
            check();
          }
        });
      }
      check();
    }
  });
}