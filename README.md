# Drizzle Dummy E-commerce

A modern e-commerce application built with Next.js, Drizzle ORM, and Supabase.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For styling and responsive design
- **Lucide Icons** - For beautiful, consistent icons
- **Next.js Image** - For optimized image loading and delivery

### Backend
- **Drizzle ORM** - Type-safe ORM for database operations
- **PostgreSQL** - Primary database (hosted on Supabase)
- **Supabase** - For database hosting and image storage
- **Next.js API Routes** - For backend API endpoints

### Authentication & Authorization
- **NextAuth.js** - For authentication
- **JWT** - For secure session management
- **Middleware** - For route protection and role-based access

### Database & Storage
- **Supabase** - For:
  - PostgreSQL database hosting
  - Image storage and CDN
  - Real-time capabilities
  - Database backups

### Development Tools
- **ESLint** - For code linting
- **TypeScript** - For static type checking
- **Prettier** - For code formatting
- **Git** - For version control

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=your_database_url

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Other
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/drizzle-dummy-ecommerce.git
cd drizzle-dummy-ecommerce
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run database migrations:
```bash
npm run db:migrate
# or
yarn db:migrate
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/         # React components
│   ├── lib/               # Utility functions and configurations
│   │   ├── db/           # Database configuration and schema
│   │   └── utils/        # Helper functions
│   ├── types/            # TypeScript type definitions
│   └── hooks/            # Custom React hooks
├── public/               # Static files
├── drizzle.config.ts    # Drizzle ORM configuration
└── package.json         # Project dependencies
```

## Database Schema

The application uses the following main tables:
- Users
- Products
- Orders
- Order Items
- Cart
- Cart Items
- CMS Users
- Sessions
- Messages

## Image Handling

Images are stored in Supabase Storage with the following structure:
- Product images are stored in the `products` bucket
- Each product can have multiple images
- Images are optimized and served through Supabase's CDN
- Next.js Image component is used for optimized delivery

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Todo
- Update user password repeat requirement on password reset/update
