# Troubleshooting Guide

This guide provides solutions for common issues that might arise when using or developing the Neo Cafe application.

## User-Facing Issues

### Authentication Problems

#### Unable to Log In

**Symptoms**:
- Login button doesn't respond
- Error message indicating incorrect credentials
- Endless loading after clicking login

**Solutions**:
1. Verify you're using the correct username and password
2. Clear your browser's cache and cookies
3. Try using a different browser
4. Check if localStorage is enabled in your browser
5. If the issue persists, try creating a new account

#### Session Suddenly Ends

**Symptoms**:
- You're unexpectedly logged out while using the application
- You have to log in again frequently

**Solutions**:
1. Make sure cookies and localStorage are enabled in your browser
2. Check if you have privacy extensions that might be clearing your session data
3. Avoid using incognito/private browsing mode
4. Update your browser to the latest version

### Cart and Ordering Issues

#### Items Not Adding to Cart

**Symptoms**:
- Clicking "Add to Cart" doesn't show confirmation
- Item count doesn't increase
- Cart remains empty

**Solutions**:
1. Refresh the page and try again
2. Check if you're logged in
3. Clear your browser's cache
4. Verify that localStorage is enabled in your browser

#### Cannot Complete Checkout

**Symptoms**:
- Order button doesn't respond
- Error message during checkout
- Page refreshes but order isn't placed

**Solutions**:
1. Make sure you have items in your cart
2. Verify that you've selected a delivery location
3. Check your browser console for specific error messages
4. Clear browser cache and try again

### Chatbot Issues

#### Chatbot Not Responding

**Symptoms**:
- Messages sent to chatbot receive no response
- "Typing" indicator appears but never completes
- Error message in chat window

**Solutions**:
1. Check your internet connection
2. Verify that the OpenAI API is functioning (check status.openai.com)
3. Refresh the page
4. Check browser console for specific error messages
5. Try simple, short messages to initiate conversation

#### Invalid Responses from Chatbot

**Symptoms**:
- Chatbot provides irrelevant answers
- Messages about API errors appear in chat
- Chatbot doesn't understand basic commands

**Solutions**:
1. Refresh the page to reset the conversation context
2. Try rephrasing your request with simpler language
3. Use one of the suggested quick replies
4. Check if there are any environment variables missing in the application setup

### Display and Interface Issues

#### Responsive Design Problems

**Symptoms**:
- Elements overlap on mobile devices
- Content is cut off or inaccessible
- Buttons or inputs are difficult to tap

**Solutions**:
1. Make sure your device is not in zoom mode
2. Try rotating your device to landscape/portrait
3. Clear browser cache and reload
4. Try a different browser

#### Images Not Loading

**Symptoms**:
- Broken image icons appear
- Empty spaces where images should be
- Very slow loading of product images

**Solutions**:
1. Check your internet connection
2. Clear browser cache
3. Disable any content blockers or ad blockers
4. Try a different browser

## Developer Issues

### Development Environment Setup

#### Node.js Version Issues

**Symptoms**:
- Build errors mentioning Node.js version
- Package installation failures
- Incompatible dependency errors

**Solutions**:
1. Make sure you're using Node.js 18 or higher
2. Use nvm (Node Version Manager) to install and switch to the correct version:
   ```bash
   nvm install 18
   nvm use 18
   ```
3. Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

#### Vite Development Server Problems

**Symptoms**:
- Server won't start
- HMR (Hot Module Replacement) not working
- Constant reloads or build errors

**Solutions**:
1. Check for port conflicts by ensuring nothing else is running on port 5173
2. Verify Vite configuration in `vite.config.js`
3. Clear the Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```
4. Restart your development server with verbose logging:
   ```bash
   npm run dev -- --debug
   ```

### React Component Issues

#### Component Rendering Problems

**Symptoms**:
- Components not rendering as expected
- Missing elements in the UI
- Console errors related to React rendering

**Solutions**:
1. Check for React key warnings in the console
2. Verify that conditional rendering logic is correct
3. Make sure all required props are being passed
4. Check for any null or undefined values causing rendering issues
5. Use React Developer Tools to inspect component hierarchy and props

#### State Management Issues

**Symptoms**:
- UI not updating when state should change
- Multiple re-renders causing performance issues
- Context values not propagating to child components

**Solutions**:
1. Check that state updates are using the setter function correctly
2. Verify that Context Providers wrap the appropriate components
3. Use React Developer Tools to inspect component state
4. Make sure state updates are using immutable patterns
5. Check for missing React dependency arrays in useEffect or useMemo

### API Integration Issues

#### OpenAI API Problems

**Symptoms**:
- Chatbot not functioning
- Console errors related to API calls
- Authentication failures

**Solutions**:
1. Verify that your OpenAI API key is correctly set in the environment variables
2. Check for API rate limiting issues
3. Make sure the API key has the correct permissions
4. Implement proper error handling for API calls

#### LocalStorage Issues

**Symptoms**:
- Data not persisting between sessions
- Cart items disappearing
- Authentication state not saved

**Solutions**:
1. Check if localStorage is available in the current browser environment
2. Implement fallback mechanisms for environments where localStorage is disabled
3. Verify that localStorage values are being properly stringified and parsed
4. Make sure localStorage operations are wrapped in try/catch blocks

### Build and Deployment Issues

#### Build Failures

**Symptoms**:
- Build process exits with errors
- Assets not generated correctly
- Missing files in build output

**Solutions**:
1. Check the build logs for specific error messages
2. Verify that all required environment variables are set
3. Make sure all dependencies are installed
4. Check for path issues in import statements
5. Run linting to catch potential errors:
   ```bash
   npm run lint
   ```

#### Deployment Problems

**Symptoms**:
- Application works locally but fails when deployed
- Routing issues in production
- API calls failing in deployed environment

**Solutions**:
1. Make sure your hosting provider is configured for single-page applications
2. Verify that environment variables are set in the production environment
3. Check for CORS issues when making API calls
4. Ensure all assets are being served correctly
5. Confirm that the build process completed successfully

## Advanced Troubleshooting

For issues not covered in this guide:

1. Check the browser console for error messages
2. Review the application logs
3. Compare with the latest working version using git diff
4. Search for similar issues in the project repository
5. Try a clean install:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

If you're unable to resolve an issue, please report it by creating a detailed issue on the project's GitHub repository, including:
- Description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Browser/environment information
- Error messages or screenshots