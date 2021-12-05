# Bookmark API

This project is a simple REST API, built with [**Deno**](https://deno.land/).

It is using Deno's [**oak**](https://deno.land/x/oak) and [**mongo**](https://deno.land/x/mongo) modules.

## Requirements
- **Deno**: https://deno.land/#installation
- **MongoDB**: https://www.mongodb.com/download-center/community
- **Denon**: https://deno.land/x/denon

## Getting Started

**Clone the repo:**

```bash
git clone git@github.com:ngdong/bookmark-chrome-extension.git
cd bookmark-chrome-extension/backend
```

**Set the environment variables:**

```bash
cp .env.example .env
```

**Run the app:**

```bash
  denon start
```


**Run the test:**

```bash
  denon test
```

**Deploy heroku:**

```bash
  npm install -g heroku
  heroku login
  heroku git:remote -a [project_name]
  heroku buildpacks:set https://github.com/chibat/heroku-buildpack-deno.git
  git push heroku master
```
