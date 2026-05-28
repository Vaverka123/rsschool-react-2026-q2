import { BrowserRouter } from 'react-router-dom';

import { render, type RenderOptions } from '@testing-library/react';

function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    ),
    ...options,
  });
}

function renderWithMemoryRouter(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, options);
}

export { renderWithMemoryRouter, renderWithProviders };
