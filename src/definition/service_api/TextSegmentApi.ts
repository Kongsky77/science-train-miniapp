const TextSegmentApi = {
  prefix: '/api/',
  version: 'v1',
  // 预测分词
  predict: {
    method: 'post',
    requestUrl: '/text/segment/predict/public'
  }
}
export default TextSegmentApi
