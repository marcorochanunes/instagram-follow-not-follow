import {
  FOLLOWERS,
  FOLLOWERS_FILE,
  FOLLOWING,
  FOLLOWING_FILE,
} from '../constants/file-names.constant';

export type FileType = typeof FOLLOWERS | typeof FOLLOWING;
export type FileName = typeof FOLLOWERS_FILE | typeof FOLLOWING_FILE;

export const FILE_TYPE_NAME: Record<FileType, FileName> = {
  FOLLOWERS: FOLLOWERS_FILE,
  FOLLOWING: FOLLOWING_FILE,
};
