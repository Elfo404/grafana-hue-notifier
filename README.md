# Hue Grafana Notifier

> A simple fastify webhook to sync alerting state of your local Grafana dashboard with Philips Hue.

## Why?

Because it's fun.

## Introduction

Philips Hue Bridge allows local and remote controlling of your lights via a RESTful API, why not use it to turn your home in you NOC room?

This webhook will light up a configurable light group when an alert notification is sent to it.

When a notification is sent to the webhook, if the state is `alerting` it will turn on the defined light group and set its color to red.
If the state is `ok` it will set the color to a more reassuring green, but without turning on the lights (as in "you'll only see the green lights if you previously received an `alerting` notification").

## Setup

In order to interact with the Hue Bridge you need to know your light group id.

In addition you need to create an API user and get a `token` with which this webhook will authenticate against the Hue Bridge.

### Environment variables

```env
PORT=3001
HUE_USERNAME=
HUE_GROUP_ID=
```

### Generating an API user and list available light groups

```bash
docker build -t grafana-hue-notifier . && docker run --net=host grafana-hue-notifier npm run setup
```
