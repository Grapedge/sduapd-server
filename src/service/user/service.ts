import Koa from 'koa';
import { controller, route } from 'router';

@controller()
class UserService {
  @route('get', '/list')
  async users(ctx: Koa.Context) {
    ctx.body = '233';
  }
}

export { UserService };
