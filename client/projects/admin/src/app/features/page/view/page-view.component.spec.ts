import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageViewComponent } from './page-view.component';

describe('PageViewComponent', () => {
  let component: PageViewComponent;
  let fixture: ComponentFixture<PageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageViewComponent);
    component = fixture.componentInstance;
  });

  it('should render page title', () => {
    component.page = {
      _id: '123',
      title: 'The Title',
      slug: 'slug',
    };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section h1')?.textContent).toContain(
      'The Title',
    );
  });
});
