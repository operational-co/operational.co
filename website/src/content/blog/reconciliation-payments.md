---
id: 25
status: "published"
sort: 14
date_created: "2024-09-23T12:23:46.000Z"
date_updated: "2025-02-04T04:15:39.000Z"
title: "Why we reconcile payments? (And how we do it)"
subtitle: "Reconciling payments helps us mitigate errors with Stripe. Here's how we do it."
slug: "reconciliation-payments"
category: null
banner: "/images/blog/reconciliation-payments/banner.webp"
banner_og: null
banner_id: "c2107809-7f11-43d0-bd56-f00c00645be1"
banner_og_id: null
---
If you’re accepting payments online, you’re likely using Stripe, PayPal, or another fintech provider. These platforms maintain a customer record on their end, which means that every user in your system also exists as a customer in theirs.

Whenever you update a user’s details, you should also update their corresponding customer record in Stripe. However, most of these systems rely on webhooks to sync changes, and webhooks are notoriously unreliable. They fail all the time, can be difficult to debug, and often lead to inconsistencies between your database and Stripe’s records.

## Why Reconciliation is Necessary

Without proper reconciliation, you can run into serious issues like:

- A user who hasn’t paid still having access to your product.
- A user who has paid is being locked out due to a missing record or a flag.
- A deleted user still having an active subscription in Stripe.

These kinds of mismatches can cause frustration for users and lead to lost revenue or disputes. To avoid these problems, we regularly reconcile our payment records.

## How We Reconcile Payments
The process is straightforward: we systematically compare all Stripe records with our database records and vice versa.

We do this with a cronjob. This cronjob runs daily and does the following:

- Goes through all paid users.
- Checks whether they have a stripe customerId
- Checks whether their current stripe plan is active(via the customerId)

### Checking Stripe Against Our Database
First, we pull all active subscriptions from Stripe and extract their customer IDs. Then, we check if each of those customers exists in our database with an active status. If there’s a mismatch, we flag it for manual review.

### Checking Our Database Against Stripe
Next, we take all paying users from our database and ensure that they have a corresponding customer record in Stripe with a valid payment status. If we find a user who should be paying but isn’t reflected correctly in Stripe, we investigate the discrepancy.

## Handling Reconciliation Issues
Whenever an issue is detected, I receive a notification and manually investigate the problem.

Depending on how payments are processed and how our database is structured, the resolution may vary.

In some cases, it’s as simple as deactiving a user who's not paying; in others, it might require contacting Stripe support or updating our internal logic.

## Lessons Learned
We first discovered this issue when we noticed that some users had been using our product for months without paying. It wasn’t an obvious bug, just a silent failure where Stripe’s webhooks didn’t sync properly.

Some people might think, "Maybe the code is broken?" That’s always a possibility, but in reality, this one process helps me sleep better at night knowing our revenue tracking is accurate and fair.

## Final Thoughts
If you’re running a SaaS that relies on recurring payments, take reconciliation seriously. Payment processors aren’t perfect, and errors will happen. By proactively auditing records, you can prevent revenue leakage, reduce disputes, and ensure that users are charged correctly for the services they use.


