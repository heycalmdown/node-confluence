import Confluency from '..';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

async function emptyFolderWith(folderId: string, seed: string) {
  const children = await confluency.getChildren(folderId, { all: true });
  const needToDelete = children.filter(o => o.title.includes(seed));
  await Promise.all(needToDelete.map(o => confluency.del(o.id)));
}

export async function cleaning(seed: string) {
  const TEST_FOLDER = '1081352';
  const WRITE_TEST_FOLDER = '1164247255';
  await emptyFolderWith(WRITE_TEST_FOLDER, seed);
  await emptyFolderWith(TEST_FOLDER, seed);
}
