# twitter_interface

The Twitter interface will show

5 recent tweets
5 recent friends
DM conversation for the last 30 days

You can also post a new tweet by using the tweet box at the bottom of the page


# How to use

1. Create a [Twitter App](https://apps.twitter.com/), with 'Read, Write and Access direct messages' permissions, then generate your keys and tokens in Keys and Access Tokens.

2. Create a config.js file in the root directory with your Twitter keys/tokens like this:

```
module.exports = {
  consumer_key: "YOUR-CONSUMER-KEY",
  consumer_secret: "YOUR-CONSUMER-SECRET",
  access_token: "YOUR-ACCESS-TOKEN",
  access_token_secret: "YOUR-ACCESS-TOKEN-SECRET"
};
```

3. npm install

4. npm start

5. http://localhost:3000/
