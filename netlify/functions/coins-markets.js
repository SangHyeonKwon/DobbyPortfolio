const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // CORS 헤더 설정
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    // GET 요청만 처리
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // 쿼리 파라미터에서 vs_currency 가져오기
        const { vs_currency = 'usd', order = 'market_cap_desc', per_page = 100, page = 1, sparkline = false, price_change_percentage = '24h' } = event.queryStringParameters || {};

        // CoinGecko API 호출
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=${sparkline}&price_change_percentage=${price_change_percentage}&include_24hr_change=true&include_last_updated_at=true`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'DobbyPortfolio/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: data
            }),
        };

    } catch (error) {
        console.error('CoinGecko API error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to fetch coin data',
                details: error.message
            }),
        };
    }
};
