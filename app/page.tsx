export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Hello, World!
        </h1>
        <p className="text-lg text-foreground/60">
          Welcome to the Agentic Coding Workshop. This is your blank canvas.
        </p>
        <div className="pt-4 text-sm text-foreground/50">
          <p>Ready to build something? Try:</p>
          <ul className="mt-2 space-y-1">
            <li>• Add a public API integration</li>
            <li>• Create a new page with a form</li>
            <li>• Store and display data from the database</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
