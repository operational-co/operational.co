---
id: 12
status: "published"
sort: 4
date_created: "2023-11-26T01:43:09.000Z"
date_updated: "2025-02-05T00:54:51.000Z"
title: "A complete guide on chargebacks for SaaS businesses"
subtitle: "This is massive guide on understanding chargebacks, avoiding getting hit by one, and contesting one. All tailored for early stage SaaS businesses."
slug: "complete-guide-on-chargebacks-for-saas-businesses"
category: "star"
banner: "/images/blog/complete-guide-on-chargebacks-for-saas-businesses/banner.webp"
banner_og: "/images/blog/complete-guide-on-chargebacks-for-saas-businesses/banner-og.jpg"
banner_id: "3d093402-c996-4b51-8ca1-3d64048163c2"
banner_og_id: "63169f3b-6e26-4549-9e4a-4d104cd03c26"
---
Back when I started my SaaS, there was no decent information on chargebacks. Especially in the context of SaaS businesses.

Over a year of running Swipekit, and having eaten a couple of chargebacks, here's all my knowledge on this topic - so you don't have the same mistakes I made.

Brace yourself, this is a 2000+ word behemoth.

## What is a chargeback?

When a customer starts paying for your SaaS, they are getting into a business relationship. When they believe that your have wrongfully charged that under these two circumstances, they may issue a chargeback:

*   **Charge error** - When a customer believes your services haven't been provided. Eg, product not working.
    
*   **Fraud charge** - When a customer's card was stolen and someone else use their card without their authorization to pay for your product.

These are the two main reasons. There are other sub-reasons too.

[Chase bank explains this](https://www.chase.com/personal/credit-cards/dispute) pretty well. Just scroll down to the second section.

Being issued a chargeback means the business relationship has ended. This is when you need to immediately stop service to the customer.

About fraudulent chargebacks - some users will signup willingly to your service, then after some time, declare their transactions as fraudulent, eg they didn't sign up/pay themselves. Then they will chargeback.

This type of chargeback is categorized as a fraudulent chargeback, but it is commonly known as friendly fraud.

### Why friendly fraud?

Friendly fraud can happen when a user goes through their transactions, see a transaction that they may not recognize, and then subsequently do a chargeback.

Or they may be aware that a charge is valid and still do a chargeback.

Yes this is very much possible.

This happens a lot in ecommerce, where a person buys a product, receives it, and THEN does a chargeback for product not received or stolen credit card.

This type of chargeback is called friendly fraud, and it is unfortunately the most common type of chargeback and also the hardest to contest.

For the rest of this guide, we'll be talking in the context of fraudulent chargebacks.

## Why are chargebacks bad for your business?

Unlike any other variable in your business, a high amount of chargebacks will certainly destroy your business. Think of it as the proverbial meteorite that destroyed the dinosaurs(aka your business).

Here's how it works:

When you get a chargeback, Stripe(or any other payment provider) will increase your dispute activity. This can be viewed in your Stripe dashboard.

When this dispute activity reaches a certain threshold over a certain number of months(eg, 0.75%+ over 3 months), Stripe may start withholding your money over a longer period of time, or even shut down your account permanently.

![If this gets to 0.75% for over 3 months, we're toast](/images/blog/complete-guide-on-chargebacks-for-saas-businesses/inline-8a13a4d4-e62a-4e26-8cfd-8a73431738a7.webp)

If this gets to 0.75% for over 3 months, we're toast

Beyond this, you also need to pay a small fee to Stripe per dispute(~$15USD)

And to make matters worse, scummy customers can dispute charges more than 1 month. So if they have been paying for 4 months, and they chargeback you for those 4 months, you will have 4 different chargebacks issued against you, not just one.

And yes, you need to pay chargeback fee for all 4 months.

And it gets better - even if you win a dispute, your dispute activity still remains high, and you need to pay the fee.

This is why chargebacks are no joke, and you need to take steps to bulletproof your business against chargebacks as early as possible.

## How to reduce chargebacks

There isn't one solution, but rather a whole heap of actionable solutions you can take to strengthen your business against chargebacks.

But first, know your obligations.

As a business owner, you need to make sure you have covered your bases. You can't leave your business processes up to ambiguity.

Ask yourself these questions:

*   Can my users easily cancel their subscription?
    
*   When they sign up, do they agree with my terms?
    
*   Is there a refund process? How does it work?
    
*   Do they get a notification whenever my business charges them on a recurring basis?
    

If you can honestly answer these questions, move on to the next section.

Otherwise, here's what you need to do to fulfill these questions.

### Can my customers easily cancel their subscription?

Your customers should clearly know how to cancel subscriptions. At Swipekit, when someone starts their subscription we send them an email where we transparently tell them they can cancel their subscription from this link. We've also put these instructions in our documentation section.

[Here's the docs for Swipekit](https://swipekit.app/help#how-do-i-cancel-my-paid-subscription-account) explaining users how can they cancel their subscription.

If you're using Stripe portal, know that most customers still find it hard to cancel their subscription from there(from my experience). What they want is explicit terminology around their subscription cancellation. 

![Note the text at the bottom of the form](/images/blog/complete-guide-on-chargebacks-for-saas-businesses/inline-2c0f71d2-682b-4810-a405-22d4d53aa8b2.webp)

Note the text at the bottom of the form

For my own business, I disabled cancellations through portal and implemented my own cancellation form. This helps customers cancel from my app itself, and as a bonus I can collect better insights on why someone cancelled.

### When they sign up, do they agree with my terms?

As part of the signup process, they need to agree to your terms and conditions. You can do this by making them tick a checkbox which tells them they agree to your terms. Obviously if they haven't ticked this checkout, don't allow them to signup.

![You basically need this tickbox to mitigate a whole host of chargebacks](/images/blog/complete-guide-on-chargebacks-for-saas-businesses/inline-7ea20956-7632-489d-a000-bee4bffb4ac4.webp)

You basically need this tickbox to mitigate a whole host of chargebacks

The whole point of getting them to explicitely agree them to your terms is so that when they chargeback you, you can show this process to the bank and tell them the customer agreed to the terms before signing up.

Furthermore you also need to add your refund policies, chargeback policies, etc clearly in your terms.

### Is there a refund process? How does it work?

Having a transparent refund process will alleviate chargeback pain. In most countries, you need to have a 30 day refund process - so I highly recommended making that a standard.

Now, if someone wants a refund, you need to have a clear process. Even if you don't issue refunds for whatever reason, as long as this is made clear to your users, you'll be fine.

Whatever your refund policy is - you need to make sure it is clearly outlined in your terms-of-service page. Here's [Harvest's terms](https://www.getharvest.com/terms-of-service) as an example. Note how clear they are about their refund policy(no refunds)

### Do they get a email when they are charged on a recurring basis?

Your customers need to get an email, sms or something where they are reminded that they will be charged for your product's next month subscription.

If you don't notify them, it will be much harder contesting a chargeback. This is also great because in the case of a chargeback, your emails to the customer will stand up as proof during the dispute process.

If you can answer confidently on ALL the above points, you are protected from most chargeback attempts.

However you can do much more to avoid chargebacks.

### Use Stripe Radar

Chances are, you're using Stripe. And Stripe has a product called Radar. This product is a value add on top of all transactions. Radar essentially allows you to block fraudulent transactions.

How does it work?

Firstly, Radar isn't a drop-in toggle-on-and-say-goodbye-to-chargeback solution. You'll need to configure it. Radar is essentially a bunch of toggles, sliders and rules you configure to allow who gets to pay for your product.

These are the options Radar give you to migitate fraud:

*   Block cards if they are throwaways(like gift cards)
    
*   Block cards by ip, country, etc
    
*   Block cards by Stripe's internal risk score
    
*   Explicitely ask for 3d secure, if available\*\*
    

Surprisingly, there's very little discourse online on setting up Radar properly.

My $2 cents is to block high risk transactions(>60 score), block where anonymous\_ip was used, and block if CVC verification fails.

Beyond this, Radar rules vary greatly between business to business. What one set of rules are applicable to a business, might not work at all for another set of business. You need to figure this out based on your business.

Here's an [article](https://www.chargebackstop.com/) that gives a good general purpose Radar rules, but you'll still need to implement your own specific rules.

Lastly, Radar's risk level score is infamously known to be dodgy. Once your business starts growing, look into using other factors to determine fraudulent users, not just the risk level.

### Disallow low quality customers from signing up

If you're running a B2B business, you actually want to restrict your signup process to allow only vetted users.

This is easier said than done. Apart from asking for a credit card upfront, there are a lot of different verification techniques you can use to get high quality users. [I've made a whole guide on this topic.](https://operational.co/articles/how-to-get-high-quality-users-for-your-b2b-saas)

Not allowing bad customers is the best approach to avoiding chargebacks. Plus you're also sure the high quality users who do sign up will have a greater chance of being paying customers.

### Use the 3rd party products to detect friendly fraud

There are a few products out there which can detect if a card is more likely to chargeback.

This is beyond the scope of this topic but you can look into chargebacks911, chargeblast, etc.

How do these products work? Once you signup and get onboarded, they will 'listen' to chargebacks made on your transactions.

Once a chargeback is made by a customer, it usually take a few hours - to days to actually file the chargeback. During this time you will be notified of the chargeback and you can refund the transaction and take necessary steps against the user.

We have gone through the most common techniques, but at the end of the day, users are gonna chargeback. There's no escaping that.

## When should you contest chargebacks?

Most people in the early stage SaaS category would tell you to eat the cost and move on. This is horrible advice - at least early on.

If anything, you want to fight chargebacks. This will make your review your processes and help you understand what went wrong and how can you prevent something from happening again.

Anyways, here's how it works:

When you get a chargeback, Stripe(or your payment provider) will give you 14 - 30 days to dispute a chargeback. If you don't do anything, the customer wins the dispute automatically.

During these timeframe, you need to gather evidence to tell them that:

*   Hey, this customer signed up on xyz date, logged in on abc date, paid for the product on jkl date. You need to show emails and relevant logs, if any.
    
*   You need to craft a letter that makes it very very obvious that the customer is in-fact, the one who paid for the product.
    
*   Lastly, don't appeal to emotion, appeal to logic. The guy reviewing your dispute probably has 5 minutes max on your case.
    

This will usually result in 3-4 documents. One will be the letter to Stripe documenting the timeline, one will be relevant logs(including ip addresses), another will be customer communications(emails and support logs), etc.

Also, get the reason code for said chargeback. Every bank has a different set of rules for dealing with chargeback disputes and reason codes outline those rules. Look up the reason code for your chargeback and prepare your documents accordingly. Here's [one](https://www.americanexpress.com/content/dam/amex/au/en/merchant/static/chargebackcodeguide.pdf) for amex.

Now send these documents through Stripe and wait for the outcome. Resolution typically takes months so don't hold your breath though.

For gathering evidence, you need to go to your transactional email provider and gather logs. I use Resend which makes this stupidly simple. For chat logs, I simply screenshot chats from Crisp.chat(the chat widget I'm using). I also send a simple about-the-business.pdf which explains at a high level what my business does and why this chargeback was in error.

## Notes

As much as I make chargebacks sound scary, they are relatively rare. They are also more of a concern for younger businesses. More established businesses can easily eat a couple of chargebacks every month without any issues.

PS - if you absolutely loathe the idea of contesting chargebacks, use a merchant-of-records, like Lemon Squeezy, Paddle, etc.

What's a merchant-of-record(MoR)? They essentially charge the customer on your behalf, and then transfer the money to you. Think of them as a middleman. And because of this arrangement, they eat the chargebacks.

### Glossary of important terms

*   B2B - Business-to-Business
    
*   Payment processor - Bank or 3rd party service which processes payment on your behalf. Charges have your business name on them.
    
*   MoR - Merchant of Record. Charges(Statement descriptors) have their name on them.
    
*   Dispute rate - This is the metrics provided by Stripe.
    
*   Dispute activity - This metrics is used by VISA and Mastercard to determine if you're having an above average dispute rate.
    
*   3D Secure - This is when the card holder's bank will issue a OTP to the user to authorize a payment. Doing so shifts the liability to the user's bank, and is usually a good defense against fraudulent chargebacks. Note that Stripe charges you a small amount per 3D Secure attempt.
