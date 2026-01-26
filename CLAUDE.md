# Claude Code Workshop

A minimal Next.js starter for hands-on Claude Code development.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 - you should see "Hello, World!"

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Components | shadcn/ui-style (Button, Card, Input included) |
| Database | SQLite via Drizzle ORM |
| Language | TypeScript |

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Drizzle schema
│   └── utils.ts          # Utility functions (cn)
└── local.db              # SQLite database (auto-created)
```

## Database

SQLite database with Drizzle ORM. No external services needed.

### Initialize the database

```bash
npm run db:push
```

### View data in browser

```bash
npm run db:studio
```

### Example: Query the database

```typescript
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";

// Insert
await db.insert(items).values({ name: "My Item", description: "Details" });

// Select all
const allItems = await db.select().from(items);

// Select with filter
import { eq } from "drizzle-orm";
const item = await db.select().from(items).where(eq(items.id, 1));
```

### Add a new table

Edit `lib/db/schema.ts`:

```typescript
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
});
```

Then run `npm run db:push` to apply changes.

## Creating API Routes

Create a file at `app/api/[route]/route.ts`:

```typescript
// app/api/items/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";

export async function GET() {
  const allItems = await db.select().from(items);
  return NextResponse.json(allItems);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await db.insert(items).values(body).returning();
  return NextResponse.json(result[0]);
}
```

## Fetching External APIs

Example with a public API:

```typescript
// app/api/weather/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=37.77&longitude=-122.42&current_weather=true"
  );
  const data = await res.json();
  return NextResponse.json(data);
}
```

## Using UI Components

Import from `@/components/ui`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Type here..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Workshop Ideas

1. **Weather Dashboard**: Fetch weather data from Open-Meteo API and display it
2. **Todo List**: Create, read, update, delete items in the database
3. **GitHub Profile Viewer**: Fetch and display GitHub user profiles
4. **Quote Generator**: Call a quotes API and save favorites to the database
5. **Simple Blog**: Create posts, store in SQLite, display on pages

## Tips for Working with Claude

- Ask Claude to create new pages at `app/[page-name]/page.tsx`
- Ask Claude to create API routes at `app/api/[route]/route.ts`
- Ask Claude to add new database tables in `lib/db/schema.ts`
- Run `npm run db:push` after schema changes
- The database file `local.db` is gitignored - data stays local

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run db:push` | Apply database schema changes |
| `npm run db:studio` | Open database GUI in browser |
