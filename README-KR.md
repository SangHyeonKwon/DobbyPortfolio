# 🧙‍♂️ Dobby의 암호화폐 로스트

당신의 투자를 신랄하게 분석해주는 암호화폐 포트폴리오 분석기입니다.

## ✨ 주요 기능

- **포트폴리오 관리**: 암호화폐 보유량 추가 및 관리
- **실시간 가격**: CoinGecko API를 통한 실시간 가격 업데이트
- **AI 분석**: Dobby AI의 신랄한 투자 조언
- **다국어 지원**: 한국어와 영어 지원
- **반응형 디자인**: 데스크톱과 모바일에서 완벽하게 작동
- **코인 이미지**: 실제 암호화폐 로고로 시각적 효과

## 🚀 빠른 시작

### 필요 조건
- Node.js 14+ 
- OpenRouter API 키

### 설치 방법

1. 저장소 클론
```bash
git clone <your-repo-url>
cd crypto-dobby-roast
```

2. 의존성 설치
```bash
npm install
```

3. 환경변수 설정
```bash
# .env 파일 생성
echo "OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here" > .env
echo "PORT=3000" >> .env
```

4. 서버 시작
```bash
npm start
```

5. 브라우저에서 열기
```
http://localhost:3000
```

## 🔧 설정

### 환경변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `OPENROUTER_API_KEY` | OpenRouter API 키 | 예 |
| `PORT` | 서버 포트 (기본값: 3000) | 아니오 |

### OpenRouter API 키 받기

1. [OpenRouter](https://openrouter.ai/) 방문
2. 계정 생성
3. API 키 생성
4. 환경변수에 추가

## 🌍 다국어 지원

- **한국어**: 기본 언어
- **영어**: 헤더의 언어 토글 버튼 클릭

## 📱 사용법

1. **코인 추가**: 암호화폐 선택 후 수량/구매가 입력
2. **성과 추적**: 실시간 손익 계산 확인
3. **로스트 받기**: "로스트 받기" 버튼으로 도비의 신랄한 분석 받기
4. **언어 변경**: 헤더의 언어 토글 버튼 사용

## 🛠️ 기술 스택

- **프론트엔드**: HTML5, CSS3, JavaScript (ES6+)
- **백엔드**: Node.js, Express.js
- **AI**: OpenRouter API (Claude 3 Haiku)
- **데이터**: CoinGecko API
- **스타일링**: 모던 디자인의 커스텀 CSS

## 📦 배포

### Vercel
1. GitHub 저장소 연결
2. Vercel 대시보드에서 환경변수 설정
3. 자동 배포

### Netlify
1. 저장소 연결
2. 빌드 명령어: `npm start`
3. 환경변수 추가

### Railway
1. 저장소 연결
2. 환경변수 추가
3. 배포

## 🔒 보안

- API 키는 환경변수에 저장
- 민감한 데이터는 하드코딩되지 않음
- CORS 활성화로 크로스 오리진 요청 지원

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성
3. 변경사항 적용
4. 풀 리퀘스트 제출

## 📄 라이선스

MIT 라이선스 - 자세한 내용은 LICENSE 파일 참조

## 🙏 감사의 말

- [CoinGecko](https://coingecko.com/) - 암호화폐 데이터 제공
- [OpenRouter](https://openrouter.ai/) - AI 기능 제공
- [도비](https://harrypotter.fandom.com/wiki/Dobby) - 영감 제공

---

**주의**: 이 앱은 오락 및 교육 목적으로만 제공됩니다. 투자 조언이 아닙니다! 🚨
