import { Test, TestingModule } from '@nestjs/testing';
import { StyleService } from '../settings/style/style.service';
import { ClientService } from './client.service';
import { configGql } from './client.service.constants';
import * as constants from './client.service.constants';
import { ScriptService } from '../settings/script/script.service';

const mockStyleService = {
  findOne: jest.fn(),
};
const mockScriptService = {
  findOne: jest.fn(),
};

describe('ClientService', () => {
  let service: ClientService;
  let styleService: StyleService;
  let scriptService: ScriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: StyleService, useValue: mockStyleService },
        { provide: ScriptService, useValue: mockScriptService },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    styleService = module.get<StyleService>(StyleService);
    scriptService = module.get<ScriptService>(ScriptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('injectPublicMainStyle', () => {
    it('should return unchanged public index if main style does not exists or has no minified property', async () => {
      (styleService.findOne as jest.Mock).mockRejectedValueOnce(undefined);

      const mockPublicIndex = '<html></html>';
      const result1 = await service.injectPublicMainStyle(mockPublicIndex);
      expect(result1).toEqual(mockPublicIndex);

      (styleService.findOne as jest.Mock).mockResolvedValueOnce({});
      const result2 = await service.injectPublicMainStyle(mockPublicIndex);
      expect(result2).toEqual(mockPublicIndex);
    });

    it('should return public index file with main style injected if main style exists', async () => {
      (styleService.findOne as jest.Mock).mockResolvedValueOnce({
        minified: 'html{visibility:hidden;}',
      });

      const result = await service.injectPublicMainStyle(
        '<html><head></head></html>',
      );
      expect(result).toEqual(
        '<html><head><style>html{visibility:hidden;}</style></head></html>',
      );
    });
  });

  describe('injectPublicMainScript', () => {
    it('should return unchanged public index if main script does not exists or has no minified property', async () => {
      (scriptService.findOne as jest.Mock).mockRejectedValueOnce(undefined);

      const mockPublicIndex = '<html></html>';
      const result1 = await service.injectPublicMainScript(mockPublicIndex);
      expect(result1).toEqual(mockPublicIndex);

      (scriptService.findOne as jest.Mock).mockResolvedValueOnce({});
      const result2 = await service.injectPublicMainScript(mockPublicIndex);
      expect(result2).toEqual(mockPublicIndex);
    });

    it('should return public index file with main script injected if main script exists', async () => {
      (scriptService.findOne as jest.Mock).mockResolvedValueOnce({
        minified: 'function foo(){console.log("bar");}',
      });

      const result = await service.injectPublicMainScript(
        '<html><body></body></html>',
      );
      expect(result).toEqual(
        '<html><body><script>function foo(){console.log("bar");}</script></body></html>',
      );
    });
  });

  describe('sanitizeFilename', () => {
    const mockReplacementOptions = { replacement: '_' };

    it('should return unchanged input for valid names', () => {
      ['the quick brown fox jumped over the lazy dog.mp3', 'résumé'].forEach(
        (name) => {
          expect(service.sanitizeFilename(name)).toEqual(name);
        },
      );

      ['valid name.mp3', 'zielona łąka'].forEach((name) => {
        expect(service.sanitizeFilename(name, mockReplacementOptions)).toEqual(
          name,
        );
      });
    });

    it('should sanitize null characters', () => {
      expect(service.sanitizeFilename('hello\u0000world')).toEqual(
        'helloworld',
      );

      expect(
        service.sanitizeFilename('hello\u0000world', mockReplacementOptions),
      ).toEqual('hello_world');
    });

    it('should sanitize control characters', () => {
      expect(service.sanitizeFilename('hello\nworld')).toEqual('helloworld');

      expect(
        service.sanitizeFilename('hello\nworld', mockReplacementOptions),
      ).toEqual('hello_world');
    });

    it('should sanitize restricted codes', () => {
      ['h?w', 'h/w', 'h*w'].forEach((name) => {
        expect(service.sanitizeFilename(name)).toEqual('hw');
        expect(service.sanitizeFilename(name, mockReplacementOptions)).toEqual(
          'h_w',
        );
      });
    });

    // https://msdn.microsoft.com/en-us/library/aa365247(v=vs.85).aspx
    it('should sanitize restricted suffixes', () => {
      ['mr.', 'mr..', 'mr ', 'mr  '].forEach((name) => {
        expect(service.sanitizeFilename(name)).toEqual('mr');
      });
    });

    it('should sanitize relative paths', () => {
      ['.', '..', './', '../', '/..', '/../', '*.|.'].forEach((name) => {
        expect(service.sanitizeFilename(name)).toEqual('');
      });

      expect(service.sanitizeFilename('..', mockReplacementOptions)).toEqual(
        '_',
      );
    });

    it('should sanitize reserved filename in Windows', () => {
      expect(service.sanitizeFilename('con')).toEqual('');
      expect(service.sanitizeFilename('COM1')).toEqual('');
      expect(service.sanitizeFilename('PRN.')).toEqual('');
      expect(service.sanitizeFilename('aux.txt')).toEqual('');
      expect(service.sanitizeFilename('LPT9.asdfasdf')).toEqual('');
      expect(service.sanitizeFilename('LPT10.txt')).toEqual('LPT10.txt');

      expect(service.sanitizeFilename('con', mockReplacementOptions)).toEqual(
        '_',
      );
      expect(service.sanitizeFilename('COM1', mockReplacementOptions)).toEqual(
        '_',
      );
      expect(service.sanitizeFilename('PRN.', mockReplacementOptions)).toEqual(
        '_',
      );
      expect(
        service.sanitizeFilename('aux.txt', mockReplacementOptions),
      ).toEqual('_');
      expect(
        service.sanitizeFilename('LPT9.asdfasdf', mockReplacementOptions),
      ).toEqual('_');
      expect(
        service.sanitizeFilename('LPT10.txt', mockReplacementOptions),
      ).toEqual('LPT10.txt');
    });

    it('should ignore invalid replacement', () => {
      expect(service.sanitizeFilename('.', { replacement: '.' })).toEqual('');
      expect(
        service.sanitizeFilename('foo?.txt', { replacement: '>' }),
      ).toEqual('foo.txt');
      expect(
        service.sanitizeFilename('con.txt', { replacement: 'aux' }),
      ).toEqual('');
      expect(
        service.sanitizeFilename('valid.txt', { replacement: '/:*?"<>|' }),
      ).toEqual('valid.txt');
    });

    it('should trim filename longer thatn the 255 limit', () => {
      const longFileName = 'a'.repeat(300);

      expect(service.sanitizeFilename(longFileName).length).toBeLessThanOrEqual(
        255,
      );
    });

    it('should trim non-bmp JUST OUTSIDE the limit', () => {
      const str25x = 'a'.repeat(253);
      const fileName = str25x + '\uD800\uDC00';

      expect(service.sanitizeFilename(fileName)).toEqual(str25x);
    });

    it('should trim non-bmp SADDLES the limit', () => {
      const str25x = 'a'.repeat(252);
      const fileName = str25x + '\uD800\uDC00';

      expect(service.sanitizeFilename(fileName)).toEqual(str25x);
    });

    it('should not trim non-bmp JUST WITHIN the limit', () => {
      const str25x = 'a'.repeat(251);
      const fileName = str25x + '\uD800\uDC00';

      expect(service.sanitizeFilename(fileName)).toEqual(fileName);
    });
  });

  describe('shouldAttemptNextHandler', () => {
    it('should return true if given url is gql url and we are in dev environment', () => {
      (constants as any).configIsDev = true;
      expect(service.shouldAttemptNextHandler('/' + configGql.url)).toEqual(
        true,
      );
    });

    it('should return false if given url is NOT gql url or we are NOT in dev environment', () => {
      (constants as any).configIsDev = false;
      expect(service.shouldAttemptNextHandler('/' + configGql.url)).toEqual(
        false,
      );

      (constants as any).configIsDev = true;
      expect(service.shouldAttemptNextHandler('/foo')).toEqual(false);
    });
  });
});
