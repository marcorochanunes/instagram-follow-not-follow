import { FileType } from './file-names.model';

export interface IdentifiedFile {
  type: FileType;
  file: File;
}
