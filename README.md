## Prerequisites

- [Bun](https://bun.sh/) is the default package manager
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) is used to develop Supabase locally
- [Docker]()

## How to start?

```sh
# first attempt
bun install; bun dev;
# to re-install packages
rm ./**/node_modules; bun install;
```

## What's inside?

This monorepo includes the following apps/packages:

### Apps

- `mobile-app`: The Verse U mobile app. Which can be adapted into a static site or native mobile app.
- `assets-manager`: An web-based GUI interface allows staffs to easily manage assets like 3D models, textures, images, etc.
- `website`: The official website of Verse U
- `exhib-machine`: A server runs on the exhibit machine of Verse U Hai-An installation.
- `bots`: This bot runs tasks like clean DB trash data, update player locations periodically.

### Packages

- `shared`: Contains shared logics and `supabase` local dev configurations

## SvelteKit apps

|      app       | adapter |
| :------------: | :-----: |
|   mobile-app   | static  |
| assets-manager |   bun   |
| exhib-machine  |   bun   |
|    website     |  node   |
