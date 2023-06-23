import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;
  let titleService: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundPageComponent],
      providers: [Title],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
    titleService = TestBed.inject(Title);
    component = fixture.componentInstance;
  });

  it('should render 404 content', () => {
    jest.spyOn(titleService, 'setTitle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('section h1')?.textContent).toContain(
      '404 Not Found :/',
    );
    expect(titleService.setTitle).toHaveBeenLastCalledWith('404 Not Found');
  });
});
