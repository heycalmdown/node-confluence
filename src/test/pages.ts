import * as _ from 'lodash';
import 'should';
import Confluency from '..';
import { cleaning } from './helper';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test pages', function () {
  this.timeout(10000);

  const space = 'CON';
  const SEED = Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
  const GRAND_PARENT_ID = '1191313514'; // https://confluency.atlassian.net/wiki/spaces/CON/pages/1191313514/Write+test

  after(async () => {
    await cleaning(SEED);
    await cleaning(SEED); // for recursive
  });

  it('should move a child', async () => {
    const parent1 = await confluency.create({ space,
                                              parent: GRAND_PARENT_ID,
                                              title: `${SEED} parent 1`,
                                              content: 'parent 1'});
    const parent2 = await confluency.create({ space,
                                              parent: GRAND_PARENT_ID,
                                              title: `${SEED} parent 2`,
                                              content: 'parent 2'});
    const child = await confluency.create({ space, title: `${SEED} child`, content: 'child', parent: parent1.id });

    const page = await confluency.changeParent(child.id, parent2.id);

    _.takeRight(page.ancestors, 1)[0].title.should.be.exactly(`${SEED} parent 2`);
  });
});
