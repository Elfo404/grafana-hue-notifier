import { api, discovery, v3 } from 'node-hue-api';

export const getBridgeAddress = async () => {
  const [nupnpBridgeResponse] = await discovery.nupnpSearch();
  if (!nupnpBridgeResponse.error) {
    return nupnpBridgeResponse.ipaddress;
  }

  const [upnpBridgeResponse] = await discovery.upnpSearch();
  if (upnpBridgeResponse.ipaddress) {
    return upnpBridgeResponse.ipaddress;
  }

  throw new Error('Discovery failed');
};

export const getClient = async (ip: string, username: string) => {
  const client = await api.createLocal(ip).connect(username);

  // `connect` silently fails if the provided username is not valaid.
  // to "workaround" this we perform a random request that requires authentication
  // that will actually fail.
  await client.configuration.getAll();

  return client;
};

export const generateGroupLightState = (on?: boolean) => {
  const state = new v3.lightStates.GroupLightState().sat(254).brightness(100);

  if (on !== undefined) {
    return state;
  }

  return state.on(on);
};
