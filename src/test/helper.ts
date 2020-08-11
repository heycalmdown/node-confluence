import Confluency from '..';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

async function emptyFolderWith(folderId: string, seed: string) {
  const children = await confluency.getChildren(folderId, { all: true });
  const needToDelete = children
    .filter(o => o.title.match(/\d{7,}.*/))
    .filter(o => o.title.includes(seed));
  await Promise.all(needToDelete.map(o => confluency.del(o.id)));
}

export async function cleaning(seed: string) {
  // tslint:disable-next-line: max-line-length
  const WRITE_TEST_FOLDER = '1191313514'; // https://confluency.atlassian.net/wiki/spaces/CON/pages/1191313514/Write+test
  const TEST_FOLDER = '1081352'; // https://confluency.atlassian.net/wiki/spaces/CON/pages/1081352/test
  await emptyFolderWith(WRITE_TEST_FOLDER, seed);
  await emptyFolderWith(TEST_FOLDER, seed);
}

// cleaning('');
