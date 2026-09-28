const ProjectApi = {
  prefix: '/api/',
  version: 'v1',
  // 获取项目数据
  detail: {
    method: 'get',
    requestUrl: '/project/public/{id}'
  }
}
export default ProjectApi
