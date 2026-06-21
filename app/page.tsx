export const dynamic = "force-dynamic";

function envValue(key: string, fallback: string): string {
  return process.env[key]?.trim() || fallback;
}

const COMPOSE_SNIPPET = `services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "127.0.0.1:\${APP_PORT:-3000}:\${PORT:-3000}"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  pgdata:`;

export default function HomePage() {
  const appUrl = envValue("APP_URL", envValue("NEXT_PUBLIC_APP_URL", "http://localhost:3000"));
  const appPort = envValue("APP_PORT", "3000");
  const containerPort = envValue("PORT", "3000");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Everything Cloud</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Your Docker app is live
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          This starter proves your stack is running. It does not use a database — the{" "}
          <span className="font-mono text-foreground">db</span> service in{" "}
          <span className="font-mono text-foreground">docker-compose.yml</span> is a template for
          when you deploy your own app.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="surface-panel p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">App URL</p>
          <p className="mt-2 break-all font-mono text-sm text-foreground">{appUrl}</p>
        </div>
        <div className="surface-panel p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Host port</p>
          <p className="mt-2 font-mono text-sm text-foreground">
            {appPort}
            <span className="text-muted"> → container {containerPort}</span>
          </p>
        </div>
      </section>

      <section className="surface-panel p-6 sm:p-8">
        <h2 className="text-lg font-bold text-foreground">How to configure Docker Compose</h2>
        <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
          <li>
            <span className="font-semibold text-foreground">1. Create your environment file.</span>{" "}
            Copy <span className="font-mono text-foreground">.env.example</span> to{" "}
            <span className="font-mono text-foreground">.env</span>.
          </li>
          <li>
            <span className="font-semibold text-foreground">2. Set your public URL.</span>{" "}
            <span className="font-mono text-foreground">APP_URL=https://your-domain.com</span> — no
            trailing slash.
          </li>
          <li>
            <span className="font-semibold text-foreground">3. Set the reverse-proxy port.</span>{" "}
            <span className="font-mono text-foreground">APP_PORT</span> must match the port
            Everything Cloud configured for your site (default{" "}
            <span className="font-mono text-foreground">3000</span>).
          </li>
          <li>
            <span className="font-semibold text-foreground">4. Keep two services only.</span> Your{" "}
            <span className="font-mono text-foreground">docker-compose.yml</span> should define{" "}
            <span className="font-mono text-foreground">app</span> and{" "}
            <span className="font-mono text-foreground">db</span>. Wire{" "}
            <span className="font-mono text-foreground">DATABASE_URL</span> in your app when you
            replace this starter. Do not add nginx, certbot, or another reverse proxy — SSL and
            routing are managed for you.
          </li>
          <li>
            <span className="font-semibold text-foreground">5. Deploy from your portal.</span> Use{" "}
            <span className="font-semibold text-foreground">Compose Up</span> after connecting your
            Git repository, or pull and compose up when you replace this starter.
          </li>
        </ol>

        <div className="mt-6 rounded-xl border border-outline/20 bg-surface-container/80 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Expected compose shape (for your app)
          </p>
          <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-foreground">
            <code>{COMPOSE_SNIPPET}</code>
          </pre>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="surface-panel border-primary/20 bg-primary/5 p-6">
          <h3 className="text-sm font-bold text-foreground">Managed by Everything Cloud</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>nginx reverse proxy</li>
            <li>SSL certificates</li>
            <li>Domain routing to your app port</li>
          </ul>
        </div>
        <div className="surface-panel p-6">
          <h3 className="text-sm font-bold text-foreground">Your repository</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Application code</li>
            <li>
              <span className="font-mono text-foreground">docker-compose.yml</span> (app + db)
            </li>
            <li>
              <span className="font-mono text-foreground">.env</span> and database credentials
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
