/**
 * Copyright (c) 2018 MING-CHIEN LEE
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Discord = require('discord.io');
var logger = require('winston');
const cheerio = require('cheerio');
const request = require('request');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

console.log("Koguchi Chino Discord Bot v1.0.0");
console.log("Copyright (c) 2018 MING-CHIEN LEE. All rights reserved.\n");

// Initialize Discord Bot
var bot = new Discord.Client({
  token: process.env.TOKEN,
  autorun: true
});
bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'Pong!'
        });
        break;
      // Just add any case commands if you want to..
    }
  }
});

function getPixivImgLink(url, recipientId, callback) {
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

function sendChinoPhoto(recipientId) {
  getPixivImgLink('https://www.pixiv.net/search.php?word=%E6%99%BA%E4%B9%83&order=date_d&p=' + Math.round(1 + Math.random() * 150), recipientId, function (illustIdList) {
    if (illustIdList !== "error") {
      console.log(illustIdList);
      var imgurl = "https://pixiv.cat/" + illustIdList[Math.round(Math.random() * illustIdList.length - 1)] + ".png";
      console.log("Chino Pixiv Img Link: " + imgurl);
      function check() {
        request(imgurl, function (err, res, body) {
          if (!err && res.statusCode == 200) {

          } else {
            imgurl = "https://pixiv.cat/" + illustIdList[Math.round(Math.random() * illustIdList.length - 1)] + ".png";
            console.log("Chino Pixiv Img Link: " + imgurl);
            check();
          }
        });
      }
      check();
    }
  });
}

function sendLoliPhoto(recipientId) {
  getPixivImgLink('https://www.pixiv.net/search.php?word=%E3%83%AD%E3%83%AA%20OR%20(%20loli%20)&order=date_d&p=' + Math.round(1 + Math.random() * 1000), recipientId, function (illustIdList) {
    if (illustIdList !== "error") {
      console.log(illustIdList);
      var imgurl = "https://pixiv.cat/" + illustIdList[Math.round(Math.random() * illustIdList.length - 1)] + ".png";
      console.log("Loli Pixiv Img Link: " + imgurl);
      function check() {
        request(imgurl, function (err, res, body) {
          if (!err && res.statusCode == 200) {

          } else {
            imgurl = "https://pixiv.cat/" + illustIdList[Math.round(Math.random() * illustIdList.length - 1)] + ".png";
            console.log("Loli Pixiv Img Link: " + imgurl);
            check();
          }
        });
      }
      check();
    }
  });
}