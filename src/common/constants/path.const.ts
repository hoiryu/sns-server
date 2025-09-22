import { join } from 'path';

// 루트 폴더
export const PROJECT_ROOT_PATH = process.cwd();
// 공개 폴더
export const PUBLIC_FOLDER_NAME = 'public';
// 포스트 이미지 폴더
export const POSTS_FOLDER_NAME = 'posts';
// 임시 폴더
export const TEMP_FOLDER_NAME = 'temp';

// root/public/
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// root/public/posts/
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);

// /public/posts/
export const POST_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, POSTS_FOLDER_NAME);

// root/public/temp/
export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMP_FOLDER_NAME);
