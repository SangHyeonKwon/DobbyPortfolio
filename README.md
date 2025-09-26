# 🧙‍♂️ Dobby's Crypto Roast

A brutally honest cryptocurrency portfolio analyzer that gives you savage advice about your investments.

## ✨ Features

- **Portfolio Tracking**: Add and manage your cryptocurrency holdings
- **Real-time Prices**: Live price updates from CoinGecko API
- **AI-Powered Analysis**: Get brutally honest advice from Dobby AI
- **Multi-language Support**: Available in Korean and English
- **Responsive Design**: Works perfectly on desktop and mobile
- **Coin Images**: Real cryptocurrency logos for better visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- OpenRouter API key

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd crypto-dobby-roast
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file
echo "OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here" > .env
echo "PORT=3000" >> .env
```

4. Start the server
```bash
npm start
```

5. Open your browser
```
http://localhost:3000
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `PORT` | Server port (default: 3000) | No |

### Getting OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Generate an API key
4. Add it to your environment variables

## 🌍 Multi-language Support

- **Korean (한국어)**: Default language
- **English**: Click the language toggle button in the header

## 📱 Usage

1. **Add Coins**: Select a cryptocurrency and enter quantity/purchase price
2. **Track Performance**: View real-time profit/loss calculations
3. **Get Roasted**: Click "Get Roast" to receive Dobby's brutal analysis
4. **Switch Languages**: Use the language toggle for different languages

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: OpenRouter API (Claude 3 Haiku)
- **Data**: CoinGecko API
- **Styling**: Custom CSS with modern design

## 📦 Deployment

### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Netlify
1. Connect your repository
2. Set build command: `npm start`
3. Add environment variables

### Railway
1. Connect your repository
2. Add environment variables
3. Deploy

## 🔒 Security

- API keys are stored in environment variables
- No sensitive data is hardcoded
- CORS enabled for cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com/) for cryptocurrency data
- [OpenRouter](https://openrouter.ai/) for AI capabilities
- [Dobby](https://harrypotter.fandom.com/wiki/Dobby) for inspiration

---

**Warning**: This app provides entertainment and educational purposes only. Not financial advice! 🚨