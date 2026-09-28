const fs = require("fs");
const path = require("path");

const pagesConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../src/pages.json"), "utf8")
);
const dynamicCheckboxSource = fs.readFileSync(
  path.resolve(__dirname, "../src/pages/fillInfo/DynamicFormCheckbox.vue"),
  "utf8"
);
const pageStyle = (pagePath) => {
  const page = pagesConfig.pages.find((item) => item.path === pagePath);
  return page && page.style;
};

describe("科普列车目标页原生首帧背景", () => {
  test("首页显式注册参与者切换面板，避免开发增量构建将内容直接渲染", () => {
    expect(pageStyle("pages/tab/index").usingComponents).toEqual({
      "van-action-sheet": "/wxcomponents/vant/action-sheet/index",
    });
  });

  test("动态复选字段不再依赖全局 Vant 复选框", () => {
    expect(pagesConfig.globalStyle.usingComponents["van-checkbox"]).toBeUndefined();
    expect(
      pagesConfig.globalStyle.usingComponents["van-checkbox-group"]
    ).toBeUndefined();
    expect(dynamicCheckboxSource).toContain("<checkbox-group");
    expect(dynamicCheckboxSource).not.toContain("<van-checkbox");
  });

  test.each([
    ["pages/kjgActivityDetail/index", "#F7F5EF"],
    ["pages/kjgQuiz/index", "#F7F5EF"],
    ["pages/kjgLottery/index", "#F7F3EA"],
    ["pages/kjgCheckIn/index", "#F7F5EF"],
    ["pages/kjgMuseum/index", "#F7F5EF"],
    ["pages/rank/index", "#F7F3EA"],
    ["pages/login/index", "#F8FCFF"],
  ])("%s 在页面代码挂载前已有匹配背景", (pagePath, color) => {
    const style = pageStyle(pagePath);
    expect(style).toBeDefined();
    expect(style.backgroundColor).toBe(color);
    expect(style.navigationBarBackgroundColor).toBe(color);
  });
});
