# Getting Started

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (or local Supabase instance)
- Git

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dubiqo
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Run database migrations:

```bash
npm run migrate
```

5. Seed the database (optional):

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Project Structure

See [Project Structure.md](../../Project%20Structure.md) for detailed structure.
