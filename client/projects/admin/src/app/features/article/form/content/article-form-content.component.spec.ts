import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ArticleFormContentComponent } from './article-form-content.component';
import { ArticleFormContentNameComponent } from './article-form-content-name.component';
import { of } from 'rxjs';
import { GetBlockNameGQL } from 'shared-lib';

describe('ArticleFormContentComponent', () => {
  let component: ArticleFormContentComponent;
  let fixture: ComponentFixture<ArticleFormContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatExpansionModule, NoopAnimationsModule],
      declarations: [
        ArticleFormContentComponent,
        ArticleFormContentNameComponent,
      ],
      providers: [
        {
          provide: GetBlockNameGQL,
          useValue: {
            fetch: jest
              .fn()
              .mockReturnValue(
                of({ data: { blockName: 'name' }, loading: false }),
              ),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleFormContentComponent);
    component = fixture.componentInstance;
    component.content = [];
    fixture.detectChanges();
  });

  describe('getContentIcon', () => {
    it('should return right icon based on content "kind" property', () => {
      fixture.detectChanges();

      expect(component.getContentIcon('text')).toEqual('short_text');
      expect(component.getContentIcon('media')).toEqual('perm_media');
      expect(component.getContentIcon('code')).toEqual('code_blocks');
    });
  });

  describe('getContentLabel', () => {
    it('should return right label based on content "kind" property', () => {
      fixture.detectChanges();

      expect(component.getContentLabel('text')).toEqual('Block');
      expect(component.getContentLabel('media')).toEqual('Multimedia');
      expect(component.getContentLabel('code')).toEqual('Code Block');
    });
  });

  describe('getContentLink', () => {
    it('should return right url based on content "kind" property', () => {
      fixture.detectChanges();

      expect(component.getContentLink({ refId: '444', kind: 'text' })).toEqual([
        '/blocks',
        '444',
        'edit',
      ]);
      expect(component.getContentLink({ refId: '888', kind: 'media' })).toEqual(
        ['/multimedia', '888', 'edit'],
      );
      expect(component.getContentLink({ refId: '999', kind: 'code' })).toEqual([
        '/code-blocks',
        '999',
        'edit',
      ]);
    });
  });

  describe('getContentLinkParams', () => {
    it('should return query params with pageId if defined', () => {
      component.articleId = '312';
      fixture.detectChanges();

      expect(component.getContentLinkParams()).toEqual({
        parent: 'articles',
        id: '312',
      });
      component.pageId = '213';
      fixture.detectChanges();
      expect(component.getContentLinkParams()).toEqual({
        parent: 'articles',
        id: '312',
        pageId: '213',
      });
    });
  });

  describe('removeItem', () => {
    it('should remove item from content array', () => {
      component.content = [
        { refId: '123', kind: 'media' },
        { refId: '321', kind: 'text' },
      ];
      fixture.detectChanges();

      jest.spyOn(component.contentUpdate, 'emit');

      component.removeItem(component.content[0]);

      expect(component.contentUpdate.emit).toHaveBeenLastCalledWith([
        { refId: '321', kind: 'text' },
      ]);
    });
  });
});
