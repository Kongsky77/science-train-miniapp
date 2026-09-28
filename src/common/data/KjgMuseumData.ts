export interface KjgMuseum {
  id: string;
  name: string;
  region: "重庆" | "四川" | "贵州";
  city: string;
  address: string;
  shortIntroduction: string;
  categories: string[];
  officialIntroduction: string;
  visitorIntroduction: string;
  highlights: string[];
  checkInEnabled: boolean;
  checkInTask: string;
  latitude: number;
  longitude: number;
  rangeMeters: number;
  outboundUrl: string;
}

export const KJG_MUSEUMS: KjgMuseum[] = [
  {
    id: "cq-science-museum",
    name: "重庆科技馆",
    region: "重庆",
    city: "重庆市",
    address: "重庆市江北区",
    shortIntroduction: "从基础科学到航天交通，在互动展项中认识科技如何改变生活。",
    categories: ["综合科技", "基础科学", "航空航天", "防灾减灾"],
    officialIntroduction:
      "重庆科技馆面向公众开展科普教育，设置生活科技、防灾科技、交通科技、国防科技、宇航科技、基础科学等主题展厅，并设有儿童科学乐园等专题展区。",
    visitorIntroduction:
      "适合亲子家庭和青少年边看边体验。主题展厅较多，建议先选择两到三个最感兴趣的方向重点参观，并预留约 1.5 至 2 小时。",
    highlights: ["防灾科技", "交通科技", "宇航科技", "儿童科学乐园"],
    checkInEnabled: true,
    checkInTask:
      "从防灾、交通或宇航主题中选择一项最感兴趣的展项，拍下现场体验或观察记录。",
    latitude: 29.5746,
    longitude: 106.5777,
    rangeMeters: 500,
    outboundUrl: "",
  },
  {
    id: "sc-science-museum",
    name: "四川科技馆",
    region: "四川",
    city: "成都市",
    address: "四川省成都市青羊区",
    shortIntroduction: "通过可操作、可观察的展项，感受基础科学与前沿技术的联系。",
    categories: ["综合科技", "互动体验", "前沿科技", "科学启蒙"],
    officialIntroduction:
      "四川科技馆是一座面向公众提供常设展览、科普活动和互动体验的综合性科普场馆，注重用科学性、趣味性和参与性激发公众探索兴趣。",
    visitorIntroduction:
      "适合第一次接触科学互动展项的家庭和学生。建议结合现场开放情况选择可操作的展品，不必追求一次看完全部内容。",
    highlights: ["互动体验", "基础科学", "前沿科技", "亲子科普"],
    checkInEnabled: true,
    checkInTask:
      "选择一项可以亲手操作的互动展品，记录操作过程，并写下你观察到的一种科学现象。",
    latitude: 30.6599,
    longitude: 104.0658,
    rangeMeters: 500,
    outboundUrl: "",
  },
  {
    id: "gz-science-museum",
    name: "贵州科技馆",
    region: "贵州",
    city: "贵阳市",
    address: "贵州省贵阳市南明区",
    shortIntroduction: "聚焦月球探测、大数据与生命健康，呈现具有贵州特色的科学体验。",
    categories: ["综合科技", "月球探测", "大数据", "生命健康"],
    officialIntroduction:
      "贵州科技馆以科学教育为主要功能，展陈内容涵盖月球探测、智慧基础、人与健康、大数据和少儿科技等方向，突出贵州科技特色与公众参与体验。",
    visitorIntroduction:
      "如果对中国天眼、大数据或航天主题感兴趣，可以优先关注相关内容。亲子参观建议预留约 1.5 小时，并根据孩子兴趣灵活选择展区。",
    highlights: ["月球探测", "走进大数据", "人与健康", "少儿科技"],
    checkInEnabled: true,
    checkInTask:
      "从月球探测、大数据或健康主题中选择一项内容，拍下最想分享给朋友的科学发现。",
    latitude: 26.5737,
    longitude: 106.7135,
    rangeMeters: 500,
    outboundUrl: "",
  },
  {
    id: "cq-natural-history-museum",
    name: "重庆自然博物馆",
    region: "重庆",
    city: "重庆市",
    address: "重庆市北碚区",
    shortIntroduction: "沿着生命演化与地球变迁的线索，探索古生物、地质和生态多样性。",
    categories: ["自然历史", "古生物", "地球科学", "生态环境"],
    officialIntroduction:
      "场馆围绕自然历史收藏、展示与研究开展公众教育，以古生物、动植物和地质资源为重要内容，帮助观众理解生命演化与自然环境。",
    visitorIntroduction:
      "恐龙化石、动物标本和地球科学内容适合亲子共同探索，可以围绕一条主题线索慢慢观察，不必一次看完。",
    highlights: ["恐龙化石", "动物星球", "地球奥秘", "生态家园"],
    checkInEnabled: false,
    checkInTask: "",
    latitude: 0,
    longitude: 0,
    rangeMeters: 0,
    outboundUrl: "",
  },
  {
    id: "cq-industry-museum",
    name: "重庆工业博物馆",
    region: "重庆",
    city: "重庆市",
    address: "重庆市大渡口区",
    shortIntroduction: "在工业遗产中认识机械、制造与城市工业发展的历史脉络。",
    categories: ["工业科技", "机械制造", "工业遗产", "城市发展"],
    officialIntroduction:
      "场馆依托重庆工业遗产，展示近现代工业发展、代表性设备和制造技术，让工业历史与科学传播在真实空间中相互连接。",
    visitorIntroduction:
      "大型机械和工业建筑本身就是重要看点，适合从一件设备出发，观察材料、结构和动力方式的变化。",
    highlights: ["工业遗产", "动力机械", "制造技术", "城市工业史"],
    checkInEnabled: false,
    checkInTask: "",
    latitude: 0,
    longitude: 0,
    rangeMeters: 0,
    outboundUrl: "",
  },
  {
    id: "wansheng-science-museum",
    name: "万盛科技馆",
    region: "重庆",
    city: "重庆市",
    address: "重庆市万盛经开区",
    shortIntroduction: "围绕人工智能、防震减灾与机械运动，提供轻量而丰富的互动体验。",
    categories: ["综合科技", "人工智能", "机械运动", "防震减灾"],
    officialIntroduction:
      "场馆以探索科技、预见未来为主题，设置科技互动、防震减灾、节水展示、机械运动、生态体验和青少年科学活动等内容。",
    visitorIntroduction:
      "展区体量适中，适合把互动体验作为主线。参观时可以重点观察机械结构如何把一种运动转换为另一种运动。",
    highlights: ["科技互动", "防震减灾", "机械运动", "生态体验"],
    checkInEnabled: false,
    checkInTask: "",
    latitude: 0,
    longitude: 0,
    rangeMeters: 0,
    outboundUrl: "",
  },
  {
    id: "chengdu-natural-history-museum",
    name: "成都自然博物馆",
    region: "四川",
    city: "成都市",
    address: "四川省成都市成华区",
    shortIntroduction: "以地质、古生物与自然环境为主线，读懂脚下大地和生命演化。",
    categories: ["自然历史", "地质科学", "古生物", "生物多样性"],
    officialIntroduction:
      "场馆以地球科学和自然历史为核心，通过地质标本、古生物化石与生态主题展示，构建从地球形成到生命演化的认知线索。",
    visitorIntroduction:
      "建议从地球形成、生命出现到生物多样性依次参观，孩子更容易建立完整的时间概念。",
    highlights: ["地球科学", "古生物化石", "矿物世界", "生命演化"],
    checkInEnabled: false,
    checkInTask: "",
    latitude: 0,
    longitude: 0,
    rangeMeters: 0,
    outboundUrl: "",
  },
  {
    id: "zigong-dinosaur-museum",
    name: "自贡恐龙博物馆",
    region: "四川",
    city: "自贡市",
    address: "四川省自贡市大安区",
    shortIntroduction: "在恐龙化石埋藏现场，认识古生物发掘、研究与地质环境。",
    categories: ["古生物", "恐龙化石", "遗址保护", "地质科学"],
    officialIntroduction:
      "场馆依托恐龙化石遗址开展收藏、研究、展示与科普教育，以丰富的化石材料呈现恐龙世界和古环境信息。",
    visitorIntroduction:
      "除了观察恐龙骨架，也值得留意化石埋藏状态和修复痕迹，它们能帮助理解古生物学家如何从证据还原历史。",
    highlights: ["恐龙化石", "埋藏遗址", "化石修复", "古环境"],
    checkInEnabled: false,
    checkInTask: "",
    latitude: 0,
    longitude: 0,
    rangeMeters: 0,
    outboundUrl: "",
  },
  {
    id: "china-sky-eye-base",
    name: "中国天眼科普基地",
    region: "贵州",
    city: "黔南州",
    address: "贵州省黔南州平塘县",
    shortIntroduction: "以 FAST 为核心，了解射电天文、大科学装置与宇宙探索。",
    categories: ["天文学", "射电科学", "大科学装置", "科学家精神"],
    officialIntroduction:
      "基地围绕中国天眼 FAST 的科学原理、工程建设和天文探索开展科普展示，并通过天文体验内容连接重大科技设施与公众教育。",
    visitorIntroduction:
      "适合先了解射电望远镜如何接收宇宙信号，再观察巨大工程结构。到访前应重点确认预约、交通和电子设备管理要求。",
    highlights: ["中国天眼 FAST", "射电天文", "天文体验", "南仁东精神"],
    checkInEnabled: false,
    checkInTask: "",
    latitude: 0,
    longitude: 0,
    rangeMeters: 0,
    outboundUrl: "",
  },
  {
    id: "guizhou-third-front-museum",
    name: "贵州三线建设博物馆",
    region: "贵州",
    city: "六盘水市",
    address: "贵州省六盘水市钟山区",
    shortIntroduction: "从工业设施与建设记忆中，理解工程技术和区域工业发展的联系。",
    categories: ["工业科技", "工程建设", "工业遗产", "科学家精神"],
    officialIntroduction:
      "场馆以贵州三线建设历史为主要内容，通过工业实物、场景与文献呈现工程建设、技术发展和产业布局的时代轨迹。",
    visitorIntroduction:
      "适合结合真实设备理解工业生产过程，也可以从建设者故事中观察工程技术如何影响一座城市。",
    highlights: ["三线建设", "工业设备", "工程技术", "建设者故事"],
    checkInEnabled: false,
    checkInTask: "",
    latitude: 0,
    longitude: 0,
    rangeMeters: 0,
    outboundUrl: "",
  },
];

export const KJG_CHECK_IN_VENUES: KjgMuseum[] = KJG_MUSEUMS.filter(
  (museum) => museum.checkInEnabled
);

export function getKjgMuseumById(id: string): KjgMuseum | null {
  return KJG_MUSEUMS.find((museum) => museum.id === id) || null;
}
