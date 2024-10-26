import { screen, fireEvent } from '@testing-library/react';
import { renderWithContext } from '../utils/testUtils';
import TripFilterForm from '../../components/TripFilterForm';

describe('TripFilterForm', () => {
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders filter form with all fields', () => {
    renderWithContext(<TripFilterForm onFilter={mockOnFilter} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passengers/i)).toBeInTheDocument();
  });

  test('handles filter changes', () => {
    renderWithContext(<TripFilterForm onFilter={mockOnFilter} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { name: 'name', value: 'Test Trip' }
    });
    fireEvent.change(screen.getByLabelText(/origin/i), {
      target: { name: 'origin', value: 'SFO' }
    });

    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Trip',
        origin: 'SFO'
      })
    );
  });

  test('handles filter reset', () => {
    renderWithContext(<TripFilterForm onFilter={mockOnFilter} />);

    // Set some filter values first.
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { name: 'name', value: 'Test Trip' }
    });
    fireEvent.change(screen.getByLabelText(/origin/i), {
      target: { name: 'origin', value: 'SFO' }
    });

    // Reset filters.
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(mockOnFilter).toHaveBeenCalledWith({
      name: '',
      origin: '',
      destination: '',
      startDate: '',
      endDate: '',
      passengers: ''
    });

    // Verify fields are cleared.
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/origin/i)).toHaveValue('');
  });

  test('validates date range', () => {
    renderWithContext(<TripFilterForm onFilter={mockOnFilter} />);

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { name: 'startDate', value: '2024-12-10' }
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { name: 'endDate', value: '2024-12-01' }
    });

    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    expect(screen.getByRole('alert'))
      .toHaveTextContent(/start date cannot be after end date/i);
    expect(mockOnFilter).not.toHaveBeenCalled();
  });

  test('validates passenger count', () => {
    renderWithContext(<TripFilterForm onFilter={mockOnFilter} />);

    fireEvent.change(screen.getByLabelText(/passengers/i), {
      target: { name: 'passengers', value: '-1' }
    });

    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    expect(screen.getByRole('alert'))
      .toHaveTextContent(/passengers must be at least 1/i);
    expect(mockOnFilter).not.toHaveBeenCalled();
  });
});