# Changelog

All notable changes to this project will be documented in this file.

> I’m starting this change log while we’re in pre-release so that we have a log of changes (announcing the changes on Mastodon only works so far). Note that until we reach API version 1, all changes could potentially be breaking changes.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Kitten does not use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) but has a version string based on release date and commit hash. Pre version API version 1, changes will be listed under the date alone.

## [1.0.0] - 2026-03-18

### Breaking changes

  - Forked from [express-busboy](https://github.com/yahoo/express-busboy) to implement `rawBody` property on request (necessary, for example, for webhook signature validation). Forked as [they already rejected a pull request for keeping a `rawBody` property in the request](https://github.com/yahoo/express-busboy/pull/36), stating that this is not the direction for that project.

    The implemented alternative in express-busboy doesn’t work for [Kitten](https://kitten.small-web.org) as Kitten apps (at least currently) cannot configure the middleware stack and set options directly on busboy.

    Kitten should also support `rawBody` on requests other than JSON ones in case people want to perform signature verification on other types of requests.

  - Renamed to @small-web/kitten-busboy.
  
  - The `extend` method is now typed to expect a [Polka](https://github.com/lukeed/polka) application instead instead of an Express one (Kitten uses Polka).

## Pre 2026-03-18

Please see [express-busboy](https://github.com/yahoo/express-busboy)
