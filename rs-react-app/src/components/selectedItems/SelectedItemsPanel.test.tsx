import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectedItemsPanel from './SelectedItemsPanel';

import useCharacterStore from '@/store/characterStore';
import { mockCharacter, mockCharacters } from '@/test-utils/mocks';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

beforeEach(() => {
  act(() => useCharacterStore.setState({ checkedItems: [] }));
});

describe('SelectedItemsPanel', () => {
  it('renders nothing when no items are selected', () => {
    const { container } = renderWithProviders(<SelectedItemsPanel />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the panel when one item is selected', () => {
    act(() => useCharacterStore.setState({ checkedItems: [mockCharacter] }));
    renderWithProviders(<SelectedItemsPanel />);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('uses plural form for multiple selected items', () => {
    act(() => useCharacterStore.setState({ checkedItems: mockCharacters }));
    renderWithProviders(<SelectedItemsPanel />);
    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('renders an Unselect all button', () => {
    act(() => useCharacterStore.setState({ checkedItems: [mockCharacter] }));
    renderWithProviders(<SelectedItemsPanel />);
    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();
  });

  it('renders a Download button', () => {
    act(() => useCharacterStore.setState({ checkedItems: [mockCharacter] }));
    renderWithProviders(<SelectedItemsPanel />);
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });

  it('clears all checked items when Unselect all is clicked', async () => {
    act(() => useCharacterStore.setState({ checkedItems: mockCharacters }));
    renderWithProviders(<SelectedItemsPanel />);

    await userEvent.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(useCharacterStore.getState().checkedItems).toEqual([]);
  });

  it('hides the panel after all items are deselected', async () => {
    act(() => useCharacterStore.setState({ checkedItems: [mockCharacter] }));
    const { container } = renderWithProviders(<SelectedItemsPanel />);

    await userEvent.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(container).toBeEmptyDOMElement();
  });

  describe('Download button', () => {
    let createObjectURL: ReturnType<typeof vi.fn>;
    let revokeObjectURL: ReturnType<typeof vi.fn>;
    let clickSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      createObjectURL = vi.fn(() => 'blob:mock-url');
      revokeObjectURL = vi.fn();
      clickSpy = vi.fn();

      global.URL.createObjectURL = createObjectURL;
      global.URL.revokeObjectURL = revokeObjectURL;

      const original = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation(
        (tag: string, options?: ElementCreationOptions) => {
          const el = original(tag, options);
          if (tag === 'a') el.click = clickSpy;
          return el;
        }
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('triggers a file download when Download is clicked', async () => {
      act(() => useCharacterStore.setState({ checkedItems: [mockCharacter] }));
      renderWithProviders(<SelectedItemsPanel />);

      await userEvent.click(screen.getByRole('button', { name: /download/i }));

      expect(createObjectURL).toHaveBeenCalledOnce();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      expect(clickSpy).toHaveBeenCalledOnce();
    });
  });
});
