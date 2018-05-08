var express = require('express');
var router = express.Router();
var config = require('../config');
var Twit = require('twit');

let timelineData = require('../data/timeline.json');
let userData = require('../data/user.json').data;
let followData = require('../data/following.json').users;
let dmData = require('../data/dm.json').events;


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
router.get('/', function(req, res, next) {

  var T = new Twit({
    consumer_key:         config.consumer_key,
    consumer_secret:      config.consumer_secret,
    access_token:         config.access_token,
    access_token_secret:  config.access_token_secret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  });

  res.render('index', { 
    name: userData.name,
    screen_name: userData.screen_name,
    friends_count: userData.friends_count,
    profile_image_url: userData.profile_image_url,
    timeline: timelineData,
    following: followData
  });

});

module.exports = router;
