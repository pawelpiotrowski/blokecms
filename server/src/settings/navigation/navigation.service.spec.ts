import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/helpers/mongoose.helper';
import { PageService } from '../../page/page.service';
import { Navigation, NavigationSchema } from './navigation.schema';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let pageService: PageService;
  let module: TestingModule;
  const mockAuthorId = new Types.ObjectId().toString();
  const mockPageService = {
    getOne: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Navigation.name,
            schema: NavigationSchema,
          },
        ]),
      ],
      providers: [
        NavigationService,
        { provide: PageService, useValue: mockPageService },
      ],
    }).compile();

    service = module.get<NavigationService>(NavigationService);
    pageService = module.get<PageService>(PageService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create navigation with NavigationCreateInput', async () => {
      const mockNavInput = {
        name: 'test',
        items: [{ label: 'foo', pageId: '123' }],
        authorId: mockAuthorId,
      };
      const createdNavigation = await service.create(mockNavInput);

      expect(createdNavigation._id).toBeDefined();
      expect(createdNavigation.name).toEqual(mockNavInput.name);
      expect(createdNavigation.items[0].label).toEqual(
        mockNavInput.items[0].label,
      );
    });
  });

  describe('findAll', () => {
    it('should get a list of navigations', async () => {
      const navigations = await service.findAll();

      expect(navigations).toBeDefined();
      expect(Array.isArray(navigations)).toBe(true);
      expect(navigations.length).toBe(1);
      expect(navigations[0].name).toBe('test');
    });
  });

  describe('findOne', () => {
    it('should return navigation if exists otherwise null', async () => {
      const createNav1Input = {
        name: 'main',
        items: [
          {
            label: 'home',
            pageId: '321',
          },
          {
            label: 'about',
            pageId: '444',
          },
        ],
        authorId: mockAuthorId,
      };
      const createNav2Input = {
        name: 'sidenav',
        items: [
          {
            label: 'categories',
            pageId: '333',
          },
          {
            label: 'contact',
            pageId: '888',
          },
        ],
        authorId: mockAuthorId,
      };
      const createdNav1 = await service.create(createNav1Input);
      const createdNav2 = await service.create(createNav2Input);

      const nav1FindOneById = await service.findOne({
        _id: createdNav1._id,
      });
      const nav1FindOneByName = await service.findOne({
        name: createNav1Input.name,
      });
      const nav2FindOneById = await service.findOne({
        _id: createdNav2._id,
      });
      const nav2FindOneByName = await service.findOne({
        name: createNav2Input.name,
      });
      const navNotFound = await service.findOne({
        name: 'not-here',
      });

      expect(nav1FindOneById.name).toEqual(createdNav1.name);
      expect(nav1FindOneByName._id.toString()).toEqual(
        createdNav1._id.toString(),
      );
      expect(nav2FindOneById.name).toEqual(createdNav2.name);
      expect(nav2FindOneByName._id.toString()).toEqual(
        createdNav2._id.toString(),
      );
      expect(navNotFound).toEqual(null);
    });
  });

  describe('deleteOne', () => {
    it('should delete navigation by id', async () => {
      const createdNav = await service.create({
        name: 'deleteme',
        items: [
          {
            label: 'foo',
            pageId: '1001',
          },
        ],
        authorId: mockAuthorId,
      });

      const navFindOneById = await service.findOne({
        _id: createdNav._id,
      });
      expect(navFindOneById._id).toBeDefined();

      await service.deleteOne(navFindOneById._id);

      const navFindOneByIdAfterDelete = await service.findOne({
        _id: createdNav._id,
      });
      expect(navFindOneByIdAfterDelete).toEqual(null);
    });
  });

  describe('update', () => {
    it('should update navigation', async () => {
      const createdNav = await service.create({
        name: 'editme',
        items: [
          {
            label: 'bar',
            pageId: '1221',
          },
        ],
        authorId: mockAuthorId,
      });
      const mockUpdate = {
        _id: createdNav._id,
        name: 'edited',
        items: [{ label: 'foo', pageId: '1301' }],
      };
      await service.update(mockUpdate);

      const findUpdatedNav = await service.findOne({
        _id: createdNav._id,
      });
      expect(findUpdatedNav.name).toEqual(mockUpdate.name);
      expect(findUpdatedNav.items.length).toEqual(1);
      expect(findUpdatedNav.items[0]).toEqual(mockUpdate.items[0]);
    });
  });

  describe('resolveLinks', () => {
    it('should return navigation items resolved to links', async () => {
      const createdNav = await service.create({
        name: 'resolveme',
        items: [],
        authorId: mockAuthorId,
      });
      const mockNavItem1 = {
        pageId: new Types.ObjectId(),
        label: 'Foo',
      };
      const mockNavItem2 = {
        pageId: new Types.ObjectId(),
        label: 'Bar',
      };
      const mockPage1 = {
        slug: 'category/foo',
        toObject: jest.fn().mockReturnThis(),
      };
      const mockPage2 = {
        slug: 'category/bar',
        toObject: jest.fn().mockReturnThis(),
      };
      createdNav.items.push(...[mockNavItem1, mockNavItem2]);

      (pageService.getOne as jest.Mock)
        .mockResolvedValueOnce(mockPage1)
        .mockResolvedValueOnce(mockPage2);

      const links = await service.resolveLinks(createdNav);

      expect(links).toEqual([
        {
          ...mockNavItem1,
          slug: mockPage1.slug,
        },
        {
          ...mockNavItem2,
          slug: mockPage2.slug,
        },
      ]);
      expect(pageService.getOne).toHaveBeenCalledTimes(2);
      expect(pageService.getOne).toHaveBeenNthCalledWith(1, {
        _id: mockNavItem1.pageId,
      });
      expect(pageService.getOne).toHaveBeenNthCalledWith(2, {
        _id: mockNavItem2.pageId,
      });
    });
  });

  describe('resolveLink', () => {
    it('should return null if page does NOT exists', async () => {
      const mockNavItem = {
        pageId: new Types.ObjectId(),
        label: 'Foo',
      };
      const mockPageNotFound = {
        toObject: jest.fn().mockReturnValue(null),
      };

      (pageService.getOne as jest.Mock).mockResolvedValueOnce(mockPageNotFound);

      const link = await service.resolveLink(mockNavItem);

      expect(link).toEqual(null);
    });

    it('should return item if it has "url" or when it is missing "pageId" property', async () => {
      (pageService.getOne as jest.Mock).mockClear();
      const mockNavItemWithUrl = {
        url: 'url',
        label: 'Foo',
      };
      const mockNavItemWithoutPageId = {
        label: 'Bar',
      };

      const linkWithUrl = await service.resolveLink(mockNavItemWithUrl);
      const linkWithoutPageId = await service.resolveLink(
        mockNavItemWithoutPageId,
      );

      expect(linkWithUrl).toEqual(mockNavItemWithUrl);
      expect(linkWithoutPageId).toEqual(mockNavItemWithoutPageId);
      expect(pageService.getOne).not.toHaveBeenCalled();
    });
  });
});
