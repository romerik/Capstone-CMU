# Neo Cafe

An integrated web application for Neo Cafe, featuring a coffee-themed interface with order management, menu display, delivery tracking, and a robust AI-powered chatbot assistant built with React.

## Features

- **Dashboard**: View sales analytics, order history, and real-time status updates
- **Menu Management**: Interactive menu display with filtering, search, and categories
- **Order System**: Seamless order processing and status tracking
- **Delivery Tracking**: Robot delivery tracking with map visualization
- **Integrated Chatbot**: AI-powered assistant using OpenAI for natural language understanding

### Enhanced User Experience

- **Responsive Design**: Fully responsive interface that works on mobile, tablet, and desktop
- **Real-time Updates**: Live updates for cart, orders, and delivery status
- **Intuitive Navigation**: React Router-based navigation with protected routes
- **Persistent State**: User preferences and authentication state persisted across sessions
- **AI-Powered Ordering**: Natural language order processing with intelligent suggestions

## Technologies

- **React**: Modern component-based frontend built with React 19
- **Vite**: Fast and efficient build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for responsive styling
- **React Router**: Client-side routing for single-page application
- **React Context API**: State management across components
- **OpenAI API**: AI integration for natural language processing
- **LocalStorage**: Client-side data persistence
- **Custom Events**: Cross-component communication

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/a-ahabwe/capstone-project.git
cd capstone-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration, including OpenAI API key
```

### Running the application

Start the development server:

```bash
npm run dev
```

Then open your browser and navigate to:
```
http://localhost:5173
```

### Building for production

```bash
npm run build
```

This generates optimized static assets in the `dist` directory that can be deployed to any static hosting service.

## Project Structure

- `src/`: Core application source code
  - `components/`: Reusable UI components
    - `Chatbot.jsx`: AI-powered chat assistant
    - `Map.jsx`: Delivery tracking map
    - `MenuItem.jsx`: Menu item display component
    - `Navbar.jsx`: Navigation and app header
    - `OrderTimeline.jsx`: Visual order status tracker
    - `PopupCart.jsx`: Shopping cart overlay
  - `pages/`: Page-level components for different routes
    - `Dashboard.jsx`: Analytics and status overview
    - `Menu.jsx`: Interactive menu display
    - `Orders.jsx`: Order management interface
    - `OrderHistory.jsx`: Past order tracking
    - `RobotTracker.jsx`: Real-time delivery tracking
  - `context/`: React Context providers for global state
    - `AuthContext.jsx`: Authentication state management
  - `utils/`: Utility functions and helper services
    - `auth.js`: Authentication utilities
    - `chat.js`: Chat message handling
    - `menu.js`: Menu data management
    - `orders.js`: Order processing functions
    - `robot.js`: Robot status tracking
  - `assets/`: Static assets used in the application
  - `App.jsx`: Main application component
  - `main.jsx`: Application entry point
- `public/`: Publicly accessible static files
  - `images/`: Image assets for menu items and UI
- `index.html`: HTML entry point
- `vite.config.js`: Vite configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `package.json`: Project dependencies and scripts

## Development Guidelines

- **Component Structure**: Follow functional component pattern with React hooks
- **State Management**: Use Context API for global state, useState for local state
- **Styling**: Use Tailwind utility classes with component-specific styles
- **Routing**: Use React Router for navigation with protected routes
- **Performance**: Implement memoization and lazy loading for optimal performance
- **Testing**: Write tests with React Testing Library for components

## Troubleshooting

### OpenAI API Issues

If you experience issues with the chatbot:

1. Verify your OpenAI API key is correctly set in the `.env` file
2. Check browser console for any authentication errors
3. Ensure you have sufficient API credits in your OpenAI account

### UI Rendering Problems

If the UI isn't displaying correctly:

1. Clear your browser cache and cookies
2. Verify your Node.js version is 18 or higher
3. Try running `npm install` again to ensure all dependencies are correctly installed
4. Check browser console for any JavaScript errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Coffee icons and images from public domain sources
- React component patterns inspired by best practices from the React community