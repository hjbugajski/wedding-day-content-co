'use client';

export default function GlobalError() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4 text-neutral-800">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-light">Something went wrong</h1>
          <p className="text-lg">We encountered an unexpected error.</p>
        </div>
        <a
          href="/"
          className="rounded-sm bg-neutral-800 px-6 py-3 font-semibold text-neutral-100 uppercase transition hover:bg-neutral-900"
        >
          Home
        </a>
      </body>
    </html>
  );
}
