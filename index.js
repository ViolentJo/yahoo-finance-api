import express from 'express';
import yahooFinance from 'yahoo-finance2';
import cors from 'cors';

const app = express();
app.use(cors());

const symbols = ['EDP.LS', 'AIQ', 'QTUM', 'GNL', 'EURUSD=X'];

app.get('/api/stocks', async (req, res) => {
  try {
    const quotes = await Promise.all(
      symbols.map(symbol => yahooFinance.quote(symbol))
    );
    res.json(quotes.map(q => ({
      symbol: q.symbol,
      shortName: q.shortName,
      price: q.regularMarketPrice
    })));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
});

app.listen(3000, () => {
  console.log('API a correr em http://localhost:3000');
});
