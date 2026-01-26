# Agentic Coding Workshop

A minimal Next.js starter for hands-on agentic coding development.

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
| Components | shadcn/ui-style (CVA + Tailwind) |
| Database | SQLite (better-sqlite3) |
| Language | TypeScript |

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # UI components (shadcn-style)
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── db/
│   │   └── index.ts      # Database helpers (query, run, exec)
│   └── utils.ts          # Utility functions (cn)
└── local.db              # SQLite database (auto-created)
```

## Database

Simple SQLite with raw SQL. No ORM overhead.

### Database Helpers

```typescript
import { query, queryOne, run, exec } from "@/lib/db";

// Create a table
exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert a row
const result = run(
  "INSERT INTO items (name, description) VALUES (?, ?)",
  ["My Item", "Details here"]
);
console.log(result.lastInsertRowid); // ID of the new row

// Select all rows
type Item = { id: number; name: string; description: string | null };
const items = query<Item>("SELECT * FROM items");

// Select one row
const item = queryOne<Item>("SELECT * FROM items WHERE id = ?", [1]);

// Update
run("UPDATE items SET name = ? WHERE id = ?", ["New Name", 1]);

// Delete
run("DELETE FROM items WHERE id = ?", [1]);
```

### Available Functions

| Function | Returns | Use For |
|----------|---------|---------|
| `query<T>(sql, params?)` | `T[]` | SELECT multiple rows |
| `queryOne<T>(sql, params?)` | `T \| undefined` | SELECT single row |
| `run(sql, params?)` | `{ changes, lastInsertRowid }` | INSERT, UPDATE, DELETE |
| `exec(sql)` | void | CREATE TABLE, etc. |

## Creating API Routes

Create a file at `app/api/[route]/route.ts`:

```typescript
// app/api/items/route.ts
import { NextResponse } from "next/server";
import { query, run } from "@/lib/db";

type Item = { id: number; name: string; description: string | null };

export async function GET() {
  const items = query<Item>("SELECT * FROM items ORDER BY id DESC");
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { name, description } = await request.json();
  const result = run(
    "INSERT INTO items (name, description) VALUES (?, ?)",
    [name, description]
  );
  return NextResponse.json({ id: result.lastInsertRowid, name, description });
}
```

## Fetching External APIs

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

---

## UI Components

This project uses the **shadcn/ui pattern**: unstyled, composable components built with Tailwind CSS and CVA (class-variance-authority).

### Using Existing Components

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
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive" size="sm">Delete</Button>
      </CardContent>
    </Card>
  );
}
```

### Available Components

| Component | Variants | File |
|-----------|----------|------|
| `Button` | default, destructive, outline, secondary, ghost, link / sm, lg, icon | `components/ui/button.tsx` |
| `Card` | CardHeader, CardTitle, CardDescription, CardContent, CardFooter | `components/ui/card.tsx` |
| `Input` | (standard HTML input props) | `components/ui/input.tsx` |

### Adding New Components

All UI components follow the same pattern. To add a new component:

1. Create `components/ui/[component].tsx`
2. Use the `cn()` utility for class merging
3. Use CVA for variants (optional)
4. Export with `React.forwardRef` for ref support

**Example: Badge component**

```tsx
// components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        secondary: "bg-foreground/10 text-foreground",
        destructive: "bg-red-500 text-white",
        outline: "border border-foreground/20 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

**Example: Simple component without variants**

```tsx
// components/ui/label.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
```

### Icons

Lucide React is installed for icons:

```tsx
import { Search, Plus, Trash2, Check } from "lucide-react";

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

Browse icons at: https://lucide.dev/icons

---

## Workshop Ideas

1. **Todo List**: CRUD operations with the database
2. **Weather Dashboard**: Fetch from Open-Meteo API
3. **GitHub Profile Viewer**: Fetch and display user profiles
4. **Quote Generator**: API + save favorites to database
5. **Simple Blog**: Posts stored in SQLite

## Tips for Agentic Coding

- Create new pages at `app/[page-name]/page.tsx`
- Create API routes at `app/api/[route]/route.ts`
- Add new UI components at `components/ui/[name].tsx`
- The database auto-creates `local.db` on first query
- Database file is gitignored - data stays local

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
