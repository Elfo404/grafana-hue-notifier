import 'fastify';

import { Api } from 'node-hue-api/dist/esm/api/Api';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      HUE_USERNAME: string;
      HUE_GROUP_ID: string;
    };
    hueClient: Api;
  }
}
