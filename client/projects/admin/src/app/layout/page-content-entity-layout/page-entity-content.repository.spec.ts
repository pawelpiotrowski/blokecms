import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {
  PageContentEntityToolbarButtons,
  pageContentEntityToolbarButtonsAvailabilityDefault,
} from './page-content-entity-layout.interface';
import { PageEntityContentRepository } from './page-entity-content.repository';

describe('PageEntityContentRepository', () => {
  let repo: PageEntityContentRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageEntityContentRepository],
    });
    repo = TestBed.inject(PageEntityContentRepository);
  });

  it('should create page entity content selectors', () => {
    expect(repo.buttonsAvailability$).toBeInstanceOf(Observable);
  });

  describe('buttonsAvailability$', () => {
    it('should set default availability', (done) => {
      repo.buttonsAvailability$.subscribe((availability) => {
        expect(availability).toEqual(
          pageContentEntityToolbarButtonsAvailabilityDefault,
        );
        done();
      });
    });

    it('should broadcast availability updates', (done) => {
      repo.updateButtonsAvailability({ Back: false, Save: false });
      repo.buttonsAvailability$.subscribe((availability) => {
        expect(availability).toEqual({
          ...pageContentEntityToolbarButtonsAvailabilityDefault,
          Back: false,
          Save: false,
        });
        done();
      });
    });
  });

  describe('buttonsAction$', () => {
    it('should broadcast buttons action', (done) => {
      repo.buttonsAction$.subscribe((action) => {
        expect(action).toEqual(PageContentEntityToolbarButtons.Delete);
        done();
      });
      repo.updateButtonsAction(PageContentEntityToolbarButtons.Delete);
    });
  });

  describe('reset', () => {
    it('should reset store props to initial state', (done) => {
      repo.updateButtonsAvailability({ Back: false, Save: false });
      repo.reset();
      repo.buttonsAvailability$.subscribe((availability) => {
        expect(availability).toEqual(
          pageContentEntityToolbarButtonsAvailabilityDefault,
        );
        done();
      });
    });
  });
});
