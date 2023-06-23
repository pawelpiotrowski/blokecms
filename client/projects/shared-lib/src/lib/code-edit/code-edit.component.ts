import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import Prism from 'prismjs';
// Prism supported languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import {
  CodeEditCursorPosition,
  CodeEditHistoryRecord,
  CodeEditPosition,
} from './code-edit.interface';
import { DOCUMENT } from '@angular/common';

/**
 *
 * Based on Anton Medvedev's CodeJar
 * https://github.com/antonmedv/codejar
 *
 */
@Component({
  selector: 'shared-code-edit',
  templateUrl: './code-edit.component.html',
  styleUrls: ['./code-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CodeEditComponent
  implements AfterViewInit, OnChanges, OnInit, OnDestroy
{
  @Input() code = '';
  @Input() showLineNumbers = true;
  @Input() language = 'css';
  @Input() readonly = false;
  @Output() codeUpdate = new EventEmitter<string>();
  @ViewChild('codeEl') codeEl: ElementRef<HTMLElement> | undefined;

  lineNumbers: number[] = [];

  private contentEditablePlainTextOnlyNotSupported = false;
  private editorListeners: Function[] = [];
  private editorHistory: CodeEditHistoryRecord[] = [];
  private editorHistoryIndex = -1;
  private editorInFocus = false;
  private editorCodePriorKeyDown!: string;
  private editorHistoryRecording = false;
  private debounceHighlightTimeout!: ReturnType<typeof setTimeout>;
  private debounceRecordingTimeout!: ReturnType<typeof setTimeout>;
  private readonly optionIndentOn = /[({\[]$/;
  private readonly optionTab = '\t';
  private readonly optionMoveToNewLine = /^[)}\]]/;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showLineNumbers'] && !changes['showLineNumbers'].firstChange) {
      this.setLineNumbers();
    }
    if (changes['language'] && !changes['language'].firstChange) {
      this.highlight();
    }
  }

  ngOnInit() {
    this.setLineNumbers();
  }

  ngAfterViewInit() {
    this.initCodeEditor();
  }

  ngOnDestroy() {
    if (!this.readonly && this.editorListeners.length > 0) {
      this.editorListeners.forEach((listener) => {
        listener();
      });
    }
    this.cancelDebounceHighlight();
    this.cancelDebounceRecording();
  }

  resetCodeEditor(code: string) {
    this.code = code;
    this.updateCodeEditor();
  }

  private initCodeEditor() {
    this.setContentEditable();
    this.updateCodeEditor();
  }

  private updateCodeEditor() {
    this.updateCode();
    this.highlight();
    this.setEditor();
  }

  private setContentEditable() {
    if (this.readonly) {
      return;
    }
    this.codeEl?.nativeElement.setAttribute(
      'contenteditable',
      'plaintext-only',
    );
    // 'plaintext-only' is not supported in FF
    if (this.codeEl?.nativeElement.contentEditable !== 'plaintext-only') {
      this.contentEditablePlainTextOnlyNotSupported = true;
      this.codeEl?.nativeElement.setAttribute('contenteditable', 'true');
    }
  }

  private highlight() {
    const textContent = this.codeEl?.nativeElement.textContent;

    if (textContent != null) {
      this.codeEl!.nativeElement.innerHTML = Prism.highlight(
        textContent,
        Prism.languages[this.language],
        this.language,
      );
    }
  }

  private setLineNumbers() {
    if (!this.showLineNumbers) {
      this.lineNumbers.length = 0;
      return;
    }

    const code = this.codeEl?.nativeElement.textContent || this.code;
    const linesCount = code.replace(/\n+$/, '\n').split('\n').length + 1;

    this.lineNumbers = [...Array(linesCount).keys()];
  }

  private updateCode() {
    this.codeEl!.nativeElement.textContent = this.code;
  }

  private setEditor() {
    if (this.readonly) {
      return;
    }
    const keyDownListener = this.renderer.listen(
      this.codeEl?.nativeElement,
      'keydown',
      this.keyDownHandler.bind(this),
    );
    const keyUpListener = this.renderer.listen(
      this.codeEl?.nativeElement,
      'keyup',
      this.keyUpHandler.bind(this),
    );
    const focusListener = this.renderer.listen(
      this.codeEl?.nativeElement,
      'focus',
      this.focusHandler.bind(this),
    );
    const blurListener = this.renderer.listen(
      this.codeEl?.nativeElement,
      'blur',
      this.blurHandler.bind(this),
    );
    const pasteListener = this.renderer.listen(
      this.codeEl?.nativeElement,
      'paste',
      this.pasteHandler.bind(this),
    );

    this.editorListeners.push(
      ...[
        keyDownListener,
        keyUpListener,
        focusListener,
        blurListener,
        pasteListener,
      ],
    );
  }

  private debounceHighlight() {
    this.cancelDebounceHighlight();
    this.debounceHighlightTimeout = setTimeout(() => {
      const pos = this.save();
      this.highlight();
      this.setLineNumbers();
      this.restore(pos);
    }, 30);
  }

  private cancelDebounceHighlight() {
    if (this.debounceHighlightTimeout != null) {
      clearTimeout(this.debounceHighlightTimeout);
    }
  }

  private shouldRecord(event: KeyboardEvent) {
    return (
      !this.isUndo(event) &&
      !this.isRedo(event) &&
      event.key !== 'Meta' &&
      event.key !== 'Control' &&
      event.key !== 'Alt' &&
      !event.key.startsWith('Arrow')
    );
  }

  private debounceRecording(event: KeyboardEvent) {
    this.cancelDebounceRecording();
    this.debounceRecordingTimeout = setTimeout(() => {
      if (this.shouldRecord(event)) {
        this.recordHistory();
        this.editorHistoryRecording = false;
      }
    }, 300);
  }

  private cancelDebounceRecording() {
    if (this.debounceRecordingTimeout != null) {
      clearTimeout(this.debounceRecordingTimeout);
    }
  }

  private keyDownHandler(event: KeyboardEvent) {
    if (event.defaultPrevented) {
      return;
    }
    this.editorCodePriorKeyDown = this.editorCode;
    // preserve indent
    this.handleNewLine(event);
    // catch tab
    this.handleTabCharacters(event);
    // add closing character
    this.handleSelfClosingCharacters(event);
    // history handlers
    this.handleUndoRedo(event);
    if (this.shouldRecord(event) && !this.editorHistoryRecording) {
      this.recordHistory();
      this.editorHistoryRecording = true;
    }

    if (this.contentEditablePlainTextOnlyNotSupported) {
      this.restore(this.save());
    }
    if (event.key === 'Enter') {
      this.adjustScroll();
    }
  }

  private keyUpHandler(event: KeyboardEvent) {
    if (event.defaultPrevented || event.isComposing) {
      return;
    }

    if (this.editorCodePriorKeyDown !== this.editorCode) {
      this.debounceHighlight();
    }

    this.debounceRecording(event);
    this.codeUpdate.emit(this.editorCode);
  }

  private focusHandler() {
    this.editorInFocus = true;
  }

  private blurHandler() {
    this.editorInFocus = false;
  }

  private pasteHandler(event: ClipboardEvent) {
    this.recordHistory();
    this.handlePaste(event);
    this.recordHistory();
    this.adjustScroll();
    this.codeUpdate.emit(this.editorCode);
  }

  private save(): CodeEditPosition {
    const s = this.getSelection();
    const pos: CodeEditPosition = { start: 0, end: 0, dir: undefined };
    let { anchorNode, anchorOffset, focusNode, focusOffset } = s as Selection;

    if (!anchorNode || !focusNode) {
      throw 'Error getting selection';
    }

    // Selection anchor and focus are expected to be text nodes,
    // so normalize them.
    if (anchorNode.nodeType === Node.ELEMENT_NODE) {
      const node = this.document.createTextNode('');
      anchorNode.insertBefore(node, anchorNode.childNodes[anchorOffset]);
      anchorNode = node;
      anchorOffset = 0;
    }

    if (focusNode.nodeType === Node.ELEMENT_NODE) {
      const node = this.document.createTextNode('');
      focusNode.insertBefore(node, focusNode.childNodes[focusOffset]);
      focusNode = node;
      focusOffset = 0;
    }

    this.visit((el) => {
      if (el === anchorNode && el === focusNode) {
        pos.start += anchorOffset;
        pos.end += focusOffset;
        pos.dir = anchorOffset <= focusOffset ? '->' : '<-';
        return 'stop';
      }

      if (el === anchorNode) {
        pos.start += anchorOffset;
        if (!pos.dir) {
          pos.dir = '->';
        } else {
          return 'stop';
        }
      } else if (el === focusNode) {
        pos.end += focusOffset;
        if (!pos.dir) {
          pos.dir = '<-';
        } else {
          return 'stop';
        }
      }

      if (el.nodeType === Node.TEXT_NODE) {
        if (pos.dir != '->') {
          pos.start += el.nodeValue!.length;
        }
        if (pos.dir != '<-') {
          pos.end += el.nodeValue!.length;
        }
      }
      return undefined;
    });

    // collapse empty text nodes
    this.codeEl?.nativeElement.normalize();

    return pos;
  }

  private restore(pos: CodeEditPosition) {
    const s = this.getSelection();
    let startNode: Node | undefined,
      startOffset = 0;
    let endNode: Node | undefined,
      endOffset = 0;

    if (!pos.dir) {
      pos.dir = '->';
    }
    if (pos.start < 0) {
      pos.start = 0;
    }
    if (pos.end < 0) {
      pos.end = 0;
    }

    // Flip start and end if the direction reversed
    if (pos.dir == '<-') {
      const { start, end } = pos;
      pos.start = end;
      pos.end = start;
    }

    let current = 0;

    this.visit((el) => {
      if (el.nodeType !== Node.TEXT_NODE) {
        return;
      }

      const len = (el.nodeValue || '').length;
      if (current + len > pos.start) {
        if (!startNode) {
          startNode = el;
          startOffset = pos.start - current;
        }
        if (current + len > pos.end) {
          endNode = el;
          endOffset = pos.end - current;
          return 'stop';
        }
      }
      current += len;
      return undefined;
    });

    if (!startNode) {
      startNode = this.codeEl?.nativeElement;
      startOffset = this.codeEl?.nativeElement.childNodes.length as number;
    }

    if (!endNode) {
      endNode = this.codeEl?.nativeElement;
      endOffset = this.codeEl?.nativeElement.childNodes.length as number;
    }

    // Flip back the selection
    if (pos.dir == '<-') {
      [startNode, startOffset, endNode, endOffset] = [
        endNode,
        endOffset,
        startNode,
        startOffset,
      ];
    }

    s.setBaseAndExtent(
      startNode as Node,
      startOffset,
      endNode as Node,
      endOffset,
    );
  }

  private beforeCursor() {
    const s = this.getSelection();
    const r0 = s.getRangeAt(0);
    const r = this.document.createRange();
    r.selectNodeContents(this.codeEl?.nativeElement as HTMLElement);
    r.setEnd(r0.startContainer, r0.startOffset);
    return r.toString();
  }

  private afterCursor() {
    const s = this.getSelection();
    const r0 = s.getRangeAt(0);
    const r = this.document.createRange();
    r.selectNodeContents(this.codeEl?.nativeElement as HTMLElement);
    r.setStart(r0.endContainer, r0.endOffset);
    return r.toString();
  }

  private handleNewLine(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }

    const before = this.beforeCursor();
    const after = this.afterCursor();

    let [padding] = this.findPadding(before);
    let newLinePadding = padding;

    // If last symbol is "{" ident new line
    if (this.optionIndentOn.test(before)) {
      newLinePadding += this.optionTab;
    }

    // Preserve padding
    if (newLinePadding.length > 0) {
      this.preventDefault(event);
      event.stopPropagation();
      this.insert('\n' + newLinePadding);
    } else {
      this.patchNewLineForContentEditablePlainTextOnlyNotSupported(event);
    }

    // Place adjacent "}" on next line
    if (newLinePadding !== padding && this.optionMoveToNewLine.test(after)) {
      const pos = this.save();
      this.insert('\n' + padding);
      this.restore(pos);
    }
  }

  private patchNewLineForContentEditablePlainTextOnlyNotSupported(
    event: KeyboardEvent,
  ) {
    // Firefox does not support plaintext-only mode
    // and puts <div><br></div> on Enter. Let's help.
    if (
      this.contentEditablePlainTextOnlyNotSupported &&
      event.key === 'Enter'
    ) {
      this.preventDefault(event);
      event.stopPropagation();

      if (this.afterCursor() == '') {
        this.insert('\n ');
        const pos = this.save();
        pos.start = --pos.end;
        this.restore(pos);
      } else {
        this.insert('\n');
      }
    }
  }

  private handleSelfClosingCharacters(event: KeyboardEvent) {
    const open = `([{'"`;
    const close = `)]}'"`;
    const codeAfter = this.afterCursor();
    const codeBefore = this.beforeCursor();
    const escapeCharacter = codeBefore.substr(codeBefore.length - 1) === '\\';
    const charAfter = codeAfter.substr(0, 1);
    if (
      close.includes(event.key) &&
      !escapeCharacter &&
      charAfter === event.key
    ) {
      // We already have closing char next to cursor.
      // Move one char to right.
      const pos = this.save();
      this.preventDefault(event);
      pos.start = ++pos.end;
      this.restore(pos);
    } else if (
      open.includes(event.key) &&
      !escapeCharacter &&
      (`"'`.includes(event.key) || ['', ' ', '\n'].includes(charAfter))
    ) {
      this.preventDefault(event);
      const pos = this.save();
      const wrapText =
        pos.start == pos.end ? '' : this.getSelection().toString();
      const text = event.key + wrapText + close[open.indexOf(event.key)];
      this.insert(text);
      pos.start++;
      pos.end++;
      this.restore(pos);
    }
  }

  private handleTabCharacters(event: KeyboardEvent) {
    if (event.key !== 'Tab') {
      return;
    }
    this.preventDefault(event);
    if (event.shiftKey) {
      const before = this.beforeCursor();
      let [padding, start] = this.findPadding(before);
      if (padding.length > 0) {
        const pos = this.save();
        // Remove full length tab or just remaining padding
        const len = Math.min(this.optionTab.length, padding.length);
        this.restore({ start, end: start + len });
        this.document.execCommand('delete');
        pos.start -= len;
        pos.end -= len;
        this.restore(pos);
      }
    } else {
      this.insert(this.optionTab);
    }
  }

  private handleUndoRedo(event: KeyboardEvent) {
    if (this.isUndo(event)) {
      this.preventDefault(event);
      this.editorHistoryIndex--;
      const record = this.editorHistory[this.editorHistoryIndex];
      if (record) {
        this.codeEl!.nativeElement.innerHTML = record.html;
        this.restore(record.pos);
      }
      if (this.editorHistoryIndex < 0) {
        this.editorHistoryIndex = 0;
      }
    }
    if (this.isRedo(event)) {
      this.preventDefault(event);
      this.editorHistoryIndex++;
      const record = this.editorHistory[this.editorHistoryIndex];
      if (record) {
        this.codeEl!.nativeElement.innerHTML = record.html;
        this.restore(record.pos);
      }
      if (this.editorHistoryIndex >= this.editorHistory.length) {
        this.editorHistoryIndex--;
      }
    }
  }

  private recordHistory() {
    if (!this.editorInFocus) {
      return;
    }

    const html = this.codeEl?.nativeElement.innerHTML;
    const pos = this.save();

    const lastRecord = this.editorHistory[this.editorHistoryIndex];
    if (lastRecord) {
      if (
        lastRecord.html === html &&
        lastRecord.pos.start === pos.start &&
        lastRecord.pos.end === pos.end
      )
        return;
    }

    this.editorHistoryIndex++;
    this.editorHistory[this.editorHistoryIndex] = {
      html,
      pos,
    } as CodeEditHistoryRecord;
    this.editorHistory.splice(this.editorHistoryIndex + 1);

    const maxHistory = 300;
    if (this.editorHistoryIndex > maxHistory) {
      this.editorHistoryIndex = maxHistory;
      this.editorHistory.splice(0, 1);
    }
  }

  private handlePaste(event: ClipboardEvent) {
    this.preventDefault(event);
    const text = ((event as any).originalEvent || event).clipboardData
      .getData('text/plain')
      .replace(/\r/g, '');
    const pos = this.save();
    this.insert(text);
    this.highlight();
    this.setLineNumbers();
    this.restore({
      start: Math.min(pos.start, pos.end) + text.length,
      end: Math.min(pos.start, pos.end) + text.length,
      dir: '<-',
    });
  }

  private visit(visitor: (el: Node) => 'stop' | undefined) {
    const queue: Node[] = [];

    if (this.codeEl!.nativeElement.firstChild) {
      queue.push(this.codeEl!.nativeElement.firstChild);
    }

    let el = queue.pop();

    while (el) {
      if (visitor(el) === 'stop') {
        break;
      }

      if (el.nextSibling) {
        queue.push(el.nextSibling);
      }
      if (el.firstChild) {
        queue.push(el.firstChild);
      }

      el = queue.pop();
    }
  }

  private isCtrl(event: KeyboardEvent) {
    return event.metaKey || event.ctrlKey;
  }

  private isUndo(event: KeyboardEvent) {
    return this.isCtrl(event) && !event.shiftKey && event.code === 'KeyZ';
  }

  private isRedo(event: KeyboardEvent) {
    return this.isCtrl(event) && event.shiftKey && event.code === 'KeyZ';
  }

  private insert(text: string) {
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    this.document.execCommand('insertHTML', false, text);
  }

  private findPadding(text: string): [string, number, number] {
    // Find beginning of previous line.
    let i = text.length - 1;
    while (i >= 0 && text[i] !== '\n') i--;
    i++;
    // Find padding of the line.
    let j = i;
    while (j < text.length && /[ \t]/.test(text[j])) j++;
    return [text.substring(i, j) || '', i, j];
  }

  private preventDefault(event: Event) {
    event.preventDefault();
  }

  private getSelection() {
    if (
      this.codeEl?.nativeElement.parentNode?.nodeType ==
      Node.DOCUMENT_FRAGMENT_NODE
    ) {
      return (
        this.codeEl?.nativeElement.parentNode as Document
      ).getSelection()!;
    }
    return this.document.getSelection()!;
  }

  private cursorPosition(toStart = true): CodeEditCursorPosition | undefined {
    const s = this.getSelection()!;
    if (s.rangeCount > 0) {
      const cursor = this.document.createElement('span');
      cursor.textContent = '|';

      const r = s.getRangeAt(0).cloneRange();
      r.collapse(toStart);
      r.insertNode(cursor);

      const { x, y, height } = cursor.getBoundingClientRect();
      const top = window.scrollY + y + height + 'px';
      const left = window.scrollX + x + 'px';
      cursor.parentNode!.removeChild(cursor);

      return { top, left };
    }
    return undefined;
  }

  private adjustScroll() {
    const cursorPosition = this.cursorPosition();
    if (cursorPosition == null) {
      return;
    }
    const { top } = cursorPosition;
    const eventTarget = this.codeEl?.nativeElement as HTMLElement;
    const { bottom } =
      eventTarget.parentElement!.parentElement!.getBoundingClientRect();
    const cursorTop = +top.replace('px', '');
    // subtracting border
    const codeElBottom = bottom - 4;

    if (cursorTop >= codeElBottom) {
      eventTarget.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  private get editorCode() {
    return this.codeEl?.nativeElement.textContent || '';
  }
}
