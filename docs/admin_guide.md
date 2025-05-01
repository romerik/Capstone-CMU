# Administrator Guide

This guide provides comprehensive instructions for administrators managing the Neo Cafe application. It covers installation, configuration, maintenance, and troubleshooting from an administrator's perspective.

## System Requirements

### Client Requirements

For optimal performance as an administrator:

- Modern web browser (Chrome, Firefox, Safari, or Edge - latest versions)
- Minimum 8GB RAM
- High-resolution display (1920x1080 or higher) for dashboard views
- Stable internet connection

### Server Requirements (for deployment)

- Node.js 18.0.0 or higher
- NPM 8.0.0 or higher
- 2GB RAM minimum (4GB recommended)
- 10GB storage space
- Nginx/Apache for static file serving
- SSL certificate for secure connections

## Installation and Setup

### Production Deployment

For a production environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/a-ahabwe/capstone-project.git
   cd capstone-project
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Create a production environment file:
   ```bash
   cp .env.example .env.production
   ```

4. Edit the production environment file with appropriate values:
   ```
   VITE_OPENAI_API_KEY=your_production_api_key
   VITE_API_URL=your_api_url_if_applicable
   VITE_LOG_LEVEL=error
   VITE_DEBUG_MODE=false
   ```

5. Build the production assets:
   ```bash
   npm run build
   ```

6. Deploy the contents of the `dist` directory to your web server

### Web Server Configuration

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.openai.com;" always;

    root /var/www/html/neo-cafe;
    index index.html;

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

#### Apache Configuration

Create a `.htaccess` file in the root directory:

```
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "max-age=2592000, public"
</FilesMatch>
```

## Administrator Dashboard

### Accessing the Dashboard

1. Navigate to the application URL
2. Log in with administrator credentials
3. Access the admin dashboard via the admin panel button in the top-right corner
4. Admin functionalities are protected by role-based access control

### Dashboard Overview

The administrator dashboard provides:

- Sales analytics and order volume metrics
- User activity statistics
- Menu item popularity charts
- Delivery performance monitoring
- System status indicators

### User Management

Admin users can:

1. View all registered users
2. Edit user information and roles
3. Disable user accounts if necessary
4. Reset user passwords
5. View user activity logs

### Menu Management

Administrators can manage the menu through:

1. Adding new menu items with details and images
2. Updating existing item information, prices, and availability
3. Organizing items into categories
4. Setting featured and new items
5. Temporarily disabling items

### Order Management

Key order management tasks include:

1. Viewing all orders across the system
2. Filtering orders by status, date, or customer
3. Manually updating order statuses
4. Cancelling or modifying orders when necessary
5. Viewing detailed order logs

## Maintenance Tasks

### Regular Maintenance

Perform these tasks regularly:

1. Check system performance and resource usage
2. Review error logs for recurring issues
3. Update menu items and prices as needed
4. Backup application data
5. Verify all functionality is working correctly

### Updating the Application

To update to a new version:

1. Pull the latest code:
   ```bash
   git pull origin main
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the production assets:
   ```bash
   npm run build
   ```

4. Deploy the new `dist` directory to your server

5. Verify the application is functioning correctly

### Backup Procedures

Implement these backup procedures:

1. Create a backup schedule for:
   - Application code and configuration
   - Menu data (stored in localStorage but should be backed up to a proper database in production)
   - User accounts and preferences
   - Order history

2. Test backups regularly by performing restoration drills

## Monitoring and Logging

### System Monitoring

Monitor the following aspects:

1. Web server performance metrics
2. Application error rates
3. API call volume and response times
4. User activity and peak usage times
5. Order processing times

### Log Management

Set up logging to capture:

1. Application errors and warnings
2. Authentication attempts and failures
3. Admin actions (especially those modifying data)
4. API call logs
5. Performance metrics

## Security Management

### Security Best Practices

Follow these security guidelines:

1. Regularly update all dependencies:
   ```bash
   npm audit
   npm audit fix
   ```

2. Implement strong password policies for admin accounts
3. Use HTTPS for all communications
4. Regularly review access logs for suspicious activity
5. Implement rate limiting for API endpoints
6. Secure API keys and credentials

### Security Incident Response

In case of a security incident:

1. Immediately assess the scope and impact
2. Isolate affected systems if necessary
3. Restore from clean backups if data is compromised
4. Investigate the root cause
5. Implement additional controls to prevent recurrence

## Troubleshooting

### Common Issues

#### Application Not Loading

1. Check web server logs for errors
2. Verify that all static assets are being served correctly
3. Confirm that the server is properly configured for SPAs
4. Clear browser cache and try again

#### Authentication Issues

1. Verify that localStorage is working correctly
2. Check for any CORS issues if applicable
3. Clear local storage in the browser

#### OpenAI API Problems

1. Check if the API key is valid and has sufficient credits
2. Verify the API is functioning by testing with curl
3. Check for rate limiting issues
4. Implement fallback messaging if the API is unavailable

## Customization

### Branding Customization

To customize the branding:

1. Update the logo in `/public/logo.png`
2. Modify the color scheme by editing the tailwind configuration
3. Update favicon and other brand assets in the `/public` directory
4. Customize email templates if applicable

### Feature Customization

To enable/disable features:

1. Feature flags can be set in the environment configuration
2. Comment out or remove specific route definitions in App.jsx
3. Customize default values in the configuration files

## Support and Resources

For additional support:

- Check the project repository for updates and issues
- Consult the developer documentation for technical details
- Contact the development team for critical issues
- Reference the user documentation for end-user functionality