import { join } from 'path';

/**
 * 루트 폴더
 */
export const PROJECT_ROOT_PATH = process.cwd();

/**
 * 공개 폴더
 */
export const PUBLIC_FOLDER_NAME = 'public';

/**
 * 임시 이미지 폴더
 */
export const TEMPLATES_FOLDER_NAME = 'templates';

/**
 * 포스트 이미지 폴더
 */
export const POSTS_FOLDER_NAME = 'posts';

/**
 * 유저 프로필 이미지 폴더
 */
export const USERS_FOLDER_NAME = 'users';

/**
 * 공개 폴더 절대 경로
 * @example root/public
 */
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

/**
 * 임시 이미지 폴더 절대 경로
 * @example root/public/templates
 */
export const TEMPLATES_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMPLATES_FOLDER_NAME);

/**
 * 포스트 폴더 절대 경로
 * @example root/public/posts
 */
export const POSTS_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);

/**
 * 포스트 폴더 상대 경로
 * @example /public/posts
 */
export const POSTS_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, POSTS_FOLDER_NAME);

/**
 * 이미지 폴더 절대 경로
 * @example root/public/users
 */
export const USERS_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, USERS_FOLDER_NAME);

/**
 * 이미지 폴더 상대 경로
 * @example /public/users
 */
export const USERS_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, USERS_FOLDER_NAME);
