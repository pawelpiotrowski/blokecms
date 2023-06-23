import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlockCode, BlockMedia, BlockText } from 'shared-lib';

@Component({
  selector: 'public-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent {
  @Input() block!: BlockMedia | BlockText | BlockCode;

  constructor(private sanitizer: DomSanitizer) {}

  get isMedia() {
    return (
      this.block != null && typeof (this.block as BlockMedia).url === 'string'
    );
  }

  get isText() {
    return (
      this.block != null &&
      typeof (this.block as BlockText).htmlIncludeWebComponentTags === 'string'
    );
  }

  get isCode() {
    return (
      this.block != null && typeof (this.block as BlockCode).code === 'string'
    );
  }

  get blockMedia() {
    return this.block as BlockMedia;
  }

  get blockText() {
    return this.block as BlockText;
  }

  get blockCode() {
    return this.block as BlockCode;
  }

  get blockTextHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.blockText.htmlIncludeWebComponentTags!,
    );
  }
}
