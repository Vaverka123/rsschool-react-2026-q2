import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';

import ThemeProvider from '@/context/ThemeProvider';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

// eslint-disable-next-line react-refresh/only-export-components
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={makeQueryClient()}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}

function renderWithMemoryRouter(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, options);
}

// Explicitly re-export only the testing utilities we use to avoid
// exporting arbitrary symbols via `export *`.
export {
  act,
  cleanup,
  fireEvent,
  prettyDOM,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
export { renderWithMemoryRouter, renderWithProviders };
