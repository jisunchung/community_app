# 커뮤니티 앱 MVP

> React Native + Expo를 기반으로 한 간단한 커뮤니티 앱 개발 프로젝트

## 프로젝트 개요

회원가입/로그인, 글 작성/조회, 이미지 첨부, 댓글 기능을 포함한 커뮤니티 앱 MVP입니다.

### 주요 기능

- **회원가입/로그인** - Firebase Auth 기반 사용자 인증
- **글 관리** - 목록 조회, 상세보기, 작성, 수정, 삭제
- **이미지 첨부** - 사진 선택
- **댓글 시스템** - 실시간 댓글 작성 및 조회

## 기술 스택

### Frontend

- **React Native**
- **Expo Router**
- **TypeScript**

### 백엔드 / 서비스

- **Firebase Authentication**
- **Firestore**
- **Expo ImagePicker**

## 프로젝트 구조

```
.
├── app/              # Expo Router 기반의 라우팅 및 화면 구성
│   ├── (auth)/       # 인증 관련 화면 (로그인, 회원가입)
│   ├── (tabs)/       # 탭 네비게이션 화면 (게시글 목록, 프로필)
│   └── post/         # 게시글 상세 및 생성 화면
├── assets/           # 이미지, 폰트 등 정적 에셋
├── components/       # 재사용 가능한 UI 컴포넌트
├── contexts/         # 전역 상태 관리를 위한 Context (예: AuthContext)
├── services/         # Firebase 등 외부 서비스와 통신하는 로직
└── types/            # TypeScript 타입 정의 (Post, Comment 등)
```

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```
