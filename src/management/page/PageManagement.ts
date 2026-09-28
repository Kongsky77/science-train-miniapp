const pagePathMap = {
  'addChild': '/pages/writeChildInfo/index'
}

export default class PageManagement {
  private static _instance
  path = ''

  public static getInstance() {
    if(!this._instance) {
      this._instance = new PageManagement()
    }
    return this._instance;
  }

  getPath(name: string) {
    return pagePathMap[name] || ''
  }

  setPagePath(path: string) {
    this.path = path
  }

  getPagePath() {
    return this.path
  }
}
