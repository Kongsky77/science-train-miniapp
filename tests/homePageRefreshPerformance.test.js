const fs = require("fs");
const path = require("path");

const homePageSource = fs.readFileSync(
  path.resolve(__dirname, "../src/pages/tab/index.vue"),
  "utf8"
).replace(/\r\n/g, "\n");

describe("首页返回刷新性能", () => {
  test("onShow 不重复读取设备安全区", () => {
    const onShowBody = homePageSource.match(/onShow\(\) \{([\s\S]*?)\n  \}/);
    expect(onShowBody).not.toBeNull();
    expect(onShowBody[1]).not.toContain("refreshSafeInsets");
    expect(onShowBody[1]).toContain("refreshHomeState(isReturningToHome)");
  });

  test("同一参与者返回首页时保留已渲染数据", () => {
    expect(homePageSource).toContain("const preserveRenderedState = !!(");
    expect(homePageSource).toContain(
      "this.renderedParticipantId === activeSubUserId"
    );
    expect(homePageSource).toContain("if (!preserveRenderedState) {");
    expect(homePageSource).toContain(
      "loadRealParticipants(\n        activeSubUserId"
    );
  });

  test("参与者、积分进度和排名请求并行且在途请求去重", () => {
    expect(homePageSource).toContain("this.realHomeRefreshInFlight &&");
    expect(homePageSource).toContain("!forceRefresh &&");
    expect(homePageSource).toContain("onHide() {");
    expect(homePageSource).toContain("const requests: Array<Promise<any>> = [");
    expect(homePageSource).toContain("this.loadRealParticipants(");
    expect(homePageSource).toContain("this.loadRealPoints(");
    expect(homePageSource).toContain("this.loadRealRank(");
    expect(homePageSource).toContain("Promise.all(requests).finally");
    expect(homePageSource).toContain("isCurrentRealParticipantRequest(");
  });

  test("离开首页时立即废弃仍在执行的首页刷新", () => {
    const onHideBody = homePageSource.match(/onHide\(\) \{([\s\S]*?)\n  \}/);
    expect(onHideBody).not.toBeNull();
    expect(onHideBody[1]).toContain("this.realHomeRequestVersion += 1");
    expect(onHideBody[1]).toContain("this.realHomeRefreshInFlight = false");
    expect(onHideBody[1]).toContain('this.realHomeRefreshKey = ""');
  });
});
