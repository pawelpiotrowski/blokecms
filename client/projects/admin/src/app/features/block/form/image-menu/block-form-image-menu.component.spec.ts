import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Editor } from 'ngx-editor';
import { BlockFormImageMenuComponent } from './block-form-image-menu.component';

describe('BlockFormImageMenuComponent', () => {
  let component: BlockFormImageMenuComponent;
  let fixture: ComponentFixture<BlockFormImageMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockFormImageMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockFormImageMenuComponent);
    component = fixture.componentInstance;
    component.editor = new Editor();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
