export const Auth = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  SIGNUP: "회원가입",
  EMAIL: "이메일",
  PASSWORD: "비밀번호",
  CONFIRM_PASSWORD: "비밀번호 확인",
  LOGIN_PROMPT: "이미 계정이 있으신가요? 로그인",
  SIGNUP_PROMPT: "계정이 없으신가요? 회원가입",
  LOGIN_SUCCESS: "로그인 성공",
  SIGNUP_SUCCESS: "회원가입 성공",
};

export const Tabs = {
  POSTS: "Posts",
  PROFILE: "Profile",
};

export const Profile = {
  MY_POSTS: "내 게시글",
  NO_POSTS_WRITTEN: "작성한 게시글이 없습니다.",
};

export const Post = {
  POSTS: "Posts",
  CREATE_NEW_POST: "새 글 작성",
  TITLE_PLACEHOLDER: "제목",
  CONTENT_PLACEHOLDER: "내용",
  SELECT_PHOTO: "사진 선택",
    CREATE_COMPLETE: "작성 완료",
  DELETE_POST_CONFIRM: "정말로 이 게시물을 삭제하시겠습니까?",
  NO_POSTS: "게시물이 없습니다.",
  POST_NOT_FOUND: "게시물을 찾을 수 없습니다.",
};

export const Comment = {
  COMMENTS: "댓글",
  ADD_COMMENT: "작성",
  DELETE_COMMENT: "댓글 삭제",
  DELETE_COMMENT_CONFIRM: "정말로 이 댓글을 삭제하시겠습니까?",
  COMMENT_INPUT_PLACEHOLDER: "댓글을 입력하세요...",
  NO_COMMENTS: "아직 댓글이 없습니다.",
};

export const Common = {
  CANCEL: "취소",
  DELETE: "삭제",
  SUCCESS: "성공",
  ERROR: "오류",
  LOADING: "Loading...",
};

export const AlertMessage = {
  // General
  FAILED_TO_LOAD_DATA: "데이터를 불러오는 데 실패했습니다.",

  // Auth
  LOGIN_FAILED: "로그인에 실패했습니다. 다시 시도해주세요.",
  SIGNUP_FAILED: "회원가입에 실패했습니다. 다시 시도해주세요.",
  LOGOUT_FAILED: "Logout Failed",
  FILL_ALL_FIELDS: "모든 필드를 입력해주세요.",
  EMAIL_PASSWORD_REQUIRED: "이메일과 비밀번호를 모두 입력해주세요.",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
  USER_NOT_FOUND: "등록되지 않은 이메일입니다.",
  WRONG_PASSWORD: "비밀번호가 틀렸습니다.",
  INVALID_EMAIL: "유효하지 않은 이메일 형식입니다.",
  TOO_MANY_REQUESTS: "너무 많은 로그인 시도로 계정이 일시적으로 잠겼습니다.",
  EMAIL_ALREADY_IN_USE: "이미 가입된 이메일입니다.",
  WEAK_PASSWORD: "비밀번호는 6자 이상이어야 합니다.",

  // Post
  POST_CREATED: "게시물이 성공적으로 작성되었습니다.",
  POST_DELETED: "게시물이 삭제되었습니다.",
  POST_CREATION_FAILED: "게시물 작성에 실패했습니다.",
  POST_DELETION_FAILED: "게시물 삭제에 실패했습니다.",
  FETCH_POST_FAILED: "게시글을 불러오는 데 실패했습니다.",
  TITLE_CONTENT_REQUIRED: "제목과 내용을 모두 입력해주세요.",
  LOGIN_REQUIRED: "로그인이 필요합니다.",

  // Comment
  COMMENT_CREATION_FAILED: "댓글 작성에 실패했습니다.",
  COMMENT_DELETION_FAILED: "댓글 삭제에 실패했습니다.",
  COMMENT_CONTENT_REQUIRED: "댓글 내용을 입력해주세요.",

  // Image
  PHOTO_PERMISSION: "Photo Permission",
  PHOTO_PERMISSION_PROMPT: "Please turn on the camera permission.",
};
