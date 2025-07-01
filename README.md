# AI Tools Directory

A modern, responsive web application for discovering and exploring AI tools. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🔍 **Advanced Search**: Search through tools by name and description
- 🏷️ **Category Filtering**: Filter tools by categories (Image Generator, Text Generator, Code Assistants, etc.)
- 📊 **Real-time Data**: Powered by Supabase for fast, real-time data access
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-tools-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Follow the detailed setup guide in `supabase-setup.md` or:
   
   - Create a new Supabase project
   - Get your project URL and API keys
   - Create a `.env.local` file with your credentials
   - Run the SQL schema from the setup guide
   - Import your data using the migration script

4. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. **Import Data**
   ```bash
   npm run migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── filters.tsx       # Filter component
│   ├── hero-section.tsx  # Hero section
│   ├── navbar.tsx        # Navigation
│   ├── theme-toggle.tsx  # Dark/light mode toggle
│   └── tools-grid.tsx    # Main tools display
├── lib/                  # Utility functions
│   ├── data-service.ts   # Database operations
│   ├── supabase.ts       # Supabase client setup
│   └── utils.ts          # General utilities
├── scripts/              # Utility scripts
│   └── migrate-data.ts   # Data migration script
├── public/               # Static assets
└── CHOOSEMYAI_Nov29_export.json  # Source data
```

## Data Schema

The application uses a single `ai_tools` table with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| id | BIGSERIAL | Primary key |
| name | TEXT | Tool name |
| description | TEXT | HTML description |
| categories | TEXT[] | Array of categories |
| url | TEXT | Main website URL |
| image_url | TEXT | Tool logo/image URL |
| youtube_url | TEXT | Demo video URL |
| resources | JSONB | Additional resources |
| created_at | TIMESTAMP | Creation date |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Import data to Supabase

## Deployment

The project is configured for deployment on Netlify with the provided `netlify.toml` configuration.

### Deploy to Netlify

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set your environment variables in Netlify dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the `supabase-setup.md` guide for setup help
2. Look through existing GitHub issues
3. Create a new issue with detailed information about your problem

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/) 