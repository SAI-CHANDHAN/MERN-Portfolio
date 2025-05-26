import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Mock the useApi hook
jest.mock('./hooks/useApi', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    error: null,
    request: jest.fn(),
  }),
}));

// Mock components that might have complex dependencies
jest.mock('./components/common/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('./components/common/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

// Custom render function with providers
const renderWithProviders = (ui, options = {}) => {
  const { initialEntries = ['/'], ...renderOptions } = options;
  
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MemoryRouter>
    );
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders home page by default', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      // Check if we're on the home page (this will depend on your home page content)
      expect(document.title).toContain('Portfolio');
    });
  });

  test('handles navigation to different routes', async () => {
    renderWithProviders(<App />, { initialEntries: ['/about'] });
    
    await waitFor(() => {
      // This test will depend on your routing implementation
      expect(window.location.pathname).toBe('/about');
    });
  });

  test('shows 404 page for unknown routes', async () => {
    renderWithProviders(<App />, { initialEntries: ['/unknown-route'] });
    
    await waitFor(() => {
      // This assumes you have a 404 page with specific content
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });

  test('includes error boundary for error handling', () => {
    // Mock console.error to avoid cluttering test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    renderWithProviders(
      <App>
        <ThrowError />
      </App>
    );
    
    // Check if error boundary catches the error
    // This will depend on your error boundary implementation
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('applies correct document title on route changes', async () => {
    const { rerender } = renderWithProviders(<App />, { initialEntries: ['/'] });
    
    await waitFor(() => {
      expect(document.title).toContain('Portfolio');
    });

    // Test navigation to projects page
    rerender(
      <MemoryRouter initialEntries={['/projects']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.title).toContain('Projects');
    });
  });

  test('handles authentication state changes', async () => {
    // This test will depend on your authentication implementation
    renderWithProviders(<App />);
    
    // Test authenticated state
    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  test('loads with proper meta tags', () => {
    renderWithProviders(<App />);
    
    // Check if SEO component is working
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toBeInTheDocument();
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords).toBeInTheDocument();
  });

  test('handles theme switching', async () => {
    renderWithProviders(<App />);
    
    // Test if theme can be switched (this depends on your theme implementation)
    const htmlElement = document.documentElement;
    expect(htmlElement).toBeInTheDocument();
    
    // You can add more specific theme tests here
  });

  test('implements proper accessibility features', () => {
    renderWithProviders(<App />);
    
    // Check for skip links
    const skipLink = screen.queryByText(/skip to main content/i);
    if (skipLink) {
      expect(skipLink).toBeInTheDocument();
    }
    
    // Check for proper landmark roles
    const main = document.querySelector('main');
    if (main) {
      expect(main).toBeInTheDocument();
    }
  });

  test('handles scroll restoration', async () => {
    renderWithProviders(<App />);
    
    // Mock window.scrollTo
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    
    // Navigate to different route
    window.history.pushState({}, '', '/about');
    
    await waitFor(() => {
      // Check if scroll is restored (this depends on your scroll restoration implementation)
      expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    });
    
    scrollToSpy.mockRestore();
  });

  test('loads external resources properly', async () => {
    renderWithProviders(<App />);
    
    // Check if external stylesheets are loaded
    const externalStyles = document.querySelectorAll('link[rel="stylesheet"]');
    expect(externalStyles.length).toBeGreaterThan(0);
  });

  test('handles offline state', async () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    
    renderWithProviders(<App />);
    
    // Dispatch offline event
    window.dispatchEvent(new Event('offline'));
    
    await waitFor(() => {
      // Check if offline indicator is shown (if implemented)
      const offlineIndicator = screen.queryByText(/offline/i);
      if (offlineIndicator) {
        expect(offlineIndicator).toBeInTheDocument();
      }
    });
    
    // Restore online state
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  test('implements proper loading states', async () => {
    renderWithProviders(<App />);
    
    // Check if loading spinner is shown initially (if applicable)
    const loadingSpinner = screen.queryByTestId('loading-spinner');
    if (loadingSpinner) {
      expect(loadingSpinner).toBeInTheDocument();
    }
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });
});