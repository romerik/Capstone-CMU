# Installation Guide

This guide provides detailed instructions for setting up the Neo Cafe React application on different environments.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- An OpenAI API key for the chatbot functionality

## General Installation

### 1. Clone the Repository

```bash
git clone https://github.com/a-ahabwe/capstone-project.git
cd capstone-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a local environment file:

```bash
cp .env.example .env
```

Open the `.env` file in your preferred text editor and set the required environment variables:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## Environment-Specific Configurations

### Development Environment

For development purposes, you can enable additional debugging features:

```
# Add to .env file
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### Production Environment

For production deployment, additional steps are recommended:

1. Build the optimized production bundle:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npm run preview
   ```

3. Configure the production environment variables:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_DEBUG_MODE=false
   VITE_LOG_LEVEL=error
   ```

## Deployment Options

### Static Hosting (Recommended)

The built application can be deployed to any static hosting service:

1. Build the application as described above
2. Upload the contents of the `dist` directory to your hosting provider
3. Configure your hosting provider to handle client-side routing:
   - For Nginx, add:
     ```
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```
   - For Apache, create a `.htaccess` file with:
     ```
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
     ```

### Docker Deployment

A Dockerfile is included for containerized deployment:

```bash
# Build the Docker image
docker build -t neo-cafe-react .

# Run the container
docker run -p 80:80 -e VITE_OPENAI_API_KEY=your_key_here neo-cafe-react
```

## Verifying the Installation

To ensure everything is installed correctly:

1. Open the application in your browser
2. Navigate to the menu page
3. Try adding an item to your cart
4. Open the chatbot and verify it responds to your messages

If any of these steps fail, refer to the [Troubleshooting Guide](troubleshooting.md).

## Next Steps

- Review the [User Guide](user_guide.md) to understand how to use the application
- If you plan to contribute to the project, read the [Development Guidelines](development.md)