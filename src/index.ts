import { join } from 'path';

import { EnvSchemaData, EnvSchemaOpt } from 'env-schema';
import fastify from 'fastify';
import fastifyEnv from 'fastify-env';
import fastifySensible from 'fastify-sensible';
import hyperid from 'hyperid';

import { huePlugin } from './plugins/hue';

const genReqId = hyperid({ urlSafe: true });

const schema: EnvSchemaData = {
  type: 'object',
  required: ['PORT', 'HUE_USERNAME', 'HUE_GROUP_ID'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    HUE_USERNAME: {
      type: 'string',
    },
    HUE_GROUP_ID: {
      type: 'string',
    },
  },
};

const options: EnvSchemaOpt = {
  schema: schema,
  dotenv: {
    path: join(__dirname, '..', '.env'),
    debug: true,
  },
};

const app = fastify({
  logger: true,
  genReqId,
});

app
  .register(fastifyEnv, options)
  .register(fastifySensible)
  .register(huePlugin)
  .ready((err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    app.listen(app.config.PORT).catch((err) => {
      app.log.error(err);
      process.exit(1);
    });
  });
