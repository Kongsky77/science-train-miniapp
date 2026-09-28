const {
  CHECK_IN_REGION_OPTIONS,
  resolveCheckInRegion,
} = require("../src/utils/check-in/CheckInRegion");

describe("打卡场馆地区筛选", () => {
  test("按业务要求提供全部、四川、重庆、贵州四个筛选项", () => {
    expect(CHECK_IN_REGION_OPTIONS).toEqual(["全部", "四川", "重庆", "贵州"]);
  });

  test.each([
    ["四川科技馆", "四川省成都市青羊区", "四川"],
    ["中国科技馆重庆分馆", "重庆市江北区", "重庆"],
    ["贵州省地质博物馆", "贵阳市观山湖区", "贵州"],
    ["地方科普馆", "遵义市红花岗区", "贵州"],
  ])("根据场馆名称和地址识别地区", (name, address, expected) => {
    expect(resolveCheckInRegion({ name, address })).toBe(expected);
  });

  test("无法识别的场馆不被误分到任一地区", () => {
    expect(resolveCheckInRegion({ name: "未命名场馆", address: "" })).toBeNull();
  });
});
