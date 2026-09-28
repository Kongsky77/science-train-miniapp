

export class ZGXAreaCodeOpts {
  static getCityOpts(): Array<CityAreaCode> {
    return CityAreaCodeMap.get(SiChuanCities.SI_CHUAN)
  }

  static getAreaOpts(city: SiChuanCities | string): Array<CityAreaCode> {
    return CityAreaCodeMap.get(city)
  }
}

export class CityAreaCode {
  value: string
  text: string
  constructor(value, text) {
    this.value = value;
    this.text = text;
  }
}

export enum SiChuanCities {
  SI_CHUAN = '510000',
  CHENG_DU = '510100',
  ZI_GONG = '510300',
  PAN_ZHI_HUA = '510400',
  LU_ZHOU = '510500',
  DE_YANG = '510600',
  MIAN_YANG = '510700',
  GUANG_YUAN = '510800',
  SUI_NING = '510900',
  NEI_JIANG = '511000',
  LE_SHAN = '511100',
  NAN_CHONG = '511300',
  MEI_SHAN = '511400',
  YI_BIN = '511500',
  GUANG_AN = '511600',
  DA_ZHOU = '511700',
  YA_AN = '511800',
  BA_ZHONG = '511900',
  ZI_YANG = '512000',
  A_BA = '513200',
  GAN_ZI = '513300',
  LIANG_SHAN = '513400'
}


const CityAreaCodeMap: Map<string,Array<CityAreaCode>> = new Map(
  [
    [SiChuanCities.SI_CHUAN, [new CityAreaCode('510100', '成都市'), new CityAreaCode('510300', '自贡市'), new CityAreaCode('510400', '攀枝花市'), new CityAreaCode('510500', '泸州市'), new CityAreaCode('510600', '德阳市'), new CityAreaCode('510700', '绵阳市'), new CityAreaCode('510800', '广元市'), new CityAreaCode('510900', '遂宁市'), new CityAreaCode('511000', '内江市'), new CityAreaCode('511100', '乐山市'), new CityAreaCode('511300', '南充市'), new CityAreaCode('511400', '眉山市'), new CityAreaCode('511500', '宜宾市'), new CityAreaCode('511600', '广安市'), new CityAreaCode('511700', '达州市'), new CityAreaCode('511800', '雅安市'), new CityAreaCode('511900', '巴中市'), new CityAreaCode('512000', '资阳市'), new CityAreaCode('513200', '阿坝藏族羌族自治州'), new CityAreaCode('513300', '甘孜藏族自治州'), new CityAreaCode('513400', '凉山彝族自治州')]],
    [SiChuanCities.CHENG_DU, [new CityAreaCode('510186', '天府新区'), new CityAreaCode('510104', '锦江区'), new CityAreaCode('510105', '青羊区'), new CityAreaCode('510106', '金牛区'), new CityAreaCode('510107', '武侯区'), new CityAreaCode('510108', '成华区'), new CityAreaCode('510187', '高新区'), new CityAreaCode('510112', '龙泉驿区'), new CityAreaCode('510113', '青白江区'), new CityAreaCode('510114', '新都区'), new CityAreaCode('510115', '温江区'), new CityAreaCode('510121', '金堂县'), new CityAreaCode('510122', '双流区'), new CityAreaCode('510124', '郫都区'), new CityAreaCode('510129', '大邑县'), new CityAreaCode('510131', '蒲江县'), new CityAreaCode('510132', '新津县'), new CityAreaCode('510181', '都江堰市'), new CityAreaCode('510182', '彭州市'), new CityAreaCode('510183', '邛崃市'), new CityAreaCode('510184', '崇州市'), new CityAreaCode('510185', '其它区'), new CityAreaCode('512081', '简阳市')]],
    [SiChuanCities.ZI_GONG, [new CityAreaCode('510302', '自流井区'), new CityAreaCode('510303', '贡井区'), new CityAreaCode('510304', '大安区'), new CityAreaCode('510311', '沿滩区'), new CityAreaCode('510321', '荣县'), new CityAreaCode('510322', '富顺县'), new CityAreaCode('510323', '其它区')]],
    [SiChuanCities.PAN_ZHI_HUA, [new CityAreaCode('510402', '东区'), new CityAreaCode('510403', '西区'), new CityAreaCode('510411', '仁和区'), new CityAreaCode('510421', '米易县'), new CityAreaCode('510422', '盐边县'), new CityAreaCode('510423', '其它区')]],
    [SiChuanCities.LU_ZHOU, [new CityAreaCode('510502', '江阳区'), new CityAreaCode('510503', '纳溪区'), new CityAreaCode('510504', '龙马潭区'), new CityAreaCode('510521', '泸县'), new CityAreaCode('510522', '合江县'), new CityAreaCode('510524', '叙永县'), new CityAreaCode('510525', '古蔺县'), new CityAreaCode('510526', '其它区')]],
    [SiChuanCities.DE_YANG, [new CityAreaCode('510603', '旌阳区'), new CityAreaCode('510623', '中江县'), new CityAreaCode('510626', '罗江区'), new CityAreaCode('510681', '广汉市'), new CityAreaCode('510682', '什邡市'), new CityAreaCode('510683', '绵竹市'), new CityAreaCode('510684', '其它区')]],
    [SiChuanCities.MIAN_YANG, [new CityAreaCode('510703', '涪城区'), new CityAreaCode('510704', '游仙区'), new CityAreaCode('510722', '三台县'), new CityAreaCode('510723', '盐亭县'), new CityAreaCode('510724', '安州区'), new CityAreaCode('510725', '梓潼县'), new CityAreaCode('510726', '北川羌族自治县'), new CityAreaCode('510727', '平武县'), new CityAreaCode('510781', '江油市'), new CityAreaCode('510782', '其它区')]],
    [SiChuanCities.GUANG_YUAN, [new CityAreaCode('510802', '利州区'), new CityAreaCode('510811', '昭化区'), new CityAreaCode('510812', '朝天区'), new CityAreaCode('510821', '旺苍县'), new CityAreaCode('510822', '青川县'), new CityAreaCode('510823', '剑阁县'), new CityAreaCode('510824', '苍溪县'), new CityAreaCode('510825', '其它区')]],
    [SiChuanCities.SUI_NING, [new CityAreaCode('510903', '船山区'), new CityAreaCode('510904', '安居区'), new CityAreaCode('510921', '蓬溪县'), new CityAreaCode('510922', '射洪县'), new CityAreaCode('510923', '大英县'), new CityAreaCode('510924', '其它区')]],
    [SiChuanCities.NEI_JIANG, [new CityAreaCode('511002', '市中区'), new CityAreaCode('511011', '东兴区'), new CityAreaCode('511024', '威远县'), new CityAreaCode('511025', '资中县'), new CityAreaCode('511028', '隆昌市'), new CityAreaCode('511029', '其它区')]],
    [SiChuanCities.LE_SHAN, [new CityAreaCode('511102', '市中区'), new CityAreaCode('511111', '沙湾区'), new CityAreaCode('511112', '五通桥区'), new CityAreaCode('511113', '金口河区'), new CityAreaCode('511123', '犍为县'), new CityAreaCode('511124', '井研县'), new CityAreaCode('511126', '夹江县'), new CityAreaCode('511129', '沐川县'), new CityAreaCode('511132', '峨边彝族自治县'), new CityAreaCode('511133', '马边彝族自治县'), new CityAreaCode('511181', '峨眉山市'), new CityAreaCode('511182', '其它区')]],
    [SiChuanCities.NAN_CHONG, [new CityAreaCode('511302', '顺庆区'), new CityAreaCode('511303', '高坪区'), new CityAreaCode('511304', '嘉陵区'), new CityAreaCode('511321', '南部县'), new CityAreaCode('511322', '营山县'), new CityAreaCode('511323', '蓬安县'), new CityAreaCode('511324', '仪陇县'), new CityAreaCode('511325', '西充县'), new CityAreaCode('511381', '阆中市'), new CityAreaCode('511382', '其它区')]],
    [SiChuanCities.MEI_SHAN, [new CityAreaCode('511402', '东坡区'), new CityAreaCode('511421', '仁寿县'), new CityAreaCode('511422', '彭山区'), new CityAreaCode('511423', '洪雅县'), new CityAreaCode('511424', '丹棱县'), new CityAreaCode('511425', '青神县'), new CityAreaCode('511426', '其它区')]],
    [SiChuanCities.YI_BIN, [new CityAreaCode('511502', '翠屏区'), new CityAreaCode('511521', '叙州区'), new CityAreaCode('511522', '南溪区'), new CityAreaCode('511523', '江安县'), new CityAreaCode('511524', '长宁县'), new CityAreaCode('511525', '高县'), new CityAreaCode('511526', '珙县'), new CityAreaCode('511527', '筠连县'), new CityAreaCode('511528', '兴文县'), new CityAreaCode('511529', '屏山县'), new CityAreaCode('511530', '其它区')]],
    [SiChuanCities.GUANG_AN, [new CityAreaCode('511602', '广安区'), new CityAreaCode('511603', '前锋区'), new CityAreaCode('511621', '岳池县'), new CityAreaCode('511622', '武胜县'), new CityAreaCode('511623', '邻水县'), new CityAreaCode('511681', '华蓥市'), new CityAreaCode('511683', '其它区')]],
    [SiChuanCities.DA_ZHOU, [new CityAreaCode('511702', '通川区'), new CityAreaCode('511721', '达川区'), new CityAreaCode('511722', '宣汉县'), new CityAreaCode('511723', '开江县'), new CityAreaCode('511724', '大竹县'), new CityAreaCode('511725', '渠县'), new CityAreaCode('511781', '万源市'), new CityAreaCode('511782', '其它区')]],
    [SiChuanCities.YA_AN, [new CityAreaCode('511802', '雨城区'), new CityAreaCode('511821', '名山区'), new CityAreaCode('511822', '荥经县'), new CityAreaCode('511823', '汉源县'), new CityAreaCode('511824', '石棉县'), new CityAreaCode('511825', '天全县'), new CityAreaCode('511826', '芦山县'), new CityAreaCode('511827', '宝兴县'), new CityAreaCode('511828', '其它区')]],
    [SiChuanCities.BA_ZHONG, [new CityAreaCode('511902', '巴州区'), new CityAreaCode('511903', '恩阳区'), new CityAreaCode('511921', '通江县'), new CityAreaCode('511922', '南江县'), new CityAreaCode('511923', '平昌县'), new CityAreaCode('511924', '其它区')]],
    [SiChuanCities.ZI_YANG, [new CityAreaCode('512002', '雁江区'), new CityAreaCode('512021', '安岳县'), new CityAreaCode('512022', '乐至县'), new CityAreaCode('512082', '其它区')]],
    [SiChuanCities.A_BA, [new CityAreaCode('513221', '汶川县'), new CityAreaCode('513222', '理县'), new CityAreaCode('513223', '茂县'), new CityAreaCode('513224', '松潘县'), new CityAreaCode('513225', '九寨沟县'), new CityAreaCode('513226', '金川县'), new CityAreaCode('513227', '小金县'), new CityAreaCode('513228', '黑水县'), new CityAreaCode('513229', '马尔康市'), new CityAreaCode('513230', '壤塘县'), new CityAreaCode('513231', '阿坝县'), new CityAreaCode('513232', '若尔盖县'), new CityAreaCode('513233', '红原县'), new CityAreaCode('513234', '其它区')]],
    [SiChuanCities.GAN_ZI, [new CityAreaCode('513321', '康定市'), new CityAreaCode('513322', '泸定县'), new CityAreaCode('513323', '丹巴县'), new CityAreaCode('513324', '九龙县'), new CityAreaCode('513325', '雅江县'), new CityAreaCode('513326', '道孚县'), new CityAreaCode('513327', '炉霍县'), new CityAreaCode('513328', '甘孜县'), new CityAreaCode('513329', '新龙县'), new CityAreaCode('513330', '德格县'), new CityAreaCode('513331', '白玉县'), new CityAreaCode('513332', '石渠县'), new CityAreaCode('513333', '色达县'), new CityAreaCode('513334', '理塘县'), new CityAreaCode('513335', '巴塘县'), new CityAreaCode('513336', '乡城县'), new CityAreaCode('513337', '稻城县'), new CityAreaCode('513338', '得荣县'), new CityAreaCode('513339', '其它区')]],
    [SiChuanCities.LIANG_SHAN, [new CityAreaCode('513401', '西昌市'), new CityAreaCode('513422', '木里藏族自治县'), new CityAreaCode('513423', '盐源县'), new CityAreaCode('513424', '德昌县'), new CityAreaCode('513425', '会理县'), new CityAreaCode('513426', '会东县'), new CityAreaCode('513427', '宁南县'), new CityAreaCode('513428', '普格县'), new CityAreaCode('513429', '布拖县'), new CityAreaCode('513430', '金阳县'), new CityAreaCode('513431', '昭觉县'), new CityAreaCode('513432', '喜德县'), new CityAreaCode('513433', '冕宁县'), new CityAreaCode('513434', '越西县'), new CityAreaCode('513435', '甘洛县'), new CityAreaCode('513436', '美姑县'), new CityAreaCode('513437', '雷波县'), new CityAreaCode('513438', '其它区')]],
  ]
)