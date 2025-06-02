# Fitness Planner

A modern web application built with Next.js 15, React 19, and TypeScript for tracking and managing fitness activities.

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Hooks
- **Database**: SQLite (better-sqlite3)
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
fitness-planner/
├── app/                    # Next.js app directory (App Router)
│   ├── tracking/          # Tracking-related pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared code
├── public/              # Static assets
├── styles/              # Additional styles
└── types/               # TypeScript type definitions
```

## Getting Started

1. **Prerequisites**
   - Node.js (Latest LTS version recommended)
   - pnpm (Package manager)

2. **Installation**
   ```bash
   pnpm install
   ```

3. **Development**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`

4. **Building for Production**
   ```bash
   pnpm build
   ```

5. **Starting Production Server**
   ```bash
   pnpm start
   ```

## Key Features

- Modern UI components using Radix UI
- Responsive design with Tailwind CSS
- Form validation with Zod
- Interactive charts and data visualization
- Dark mode support
- Type-safe development with TypeScript

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Dependencies

### Main Dependencies
- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Zod
- Recharts
- date-fns
- SQLite

### Development Dependencies
- TypeScript
- PostCSS
- Tailwind CSS
- ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please open an issue in the repository.
