export interface FlowStock {
    symbol: string;
    name: string;
    sector: string;
    stepSize: number;
}

export const NOTABLE_FLOW_STOCKS: FlowStock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', stepSize: 1.00 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Cyclical', stepSize: 1.00 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', stepSize: 1.00 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', stepSize: 0.50 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', stepSize: 1.00 },
    { symbol: 'AMZN', name: 'Amazon.com', sector: 'Consumer Cyclical', stepSize: 1.00 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication', stepSize: 1.00 },
    { symbol: 'META', name: 'Meta Platforms', sector: 'Communication', stepSize: 1.00 },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', sector: 'ETF', stepSize: 0.50 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', sector: 'ETF', stepSize: 0.50 },
    { symbol: 'IWM', name: 'iShares Russell 2000', sector: 'ETF', stepSize: 0.50 },
    { symbol: 'COIN', name: 'Coinbase Global', sector: 'Financial', stepSize: 1.00 },
    { symbol: 'NFLX', name: 'Netflix', sector: 'Communication', stepSize: 1.00 },
    { symbol: 'BA', name: 'Boeing', sector: 'Industrials', stepSize: 1.00 },
    { symbol: 'DIS', name: 'Disney', sector: 'Communication', stepSize: 0.50 },
    { symbol: 'ROKU', name: 'Roku', sector: 'Communication', stepSize: 0.50 },
    { symbol: 'SQ', name: 'Block', sector: 'Financial', stepSize: 1.00 },
    { symbol: 'PLTR', name: 'Palantir', sector: 'Technology', stepSize: 0.50 },
    { symbol: 'DKNG', name: 'DraftKings', sector: 'Consumer Cyclical', stepSize: 0.50 },
    { symbol: 'UBER', name: 'Uber Technologies', sector: 'Technology', stepSize: 0.50 }
];

export const STEP_SIZE_OPTIONS = [
    { value: '0.25', label: '$0.25' },
    { value: '0.50', label: '$0.50' },
    { value: '1.00', label: '$1.00' },
    { value: '2.50', label: '$2.50' },
    { value: '5.00', label: '$5.00' },
    { value: '10.00', label: '$10.00' }
];

export function searchFlowStocks(query: string): FlowStock[] {
    const q = query.toUpperCase();
    return NOTABLE_FLOW_STOCKS.filter(stock =>
        stock.symbol.includes(q) ||
        stock.name.toUpperCase().includes(q)
    );
}

export function getFlowStock(symbol: string): FlowStock | undefined {
    return NOTABLE_FLOW_STOCKS.find(s => s.symbol === symbol);
}
