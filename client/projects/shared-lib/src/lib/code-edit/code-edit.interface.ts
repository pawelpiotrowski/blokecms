export type CodeEditHistoryRecord = {
  html: string;
  pos: CodeEditPosition;
};

export type CodeEditPosition = {
  start: number;
  end: number;
  dir?: '->' | '<-';
};

export type CodeEditCursorPosition = {
  top: string;
  left: string;
};

export const codeEditLanguages = ['typescript', 'javascript', 'css', 'markup'];
