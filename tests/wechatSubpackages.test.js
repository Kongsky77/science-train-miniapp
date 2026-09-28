const fs = require('fs');
const path = require('path');
const configurePages = require('../src/pages');
const original = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/pages.json'), 'utf8'));

function routes(config) {
  return [...config.pages, ...(config.subPackages || []).flatMap(pkg =>
    pkg.pages.map(page => ({ ...page, path: pkg.root + '/' + page.path })))
  ].sort((a, b) => a.path.localeCompare(b.path));
}

const savedEnv = { platform: process.env.UNI_PLATFORM, theme: process.env.VUE_APP_THEME_TYPE };
afterAll(() => {
  for (const [key, value] of Object.entries({ UNI_PLATFORM: savedEnv.platform, VUE_APP_THEME_TYPE: savedEnv.theme })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test('subpackage split preserves every route and page option, keeps startup and login in main', () => {
  process.env.UNI_PLATFORM = 'mp-weixin';
  process.env.VUE_APP_THEME_TYPE = 'kjg';
  const before = JSON.stringify(original);
  const result = configurePages(original);
  expect(routes(result)).toEqual(routes(original));
  expect(result.pages[0].path).toBe('pages/tab/index');
  expect(result.pages.some(page => page.path === 'pages/login/index')).toBe(true);
  expect(result.subPackages.length).toBe(original.subPackages.length + 18);
  expect(result.subPackages[0]).toEqual(original.subPackages[0]);
  for (const pkg of result.subPackages) {
    expect(result.pages.some(page => page.path.startsWith(pkg.root + '/'))).toBe(false);
  }
  expect(JSON.stringify(original)).toBe(before);
});

test('other themes and platforms keep their original package layout', () => {
  process.env.UNI_PLATFORM = 'h5';
  process.env.VUE_APP_THEME_TYPE = 'kjg';
  expect(configurePages(original)).toBe(original);
  process.env.UNI_PLATFORM = 'mp-weixin';
  process.env.VUE_APP_THEME_TYPE = 'tfgf';
  expect(configurePages(original)).toBe(original);
});

test('development watch and production quality builds use separate output directories', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
  );
  const developmentCommand =
    packageJson.scripts['dev:integration:kjg:mp-weixin'];
  const qualityCommand = packageJson.scripts['build:quality:kjg:mp-weixin'];

  expect(developmentCommand).toContain('UNI_OUTPUT_DIR=dist/dev/kjg-integration');
  expect(qualityCommand).toContain('UNI_OUTPUT_DIR=dist/build/kjg-integration');
  expect(qualityCommand).not.toContain('UNI_OUTPUT_DIR=dist/dev/kjg-integration');
});
