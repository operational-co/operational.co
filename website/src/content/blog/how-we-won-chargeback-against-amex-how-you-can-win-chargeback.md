---
id: 13
status: "published"
sort: 5
date_created: "2024-06-10T03:56:19.000Z"
date_updated: "2025-02-05T00:57:20.000Z"
title: "How we won a chargeback against Amex (and you can win one too!)"
subtitle: "Our epic saga on how we won two disputes against us by AMEX bank."
slug: "how-we-won-chargeback-against-amex-how-you-can-win-chargeback"
category: null
banner: "/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/banner.webp"
banner_og: "/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/banner-og.jpg"
banner_id: "b63f7188-559d-4530-a2f7-d289d170c225"
banner_og_id: "72bfdcf7-c795-489f-940e-a9903c589cab"
---
Here's a tale for the grandkids. My business got 2 chargebacks and we.. won?

What makes it even more interesting is that the chargebacks were filed through Amex. For those not in the known, Amex loves chargebacks. They are infamously known for always siding with the customer.

If you don't know much about chargebacks and would like to know more, here's an [in-depth article](https://operational.co/articles/complete-guide-on-chargebacks-for-saas-businesses) I wrote sometime ago.

## How it all started+

This customer, we'll call them C, signed up sometime in January. Their trial ended and they promptly signed up for our paid subscription.

After about 2 months of usage, their card payment failed so we deactivated their account(our business rule) and sent them an email letting them know about it.

A few weeks after this, they filed a chargeback for their last payment.

Here's where things turned spicy. A day after they filed a chargeback, we sent them an email stating that we intend to dispute the chargeback unless they revert the chargeback. If they do revert, we promise to refund them their amount.

![The damage has been done. I might as well collect my pound of flesh.](/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/inline-ac48d6b9-9d25-493b-837b-d1d18c11c962.webp)

The damage has been done. I might as well collect my pound of flesh.

Next thing you know, C filed another chargeback for their first transaction a day after this email was sent. Whether this was done in vendetta or there was a time lag, we don't know.

Obviously we banned C but the damage was done. I had to dispute the chargebacks now.

## Disputing the chargebacks

Amex gave us 14 days to dispute the chargeback. Since we have a short timeframe to gather dispute evidence, we immediately went to work.

First, we did some research into this specific chargeback type. We were hit with a "subscription cancelled" chargeback. Contesting this means understanding what this means.

Aside from the chargeback type, Stripe also gives a specific chargeback code. This chargeback code maps to the bank/card's internal dispute code system, and is more relevant to the chargeback.

In our case, it was code 4544. 

So we looked up Amex's definition of chargeback code 4544. Here's a handy [list of all chargeback codes](https://www.americanexpress.com/content/dam/amex/au/en/merchant/static/chargebackcodeguide.pdf) for Amex.

According to Amex's docs, in order to challenge and win this chargeback, I'll need to prove this:  

*   Proof that a correcting Transaction, which directly offsets the disputed Transaction, has already been processed.
    
*   Evidence that this Chargeback was raised in error and the disputed Transaction does not qualify under this Chargeback reason.
    

Quite frankly, this sounded vague. I pondered over this for some time and came with this conclusion - The first line meant that I had already processed a refund, which is not true, so I'll ignore that. The second line means that the chargeback was in error. Now to prove this I need to show that:

*   The customer never cancelled their subscription.
    
*   The customer willingly signed up to our service and read our Terms, which state that they have 30 days to get a refund AND they can cancel their subscription anytime from within the app.
    
*   We also need to give the banks other documents with kyc data.

Alright, let's get to work.

First, we prepared a pdf doc with these bits:

*   A basic description of our business
    
*   Timeline of the events
    
*   Proof that this chargeback was in error
    
*   Proof that the customer agreed to the terms of Sale
    
*   Activity logs
    
*   Refund policy
    

We created a single pdf with all the information needed to dispute. Stripe also wants documents with various details, so we also created 4 other documents:

*   refund and cancellation policy doc
    
*   Invoice of the transaction(from Stripe)
    
*   Terms of sale
    
*   A basic pdf describing our business
    

![Phew, this took a lot of time](/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/inline-00b376ba-bffa-4344-9d73-87a5ec068ddd.webp)

Phew, this took a lot of time

Since both chargebacks were similar in nature, we sent the same documents in the other dispute(but modified the main customer communications pdf)

In case you're wondering what I wrote down, here's a combination of all these [files in a single document](/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/inline-16875bc2-cf22-45de-876b-cb29a57594ad.bin). All customer emails are replaced with \[redacted\].

I used the information I gathered about the Amex code and gave an angle to the document. This was in the section  "Proof the chargeback was in error". I also tried using the same language these banks used in their codes pdf.

We also sent a activity log seperately. This was a csv with the ip addresses of all logins of C.

Here's how it looked like:

![First 3 columns are ids. One of them is the userId. Fourth column is IP address. Fifth column is datetime field](/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/inline-de4d11d4-c8a7-4462-b862-469996418c9e.webp)

First 3 columns are ids. One of them is the userId. Fourth column is IP address. Fifth column is datetime field

I collect this information and store it in my database. It was trivial exporting this as a csv using Sequel Ace.

## Submitting dispute evidence

Submitting these documents through Stripe is relatively straightforward. Try to submit as many documents as you can, even if it feels like overkill. I believe we gave Stripe 4-5 documents.

During this process, Stripe will guide you through the documentation process.

![I left the access activity log blank but uploaded a csv with the login data](/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/inline-6c14cb7e-2766-4038-ae7e-94d15c85a688.webp)

I left the access activity log blank but uploaded a csv with the login data

For the Refund and cancellation section. I took a screenshot of the signup page and uploaded it as part of the document. And I clicked on 'Yes'(the screenshot is incorrect here)

![Finally done, now sit back and wait.. for 3 months!](/images/blog/how-we-won-chargeback-against-amex-how-you-can-win-chargeback/inline-f485bab1-569b-4dd2-b160-ecfa6a46cadc.webp)

Finally done, now sit back and wait.. for 3 months!

The entire submission process was quite smooth. Note that once you submit, you cannot amend your application.

Once you're done with the application, don't expect a quick reply. Banks usually take 2-3 months to decide. In our case it took just a bit less than 3 months.

## Pyrrhic victory

Thinking nothing of it, I continued on as usual with Swipekit. Come May 30th, we got notifications from Stripe that we won! We got the original amount back. Yaaa!

To be clear, this chargeback was filed under 'subscription\_cancelled'. I've been told it's nearly impossible winning 'fraudulent' chargebacks.

However, if I were to count the hours I spent gathering the evidence and managing the whole situation, it felt like a slap on the face. Plus my dispute activity was still the same as before(not that it mattered too much - we already have low dispute activity)

All in all, it definitely felt like a pyrrhic victory. The only satisfaction was the delight from knowing C had to eat $60.

## Learnings

Since writing this article, we haven't got a single chargeback. After this incident I spent a lot of time honing our processes to ensure this never happens again. And even if it happens we're prepared.

Here's my learnings from dealing with chargebacks:

*   Make sure you control the signup flow. Don't allow [bad actors to signup](https://operational.co/articles/how-to-get-high-quality-users-for-your-b2b-saas) at all.
    
*   Banks weirdly need to know the customer's login activity for contesting disputes. Store login details like the ip address and the userId of all customers in a database table.
    
*   Make sure your (Stripe)Radar rules are solid. I'll write a seperate article on this topic.
    
*   Make sure you have a solid Terms and Conditions page. People do read this.
    
*   Make sure your cancellation flow is simple and easy to process. The default cancellation flow that Stripe checkout comes with, is not good enough.
    

Funnily, a few months ago I got notified about this customer trying to login back in -  unsuccessfully of course.
