---
layout: post
title: "How to Keep Heroku Apps Awake with Google Apps Script"
date: 2013-09-23 21:00:00
categories: heroku rails google apps script
---
I recently [tweeted] that Heroku apps with only one dyno will go to sleep after an
hour if the app doesn't receive any traffic.  More information about Heroku's
sleep policy can be found at [Heroku's blog post]. In order to prevent that from
happening, you just need to "ping" that app within that hour window.

Recently, [Nathan Bradshaw] showed me a great hack to keep Heroku Apps awake
with Google Apps Scripts.  Google Apps Script is a JavaScript cloud scripting
language that can be used to automate tasks using triggers.

**Inorder to use Google Apps Scripts you first need to have a Google account and
head over to your Google Drive and create a new script.**

1.  If you are new to Google App Scripts you first need to connect the Google
    Apps Script App to the rest of your existing Apps.  (Docs, Presentation,
    Spreadsheets, etc)
    ![Add Google App Script][connect google app scripts]
2.  After adding the Google Apps Script app, select the Create button and select
    the Script option.  Select the "Blank Project" option.
3.  Within the myFunction() definition type:
    ```
    UrlFetchApp.fetch("http://appname.herokuapp.com");
    ```
    ![Code][code]
4.  Next set the project's trigger by selecting: Resources -> Current project's
    triggers.  Make sure you select Time-driven, Minutes timer and select the 15
    minutes or the 30 minutes option.
    ![Project Triggers][project triggers]
5.  (Optional) If you want to be notified when the trigger fails select the
    "notifications" option and select the email address that you want to receive
    the notification.
6.  Select the "Save" button and then rename the script to something useful.
    (e.g. ping-appname-heroku)
7.  Select the "Run" button to make sure the script executes correctly.

So now whenever you go to your Heroku app, it should respond right away without
that annoying spin-up time that seem to last an eternity especially when you are
trying to demo your app to a potential employer.

**-Update:** (2013-10-08) I think Heroku might of started to block this method of
keeping a Heroku app awake.  I've been witnessing many failure notices from
Google App Scripts notification.  So with is in mind I suggest using the [New
Relic Heroku Standard Plan add-on] for your app.  The add-on will ping your
app every 30 seconds and also provide you performance monitoring.  Despite being more complicated
than the approach I've outlined above, it is fairly straight forward.

## Heroku Web Interface
1.  After logging into your Heroku Dashboard, select the Resources link of the
    app you want to add the New Relic Standard Add-on.
2.  In the Add-ons section, select the Get Add-ons link and search for New
    Relic.  Select the New Relic search result.
3.  Make sure you select the Standard plan.
4.  Select the app you want start monitoring and then select the Add Standard
    for Free button.
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
In order to start the pinging, you need to then enable the **availability
monitoring feature**.  Select your application and under the Reports ->
Availability tab, enable availability monitoring and enter the URL of your
application.  Leave everthing else to the defaults and select the Save your
changes button.  Make sure you also enter your email address for downtime
notifications and also select the Save the notification email button.

There you have it, now you have a fully "sanctioned" way to keep your Heroku app
awake and you get performance monitoring to boot.  Win-Win.

[tweeted]: https://twitter.com/xiaogwu/status/380757001745088512
[Heroku's blog post]: https://blog.heroku.com/archives/2013/6/20/app_sleeping_on_heroku?mkt_tok=3RkMMJWWfF9wsRonuq%2FPZKXonjHpfsX57O0uWqC%2FlMI%2F0ER3fOvrPUfGjI4ATsNqI%2BSLDwEYGJlv6SgFQrjAMapmyLgLUhE%3D
[Nathan Bradshaw]: https://twitter.com/nbashaw
[connect google app scripts]: http://note.io/15o37HY
[project triggers]: http://note.io/18TOqaq
[code]: http://note.io/18TRaEx
[New Relic Heroku Standard Plan add-on]: https://addons-sso.heroku.com/apps/locale/addons/newrelic:standard

