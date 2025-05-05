# Development Guidelines

This document outlines the development standards and best practices for the Neo Cafe React application.

## Code Organization

### Project Structure

Follow the established project structure:

```
src/
  ├── components/    # Reusable UI components
  ├── pages/         # Top-level page components
  ├── context/       # React Context definitions
  ├── utils/         # Utility functions and helpers
  ├── assets/        # Static assets
  ├── App.jsx        # Main application component
  └── main.jsx       # Application entry point
```

### Component Structure

- **Component Files**: Use `.jsx` extension for React components
- **Component Organization**:
  - Use functional components with hooks instead of class components
  - One component per file
  - Name files using PascalCase (e.g., `OrderDetail.jsx`)
  - Place shared components in the `/components` directory
  - Place page-level components in the `/pages` directory

## Coding Standards

### General Guidelines

- Use modern JavaScript (ES6+) features
- Follow the DRY (Don't Repeat Yourself) principle
- Maintain a clear separation of concerns
- Write self-documenting code with meaningful variable and function names
- Break down complex components into smaller, focused components

### React-Specific Standards

- Use functional components and React hooks
- Avoid unnecessary re-renders by using `React.memo`, `useMemo`, and `useCallback` when appropriate
- Manage component-specific state with `useState`
- Use React Context for global state management
- Implement proper error boundaries

### Styling Guidelines

- Use Tailwind CSS utility classes for styling
- For complex components, organize Tailwind classes using the recommended grouping order:
  1. Layout (display, position, etc.)
  2. Box model (width, height, margin, padding)
  3. Typography
  4. Visual (colors, backgrounds, borders)
  5. Misc (cursor, overflow, etc.)
- Use CSS-in-JS for dynamic styles only when necessary

### State Management

- Use React Context API for global state management
- Define clear provider boundaries and custom hooks for accessing context
- Keep state updates immutable
- For local component state, use the `useState` hook
- Use `useReducer` for complex state logic

## Performance Optimization

- Implement proper memoization with `React.memo`, `useMemo`, and `useCallback`
- Use lazy loading for routes with the `React.lazy` and `Suspense` components
- Optimize re-renders by avoiding unnecessary state updates
- Use the React Developer Tools profiler to identify performance bottlenecks
- Keep bundle size small by:
  - Avoiding unnecessary dependencies
  - Using tree-shakable libraries
  - Implementing code splitting

## Testing Standards

- Write tests for all new components
- Use React Testing Library for component testing
- Focus on testing behavior, not implementation details
- Maintain a test coverage of at least 75%
- Structure test files with the same name as the component (e.g., `Component.test.jsx`)

## Git Workflow

- Branch naming convention: `feature/description`, `bugfix/issue-number`, etc.
- Create specific, well-scoped commits with clear messages
- Follow the commit message format: `[Type] Brief description`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Submit pull requests for code reviews before merging
- Keep pull requests focused on a single feature or bug fix

## Documentation

- Document complex logic with clear comments
- Use JSDoc format for documenting functions and components
- Keep documentation updated when modifying code
- Add usage examples for reusable components

## Accessibility

- Ensure all interactive elements are keyboard accessible
- Use semantic HTML elements
- Include proper ARIA attributes when necessary
- Maintain sufficient color contrast
- Ensure the application is fully usable with screen readers

## Responsive Design

- Implement mobile-first design
- Use Tailwind's responsive modifiers for different screen sizes
- Test on multiple device sizes and orientations
- Ensure touch targets are appropriately sized for mobile use

## Error Handling

- Implement proper error boundaries for critical components
- Provide meaningful error messages to users
- Log errors to the console in development
- Never show implementation details in user-facing error messages

## Security Best Practices

- Never store sensitive information in client-side code or local storage
- Implement proper client-side validation
- Sanitize user inputs to prevent XSS attacks
- Use environment variables for API keys and configuration
- Follow the principle of least privilege

## Performance Monitoring

- Monitor component render performance
- Identify and fix unnecessary re-renders
- Use the React Developer Tools profiler
- Implement analytics to track real-world user performance

## Continuous Integration

- Ensure all tests pass before merging
- Maintain consistent code style
- Verify that the application builds successfully
- Run linting checks to ensure code quality

By following these guidelines, we maintain a consistent, high-quality codebase that is easier to maintain and extend.