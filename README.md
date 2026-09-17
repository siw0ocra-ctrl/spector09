# SECTOR 09 · 군단 서바이버

우주 전장을 배경으로 한 JavaScript Canvas 생존 웹게임입니다.

## 주요 기능

- 노멀·하드·익스트림 각 10개 작전, 최대 무기 5 / 3 / 1종
- 8종 무기, 각성, 패시브, 보스별 패턴, 모바일 터치 조작
- 서버에 저장되는 익명 계정, 공통 골드, 업그레이드와 외형·칭호 상점
- 난이도·맵별 TOP 25 랭킹과 순위 유지형 칭호
- 오락실 로켓·플린코 미니게임과 서버 정산
- 계정 복구 코드 및 일회성 골드 지급 코드

## 실행 환경과 구성

Node.js 24 이상을 사용합니다.

```sh
npm ci
npm test
npm run build
```

- `dist/index.html`, `dist/game.js`, `dist/style.css`: 게임 화면과 전투
- `dist/assets/`: 브라우저 기능과 에셋
- `server/api.mjs`: 계정·골드·게임 정산 API
- `server/catalog.mjs`: 서버 상품 가격
- `db/`, `drizzle/`: D1 SQLite 스키마와 마이그레이션
- `scripts/build.mjs`: Cloudflare Workers 호환 서버 빌드
- `SYSTEM_V3.md`: 저장·정산·랭킹 구조와 검증 기록

빌드 결과는 `dist/server/index.js`에 생성됩니다. 서버 기능에는 Cloudflare Workers 호환 환경, `DB` D1 바인딩, 서버 비밀값 `SAVE_KEY`가 필요합니다. `.env.example`은 예시만 포함합니다. 실제 비밀값은 배포 환경에서 설정하세요.

이 저장소를 GitHub Pages에 정적 배포하는 것만으로는 계정·골드·랭킹 API가 동작하지 않습니다. 현재 서비스의 호스팅 연결 정보는 `.openai/hosting.json`에 있습니다. 다른 환경으로 옮길 때 기존 서비스의 DB와 마이그레이션 적용 상태를 확인하세요.

## WebSocket 상태

WebSocket 기능과 HTTP 재시도 처리는 구현되어 있고 로컬 검증을 통과했습니다. 현재 운영 호스팅의 WebSocket 업그레이드가 HTTP 500을 반환하여 **운영에서는 비활성화**되어 있습니다. 서버 환경의 `REALTIME_ENABLED=true`는 배포 경로의 WebSocket 지원을 확인한 후에만 설정하세요. 비활성 상태에서는 기존 HTTP 방식으로 동작합니다.

## 에셋

Kenney CC0 에셋을 사용합니다. 개별 출처와 라이선스는 `dist/assets/LICENSE*.txt`를 참고하세요. 보스 및 일부 시각 효과는 Canvas 코드로 렌더링합니다.

## 조작

WASD / 방향키 이동 · Space 스팀팩 · Esc 일시정지. 모바일은 가상 조이스틱과 화면 버튼을 사용합니다.
