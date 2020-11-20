import Koa from 'koa';
import router from './router/index';
import cors from '@koa/cors';
import yaml from 'yamljs';

type ServerConfig = {
  host: string;
  port: number;
  db: {
    address: string;
    username: string;
    password: string;
  };
};

// read config
const config: ServerConfig = yaml.load('conf/config.yaml');

const app = new Koa();

// CORS
app.use(
  cors({
    allowHeaders: 'authentication',
  })
);

// Router
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(
    `山大敏捷开发平台 is running at http://${config.host}:${config.port}`
  );
});
