const express = require('express');
const router = express.Router();
const config = require('../config');
const Twit = require('twit');
const moment = require("moment");

let timelineData = require('../data/timeline.json');
let userData = require('../data/user.json').data;
let followData = require('../data/following.json').users;
let dmData = require('../data/dm.json').events.reverse();
let me = userData.id;

let convos = {};
let users = {};

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

// T.get('account/verify_credentials', { skip_status: true })
// .catch(function (err) {
//   console.log('caught error', err.stack)
// })
// .then(function (result) {
//   // accountData = result;
//   screenName = result.data.screen_name;
// });

// T.get('statuses/user_timeline', {count: 5},function (err, data, response) {
//   accountData = data;
//   console.log(data);
// });

// T.get('friends/list', {count: 5},function (err, data, response) {
//   followData = data;
// });

// T.get('direct_messages/events/list',function (err, data, response) {
//   dmData = data;
//   // if (err)
//   // {
//   //   res.render('error',{error: err, message: err.message});
//   // }
// });

/* GET home page. */
router.get('/', function (req, res, next) {

  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
  });

  for (const key in convos) {
    if (convos.hasOwnProperty(key)) {
      T.get('users/lookup', { user_id: key }, function (err, data, response) {
        console.log(data);
      });
    }
  }

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
  });
});

router.post('/tweet', (req, res) => {

  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
  });

  console.log(req.body)
  const status = req.body.tweetText;
  if (status) {
    T.post('statuses/update', {
      status: status,
      auto_populate_reply_metadata: true
    }, function (err, data, response) {
      if (err) {
        res.render('error', { error: err, message: err.message });
      } else {
        res.redirect("/");
      }
    });
  }

})

module.exports = router;
