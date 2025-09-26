# 🚀 Netlify 배포 가이드

## 1단계: GitHub에 코드 푸시

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Dobby's Crypto Roast app"

# GitHub 저장소 생성 후 연결
git remote add origin https://github.com/yourusername/crypto-dobby-roast.git

# 푸시
git push -u origin main
```

## 2단계: Netlify에서 배포

### 2-1. Netlify 계정 생성
1. [netlify.com](https://netlify.com) 방문
2. "Sign up" 클릭
3. GitHub 계정으로 로그인

### 2-2. 새 사이트 생성
1. "New site from Git" 클릭
2. "GitHub" 선택
3. 저장소 권한 부여
4. `crypto-dobby-roast` 저장소 선택

### 2-3. 빌드 설정
Netlify가 자동으로 감지하지만, 확인해보세요:
- **Build command**: `npm install && npm start`
- **Publish directory**: `.`
- **Node version**: 18

### 2-4. 환경변수 설정
1. "Site settings" 클릭
2. "Environment variables" 클릭
3. "Add variable" 클릭
4. 다음 변수들 추가:
   - `OPENROUTER_API_KEY`: `sk-or-v1-your-actual-api-key-here`
   - `PORT`: `3000` (선택사항)

### 2-5. 배포 시작
1. "Deploy site" 클릭
2. 빌드 과정 확인 (약 2-3분)
3. 배포 완료! 🎉

## 3단계: 배포 확인

### 3-1. 사이트 접속
- Netlify에서 제공하는 URL로 접속
- 예: `https://amazing-name-123456.netlify.app`

### 3-2. 기능 테스트
1. 코인 추가 테스트
2. 가격 새로고침 테스트
3. 언어 토글 테스트
4. **로스트 받기** 테스트 (가장 중요!)

### 3-3. 문제 해결
만약 문제가 있다면:
1. Netlify 대시보드에서 "Functions" 탭 확인
2. "Deploys" 탭에서 빌드 로그 확인
3. 환경변수가 제대로 설정되었는지 확인

## 4단계: 커스텀 도메인 (선택사항)

### 4-1. 도메인 설정
1. "Domain settings" 클릭
2. "Add custom domain" 클릭
3. 도메인 입력
4. DNS 설정 안내 따르기

### 4-2. HTTPS 자동 설정
- Netlify가 자동으로 SSL 인증서 발급
- HTTPS로 자동 리다이렉트

## 🔧 추가 설정

### 환경변수 관리
```bash
# 로컬에서 테스트
export OPENROUTER_API_KEY="sk-or-v1-your-actual-api-key-here"
npm start
```

### 빌드 최적화
- `netlify.toml` 파일이 자동으로 설정을 관리
- Node.js 18 버전 사용
- ESBuild 번들러 사용

## 🚨 주의사항

1. **API 키 보안**: 절대 코드에 직접 작성하지 마세요
2. **환경변수**: Netlify 대시보드에서만 설정하세요
3. **빌드 로그**: 문제 발생 시 로그를 확인하세요
4. **함수 제한**: Netlify Functions는 월 125,000회 무료

## 📞 지원

문제가 있다면:
1. Netlify 문서: [docs.netlify.com](https://docs.netlify.com)
2. GitHub Issues에 문제 보고
3. 빌드 로그 확인

---

**성공적인 배포를 위해 환경변수 설정을 꼭 확인하세요!** 🔑
