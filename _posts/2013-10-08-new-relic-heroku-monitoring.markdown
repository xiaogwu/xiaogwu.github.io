---
layout: post
title: "Using New Relic Heroku Monitoring to Keep Apps Awake"
date: 2013-10-08 16:44:00
categories: new relic heroku rails monitoring
---
In my previous post on [How to Keep Heroku Apps Awake with Google Apps Script]
I detail the steps to creating a simple "ping" mechanism using Google Apps Script
to keep your Heroku App Awake.

Since then, I think Heroku might of started to block this method of
keeping a Heroku app awake.  I've been witnessing many failure notices from
Google App Scripts notification.  So with is in mind I suggest using the [New
Relic Heroku Standard Plan add-on] for your app.  The add-on will ping your
app every 30 seconds and also provide you performance monitoring.  Despite
being more complicated than the approach I've outlined previously, it is fairly
straight forward.

## Heroku Web Interface

1.  After logging into your Heroku Dashboard, select the Resources link of the
    app you want to add the New Relic Standard Add-on.
    ![Heroku App Resource][heroku-app-resource]
2.  In the Add-ons section, select the Get Add-ons link and search for New
    Relic.  Select the New Relic search result.
3.  Make sure you select the Standard plan.
4.  Select the app you want start monitoring and then select the Add Standard
    for Free button.
    ![New Relic Standard][new-relic-standard]
5.  Then New Relic will walk you through the process of signing up if you don't
    have a New Relic account.
6.  After that it's a pretty straight forward six step process:
  1.  Choose your language
  2.  Generate your license key
  3.  Add ``` gem 'newrelic_rpm' ``` to your Gemfile and from your application
directory run ``` bundle install ```
  4.  Download the newrelic.yml into your app's config directory.  Update the
app_name value in the newrelic.yml file.
  5.  Deploy your application
  6.  Wait 5 minutes to see data

## Heroku Toolbelt CLI
1.  Go to the root of your application.
2.  ``` heroku addons:add newrelic:standard ```
3.  Open the New Relic interface ``` heroku addons:open newrelic ```
4.  Then follow the instructions starting with step 6 of the Heroku Web
    Interface.

## Final Step
![New Relic Availability Monitoring][new-relic-availability-monitoring]

In order to start the pinging, you need to then enable the **availability
monitoring feature**.  Select your application and under the Settings ->
Availability monitoring tab, enable availability monitoring and enter the URL of your
application.  Leave everthing else to the defaults and select the Save your
changes button.  Make sure you also enter your email address for downtime
notifications and also select the Save the notification email button.

There you have it, now you have a fully "sanctioned" way to keep your Heroku app
awake and you get performance monitoring to boot.  Win-Win.

[heroku-app-resource]: http://note.io/1e98PO7
[new-relic-standard]: http://note.io/1e9a5kc
[new-relic-availability-monitoring]: http://note.io/1e9bzuX
[New Relic Heroku Standard Plan add-on]: https://addons.heroku.com/newrelic
[How to Keep Heroku Apps Awake with Google Apps Script]: {% post_url 2013-09-23-how-to-keep-heroku-apps-awake %}

