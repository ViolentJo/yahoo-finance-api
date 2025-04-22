import express from 'express';
import yahooFinance from 'yahoo-finance2';
import cors from 'cors';

const app = express();
app.use(cors());

// Símbolos a seguir (ação + ETFs + câmbio EUR/USD)
const symbols = ['EDP.LS', 'AIQ', 'QTUM', 'GNL', 'EURUSD=X'];

app.get('/api/stocks', async (req, res) => {
  try {
    const quotes = await Promise.all(
      symbols.map(async symbol => {
        try {
          const q = await yahooFinance.quote(symbol);
          console.log(`✔️ ${symbol}: ${q.regularMarketPrice}`);
          return q;
        } catch (err) {
          console.error(`❌ Erro ao obter ${symbol}:`, err.message);
          return null;
        }
      })
    );

    // Filtra os símbolos válidos
    const validQuotes = quotes.filter(q => q !== null);

    // Resposta em JSON com os dados principais
    res.json(validQuotes.map(q => ({
      symbol: q.symbol,
      shortName: q.shortName,
      price: q.regularMarketPrice
    })));
  } catch (error) {
    console.error("❌ ERRO GERAL:", error.message);
    res.status(500).json({ error: 'Erro ao obter dados', details: error.message });
  }
});

// Inicia servidor na porta 3000
app.listen(3000, () => {
  console.log('✅ API a correr em http://localhost:3000');
});
