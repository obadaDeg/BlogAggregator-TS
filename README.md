# BlogAggregator-TS

A CLI RSS feed aggregator built with TypeScript as part of the [Boot.dev](https://www.boot.dev) backend development curriculum.

This is the **2th project** in the **6th course** of the [Foothill Training plan](https://www.boot.dev/u/obadadaghlas), covering backend fundamentals through building a multi-user terminal RSS reader backed by PostgreSQL.

## About

BlogAggregator-TS (Gator) is a command-line application that lets multiple users follow RSS feeds and browse their latest posts. A long-running `agg` loop continuously fetches and stores feed content in a PostgreSQL database, while other commands let you manage feeds, follows, and browse posts — all from the terminal.

### Course Chapters

**Chapter 1 - CLI Foundation**
- JSON config file read/write for persisting user session and DB URL
- Command registry pattern with centralized `registerCommand` / `runCommand` helpers
- Commands: `login`, `register`

**Chapter 2 - Database Layer**
- PostgreSQL integration via `postgres.js` and Drizzle ORM
- Schema design with `users`, `feeds`, `feed_follows`, and `posts` tables
- Migration workflow with `drizzle-kit`
- Commands: `reset`, `users`

**Chapter 3 - Feed Management**
- Feed creation with automatic follow-on-add behaviour
- Many-to-many feed follows with unique constraint enforcement
- Commands: `addfeed`, `feeds`, `follow`, `following`, `unfollow`

**Chapter 4 - RSS Aggregation**
- XML parsing with `fast-xml-parser`
- Configurable polling loop with `setInterval` and clean `SIGINT` shutdown
- Oldest-feed-first scheduling via `NULLS FIRST` SQL ordering
- `middlewareLoggedIn` higher-order function for auth-gated commands
- Command: `agg`

**Chapter 5 - Posts & Browse**
- Post storage with duplicate-URL deduplication (`ON CONFLICT DO NOTHING`)
- User-scoped post retrieval joined through followed feeds
- Command: `browse`

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) (local or remote)

## Getting Started

**1. Install dependencies**
```bash
npm install
```

**2. Create the config file**

Create `~/.gatorconfig.json` with your database connection string:
```json
{
  "db_url": "postgres://user:password@localhost:5432/gator?sslmode=disable"
}
```

**3. Run migrations**
```bash
node_modules/.bin/drizzle-kit migrate
```

**4. Register a user and start using Gator**
```bash
npm start register <username>
npm start login <username>
```

## Commands

| Command | Description |
|---------|-------------|
| `register <name>` | Create a new user account |
| `login <name>` | Log in as an existing user |
| `users` | List all registered users |
| `reset` | Delete all users (dev/testing) |
| `addfeed <name> <url>` | Add a new RSS feed and auto-follow it |
| `feeds` | List all feeds in the system |
| `follow <url>` | Follow an existing feed by URL |
| `following` | List feeds you currently follow |
| `unfollow <url>` | Unfollow a feed by URL |
| `agg <interval>` | Start the feed scraper loop (e.g. `agg 30s`, `agg 1m`) |
| `browse [limit]` | Show your latest posts (default: 2) |

## Example Workflow

```bash
# Register and log in
npm start register alice
npm start login alice

# Add some feeds (auto-followed on creation)
npm start addfeed "Hacker News" https://hnrss.org/newest
npm start addfeed "Boot.dev Blog" https://blog.boot.dev/index.xml

# In another terminal, start scraping
npm start agg 1m

# Browse the latest posts
npm start browse 10
```

## Future Goals

- [ ] Add sorting and filtering options to the `browse` command
- [ ] Add pagination to the `browse` command
- [ ] Add concurrency to the `agg` command so it can fetch multiple feeds simultaneously
- [ ] Add a `search` command that allows fuzzy searching of posts
- [ ] Add bookmarking or liking posts
- [ ] Add a TUI that lets you select a post and view it in a readable format (or open it in a browser)
- [ ] Add an HTTP API with authentication/authorization for remote access
- [ ] Write a service manager that keeps `agg` running in the background and restarts it on crash
- [ ] Add feed health checks to detect dead or unreachable feeds
- [ ] Support OPML import/export for feed lists
- [ ] Write integration tests for all commands

## Links

- [Boot.dev Profile](https://www.boot.dev/u/obadadaghlas)
- [GitHub Repository](https://github.com/obadaDeg/BlogAggregator-TS)
