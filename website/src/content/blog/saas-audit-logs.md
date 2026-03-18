---
id: 21
status: "draft"
sort: 15
date_created: "2024-07-18T06:10:58.000Z"
date_updated: "2025-02-05T00:59:30.000Z"
title: "How to setup audit logs for your SaaS?"
subtitle: "A basic guide on how to setup audit logs for your SaaS"
slug: "saas-audit-logs"
category: null
banner: "/images/blog/saas-audit-logs/banner.jpg"
banner_og: "/images/blog/saas-audit-logs/banner-og.jpg"
banner_id: "a6fb7ac3-4b55-4305-8d57-d88d4eda98f0"
banner_og_id: "e04447ec-9eef-49cf-8c55-9c0c91b3dff7"
---
Why setup audit logs?

Audit logs might sound entreprisey, but they aren't. Lots of small businesses have logs, they might have different names like session logs, logins, etc but they all do the same thing:

Keep track of compliance

Why compliance?

Let's say you have a user who's using your product. One day, they raise a support issue and ask you why are they getting charged when they have cancelled their subscription.

This can wreck your day so you need to dig into your audit logs and check their activity.

What events should you track?

At the very least, you should be tracking these events:

signuploginlogoutbilling flowreset password requestpassword resetupdate profileupdate email

The first 3 are obvious. I also highly recommend tracking ip address in those logs in case you might need to battle a chargeback in the future.

Auditing billing flow is crucial because you need to know whether users completed their billing flow successfully or were they hampered by technical problems. Stripe's webhooks contain a ton of data, unfortunately this also leads to implementation complexity.

For reset password request, this can help you track whether someone was maliciously tring to reset your user's password.

Password reset, update profile and update email are all for tracking critical events. For instance, if a user didn't receive their invoice email and they complain later on about it, you can always refer to your logs and see if they updated their email.

PS, when you allow users to update their email, always get them to verify their new email address before you update their email address in your database.

Closing thoughts

Now you can track a whole host of events. This was just a primer on what you might track.

You can go forth and track these things too:

Whenever they receive a transactional email from you(record the email type too)Certain stripe webhooks for the user(payment details created, updated, card updated, removed, plan upgraded/downgraded, etc)When they invite their team members(in a workspace setting)When said workmate accepts their inviteAccount deletions

For the last point, always always keep their audit logs around. I don't care how privacy conscious you are, if your user deletes their account and you're not storing audit logs for at least a few months, you're in a world of suffering.

Final thoughts
