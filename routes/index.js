var express = require('express');
var router = express.Router();
var config = require('../config');
var Twit = require('twit');

const timelineData = require('../data/timeline.json');

var T = new Twit({
  consumer_key:         config.consumer_key,
  consumer_secret:      config.consumer_secret,
  access_token:         config.access_token,
  access_token_secret:  config.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

let accountData;
let screenName;

T.get('account/verify_credentials', { skip_status: true })
.catch(function (err) {
  console.log('caught error', err.stack)
})
.then(function (result) {
  // accountData = result;
  screenName = result.data.screen_name;
});

// T.get('statuses/user_timeline', {count: 5},function (err, data, response) {
//   accountData = data;
//   console.log(data);
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    screenName: screenName,
    followCount: 39
  });
  // res.json(timelineData);
});

module.exports = router;
