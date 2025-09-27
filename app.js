// Crypto Portfolio App with Dobby AI Roast
class CryptoPortfolioApp {
    constructor() {
        this.portfolio = [];
        this.priceData = {};
        this.isLoadingPrices = false;
        this.currentLanguage = 'ko'; // 기본 언어는 한국어
        
        // API configuration
        this.coingeckoAPI = 'https://api.coingecko.com/api/v3';
        
        // 다국어 텍스트
        this.texts = {
            ko: {
                title: "🧙‍♂️ Dobby의 암호화폐 로스트",
                subtitle: "당신의 포트폴리오를 신랄하게 분석해드립니다",
                addPortfolio: "포트폴리오에 추가",
                coinSymbol: "코인 심볼",
                selectCoin: "코인을 선택하세요",
                quantity: "수량",
                purchasePrice: "구매가 (USD)",
                addButton: "추가",
                refreshPrices: "가격 새로고침",
                myPortfolio: "내 포트폴리오",
                coin: "코인",
                quantityCol: "수량",
                purchasePriceCol: "구매가",
                currentPrice: "현재가",
                profitLoss: "손익",
                action: "액션",
                delete: "삭제",
                totalInvested: "총 투자금액",
                currentValue: "현재 포트폴리오 가치",
                totalPnL: "총 손익",
                getRoast: "로스트 받기",
                roastTitle: "Dobby의 신랄한 조언",
                roastPlaceholder: "포트폴리오를 추가한 후 Dobby의 신랄한 조언을 받아보세요!",
                loading: "로딩 중...",
                loadingRoast: "Dobby가 당신의 포트폴리오를 분석 중...",
                error: "Dobby가 잠시 말을 잃었습니다... 잠시 후 다시 시도해주세요.",
                removeConfirm: "이 항목을 포트폴리오에서 제거하시겠습니까?",
                allFieldsRequired: "모든 필드를 올바르게 입력해주세요.",
                invalidCoin: "유효하지 않은 코인입니다.",
                priceError: "가격 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.",
                coinListError: "코인 목록을 가져올 수 없습니다.",
                copyright: "© 2025 Dobby's Crypto Roast. 가격 데이터는 CoinGecko에서 제공됩니다."
            },
            en: {
                title: "🧙‍♂️ Dobby's Crypto Roast",
                subtitle: "Get brutally honest analysis of your portfolio",
                addPortfolio: "Add to Portfolio",
                coinSymbol: "Coin Symbol",
                selectCoin: "Select a coin",
                quantity: "Quantity",
                purchasePrice: "Purchase Price (USD)",
                addButton: "Add",
                refreshPrices: "Refresh Prices",
                myPortfolio: "My Portfolio",
                coin: "Coin",
                quantityCol: "Quantity",
                purchasePriceCol: "Purchase Price",
                currentPrice: "Current Price",
                profitLoss: "P&L",
                action: "Action",
                delete: "Delete",
                totalInvested: "Total Invested",
                currentValue: "Current Portfolio Value",
                totalPnL: "Total P&L",
                getRoast: "Get Roast",
                roastTitle: "Dobby's Brutal Advice",
                roastPlaceholder: "Add coins to your portfolio to get Dobby's brutal advice!",
                loading: "Loading...",
                loadingRoast: "Dobby is analyzing your portfolio...",
                error: "Dobby has lost his words... Please try again later.",
                removeConfirm: "Are you sure you want to remove this item from your portfolio?",
                allFieldsRequired: "Please fill in all fields correctly.",
                invalidCoin: "Invalid coin selected.",
                priceError: "Failed to fetch price data. Please try again later.",
                coinListError: "Failed to load coin list.",
                copyright: "© 2025 Dobby's Crypto Roast. Price data provided by CoinGecko."
            }
        };
        
        
        this.coinMap = {
            'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
            'ethereum': { symbol: 'ETH', name: 'Ethereum' },
            'binancecoin': { symbol: 'BNB', name: 'Binance Coin' },
            'ripple': { symbol: 'XRP', name: 'Ripple' },
            'cardano': { symbol: 'ADA', name: 'Cardano' },
            'solana': { symbol: 'SOL', name: 'Solana' },
            'polkadot': { symbol: 'DOT', name: 'Polkadot' },
            'chainlink': { symbol: 'LINK', name: 'Chainlink' },
            'litecoin': { symbol: 'LTC', name: 'Litecoin' },
            'bitcoin-cash': { symbol: 'BCH', name: 'Bitcoin Cash' }
        };
        
        this.init();
    }
    
    init() {
        this.loadPortfolioFromStorage();
        this.bindEvents();
        this.loadCoinList();
        this.updateUI();
        this.fetchPrices();
        
        // Auto refresh prices every 30 seconds (무료 API 제한 고려)
        setInterval(() => {
            if (this.portfolio.length > 0) {
                this.fetchPrices();
            }
        }, 30000);
    }
    
    bindEvents() {
        // Portfolio form submission
        document.getElementById('portfolio-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addToPortfolio();
        });
        
        // Refresh prices button
        document.getElementById('refresh-prices').addEventListener('click', () => {
            this.fetchPrices();
        });
        
        // Get roast button
        document.getElementById('get-roast').addEventListener('click', () => {
            this.generateRoast();
        });
        
        // Language toggle button
        document.getElementById('language-toggle').addEventListener('click', () => {
            this.toggleLanguage();
        });
    }
    
    async loadCoinList() {
        const selectElement = document.getElementById('coin-symbol');
        if (!selectElement) return;
        
        // 로딩 상태 표시
        selectElement.classList.add('coin-select-loading');
        selectElement.disabled = true;
        
        try {
            // CoinGecko API에서 상위 100개 코인 목록 가져오기
            const response = await fetch(`/.netlify/functions/coins-markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
            
            if (!response.ok) {
                throw new Error('코인 목록을 가져올 수 없습니다.');
            }
            
            const coins = await response.json();
            
            // coinMap 업데이트
            this.coinMap = {};
            coins.forEach(coin => {
                this.coinMap[coin.id] = {
                    symbol: coin.symbol.toUpperCase(),
                    name: coin.name,
                    marketCap: coin.market_cap,
                    image: coin.image
                };
            });
            
            // 셀렉트 박스 업데이트
            this.updateCoinSelect();
            
        } catch (error) {
            console.error('Error loading coin list:', error);
            // 실패 시 기본 코인들 사용
            this.useDefaultCoins();
        } finally {
            // 로딩 상태 제거
            selectElement.classList.remove('coin-select-loading');
            selectElement.disabled = false;
        }
    }
    
    updateCoinSelect() {
        const selectElement = document.getElementById('coin-symbol');
        if (!selectElement) return;
        
        // 기존 옵션들 제거 (첫 번째 옵션 제외)
        selectElement.innerHTML = '<option value="">코인을 선택하세요</option>';
        
        // 상위 50개 코인만 표시 (너무 많으면 선택하기 어려움)
        const topCoins = Object.entries(this.coinMap)
            .sort((a, b) => b[1].marketCap - a[1].marketCap)
            .slice(0, 50);
        
        topCoins.forEach(([id, coin]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${coin.symbol} - ${coin.name}`;
            selectElement.appendChild(option);
        });
    }
    
    useDefaultCoins() {
        // API 실패 시 기본 코인들 사용
        this.coinMap = {
            'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
            'ethereum': { symbol: 'ETH', name: 'Ethereum' },
            'binancecoin': { symbol: 'BNB', name: 'Binance Coin' },
            'ripple': { symbol: 'XRP', name: 'Ripple' },
            'cardano': { symbol: 'ADA', name: 'Cardano' },
            'solana': { symbol: 'SOL', name: 'Solana' },
            'polkadot': { symbol: 'DOT', name: 'Polkadot' },
            'chainlink': { symbol: 'LINK', name: 'Chainlink' },
            'litecoin': { symbol: 'LTC', name: 'Litecoin' },
            'bitcoin-cash': { symbol: 'BCH', name: 'Bitcoin Cash' }
        };
        this.updateCoinSelect();
    }
    
    addToPortfolio() {
        const coinId = document.getElementById('coin-symbol').value;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
        
        if (!coinId || !quantity || !purchasePrice) {
            alert('모든 필드를 올바르게 입력해주세요.');
            return;
        }
        
        const coinInfo = this.coinMap[coinId];
        if (!coinInfo) {
            alert('유효하지 않은 코인입니다.');
            return;
        }
        
        // Check if coin already exists in portfolio
        const existingIndex = this.portfolio.findIndex(item => item.coinId === coinId);
        
        if (existingIndex !== -1) {
            // Update existing holding
            const existing = this.portfolio[existingIndex];
            const totalQuantity = existing.quantity + quantity;
            const totalValue = (existing.quantity * existing.purchasePrice) + (quantity * purchasePrice);
            const avgPrice = totalValue / totalQuantity;
            
            this.portfolio[existingIndex] = {
                ...existing,
                quantity: totalQuantity,
                purchasePrice: avgPrice
            };
        } else {
            // Add new holding
            this.portfolio.push({
                coinId,
                symbol: coinInfo.symbol,
                name: coinInfo.name,
                quantity,
                purchasePrice,
                currentPrice: 0
            });
        }
        
        this.savePortfolioToStorage();
        this.updateUI();
        this.fetchPrices();
        
        // Reset form
        document.getElementById('portfolio-form').reset();
        
        // Enable roast button if portfolio has items
        document.getElementById('get-roast').disabled = this.portfolio.length === 0;
    }
    
    removeFromPortfolio(index) {
        if (confirm('이 항목을 포트폴리오에서 제거하시겠습니까?')) {
            this.portfolio.splice(index, 1);
            this.savePortfolioToStorage();
            this.updateUI();
            
            // Disable roast button if portfolio is empty
            document.getElementById('get-roast').disabled = this.portfolio.length === 0;
        }
    }
    
    async fetchPrices() {
        if (this.portfolio.length === 0) return;
        
        // API 호출 제한 방지 (무료 API 고려)
        if (this.isLoadingPrices) return;
        
        this.showLoadingState();
        
        try {
            const coinIds = this.portfolio.map(item => item.coinId).join(',');
            const response = await fetch(
                `/.netlify/functions/coins-markets?ids=${coinIds}&vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
            );
            
            if (!response.ok) {
                throw new Error('가격 정보를 가져올 수 없습니다.');
            }
            
            const data = await response.json();
            
            // Update portfolio with current prices and images
            this.portfolio.forEach(item => {
                const coinData = data.find(coin => coin.id === item.coinId);
                if (coinData) {
                    item.currentPrice = coinData.current_price;
                    item.image = coinData.image;
                }
            });
            
            this.priceData = data;
            this.savePortfolioToStorage();
            this.updateUI();
            
        } catch (error) {
            console.error('Error fetching prices:', error);
            this.showError('가격 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
        
        this.hideLoadingState();
    }
    
    updateUI() {
        this.renderPortfolioTable();
        this.updateMetrics();
        this.updateLanguageUI();
        
        // Update roast button state
        const roastButton = document.getElementById('get-roast');
        if (roastButton) {
            roastButton.disabled = this.portfolio.length === 0;
            // Force update the button text after enabling/disabling
            if (!roastButton.disabled) {
                const t = this.texts[this.currentLanguage];
                roastButton.textContent = t.getRoast;
            }
        }
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ko' ? 'en' : 'ko';
        this.updateLanguageUI();
        this.updateUI();
    }
    
    updateLanguageUI() {
        const t = this.texts[this.currentLanguage];
        
        // Update header
        document.querySelector('.app-title').textContent = t.title;
        document.querySelector('.app-subtitle').textContent = t.subtitle;
        
        // Update language toggle button
        document.querySelector('.language-text').textContent = this.currentLanguage === 'ko' ? 'EN' : '한';
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
            }
        });
        
        // Update placeholders
        document.getElementById('quantity').placeholder = t.quantity;
        document.getElementById('purchase-price').placeholder = t.purchasePrice;
        
        // Update select option placeholder
        const selectOption = document.getElementById('coin-symbol').querySelector('option[value=""]');
        if (selectOption) {
            selectOption.textContent = t.selectCoin;
        }
        
        // Update copyright
        document.querySelector('.app-footer p').textContent = t.copyright;
    }
    
    renderPortfolioTable() {
        const portfolioTable = document.getElementById('portfolio-table');
        const portfolioRows = document.getElementById('portfolio-rows');
        const emptyState = document.getElementById('portfolio-empty');
        
        if (this.portfolio.length === 0) {
            portfolioTable.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        portfolioTable.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        portfolioRows.innerHTML = '';
        
        this.portfolio.forEach((item, index) => {
            const currentValue = item.quantity * item.currentPrice;
            const investedValue = item.quantity * item.purchasePrice;
            const pnl = currentValue - investedValue;
            const pnlPercentage = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
            
            const row = document.createElement('div');
            row.className = 'table-row';
            const t = this.texts[this.currentLanguage];
            row.innerHTML = `
                <div class="table-cell" data-label="${t.coin}">
                    <div class="coin-info">
                        <div class="coin-icon">
                            ${item.image ? 
                                `<img src="${item.image}" alt="${item.symbol}" class="coin-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                 <div class="coin-fallback" style="display: none;">${item.symbol.charAt(0)}</div>` :
                                `<div class="coin-fallback">${item.symbol.charAt(0)}</div>`
                            }
                        </div>
                        <div>
                            <div class="coin-name">${item.name}</div>
                            <div class="coin-symbol">${item.symbol}</div>
                        </div>
                    </div>
                </div>
                <div class="table-cell" data-label="${t.quantityCol}">${item.quantity.toFixed(8)}</div>
                <div class="table-cell" data-label="${t.purchasePriceCol}">$${item.purchasePrice.toFixed(2)}</div>
                <div class="table-cell" data-label="${t.currentPrice}">$${item.currentPrice.toFixed(2)}</div>
                <div class="table-cell ${pnl >= 0 ? 'pnl-positive' : 'pnl-negative'}" data-label="${t.profitLoss}">
                    $${pnl.toFixed(2)} (${pnlPercentage.toFixed(1)}%)
                </div>
                <div class="table-cell" data-label="${t.action}">
                    <button class="btn btn--danger" onclick="app.removeFromPortfolio(${index})">${t.delete}</button>
                </div>
            `;
            
            portfolioRows.appendChild(row);
        });
    }
    
    updateMetrics() {
        let totalInvested = 0;
        let currentValue = 0;
        
        this.portfolio.forEach(item => {
            totalInvested += item.quantity * item.purchasePrice;
            currentValue += item.quantity * item.currentPrice;
        });
        
        const totalPnL = currentValue - totalInvested;
        const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
        
        const t = this.texts[this.currentLanguage];
        document.getElementById('total-invested').textContent = `$${totalInvested.toFixed(2)}`;
        document.getElementById('current-value').textContent = `$${currentValue.toFixed(2)}`;
        
        const pnlElement = document.getElementById('total-pnl');
        pnlElement.textContent = `$${totalPnL.toFixed(2)} (${totalPnLPercentage.toFixed(1)}%)`;
        pnlElement.className = `metric-value ${totalPnL >= 0 ? 'text-positive' : 'text-negative'}`;
        
        // Update metric labels
        document.querySelector('[data-metric="invested"] .metric-label').textContent = t.totalInvested;
        document.querySelector('[data-metric="value"] .metric-label').textContent = t.currentValue;
        document.querySelector('[data-metric="pnl"] .metric-label').textContent = t.totalPnL;
    }
    
    async generateRoast() {
        if (this.portfolio.length === 0) return;
        
        const roastContent = document.getElementById('roast-content');
        const roastLoading = document.getElementById('roast-loading');
        const getRoastBtn = document.getElementById('get-roast');
        
        // Show loading state
        roastContent.classList.add('hidden');
        roastLoading.classList.remove('hidden');
        getRoastBtn.disabled = true;
        
        // Update loading message
        const loadingText = roastLoading.querySelector('p');
        if (loadingText) {
            const t = this.texts[this.currentLanguage];
            loadingText.textContent = t.loadingRoast;
        }
        
        try {
            // Dobby API 호출
            const roastText = await this.callDobbyAPI();
            
            roastLoading.classList.add('hidden');
            roastContent.classList.remove('hidden');
            
            // Typewriter effect
            this.typewriterEffect(roastContent, roastText);
            
        } catch (error) {
            console.error('Error generating roast:', error);
            
            // Show error message instead of fallback roast
            roastLoading.classList.add('hidden');
            roastContent.classList.remove('hidden');
            
            const t = this.texts[this.currentLanguage];
            roastContent.innerHTML = `<p class="roast-text error">${t.error}</p>`;
        }
        
        getRoastBtn.disabled = false;
    }
    
    async callDobbyAPI() {
        try {
            console.log('Dobby API 호출 시작...', this.portfolio);
            
            const response = await fetch('/.netlify/functions/dobby-roast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    portfolio: this.portfolio,
                    language: this.currentLanguage
                })
            });
            
            console.log('응답 상태:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('서버 응답 에러:', response.status, errorText);
                throw new Error(`서버 오류: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('받은 데이터:', data);
            
            if (!data.success) {
                throw new Error(data.error || 'API 호출 실패');
            }
            
            return data.roast;
            
        } catch (error) {
            console.error('API 호출 에러:', error);
            throw error;
        }
    }
    
    
    typewriterEffect(element, text) {
        element.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'roast-text';
        element.appendChild(p);
        
        let i = 0;
        const timer = setInterval(() => {
            p.textContent += text.charAt(i);
            i++;
            
            if (i > text.length) {
                clearInterval(timer);
            }
        }, 50);
    }
    
    showLoadingState() {
        document.getElementById('portfolio-loading').classList.remove('hidden');
        this.isLoadingPrices = true;
    }
    
    hideLoadingState() {
        document.getElementById('portfolio-loading').classList.add('hidden');
        this.isLoadingPrices = false;
    }
    
    showError(message) {
        // Simple error display - could be enhanced with a proper toast system
        alert(message);
    }
    
    savePortfolioToStorage() {
        try {
            localStorage.setItem('crypto-portfolio', JSON.stringify(this.portfolio));
        } catch (error) {
            console.error('Failed to save portfolio to storage:', error);
        }
    }
    
    loadPortfolioFromStorage() {
        try {
            const stored = localStorage.getItem('crypto-portfolio');
            if (stored) {
                this.portfolio = JSON.parse(stored);
                // Ensure all items have required properties
                this.portfolio = this.portfolio.filter(item => 
                    item.coinId && item.symbol && item.name && 
                    typeof item.quantity === 'number' && 
                    typeof item.purchasePrice === 'number'
                );
            }
        } catch (error) {
            console.error('Failed to load portfolio from storage:', error);
            this.portfolio = [];
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CryptoPortfolioApp();
    
    // Add some sample data for demonstration (optional)
    if (window.location.search.includes('demo=true')) {
        setTimeout(() => {
            // Add sample Bitcoin holding
            document.getElementById('coin-symbol').value = 'bitcoin';
            document.getElementById('quantity').value = '0.1';
            document.getElementById('purchase-price').value = '45000';
            
            // Trigger add to portfolio
            const event = new Event('submit');
            document.getElementById('portfolio-form').dispatchEvent(event);
            
            // Add sample Ethereum holding after a short delay
            setTimeout(() => {
                document.getElementById('coin-symbol').value = 'ethereum';
                document.getElementById('quantity').value = '2.5';
                document.getElementById('purchase-price').value = '3000';
                
                const event2 = new Event('submit');
                document.getElementById('portfolio-form').dispatchEvent(event2);
            }, 1000);
        }, 2000);
    }
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatPercentage(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Error handling for global errors
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export app for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoPortfolioApp;
}