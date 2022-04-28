import { getSupportedCurrencies } from './getCurrencies';

describe('getCurrencies', () => {
  it('should return all supported currencies', () => {
    const result = getSupportedCurrencies();

    expect(result).toContain('INR');
    expect(result).toContain('AUD');
    expect(result).toContain('USD');
  });
});
