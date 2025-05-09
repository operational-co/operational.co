<p align="center">
  <a href="https://operational.co">
    <img src="media/operational-banner.jpg" width="800px" alt="Operational Event tracker" />
  </a>
</p>

<p align="center">
    <a href="https://operational.co" target="_blank">Website</a> |
    <a href="https://operational.co/api" target="_blank">Docs</a> |
    <a href="https://operational.co/selfhosted/introduction" target="_blank">Self-hosting</a> |
    <a href="https://operational.co/pitch" target="_blank">Pitch</a> |
    <a href="https://operational.co/other/vision" target="_blank">Vision</a>
    <br /><br />
</p>

[Operational.co](https://operational.co) is a open-source Event tracking tool. Monitor signups, webhooks, cronjobs and more.

Operational is a Open source alternative to Logsnag, another Event tracking tool in the same category.

![Operational Event tracker](media/operational-screenshot.png?v=1)

### Why use Operational?

- Get push notifications for critical events straight to your phone, or on the webapp
- Monitor critical events
- Trigger webhooks via action buttons
- Understand complex events via contexts(events-in-events)
- Usable on mobile as a progressive web app(can receive push notifications on mobile too)
- Built for tech businesses

## How to use Operational?

There are two ways to use Operational:

- Join the waitlist on [Discord](https://discord.gg/QmfGeMGM)
- Self-host [Operational](https://operational.co/selfhosted)

### Highlights

- Heaps of self-hosting options, from Render.com to docker images, with video guides. We want you to self-host!
- Very few 3rd party dependencies. No need to install clickhouse in the open source version.
- Feature packed. Send json, formatted json, bundle up logs in contexts, add action buttons, and more.
- Easy to grok and tear apart - no useless dependencies, nor unnecessarily complex code.

## Community

We have a active [Discord](https://discord.gg/QmfGeMGM) community. We highly recommend jumping on our Discord server for updates, feedback and help.

## Technology

Operational has a dead-simple tech stack:

- Nodejs >=18
- Mysql 8.x
- Prismajs
- Clickhouse(optional)
- Expressjs 5.x
- Vue 3
- Vite

Operational itself is a monorepo of 3 repos:

- /app the SPA for operational.co
- /backend the expressjs app powering the backend

- /website astrojs marketing website
- /packages folder has public npm packages which are shared across all repos.
