const fs = require("fs");
const path = require("path");

const readSource = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

const readBusinessSources = (relativeDirectory) => {
  const directory = path.resolve(__dirname, relativeDirectory);
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return readBusinessSources(path.relative(__dirname, entryPath));
    }
    return /\.(?:vue|scss|css|ts|js|json|wxml|wxss)$/.test(entry.name)
      ? [fs.readFileSync(entryPath, "utf8")]
      : [];
  });
};

describe("科普列车纯符号控件可访问名称", () => {
  test("场馆选择面板关闭按钮具有明确名称", () => {
    const source = readSource("../src/pages/kjgCheckIn/index.vue");
    expect(source).toContain('role="button"');
    expect(source).toContain('aria-label="关闭场馆选择面板"');
  });

  test.each([
    ["动作面板", "../src/wxcomponents/vant/action-sheet/index.wxml"],
    ["通用弹窗", "../src/wxcomponents/vant/popup/index.wxml"],
  ])("%s关闭图标具有明确名称", (_name, sourcePath) => {
    const source = readSource(sourcePath);
    expect(source).toContain('role="button"');
    expect(source).toContain('aria-label="关闭弹窗"');
    expect(source).toMatch(/bind:tap="on(?:Close|ClickCloseIcon)"/);
  });
});

describe("科普列车强调文字颜色", () => {
  test("所有页面和业务组件不再使用旧青绿色字体", () => {
    const source = [
      ...readBusinessSources("../src/pages"),
      ...readBusinessSources("../src/components"),
    ].join("\n");
    const legacyTealText =
      /(?<![-\w])color\s*:\s*(?:\$home-teal|\$teal|\$kjg-jade|#(?:078c83|08746d|126f6a|168f88|00bf86))\b/gi;

    expect(source.match(legacyTealText) || []).toEqual([]);
    expect(source).toContain("color: #FAC12A;");
  });
});

describe("科普列车用户称谓", () => {
  test("所有页面、组件和业务提示统一使用用户称谓", () => {
    const source = readBusinessSources("../src").join("\n");

    expect(source).not.toContain("参与者");
  });
});
