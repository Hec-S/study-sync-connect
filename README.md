# Campus Connect

A platform for students to connect, collaborate on projects, and build their portfolios together.

## Features

- User authentication with Supabase
- Project marketplace for sharing and discovering projects
- Direct messaging between users
- User profiles with portfolio showcase
- Real-time notifications for messages and connections
- Project categorization and search functionality

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (Authentication & Database)

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account - [sign up here](https://supabase.com)

### Setup

1. Clone the repository
```sh
git clone <repository-url>
cd study-sync-connect-1
```

2. Install dependencies
```sh
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Fill in your Supabase credentials:
  ```
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

4. Start the development server
```sh
npm run dev
```

The app will be available at `http://localhost:8080`

## Database Setup

The project uses Supabase as its database. The database schema and migrations can be found in the `supabase/migrations` directory. These migrations handle:

- User profiles and authentication
- Project marketplace tables
- Messaging system
- Connection management
- Portfolio items

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
