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

**-Update:** (2013-10-08) See my new post [Using New Relic Heroku Monitoring to
Keep Apps Awake] as I think Heroku might be blocking this method.

[tweeted]: https://twitter.com/xiaogwu/status/380757001745088512
[Heroku's blog post]: https://blog.heroku.com/archives/2013/6/20/app_sleeping_on_heroku?mkt_tok=3RkMMJWWfF9wsRonuq%2FPZKXonjHpfsX57O0uWqC%2FlMI%2F0ER3fOvrPUfGjI4ATsNqI%2BSLDwEYGJlv6SgFQrjAMapmyLgLUhE%3D
[Nathan Bradshaw]: https://twitter.com/nbashaw
[connect google app scripts]: http://note.io/15o37HY
[project triggers]: http://note.io/18TOqaq
[code]: http://note.io/18TRaEx
[Using New Relic Heroku Monitoring to Keep Apps Awake]: {% post_url 2013-10-08-new-relic-heroku-monitoring %}
