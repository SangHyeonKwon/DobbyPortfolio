# 배포 가이드

## 환경변수 설정

배포 시 다음 환경변수를 설정해야 합니다:

```bash
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
PORT=3000
```

## 배포 플랫폼별 설정

### 1. Netlify (추천) ⭐
- GitHub 저장소 연결
- 빌드 설정 (자동 감지됨):
  - Build command: `npm install && npm start`
  - Publish directory: `.`
- Site settings > Environment variables
- `OPENROUTER_API_KEY` 추가
- `PORT`: 3000 (선택사항)

### 2. Vercel
- Vercel 대시보드에서 Environment Variables 설정
- `OPENROUTER_API_KEY` 추가

### 3. Railway
- Project settings > Variables
- `OPENROUTER_API_KEY` 추가

### 4. Heroku
```bash
heroku config:set OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

## 로컬 개발
```bash
# .env 파일 생성
echo "OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here" > .env
echo "PORT=3000" >> .env

# 서버 실행
npm start
```

## 보안 주의사항
- 절대 API 키를 코드에 직접 작성하지 마세요
- .env 파일을 .gitignore에 추가하세요
- 배포 시 환경변수로만 설정하세요
