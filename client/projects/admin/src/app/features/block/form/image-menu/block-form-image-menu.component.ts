import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Editor } from 'ngx-editor';
import { EditorView } from 'prosemirror-view';
import { NodeSelection } from 'prosemirror-state';
import { Subscription } from 'rxjs';
import { BlockFormImage, BlockFormImageAttrs } from './block-form-image';

/**
 * Copied from https://github.com/sibiraj-s/ngx-editor/blob/master/projects/ngx-editor/src/lib/modules/menu/image/image.component.ts
 * to bypass image src validation that did not allow "files/image.jpg" path
 */
@Component({
  selector: 'admin-block-form-image-menu',
  templateUrl: './block-form-image-menu.component.html',
  styleUrls: ['./block-form-image-menu.component.scss'],
})
export class BlockFormImageMenuComponent implements OnInit, OnDestroy {
  @Input() editor!: Editor;
  showPopup = false;
  isActive = false;
  form = new FormGroup({
    src: new FormControl('', [
      Validators.required,
      // Validators.pattern(
      //   '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/??([^#\n\r]*)?#?([^\n\r]*)',
      // ),
    ]),
    alt: new FormControl(''),
    title: new FormControl(''),
  });
  private updateSubscription!: Subscription;
  private editorView!: EditorView;
  private imageCommand = new BlockFormImage();

  constructor(private el: ElementRef) {}

  get src(): AbstractControl {
    return this.form.get('src') as AbstractControl;
  }

  @HostListener('document:mousedown', ['$event']) onDocumentClick(
    e: MouseEvent,
  ): void {
    if (!this.el.nativeElement.contains(e.target) && this.showPopup) {
      this.hideForm();
    }
  }

  ngOnInit(): void {
    this.editorView = this.editor.view;

    this.updateSubscription = this.editor.update.subscribe(
      (view: EditorView) => {
        this.update(view);
      },
    );
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) {
      return;
    }

    this.showPopup = !this.showPopup;

    if (this.showPopup) {
      this.fillForm();
    }
  }

  insertLink(e: MouseEvent): void {
    e.preventDefault();
    const { src, alt, title } = this.form.getRawValue();
    const { dispatch, state } = this.editorView;

    const attrs: BlockFormImageAttrs = {
      alt: alt as string,
      title: title as string,
    };

    this.imageCommand.insert(src as string, attrs)(state, dispatch);
    this.editorView.focus();
    this.hideForm();
  }

  private fillForm(): void {
    const { state } = this.editorView;
    const { selection } = state;
    if (selection instanceof NodeSelection && this.isActive) {
      const { src, alt = '', title = '' } = selection.node.attrs;

      this.form.setValue({
        src,
        alt,
        title,
      });
    }
  }

  private update = (view: EditorView) => {
    const { state } = view;
    this.isActive = this.imageCommand.isActive(state);
  };

  private hideForm(): void {
    this.showPopup = false;
    this.form.reset({
      src: '',
      alt: '',
      title: '',
    });
  }
}
