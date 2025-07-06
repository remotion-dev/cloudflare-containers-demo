# Remotion on Cloudflare Workers

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.gif">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

A minimal Remotion server that runs on Cloudflare Containers.

## Requirements

- You have a Cloudflare account.
- You have enabled the Paid Workers plan (otherwise you'll get an "Unauthorized" error when running `wrangler deploy`).
- You have signed in into the Wrangler CLI with `wrangler login`.

## Setup

Step 1: Install dependencies

```
npm i
```

Step 2: Add your Cloudflare credentials to `wrangler.toml`:

```toml
[vars]
# Create a new R2 bucket in your Cloudflare account
R2_BUCKET_NAME = "cloudflare-container-service"
# How to find your Cloudflare account ID: https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/#users-with-a-single-account
CLOUDFLARE_ACCOUNT_ID = "2fe488b3b0f4deee223aef7464784c46"
```

Step 3: Generate the types

```
npx wrangler types
```

## Development

```
npx wrangler dev --remote
```

**Note**: Without the `--remote` flag, the video will not actually be saved to the R2 bucket.  
Run without the flag to test locally.

## Deployment

```
npx wrangler deploy
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
