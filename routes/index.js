const express = require('express');
const router = express.Router();
const config = require('../config');
const Twit = require('twit');
const moment = require("moment");

let timelineData;
let userData;
let me;
let followData;
let dmData;
let T;

let convos = {};
let users = {};

const getUserData = () => {
  return new Promise((resolve, reject) => {
    T.get('account/verify_credentials', { skip_status: true }, function (err, data, response) {
      if(err) {
        return reject(err)
      } else {
        
        userData = data;
        me = userData.id;
        return resolve();
      }
    });
  });
}

const getTimelineData = () => {
  return new Promise((resolve, reject) => {
    T.get('statuses/user_timeline', { count: 5 }, function (err, data, response) {
      if(err) {
        return reject(err)
      } else {
        
        timelineData = data;
        return resolve();
      }
    });
  });
}

const getFollowData = () => {
  return new Promise((resolve, reject) => {
    T.get('friends/list', { count: 5 }, function (err, data, response) {
      if(err) {
        return reject(err)
      } else {
        
        followData = data.users;
        return resolve();
      }
    });
  });
}

const getDmData = () => {
  return new Promise((resolve, reject) => {
    T.get('direct_messages/events/list', function (err, data, response) {
      if (err) {
        return reject(err)
      } else {
        
        dmData = data.events.reverse();
        convos = {};

        dmData.forEach(message => {
          let targetID = message.message_create.target.recipient_id;
          let senderID = message.message_create.sender_id;

          if (senderID == me) {
            message.me = true;
            convos[targetID] = convos[targetID] || [];
            convos[targetID].push(message);

          } else {
            message.me = false;
            convos[senderID] = convos[senderID] || [];
            convos[senderID].push(message);
          }
        });
        return resolve();
      }
    });
  });
}


/* GET home page. */
router.get('/', function (req, res, next) {

  T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  });

  getUserData()
    .then(() => {
      Promise.all([getTimelineData(), getFollowData(), getDmData()])
        .then(() => {
          res.render('index', {
            moment: require("moment"),
            name: userData.name,
            screen_name: userData.screen_name,
            friends_count: userData.friends_count,
            profile_image_url: userData.profile_image_url,
            profile_banner_url: userData.profile_banner_url,
            timeline: timelineData,
            following: followData,
            messages: convos
          })
        })
        .catch(error => {
          res.render('error', { error });
        })
    })
    .catch(error => {
      res.render('error', { error });
    });

});

router.post('/tweet', (req, res) => {
  console.log('im here');

  let T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
  });

  const status = req.body.tweetText;
  console.log(status);
  if (status) {
    T.post('statuses/update', {
      status: status,
      auto_populate_reply_metadata: true
    }, function (err, data, response) {
      if (err) {
        res.render('error', { error: err, message: err.message });
      } else {
        console.log(data);
        res.render("tweet-single",{ tweet: data, moment: require("moment") });
      }
    });
  } else {

  }

});

module.exports = router;
