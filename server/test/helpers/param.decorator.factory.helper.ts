import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

export function getParamDecoratorFactory(decorator) {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(@decorator() value) {
      /**/
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}
