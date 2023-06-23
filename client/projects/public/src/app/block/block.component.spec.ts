import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockCode, BlockMedia, BlockText, BlockType } from 'shared-lib';
import { BlockComponent } from './block.component';

describe('BlockComponent', () => {
  let component: BlockComponent;
  let fixture: ComponentFixture<BlockComponent>;
  const mockBlockText = {
    name: 'Text',
    kind: BlockType.Text,
    text: 'text',
    jsonDoc: 'text',
    html: '<p>text</p>',
    htmlIncludeWebComponentTags: '<p>text</p>',
  };
  const mockBlockMedia = {
    name: 'Media',
    kind: BlockType.Media,
    url: 'media',
  };
  const mockBlockCode = {
    name: 'Code',
    kind: BlockType.Code,
    code: 'let foo = "bar"',
    lang: 'typescript',
    showLineNumbers: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockComponent);
    component = fixture.componentInstance;
  });

  describe('isMedia', () => {
    it('should return false when block is undefined', () => {
      fixture.detectChanges();
      expect(component.isMedia).toEqual(false);
    });

    it('should return false when block is text', () => {
      component.block = mockBlockText as BlockText;
      fixture.detectChanges();
      expect(component.isMedia).toEqual(false);
    });

    it('should return true when block is media', () => {
      component.block = mockBlockMedia as BlockMedia;
      fixture.detectChanges();
      expect(component.isMedia).toEqual(true);
    });
  });

  describe('isText', () => {
    it('should return false when block is undefined', () => {
      fixture.detectChanges();
      expect(component.isText).toEqual(false);
    });

    it('should return true when block is text', () => {
      component.block = mockBlockText as BlockText;
      fixture.detectChanges();
      expect(component.isText).toEqual(true);
    });

    it('should return false when block is media', () => {
      component.block = mockBlockMedia as BlockMedia;
      fixture.detectChanges();
      expect(component.isText).toEqual(false);
    });
  });

  describe('isCode', () => {
    it('should return false when block is undefined', () => {
      fixture.detectChanges();
      expect(component.isCode).toEqual(false);
    });

    it('should return true when block is code', () => {
      component.block = mockBlockCode as BlockCode;
      fixture.detectChanges();
      expect(component.isCode).toEqual(true);
    });

    it('should return false when block is not code', () => {
      component.block = mockBlockMedia as BlockMedia;
      fixture.detectChanges();
      expect(component.isCode).toEqual(false);
    });
  });

  describe('blockMedia', () => {
    it('should return block as BlockMedia', () => {
      component.block = mockBlockMedia as BlockMedia;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(
        (compiled.querySelector('figure img') as HTMLImageElement).src,
      ).toContain(`/files/${component.blockMedia.url}`);
    });
  });

  describe('blockText', () => {
    it('should return block as BlockText', () => {
      component.block = mockBlockText as BlockText;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('div')?.innerHTML).toEqual(
        component.blockText.html,
      );
    });
  });

  describe('blockCode', () => {
    it('should return block as BlockCode', () => {
      component.block = mockBlockCode as BlockCode;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('shared-code-edit')).not.toBeNull();
    });
  });
});
