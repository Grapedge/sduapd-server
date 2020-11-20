import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import yaml from 'yamljs';
import chalk from 'chalk';

const router = new Router();

router.prefix('/api/v1');

type Constructor = {
  new (...args: any[]): {};
};

type HttpMethod =
  | 'get'
  | 'post'
  | 'patch'
  | 'options'
  | 'head'
  | 'put'
  | 'link'
  | 'unlink'
  | 'delete';

const methods = {
  get: chalk.blue('get'),
  post: chalk.magenta('post'),
  patch: chalk.magentaBright('patch'),
  options: chalk.yellow('options'),
  head: chalk.cyan('head'),
  put: chalk.cyanBright('put'),
  link: chalk.greenBright('link'),
  unlink: chalk.greenBright('unlink'),
  delete: chalk.red('delete'),
};
export function controller(prefix?: string) {
  return function <T extends Constructor>(target: T) {
    const routes = Object.values(
      Object.getOwnPropertyDescriptors(target.prototype)
    ).filter((item) => item.value._method && item.value._route);
    for (const { value } of routes) {
      const method = value._method as HttpMethod;
      const route = `${prefix || ''}${value._route}`;
      router[method](route, value);
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `${chalk.green('[Map Route]')}`,
          `${methods[method]} ${chalk.greenBright(route)}`
        );
      }
    }
  };
}

export function route(method: HttpMethod, route: string) {
  return function (_t: any, _n: string, descriptor: PropertyDescriptor) {
    descriptor.value._method = method;
    descriptor.value._route = route;
  };
}

// 扫描文件夹
function mapRoutes(sourcePath: string) {
  const files = fs.readdirSync(sourcePath);
  for (const file of files) {
    const filePath = path.resolve(sourcePath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      mapRoutes(filePath);
    } else if (/^service\.(ts|js)$/.test(file)) {
      // 映射路由
      require(filePath);
    }
  }
}

mapRoutes('src/service');
export default router;
