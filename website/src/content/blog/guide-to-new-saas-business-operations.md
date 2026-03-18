---
id: 19
status: "published"
sort: 12
date_created: "2024-06-19T01:59:49.000Z"
date_updated: "2025-02-05T00:58:31.000Z"
title: "Basic Guide to Setting Up Your New SaaS business's Operations"
subtitle: "A practical guide to setting up operational foundations for your new SaaS business. Covering domain management, email setup, transactional & marketing emails."
slug: "guide-to-new-saas-business-operations"
category: null
banner: "/images/blog/guide-to-new-saas-business-operations/banner.webp"
banner_og: "/images/blog/guide-to-new-saas-business-operations/banner-og.jpg"
banner_id: "d25cafc3-eae2-40b9-957d-9a7baa48a458"
banner_og_id: "abac0bb7-9eae-41b7-acca-eaeea855aedd"
---
Starting a SaaS biz requires more than just writing code. Before diving deep into coding, here's a list of operations you can setup to avoid confusion and unnecessary bikeshedding later on.

This guide covers key areas like domain setup, email management, transactional and marketing emails, and proper documentation. By handling these early, you’ll save time, avoid confusion, and make your business more manageable.

## Domain Setup
Choosing the right domain is crucial for branding and credibility. A strong domain makes your business look professional and helps users trust your brand. I recommend using [Domainr](https://domainr.com) to find a good domain name. Once you've chosen one, register it with a service like Cloudflare.

I recommend favouring support and developer experience over price. Saving a few bucks for a yearly domain won't help you much. Unfortunately most domain providers don't provide good support. You're better off picking stability over price.

To manage your domain, use [Cloudflare](https://www.cloudflare.com) for DNS resolution. Alternatives like AWS Route 53 and BunnyCDN are also solid choices.

Your domain should be structured as `xyz.com` for your landing page and `app.xyz.com` for your web app. Always enable SSL for security and keep URLs clean by avoiding `www` in your domain. Feel free to break these rules but this has become a standard of sorts for new businesses and it is in your best interest to stick to this convention.

## Email Setup
Setting up a email ensures your business appears legitimate and helps with deliverability. [Google Workspace](https://workspace.google.com) is a solid choice because emails sent from it are widely accepted, and it has higher cold email limits(than standard gmail). If you need alternatives, consider Zoho Mail, Fastmail, or ProtonMail if you value privacy.

## Transactional Emails
Your webapp will need to send automated emails like password resets and notifications. I recommend Resend of its simple setup and competitive pricing. Other alternatives include Postmark, Amazon SES(really cheap), and Mailgun.

## Marketing Emails
If you want to collect emails and send marketing campaigns, you need an email marketing service. If you’re just starting and want something affordable, Mailcoach or EmailOctopus are easy to set up. In particular Mailcoach is really cheap and I recommend it.
![](/images/blog/guide-to-new-saas-business-operations/inline-7b2c90a5-8ab7-4412-9b5c-cdafb3cbd2e7.png)

If you need a more advanced setup with automation, consider Resend's marketing email feature, Loops, Encharge, or Userlist. The goal is to make sure you can engage and retain your customers effectively.

## Documentation
This is arguably the most important step. You want to keep ALL your information organized somewhere. I recommend Notion for documenting server logins, app credentials, server setups, workflows, etc.

Here's my Notion for managing Swipekit:
![](/images/blog/guide-to-new-saas-business-operations/inline-5770c00e-3420-4579-b62b-8d24c3aeead6.png)

Having everything in one place prevents confusion and makes it easy to onboard new team members. If you prefer alternatives, Obsidian (great for offline use), Confluence, or even Google Docs can work just as well. The key is to ensure that your documentation is structured, accessible and available in one place.

## Closing Thoughts
Set up these foundational elements after conducting market research but before starting development.
This ensures less headaches, minimizes technical issues later, and allows you to focus on building your SaaS without distractions.


