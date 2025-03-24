=== Operational ===
Contributors: shash122tfu
Donate link: https://operational.co
Tags: Activity log, Event log, Admin log, Event Tracker, logger
Requires at least: 5.9
Tested up to: 6.7
Stable tag: 1.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Track Admin area activity 

== Description ==

Track and receive notifications for who logged in, who changed the theme, who activated/deactivated a plugin, failed login attempts, password requests, etc.

Note: This plugin required a operational.co account. Operational is a SaaS Event tracker tool for tech products.

Why use this?

- Event logs are stored on external servers. If your website goes down, your logs don't go down.
- With existing Wordpress activity log plugins, they add logs in your Wordpress website, which might slow down your website
- Unlike Wordpress activity log plugins, you can receive mobile notifications for your activity logs.

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload `operational.php` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Do I need to have a operational.co account? =

Yes

= What if I want to track a event by coding? =

This is doable, please read the docs at https://operational.co/api

== Screenshots ==

1. Operational main banner
2. Track everything inside your site
3. Use Operational on the go
4. Send events from your theme

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 1.1.0 =
* Updated api and made it simpler.
* Added detailed instructions inside the admin page for running the code inside your own theme's functions.php
* Removes plugin specific options when plugin is deactivated.

= 1.0 =
* Initial version