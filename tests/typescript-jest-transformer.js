const typescript = require("typescript");

module.exports = {
  process(source, filename) {
    return typescript.transpileModule(source, {
      compilerOptions: {
        esModuleInterop: true,
        module: typescript.ModuleKind.CommonJS,
        target: typescript.ScriptTarget.ES2018,
      },
      fileName: filename,
    }).outputText;
  },
};
