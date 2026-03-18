---
id: 10
status: "published"
sort: 2
date_created: "2023-11-17T04:19:37.000Z"
date_updated: "2025-02-05T00:56:33.000Z"
title: "Setup event notifications for your SaaS"
subtitle: "A simple guide on setting up SaaS event notifications to track various operational aspects of your business."
slug: "setup-event-notifications-for-your-saas"
category: null
banner: "/images/blog/setup-event-notifications-for-your-saas/banner.webp"
banner_og: "/images/blog/setup-event-notifications-for-your-saas/banner-og.jpg"
banner_id: "33c39cd9-952c-42c3-bbab-b57e5e8b6406"
banner_og_id: "21807df5-2fad-436f-a7ac-45ba3bf12645"
---
## Why setup event notifications for your SaaS?

During my time building out Swipekit, there was a need to get real-time notifications for various operational tasks.

These were things like:

*   Track background jobs status.
    
*   Track signups. Show me the email of the person who signed up.
    
*   Show me when a user's trial ended.
    
*   Show me if a particular feature worked as intended.
    

etcetc.

Initially, I had nothing to view this data on. I knew I had to setup something because early on, tracking and fixing bugs ASAP was a big priority.

After setting up event tracking, I immediately got visibility over the most important actions taking place in my SaaS.

Here's how my Telegram looks like after setting up event notifications.

![](https://writings.operational.co/assets/a54a6d0e-b142-4cda-984a-842be159a408?format=webp&quality=80)

I'm going to show you how to setup event tracking for your SaaS, for free.

## Setting up tracking via Telegram to track events

Most SaaS builders on twitter were already using Slack or Discord to track various events.

I opted for Telegram. Here's why.

Firstly, I didn't use Stack for my work. I did use something similar called Pumble but that was exclusively for liaising with freelacers and contracts. And I certainly didn't want to setup Slack just for notifications.

Secondly, I'm not a big fan of Discord. I'm part of 10+ discords and opening up Discord is like opening up a zoo. Every few seconds, a random ping would go off and I had no idea where it came from.

This left me with Telegram. I had used Telegram before and I really liked it UI. Plus they had easy to use docs(not that Slack, Discord, etc were bad).

The only issue with Telegram is their search function, which doesn't work most of the time.

Anyways, here's how I did it.

I created a simple function on my nodejs server that interfaces the the telegram API.

```
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {});

async function sendMessage(msg) {
  bot.sendMessage(this.chatId, message).catch((err) => {
		console.log(err);
	});
}

exports = module.exports = sendMessage;
```

That's it. Now I'd call this function whenever I wanted to track something.

Here's one where I'm tracking a background job:

![Tracking background jobs](https://writings.operational.co/assets/dc988f81-b353-4dd8-9443-24af3f04dfd4?format=webp&quality=80)

Tracking background jobs

## Going further

This solution helps me figure out issues, but it has some issues.

Here's what I want:

*   More context inside a notification. For instance, If a user's trial expired, how much activity did they do?
    
*   Ability to send commands back to my server. For instance, if a user's trial has expired but they have performed enough activity and have signed up via a company email, send them a trial extension offer.
    

Right now, I'm trialing a way to send commands back to the telegram bot so it can fire webhooks to my server. But this is still quite far away.

I hope this simple guide helps you setup event tracking for your SaaS. Event notifications can help you figure out what your users are up to, and you can proactively help them figure out their issues.

If you have any questions, feel free to holla at me on twitter/X at @shash122tfu
