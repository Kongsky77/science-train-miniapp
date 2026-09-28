const {
  prepareComponentInjection,
  pruneUnusedVantComponents,
} = require('../build/WechatComponentInjectionPlugin');

function fixture() {
  const assets = {};
  function add(name, value) {
    const source = typeof value === 'string' ? value : JSON.stringify(value);
    assets[name] = { source: () => source };
  }
  add('app.json', { pages: ['pages/home/index'], usingComponents: {
    'van-popup': '/wxcomponents/popup/index', 'van-icon': '/wxcomponents/icon/index'
  }});
  for (const base of ['pages/home/index', 'wxcomponents/popup/index', 'wxcomponents/icon/index']) {
    add(base + '.json', { usingComponents: {} });
    add(base + '.js', 'Component({})');
    add(base + '.wxss', '');
    add(base + '.wxml', '<view/>');
  }
  return { assets, add };
}

test('scopes globals through imported templates and nested components without changing JS', () => {
  const { assets, add } = fixture();
  add('pages/home/index.wxml', '<import src="./parts.wxml"/><template is="body"/>');
  add('pages/home/parts.wxml', '<template name="body"><van-popup/></template>');
  add('wxcomponents/popup/index.wxml', '<van-icon/>');
  const result = prepareComponentInjection(assets);
  expect(JSON.parse(result['pages/home/index.json']).usingComponents).toEqual({ 'van-popup': '/wxcomponents/popup/index' });
  expect(JSON.parse(result['wxcomponents/popup/index.json']).usingComponents).toEqual({ 'van-icon': '/wxcomponents/icon/index' });
  expect(JSON.parse(result['app.json']).lazyCodeLoading).toBe('requiredComponents');
  expect(JSON.parse(result['app.json']).usingComponents).toEqual({});
  expect(Object.keys(result).every(name => name.endsWith('.json'))).toBe(true);
});

test('keeps explicit native dependencies ahead of globals', () => {
  const { assets, add } = fixture();
  add('wxcomponents/popup/index.wxml', '<van-icon/>');
  add('wxcomponents/popup/index.json', { component: true, usingComponents: { 'van-icon': '../icon/index' } });
  const result = prepareComponentInjection(assets);
  expect(JSON.parse(result['wxcomponents/popup/index.json'])).toEqual({ component: true, usingComponents: { 'van-icon': '../icon/index' } });
});

test('rejects missing dependency files before enabling injection', () => {
  const { assets, add } = fixture();
  add('pages/home/index.wxml', '<van-popup/>');
  delete assets['wxcomponents/popup/index.js'];
  expect(() => prepareComponentInjection(assets)).toThrow('Missing van-popup dependency');
  expect(JSON.parse(assets['app.json'].source()).lazyCodeLoading).toBeUndefined();
});

test('rejects undeclared Vant tags', () => {
  const { assets, add } = fixture();
  add('pages/home/index.wxml', '<van-missing/>');
  expect(() => prepareComponentInjection(assets)).toThrow('Undeclared component van-missing');
});

test('declares a bundled Vant component missing from global registrations', () => {
  const { assets, add } = fixture();
  for (const extension of ['json', 'js', 'wxml']) {
    add('wxcomponents/vant/index-bar/index.' + extension, extension === 'json' ? { component: true } : '');
  }
  add('pages/home/index.wxml', '<van-index-bar/>');
  const result = prepareComponentInjection(assets);
  expect(JSON.parse(result['pages/home/index.json']).usingComponents).toEqual({ 'van-index-bar': '/wxcomponents/vant/index-bar/index' });
});

test('removes unreachable Vant components while preserving reachable and shared assets', () => {
  const { assets, add } = fixture();
  add('app.json', { pages: ['pages/home/index'], usingComponents: {} });
  add('pages/home/index.json', {
    usingComponents: { 'van-popup': '/wxcomponents/vant/popup/index' },
  });
  for (const name of [
    'wxcomponents/vant/popup/index',
    'wxcomponents/vant/overlay/index',
    'wxcomponents/vant/dialog/index',
  ]) {
    add(name + '.js', 'Component({})');
    add(name + '.wxml', '<view/>');
    add(name + '.json', { usingComponents: {} });
  }
  add('wxcomponents/vant/popup/index.json', {
    usingComponents: { 'van-overlay': '../overlay/index' },
  });
  add('wxcomponents/vant/common/index.wxss', '');

  pruneUnusedVantComponents(assets);

  expect(assets['wxcomponents/vant/popup/index.js']).toBeDefined();
  expect(assets['wxcomponents/vant/overlay/index.js']).toBeDefined();
  expect(assets['wxcomponents/vant/common/index.wxss']).toBeDefined();
  expect(assets['wxcomponents/vant/dialog/index.js']).toBeUndefined();
});
