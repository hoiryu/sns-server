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
 * 포스트 이미지 폴더
 */
export const POSTS_FOLDER_NAME = 'posts';
/**
 * 임시 이미지 폴더
 */
export const TEMPLATES_FOLDER_NAME = 'templates';

/**
 * Absolute Path
 * @example root/public
 */
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

/**
 * Absolute Path
 * @example root/public/posts
 */
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);

/**
 * Absolute Path
 * @example root/public/templates
 */
export const TEMPLATES_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMPLATES_FOLDER_NAME);

/**
 * Relative Path
 * @example /public/posts
 */
export const POST_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, POSTS_FOLDER_NAME);
