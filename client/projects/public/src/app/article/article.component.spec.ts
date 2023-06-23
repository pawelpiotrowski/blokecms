import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockModule } from '../block/block.module';
import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockModule],
      declarations: [ArticleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
  });

  it('should render article title', () => {
    component.article = {
      title: 'The Article',
      _id: '123',
      blocks: [],
    };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('article h1')?.textContent).toContain(
      'The Article',
    );
  });
});
