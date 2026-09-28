const {
  getBackDeltaToRoute,
  isCurrentPageRoute,
} = require("../src/logic/navigation/PageStackNavigationLogic.ts");

describe("页面栈首页返回策略", () => {
  test("首页紧邻答题页时返回一层", () => {
    expect(
      getBackDeltaToRoute(
        [{ route: "pages/tab/index" }, { route: "pages/kjgQuiz/index" }],
        "pages/tab/index"
      )
    ).toBe(1);
  });

  test("首页与答题页之间存在其他页面时返回到首页所在层", () => {
    expect(
      getBackDeltaToRoute(
        [
          { route: "pages/tab/index" },
          { route: "pages/kjgActivityDetail/index" },
          { route: "pages/kjgQuiz/index" },
        ],
        "/pages/tab/index"
      )
    ).toBe(2);
  });

  test("首页已被 redirectTo 替换时返回零并启用替换兜底", () => {
    expect(
      getBackDeltaToRoute(
        [
          { route: "pages/login/index" },
          { route: "pages/kjgQuiz/index" },
        ],
        "pages/tab/index"
      )
    ).toBe(0);
  });

  test("兼容 fullPath、查询参数和开头斜杠", () => {
    expect(
      getBackDeltaToRoute(
        [
          { $page: { fullPath: "/pages/tab/index?from=quiz" } },
          { route: "pages/kjgQuiz/index" },
        ],
        "pages/tab/index"
      )
    ).toBe(1);
  });

  test("失败回调到达时可识别已经切换成功的首页", () => {
    expect(
      isCurrentPageRoute(
        [{ route: "pages/kjgQuiz/index" }, { route: "pages/tab/index" }],
        "/pages/tab/index"
      )
    ).toBe(true);
    expect(
      isCurrentPageRoute(
        [{ route: "pages/kjgQuiz/index" }],
        "pages/tab/index"
      )
    ).toBe(false);
  });
});
