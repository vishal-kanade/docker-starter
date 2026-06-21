# Everything Cloud Docker Starter

Sample Next.js app for customer Docker hosting on Everything Cloud. The **starter app has no database** — `docker-compose.yml` still includes an **app** and **db** service as the template customers should follow. nginx, SSL, and domain routing are managed by the platform.

## Quick start (local)

```bash
cp .env.example .env
docker compose up --build
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The page shows your configured `APP_URL` and `APP_PORT`.

## Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `APP_URL` | Public site URL (no trailing slash) | `http://localhost:3000` |
| `APP_PORT` | Host port for reverse proxy binding | `3000` |
| `PORT` | Port Next.js listens on inside the container | `3000` |
| `POSTGRES_*` | Credentials for the **db** service in compose (unused by this starter) | see `.env.example` |

Compose publishes the app on `127.0.0.1:${APP_PORT}` so only the managed nginx on the host can reach it.

## Admin: seed on aaPanel

1. Push this folder to a git repository (public or private with deploy token).
2. Clone it into the customer app directory on the server (the ops root that contains `docker-compose.yml`).
3. Copy `.env.example` to `.env` and set `APP_URL` to the customer domain and `APP_PORT` to the nginx upstream port.
4. Run `docker compose up -d --build`.
5. In the HMS admin order view, link the aaPanel proxy site and check **Starter git repo is on server (hello-world)** if applicable.

Customers can later connect their own repository from the hosting portal; `.env` files are preserved on re-clone.

## What customers should not add

Do not add nginx, Caddy, Traefik, or certbot services to `docker-compose.yml`. Everything Cloud manages the reverse proxy and SSL in front of `127.0.0.1:${APP_PORT}`.

When customers replace this starter with their own app, they should connect to the **db** service using `DATABASE_URL=postgresql://...@db:5432/...` and add `depends_on` with a healthcheck as shown on the starter page.

## Development without Docker

```bash
npm ci
cp .env.example .env
npm run dev
```
