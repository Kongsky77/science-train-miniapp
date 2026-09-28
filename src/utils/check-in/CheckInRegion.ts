export const CHECK_IN_REGION_OPTIONS = ["全部", "四川", "重庆", "贵州"];

const SICHUAN_PATTERN =
  /四川|成都|绵阳|德阳|乐山|自贡|攀枝花|泸州|遂宁|内江|南充|宜宾|广安|达州|巴中|雅安|眉山|资阳|阿坝|甘孜|凉山/;
const CHONGQING_PATTERN =
  /重庆|万州|涪陵|渝中|大渡口|江北|沙坪坝|九龙坡|南岸|北碚|綦江|大足|渝北|巴南|黔江|长寿|江津|合川|永川|南川|璧山|铜梁|潼南|荣昌|开州|梁平|武隆|城口|丰都|垫江|忠县|云阳|奉节|巫山|巫溪|石柱|秀山|酉阳|彭水/;
const GUIZHOU_PATTERN =
  /贵州|贵阳|遵义|六盘水|安顺|毕节|铜仁|黔东南|黔南|黔西南|六枝|平坝/;

export const resolveCheckInRegion = (venue) => {
  const location = `${venue.name || ""} ${venue.address || ""}`;
  if (SICHUAN_PATTERN.test(location)) return "四川";
  if (CHONGQING_PATTERN.test(location)) return "重庆";
  if (GUIZHOU_PATTERN.test(location)) return "贵州";
  return null;
};
