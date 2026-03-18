---
id: 11
status: "published"
sort: 3
date_created: "2023-11-18T11:44:20.000Z"
date_updated: "2025-02-05T00:56:16.000Z"
title: "How to get high quality users for your B2B SaaS business?"
subtitle: "A list of business rules I have setup in place for getting high quality customers."
slug: "how-to-get-high-quality-users-for-your-b2b-saas"
category: null
banner: "/images/blog/how-to-get-high-quality-users-for-your-b2b-saas/banner.webp"
banner_og: "/images/blog/how-to-get-high-quality-users-for-your-b2b-saas/banner-og.jpg"
banner_id: "a7d9c02c-85eb-4c78-b722-cb58439b8af5"
banner_og_id: "f8786473-bc87-45f3-aef8-dd1d020191a1"
---
When I started Swipekit, I had a wide open signup setup. Meaning that everyone could sign up for my SaaS without any hurdles.

This doesn't seem bad since most folks in the startup world recommend removing any blockers to signups.

Turns out, for a B2B business, you need to have your signup workflow relatively restrictive.

Why you shouldn't allow anyone to signup for your B2B SaaS?

*   I saw a lot of users signing up, using the product, then after their trial would expire, they would signup with another email address.
    
*   Users were very hesitant to ask for feature requests, report bugs, and just generally, open a dialogue with me.
    
*   Because of these users, we weren't getting better quality metrics(We certainly don't want to analyze behaviours of users who don't intent to pay for the product)
    
*   The support messages we got were horrible from these users. Bad product requests, dumb responses, and more.
    
*   And lastly, our conversion ratios were bad.
    

All these issues would lead to more operational problems for my SaaS.

It became very clear that I had to put mechanisms in place to get more high quality users for my self-serve SaaS.

## How to actually get high quality users?

In my 1 year of running Swipekit, I gradually started implementing rules in place to get quality users.

Here's what I implemented:

### Set a email verification system

This is the most basic thing you can do to verify that john@acme.com is the real owner of that email.

Initially, Swipekit allowed users to signup, but they won't be able to save more than 3 Ads unless they clicked the verification link inside their emai.

This was a bad decision as folks would signup and then download 3 ads and then move along.

So I made my onboarding in such a way that after the initial signup process, they need to verify their email.

Phew this blocked a ton of crappy signups.

### Don't allow throwaway emails

Some users would:

*   Signup via a throwaway email
    
*   After their trial is over, signup with another throwaway email
    

This was a clear indicator that this user won't pay for the product.

The solution was simple - get a list of [throwaway email providers](https://github.com/disposable/disposable-email-domains) and block signups from them.

### Don't allow 10 minute emails

This is the spiritual successor of throwaway emails. These services buy 20-30 domains, then allow people to create fake email accounts for 10 minutes. Problem is - unlike throwaway emails, they actual do work.

The best way to ban them is to figure out their dns's ip address - and ban that ip. But that's a bit more involved process(I might write another article about it in the future)

### Proactively ban users

Sometimes, you just need to ban users manually.

We do this during a couple of scenarios:

*   When they issue a chargeback
    
*   When their email bounces. We can see this from our transactional email provider. This basically means that they are using a sort of a throwaway email service.
    
*   When they are being abusive in the support chat. Happened only once though.
    

To setup a ban system, I made a simple table called banlist. This table has these columns:

*   text - the string to check against
    
*   type - email or domain enum. If email is selected, don't allow signups if the entire email matches text column. If domain is selected, don't allow signup if the domain part of the email matches the text column.
    
*   createdAt - just cause
    
*   banTill - In case I need to add a temporary ban. Not used at the moment.

### Don't allow gmail's +1 trick

Gmail allows users to have multiple email address, on a single email address.

Essentially, a single gmail email address can be used as multiple emails as long as there's a + character in the email.

For instance, if you're gmail is john@gmail.com

You can signup as john+1@gmail.com , john+abc@gmail.com ,etc. Here's a [detailed explaination](https://medium.com/verses-education/an-easy-gmail-hack-for-signing-up-multiple-user-accounts-that-require-an-email-address-4aba56e29248).

**What's the fix?**

It's very simple. During signup, just check if the email provider is gmail and there's a + character inside the email. If yes, don't allow signup.

## Taking this further

So far, these rules have drastically improved the quality of users. Still, there's one thing that will totally eliminate all unwanted users.

**Ask for their card details during signup.**

Doing this will pretty much overnight cut down low quality signups. As much as I'd love to set this up, unfortunately we are a long way from implementing this.

## Notes

*   I wish I had implemented this rules from day one. This would've cut down crappy signups and alleviated a whole lot of operational headaches.
    
*   Asking for a credit card during signup will drastically cut down signups. I need to improve my onboarding, docs, etc before I can safely implement this.
    
*   I can also ask for company email signups only. I don't do this simply because we have heaps of valid paying users who signed up via gmail, yahoo or other providers.
