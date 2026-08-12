import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VaultProvider } from '../context/VaultContext';
import { DeviceProvider } from '../context/DeviceContext';
import { TransactionsScreen } from '../screens/TransactionsScreen';

const renderWithProviders = (ui) => {
  return render(
    <DeviceProvider>
      <VaultProvider>
        {ui}
      </VaultProvider>
    </DeviceProvider>
  );
};

describe('TransactionsScreen Component', () => {
  it('renders transactions list and filters by search input', () => {
    renderWithProviders(<TransactionsScreen />);

    expect(screen.getByText('Activity & Transactions')).toBeInTheDocument();
    expect(screen.getByText('Swiggy Gourmet')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search merchant, category, or note.../i);
    fireEvent.change(searchInput, { target: { value: 'Blinkit' } });

    expect(screen.getByText('Blinkit Instant')).toBeInTheDocument();
    expect(screen.queryByText('Swiggy Gourmet')).not.toBeInTheDocument();
  });

  it('filters transactions by category chip', () => {
    renderWithProviders(<TransactionsScreen />);

    const refundChip = screen.getByRole('button', { name: 'Refund' });
    fireEvent.click(refundChip);

    expect(screen.getByText('Swiggy Refund (Cancelled Item)')).toBeInTheDocument();
    expect(screen.queryByText('Uber India')).not.toBeInTheDocument();
  });
});
