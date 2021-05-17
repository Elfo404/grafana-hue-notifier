import { api } from 'node-hue-api';

import { getBridgeAddress } from './plugins/hue/hue';

(async () => {
  const ip = await getBridgeAddress();
  const localBootstrap = await api.createLocal(ip);

  let client = await localBootstrap.connect();

  const user = await client.users.createUser('grafana-hue-notifier');
  client = await localBootstrap.connect(user.username);
  console.log(`created user: ${user.username}\n`);

  const lightGroups = (await client.groups.getAll()).filter(
    (group) => group.type === 'LightGroup'
  );

  lightGroups.forEach((group) => {
    console.log(`${group.name} ID: ${group.id}`);
  });
})();
