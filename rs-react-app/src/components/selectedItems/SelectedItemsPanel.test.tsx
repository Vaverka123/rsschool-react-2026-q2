import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectedItemsPanel from './SelectedItemsPanel';

import useCharacterStore from '@/store/characterStore';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

beforeEach(() => {
  act(() => useCharacterStore.setState({ checkedIds: [] }));
});

describe('SelectedItemsPanel', () => {
  it('renders nothing when no items are selected', () => {
    const { container } = renderWithProviders(<SelectedItemsPanel />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the panel when one item is selected', () => {
    act(() => useCharacterStore.setState({ checkedIds: [1] }));
    renderWithProviders(<SelectedItemsPanel />);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('uses plural form for multiple selected items', () => {
    act(() => useCharacterStore.setState({ checkedIds: [1, 2, 3] }));
    renderWithProviders(<SelectedItemsPanel />);
    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('renders a Deselect all button', () => {
    act(() => useCharacterStore.setState({ checkedIds: [1] }));
    renderWithProviders(<SelectedItemsPanel />);
    expect(
      screen.getByRole('button', { name: /deselect all/i })
    ).toBeInTheDocument();
  });

  it('clears all checked ids when Deselect all is clicked', async () => {
    act(() => useCharacterStore.setState({ checkedIds: [1, 2, 3] }));
    renderWithProviders(<SelectedItemsPanel />);

    await userEvent.click(screen.getByRole('button', { name: /deselect all/i }));

    expect(useCharacterStore.getState().checkedIds).toEqual([]);
  });

  it('hides the panel after all items are deselected', async () => {
    act(() => useCharacterStore.setState({ checkedIds: [1] }));
    const { container } = renderWithProviders(<SelectedItemsPanel />);

    await userEvent.click(screen.getByRole('button', { name: /deselect all/i }));

    expect(container).toBeEmptyDOMElement();
  });
});
