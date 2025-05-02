import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  const symbols = [
    'EDP.LS', 'AIQ', 'QTUM', 'GNL', 'EURUSD=X',
    'ENEL.MI', 'ISP.MI', 'NOS.LS', 'ORA.PA'
  ];

  try {
    const quotes = await Promise.all(
      symbols.map(async symbol => {
        try {
          const q = await yahooFinance.quote(symbol);
          return {
            symbol: q.symbol,
            shortName: q.shortName,
            price: q.regularMarketPrice
          };
        } catch (e) {
          console.error(`Erro em ${symbol}:`, e.message);
          return null;
        }
      })
    );

    res.status(200).json(quotes.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Erro geral', details: error.message });
  }
}
