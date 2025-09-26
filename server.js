require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// OpenRouter API 키
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// 포트폴리오 분석 함수
function analyzePortfolio(portfolio) {
    const analysis = {
        coinCount: portfolio.length,
        profitCount: 0,
        lossCount: 0,
        totalInvested: 0,
        currentValue: 0,
        totalPnL: 0,
        totalPnLPercentage: 0,
        isProfitable: false,
        worstPerformer: null,
        bestPerformer: null,
        diversification: 'low',
        riskLevel: 'low',
        topCoins: [],
        memeCoins: [],
        newbieTraits: []
    };

    if (portfolio.length === 0) return analysis;

    // 기본 분석
    portfolio.forEach(coin => {
        const invested = coin.quantity * coin.purchasePrice;
        const current = coin.quantity * coin.currentPrice;
        const pnl = current - invested;
        const pnlPercentage = invested > 0 ? (pnl / invested) * 100 : 0;

        analysis.totalInvested += invested;
        analysis.currentValue += current;
        analysis.totalPnL += pnl;

        if (pnl > 0) {
            analysis.profitCount++;
        } else {
            analysis.lossCount++;
        }

        // 최고/최악 성과자 추적
        if (!analysis.bestPerformer || pnlPercentage > analysis.bestPerformer.pnlPercentage) {
            analysis.bestPerformer = { ...coin, pnlPercentage };
        }
        if (!analysis.worstPerformer || pnlPercentage < analysis.worstPerformer.pnlPercentage) {
            analysis.worstPerformer = { ...coin, pnlPercentage };
        }

        // 밈 코인 감지 (일반적인 밈 코인 패턴)
        const memeCoinPatterns = ['doge', 'shib', 'pepe', 'floki', 'elon', 'moon', 'safe', 'baby'];
        const isMemeCoin = memeCoinPatterns.some(pattern => 
            coin.symbol.toLowerCase().includes(pattern) || 
            coin.name.toLowerCase().includes(pattern)
        );
        
        if (isMemeCoin) {
            analysis.memeCoins.push(coin);
        }
    });

    analysis.totalPnLPercentage = analysis.totalInvested > 0 ? (analysis.totalPnL / analysis.totalInvested) * 100 : 0;
    analysis.isProfitable = analysis.totalPnL > 0;

    // 다양화 수준 분석
    if (analysis.coinCount >= 10) {
        analysis.diversification = 'high';
    } else if (analysis.coinCount >= 5) {
        analysis.diversification = 'medium';
    }

    // 리스크 레벨 분석
    if (analysis.memeCoins.length > analysis.coinCount * 0.5) {
        analysis.riskLevel = 'extreme';
    } else if (analysis.memeCoins.length > analysis.coinCount * 0.3) {
        analysis.riskLevel = 'high';
    } else if (analysis.coinCount < 3) {
        analysis.riskLevel = 'high';
    } else if (analysis.coinCount >= 5) {
        analysis.riskLevel = 'medium';
    }

    // 신규자 특성 감지
    if (analysis.coinCount === 1) {
        analysis.newbieTraits.push('단일 코인 집중');
    }
    if (analysis.memeCoins.length > 0) {
        analysis.newbieTraits.push('밈 코인 투자');
    }
    if (analysis.coinCount > 20) {
        analysis.newbieTraits.push('과도한 다양화');
    }
    if (analysis.worstPerformer && analysis.worstPerformer.pnlPercentage < -50) {
        analysis.newbieTraits.push('손절매 미실행');
    }

    // 상위 코인들 (시가총액 기준)
    analysis.topCoins = portfolio
        .sort((a, b) => b.currentValue - a.currentValue)
        .slice(0, 3)
        .map(coin => coin.symbol);

    return analysis;
}

// Dobby AI 응답 생성
app.post('/api/dobby-roast', async (req, res) => {
    try {
        console.log('API Key 상태:', OPENROUTER_API_KEY ? 'Set' : 'Not set');
        console.log('받은 포트폴리오:', req.body.portfolio);
        console.log('언어 설정:', req.body.language);
        
        const portfolio = req.body.portfolio || [];
        const language = req.body.language || 'ko';
        
        if (portfolio.length === 0) {
            return res.json({ 
                success: false, 
                error: '포트폴리오가 비어있습니다.' 
            });
        }
        
        const analysis = analyzePortfolio(portfolio);
        
        // 더 간단한 프롬프트로 변경
        const portfolioSummary = `
총 ${analysis.coinCount}개 코인, 총 손익: ${analysis.totalPnLPercentage.toFixed(1)}%
수익: ${analysis.profitCount}개, 손실: ${analysis.lossCount}개
${analysis.memeCoins.length > 0 ? `밈코인 ${analysis.memeCoins.length}개 포함` : ''}
${analysis.newbieTraits.length > 0 ? `특징: ${analysis.newbieTraits.join(', ')}` : ''}
        `.trim();

        console.log('OpenRouter API 호출 시작...');
        
        // 수정된 API 호출
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000', // 또는 실제 도메인
                'X-Title': 'Dobby Crypto Roast'
            },
            body: JSON.stringify({
                // 올바른 모델명 사용 (실제 존재하는 모델로 변경)
                model: 'anthropic/claude-3-haiku', // 또는 다른 사용 가능한 모델
                messages: [{
                    role: 'system',
                    content: language === 'en' ? 
                        `You are Dobby, a brutally honest cryptocurrency advisor. 
                        Analyze the user's portfolio and give direct, humorous advice. 
                        Respond in English with detailed and brutal analysis.` :
                        `당신은 Dobby라는 신랄하고 솔직한 암호화폐 조언가입니다. 
                        사용자의 포트폴리오를 분석하여 직설적이고 유머러스한 조언을 해주세요. 
                        한국어로 매우 자세하고 신랄하게 답변하세요. 
                        최소 300자 이상으로 상세한 분석을 제공해주세요.`
                }, {
                    role: 'user',
                    content: language === 'en' ? 
                        `My portfolio: ${portfolioSummary}\n\nGive me your brutal advice!` :
                        `내 포트폴리오: ${portfolioSummary}\n\n신랄한 조언 부탁해!`
                }],
                max_tokens: language === 'en' ? 500 : 1200, // 한글은 더 많은 토큰 필요
                temperature: 0.8
            })
        });

        console.log('API 응답 상태:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API 에러:', response.status, errorText);
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API 응답 데이터:', data);
        
        const roastText = data.choices?.[0]?.message?.content || 
                         data.choices?.[0]?.text || 
                         'Dobby가 잠시 말을 잃었습니다...';

        res.json({ success: true, roast: roastText });

    } catch (error) {
        console.error('Error generating roast:', error);
        
        // 폴백 로스트 메시지들
        const fallbackRoasts = [
            "네트워크가 불안정해서 Dobby가 화났네요! 다시 시도해보세요.",
            "API 키가 제대로 설정되지 않은 것 같습니다. 설정을 확인해주세요.",
            "OpenRouter 서버에 문제가 있는 것 같네요. 잠시 후 다시 시도해주세요."
        ];
        
        const fallbackMessage = fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
        
        res.json({ 
            success: false, 
            error: fallbackMessage,
            details: error.message
        });
    }
});

// 정적 파일 서빙
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('OpenRouter API Key:', OPENROUTER_API_KEY.substring(0, 10) + '...');
});
