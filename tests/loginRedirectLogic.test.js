const {
  resolvePostLoginPath,
} = require("../src/logic/navigation/LoginRedirectLogic");

describe("登录后跳转", () => {
  test("已下线荣誉页链接登录后回到首页", () => {
    expect(resolvePostLoginPath("/pages/profile/index")).toBe(
      "/pages/tab/index"
    );
    expect(resolvePostLoginPath("/pages/profile/index?currentId=123")).toBe(
      "/pages/tab/index"
    );
  });

  test("其他业务页面仍按原路径返回", () => {
    expect(
      resolvePostLoginPath("/pages/kjgActivityDetail/index?openRegistration=1")
    ).toBe("/pages/kjgActivityDetail/index?openRegistration=1");
  });
});
