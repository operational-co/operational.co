---
id: 31
status: "published"
sort: null
date_created: "2025-08-07T10:41:24.000Z"
date_updated: "2025-08-07T14:33:16.000Z"
title: "My experience running a Commercial OSS project"
subtitle: "How I created Operational.co's OSS component and all the ups and downs."
slug: "commercial-open-source-software"
category: null
banner: "/images/blog/commercial-open-source-software/banner.png"
banner_og: null
banner_id: "d82ec5e1-22c5-45b2-b605-2b4c1ca6d30f"
banner_og_id: null
---
I’ve been running Operational.co as a COSS (Commercial Open-Source Software) offering since early this year. Below are my reflections on maintaining the open-source side of the project.

**What is COSS?**

COSS refers to software that are fully open source but also offers a paid component - usually its a managed SaaS. Popular examples include WordPress, Cal.com, PostHog, and the majority of YC-backed tools these days.

**Why does it matter?**

COSS often gets a bad reputation for being “open source in name only.” You get all the marketing benefits of OSS like social buzz, backlinks, free testers and contributors - without the effort required to make it truly self-hostable, to respond promptly on GitHub, or to cater to self-hosters who want to run it on their own infrastructure:

![](/images/blog/commercial-open-source-software/inline-3e721523-c63c-487c-9acd-980b1105b0b1.png)
*Folks on Hacker News complaining about PostHog’s OSS edition*

It’s easy to pitch (“open-source Google Drive alternative” sounds sexier than “self-hostable file storage software”), but the real work is in making self-hosting frictionless(think Wordpress).

For Operational, we deliberately prioritized genuine OSS values so self-hosters could host without any major hassle.

## The reality

Since launch, we ran into a few painful challenges:

### 1. A completely different Ideal Customer Profile(ICP)

We built Operational for SaaS teams—but instead got a flood of homelab hackers using it for niche projects.

That’s fine if your project is mature, but in early days it sends misleading signals. If we’d chased those niche use-cases, we’d have divebombed the core product.

### 2. Massive effort just to self-host

Gone are the days when you could FTP up a few PHP files and call it a day. Today you need polished, step-by-step guides for major deployment target:

* **Docker.** “Sure, just run a container”, except there are a million ways to configure Docker, and none of them standard.*
* **PaaS platforms.** Render, Railway, DigitalOcean App Platform… each has its own quirks, so you'll dedicated docs.
* **Vanilla VPS.** Ironically, we found it easiest to write a VPS guide, but almost nobody follows it. They all want PaaS or Docker.

Spending so much time on hosting docs meant slower feature releases.

### 3. Careful selection of third-party APIs

If your software is OSS and you want to make self-hosting seamless, you can’t rely on proprietary services without offering a drop-in replacement. For transactional emails, we use plain SMTP instead of Loops email marketing. Otherwise every self-host would need to sign up for yet another paid service.

![](/images/blog/commercial-open-source-software/inline-2d252208-8b14-488a-9f0d-ad1e2d868c5e.png)
*Dub.co’s hosting requirements are.. something*

Environment variables are also a pain in the butt. Public repo, public vars, potential key leaks. You gotta be vigilant on every push.

### 4. Managing proprietary code

Not everything can go public. Think user-ban logic, commercial analytics, or billing integrations. This includes:

* **Private repo** for sensitive modules.
* **Separate orchestration server** to handle commercial only features.

We haven’t landed on a perfect solution yet.

## What I’d do differently

* **Docker only.** Focus on a single, battle-tested Docker guide. 99% of self-hosters use that. Skip specific guides for every PaaS.
* **Skip Discord.** We never got useful feedback there. GitHub Issues and email support would’ve been more efficient—and less of a time sink.

Ther are a couple of other things I'd done differently. However its too early to call it

## Should you launch a COSS project?

Go for it if:

* You have a massive total addressable market (e.g. Google-style alternatives, email marketing tools).
* Few credible open-source alternatives exist.
* You’re ready to invest extra effort in community and self-hosting.
* You don't have proprietary code in part of your codebase(that you're uncomfortable releasing publicly)

If your goal is traction, a free-tier SaaS seems to be more effective than a fully open-source version.

OSS magnets backlinks and social buzz, but most users will still opt for the free plan in your managed hosting over self-hosting it themselves

> **Note:** I’m not throwing shade at other COSS projects - they have it tough. FTP era simplicity is long gone, and that makes genuine COSS a lot more work than it used to be.

---

\* Most self-hosters don’t run Docker directly, they go via PaaS, which introduces CORS, port, and proxy headaches. Docker itself isn’t the problem; it’s the plumbing around it.

\*\* I personally loathe using Discord as a primary support channel. It offloads your support burden onto other users. I’d rather do real one-on-one help.

