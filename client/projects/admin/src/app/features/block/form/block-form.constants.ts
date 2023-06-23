import { Toolbar } from 'ngx-editor';

export const blockFormEditorToolbar: Toolbar = [
  ['bold', 'italic'],
  ['underline', 'strike'],
  ['code', 'blockquote'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  // ['link', 'image'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
];
