const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // CORS 헤더 설정
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // POST 요청만 처리
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { portfolio, language = 'ko' } = JSON.parse(event.body);

        if (!portfolio || !Array.isArray(portfolio)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Portfolio data is required' }),
            };
        }

        // 포트폴리오 분석
        const analysis = analyzePortfolio(portfolio);
        
        // OpenRouter API 호출
        const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://dobbyportfolio.netlify.app',
                'X-Title': 'Dobby Portfolio App'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3-haiku',
                messages: [
                    {
                        role: 'system',
                        content: language === 'ko' 
                            ? '당신은 Dobby입니다. 사용자의 암호화폐 포트폴리오를 신랄하고 유머러스하게 분석해주세요. 매우 자세하고 신랄하게 답변하세요. 최소 500자 이상으로 상세한 분석을 제공해주세요. 투자 패턴, 위험도, 수익성, 분산투자 수준 등 모든 측면을 분석해주세요.'
                            : 'You are Dobby. Analyze the user\'s cryptocurrency portfolio in a brutally honest and humorous way. Provide detailed and brutal analysis. Write at least 300 words covering investment patterns, risk levels, profitability, diversification, and all aspects of the portfolio.'
                    },
                    {
                        role: 'user',
                        content: language === 'ko'
                            ? `포트폴리오 분석 요청입니다:\n\n${analysis}\n\n위 포트폴리오를 Dobby의 관점에서 신랄하게 분석해주세요.`
                            : `Portfolio analysis request:\n\n${analysis}\n\nPlease analyze this portfolio from Dobby's perspective in a brutally honest way.`
                    }
                ],
                max_tokens: language === 'ko' ? 1500 : 800,
                temperature: 0.8
            })
        });

        if (!openrouterResponse.ok) {
            throw new Error(`OpenRouter API error: ${openrouterResponse.status}`);
        }

        const data = await openrouterResponse.json();
        const roast = data.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                roast: roast
            }),
        };

    } catch (error) {
        console.error('Dobby roast error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Dobby가 잠시 말을 잃었습니다...',
                details: error.message
            }),
        };
    }
};

// 포트폴리오 분석 함수
function analyzePortfolio(portfolio) {
    const analysis = {
        coinCount: portfolio.length,
        totalInvested: 0,
        currentValue: 0,
        profitLoss: 0,
        profitLossPercentage: 0,
        diversification: 'low',
        riskLevel: 'high',
        memeCoins: 0,
        newbieTraits: []
    };

    // 기본 계산
    portfolio.forEach(item => {
        const invested = item.quantity * item.purchasePrice;
        const current = item.quantity * item.currentPrice;
        
        analysis.totalInvested += invested;
        analysis.currentValue += current;
    });

    analysis.profitLoss = analysis.currentValue - analysis.totalInvested;
    analysis.profitLossPercentage = analysis.totalInvested > 0 ? (analysis.profitLoss / analysis.totalInvested) * 100 : 0;

    // 분석 로직
    if (analysis.coinCount === 1) {
        analysis.newbieTraits.push('단일 코인 집중 투자');
        analysis.riskLevel = 'very high';
    } else if (analysis.coinCount <= 3) {
        analysis.diversification = 'low';
        analysis.riskLevel = 'high';
    } else if (analysis.coinCount <= 10) {
        analysis.diversification = 'medium';
        analysis.riskLevel = 'medium';
    } else {
        analysis.diversification = 'high';
        analysis.riskLevel = 'low';
    }

    // 메모 코인 체크
    const memeCoinSymbols = ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF'];
    portfolio.forEach(item => {
        if (memeCoinSymbols.includes(item.symbol.toUpperCase())) {
            analysis.memeCoins++;
        }
    });

    if (analysis.memeCoins > 0) {
        analysis.newbieTraits.push(`${analysis.memeCoins}개의 메모 코인 보유`);
    }

    if (analysis.profitLossPercentage > 50) {
        analysis.newbieTraits.push('과도한 수익률 (FOMO 가능성)');
    } else if (analysis.profitLossPercentage < -50) {
        analysis.newbieTraits.push('심각한 손실 (HODL 중)');
    }

    // 결과 문자열 생성
    let result = `포트폴리오 분석 결과:\n\n`;
    result += `📊 기본 정보:\n`;
    result += `- 보유 코인 수: ${analysis.coinCount}개\n`;
    result += `- 총 투자금: $${analysis.totalInvested.toFixed(2)}\n`;
    result += `- 현재 가치: $${analysis.currentValue.toFixed(2)}\n`;
    result += `- 손익: $${analysis.profitLoss.toFixed(2)} (${analysis.profitLossPercentage.toFixed(1)}%)\n\n`;
    
    result += `🎯 분석 결과:\n`;
    result += `- 분산투자 수준: ${analysis.diversification}\n`;
    result += `- 위험도: ${analysis.riskLevel}\n`;
    result += `- 메모 코인: ${analysis.memeCoins}개\n`;
    
    if (analysis.newbieTraits.length > 0) {
        result += `- 신규 투자자 특징: ${analysis.newbieTraits.join(', ')}\n`;
    }

    result += `\n📈 상세 포트폴리오:\n`;
    portfolio.forEach((item, index) => {
        const invested = item.quantity * item.purchasePrice;
        const current = item.quantity * item.currentPrice;
        const pnl = current - invested;
        const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
        
        result += `${index + 1}. ${item.name} (${item.symbol})\n`;
        result += `   수량: ${item.quantity.toFixed(8)}\n`;
        result += `   구매가: $${item.purchasePrice.toFixed(2)}\n`;
        result += `   현재가: $${item.currentPrice.toFixed(2)}\n`;
        result += `   손익: $${pnl.toFixed(2)} (${pnlPercent.toFixed(1)}%)\n\n`;
    });

    return result;
}
