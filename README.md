# Briefing Checklist - Guest Services Tool

A clean, minimal Next.js application for guest services teams to manage their daily briefings and tasks. Built with React, TypeScript, and shadcn/ui components.

## Features

### 📋 Daily Briefing Cards
- **Manifesto**: Track when team values are demonstrated in practice
- **Mission Snapshot**: Daily operational overview and status updates  
- **Hot Zones**: Special attention items (VIPs, events, transitions)
- **Check-in**: Team updates and important information sharing
- **Principles Spotlight**: Randomized service principles for inspiration

### ✅ Interactive Checklist System
- Check off completed tasks and items
- Visual feedback with pink accent theming (#CB1A84)
- Cards highlight when completed
- Individual item tracking within cards

### 📝 Todo Management
- Add custom todo items for the day
- Copy entire todo list to clipboard
- Send todos via webhook (ready for Zapier integration)
- Clean list interface with easy item removal

### 🎨 Design Features
- Clean, minimal interface with pink accents
- Large, prominent cards for easy viewing
- Responsive design for various screen sizes
- Smooth transitions and hover effects
- Professional typography and spacing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)
This app is optimized for Vercel deployment:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Deploy automatically with zero configuration

### Environment Setup
No environment variables required for basic functionality. For webhook integration:

- Add your Zapier webhook URL to the `sendTodos` function in `components/TodoSection.tsx`

## Customization

### Service Principles
Edit `data/service-principles.ts` to customize the randomized principles that appear in the Principles Spotlight card.

### Card Content
Modify the `briefingCards` array in `app/page.tsx` to customize:
- Card titles and descriptions
- Time estimates
- Checklist items
- Card order

### Theming
The pink accent color (#CB1A84) is defined in:
- `tailwind.config.ts` - Primary color configuration
- `app/globals.css` - CSS custom properties

### Adding New Features
The modular component structure makes it easy to:
- Add new card types
- Modify existing card behavior
- Integrate additional data sources
- Add new todo functionality

## Project Structure

```
briefing-checklist/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── BriefingCard.tsx # Main card component
│   └── TodoSection.tsx  # Todo management
├── data/
│   └── service-principles.ts
├── hooks/
│   └── use-toast.ts
├── lib/
│   └── utils.ts
└── ...config files
```

## Usage Tips

### Daily Reset
The application is designed to be used daily. Consider:
- Bookmarking for easy access
- Using on tablets for team standup meetings
- Integrating with existing daily workflows

### Team Collaboration
- Use the todo section for action items
- Copy todos to share with team members
- Send todos to management via webhook

### Customization Ideas
- Add team member assignments to cards
- Include shift-specific information
- Integrate with building management systems
- Add photo upload capabilities for issues

## Support & Maintenance

### Regular Updates
- Service principles can be updated seasonally
- Card content should reflect current operational needs
- Todo webhook can be connected to various systems

### Performance
- Lightweight design loads quickly
- Client-side state management for responsiveness
- Optimized for mobile and desktop use

## License

This project is designed for internal guest services use. Customize and deploy as needed for your organization. 