# Multi-Source Data Explorer

A robust, resilient, and performant dashboard that aggregates data from multiple public APIs:
- Fake Store API (E-commerce)
- REST Countries API (Geographic data)
- GitHub Search API (Repositories)

## Features

- **Unified Explorer**: View data from all sources in a single, responsive dashboard.
- **Real-time Search**: Search across datasets with debounced input.
- **Filtering & Pagination**: Efficient data navigation (client-side for small datasets, server-side for large ones).
- **Detail Views**: Deep-linkable pages for Products, Countries, and Repositories.
- **Toggle Controls**: Enable/disable specific datasets.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Testing**: Jest, React Testing Library, Playwright (Setup included)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multisource-data-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

4. **Run Tests**
   ```bash
   # Unit Tests (requires jest setup)
   npm test

   # E2E Tests (requires playwright setup)
   npm run e2e:test
   ```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions, trade-offs, and scalability considerations.
