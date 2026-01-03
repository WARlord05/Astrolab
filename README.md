# Astrolab

A modern, responsive horoscope application built with React, TypeScript, and Vite. Astrolab delivers personalized daily and weekly horoscopes based on your zodiac sign with an elegant UI powered by shadcn/ui components.

## Features

- 🌟 **Daily & Weekly Horoscopes** - Get personalized horoscope predictions for any zodiac sign
- 🎨 **Dark/Light Theme** - Toggle between dark and light modes for comfortable viewing
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop devices
- 🔮 **Lucky Numbers & Colors** - Receive daily lucky numbers and colors with their meanings
- ⚡ **Real-time Data Fetching** - Integrated with astrology API for fresh predictions
- 🎯 **Smooth UI/UX** - Built with shadcn/ui components and Tailwind CSS
- 📦 **Mobile Support** - Capacitor integration for iOS and Android deployment

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router v7
- **Form Handling**: React Hook Form + Zod validation
- **Mobile**: Capacitor (iOS & Android)
- **Linting**: ESLint with TypeScript support
- **Component Tagging**: Dyad component tagger for enhanced development

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui component library
│   ├── HoroscopeDisplay.tsx
│   ├── UserForm.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── pages/              # Page components
│   ├── Index.tsx       # Main horoscope page
│   └── NotFound.tsx    # 404 page
├── services/           # API services
│   └── astroApiService.ts  # Astrology API integration
├── hooks/              # Custom React hooks
│   └── useHoroscope.ts # Horoscope data fetching hook
├── lib/                # Utility libraries
│   ├── astrology.ts    # Astrology logic & types
│   ├── mockHoroscope.ts # Mock data for testing
│   └── utils.ts
└── App.tsx             # Root component
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Astrolab
```

2. Install dependencies
```bash
pnpm install
```

3. Create environment variables
```bash
cp .env.example .env.local
```

4. Configure your API endpoint in `.env.local`:
```
VITE_API_URL=http://localhost:5000/api/v1
```

## Development

### Running the Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:8080`

### Building for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Linting

```bash
pnpm lint
```

## API Integration

The application connects to a Flask-based horoscope API that provides:

- **Daily Horoscopes** - `/get-horoscope/daily?day={today|tomorrow|yesterday|YYYY-MM-DD}&sign={zodiac_sign}`
- **Weekly Horoscopes** - `/get-horoscope/weekly?sign={zodiac_sign}`

Each response includes:
- `prediction` - Horoscope text
- `luckyNumber` - Daily lucky number
- `luckyNumberMeaning` - Interpretation of the lucky number
- `luckyColor` - Recommended color for the day

## Mobile Deployment

### Android

```bash
# Build and sync with Android Studio
pnpm build
npx cap add android
npx cap sync android
npx cap open android
```

### iOS

```bash
# Build and sync with Xcode
pnpm build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm build:dev` | Build with development mode |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint checks |

## Environment Variables

- `VITE_API_URL` - Base URL for the astrology API (default: `http://localhost:5000/api/v1`)

## Component Highlights

### UserForm
Collects user information including:
- Name
- Birth date
- Zodiac sign selection

### HoroscopeDisplay
Presents horoscope data in an elegant card-based layout with:
- Daily predictions
- Lucky numbers and meanings
- Lucky colors
- Tomorrow's forecast

### ThemeProvider & ThemeToggle
Seamless theme switching with system preference detection and localStorage persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

---

Built with ✨ for astrology enthusiasts and developers
