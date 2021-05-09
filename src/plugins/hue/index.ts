import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

import { generateGroupLightState, getBridgeAddress, getClient } from './hue';

// Grafana only sends notifications for alerts that are either in `ok` or `alerting` state
type AlertState = 'ok' | 'alerting';

// Basic request body type for Grafana's webhook notifications.
// We are only interested in `state`
interface RequestBody {
  state: AlertState;
}

/**
 * Returns a hue number value for the given state: Red for 'alerting' and green for 'ok'
 */
const getHueValue = (state: AlertState): number => {
  switch (state) {
    case 'alerting':
      // red
      return 0;
    default:
    case 'ok':
      // green
      return 25500;
  }
};

const pluginCallback: FastifyPluginCallback = async (app) => {
  app.log.info('Obtaining Bridge ip address');
  const address = await getBridgeAddress();
  app.log.info(`Found Bridge at ${address}`);

  const hueClient = await getClient(address, app.config.HUE_USERNAME);
  app.log.info(`Successfully connected to Hue Bridge`);

  app.decorate('hueClient', hueClient);

  app.post<{ Body: RequestBody }>('/hue', async (req) => {
    req.log.info(`Got notification alert from Grafana: ${req.body.state}`);

    const success = await app.hueClient.groups.setGroupState(
      app.config.HUE_GROUP_ID,
      generateGroupLightState(
        req.body.state === 'alerting' ? true : undefined
      ).hue(getHueValue(req.body.state))
    );

    if (success) {
      app.log.info('Successfully set new state');
    } else {
      app.log.warn(`Could not set group state to ${req.body.state}`);
    }

    return { ok: true };
  });
};

export const huePlugin = fp(pluginCallback, { name: 'hue' });
