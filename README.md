# Raspberry Pi Zero Picture Frame

Raspberry Pi-powered digital photo frame that displays images from a Google Photos album.

> NOTE: Only tested on a Raspberry Pi Zero.

## What's inside?

- Node.js Photo downloader and manager for the [feh image viewer](https://feh.finalrewind.org/) subprocess.
- [xserver](https://github.com/balena-labs-projects/xserver) as a minimal X11 server.
- [wifi-connect](https://github.com/balena-os/wifi-connect) for easy WiFi configuration.

## Why not use Balena Photo Slideshow?

The Raspberry Pi zero is not compatible with [Balena Photo Slideshow](https://github.com/balena-io-experimental/photo-slideshow) since [its component Balena Dash is not compatible with older Raspberry Pi's](https://github.com/balena-labs-projects/balena-dash#hardware-required).

Instead of using a browser, this uses [feh](https://feh.finalrewind.org/) as a minimal image viewer which is more RAM-friendly.

## Setup and configuration

You can deploy this app to a new balenaCloud fleet in one click using the button below:

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/DrSkunk/rpi-zero-picture-frame)

Or, you can create a Fleet in your balenaCloud dashboard and balena push this code to it the traditional way. Just be aware that balenaDash requires that you allocate more memory to the GPU. This is achieved by adding (or editing the existing) the Device configuration variable `Define device GPU memory in megabytes`. For this project we recommend setting it to **128**.

## Setting up the photo album

- On balenaCloud, go to **Device variables D(x)** and add the following:

| ENV VAR         | Description                                                                                           | Default                                |
| --------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- |
| ALBUM_URL       | Gallery URL for **google photos**                                                                     | https://goo.gl/photos/XQ2sGUyPe3swFVga |
| CRON            | Cron scheduler to download new and delete old photos                                                  | 0 0 \* \* \*                           |
| WIDTH           | Width of the downloaded picture                                                                       | 1366                                   |
| DELAY           | Delay between pictures in seconds                                                                     | 10                                     |
| RELOAD_INTERVAL | Interval on when to check **locally** for new pictures. This is parameter is directly passed to `feh` | 60                                     |
