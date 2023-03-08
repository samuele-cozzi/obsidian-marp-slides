// Import this named export into your test file:
export const TFile = jest.fn().mockImplementation(() => {
  return {
    constructor: () => {},
    path: String,
    parent: () => new TFile,
    vault: new Vault()
  };
});

export const Vault = jest.fn().mockImplementation(() => {
  return {
    constructor: () => {},
    adapter: new FileSystemAdapter
  }
});

export const FileSystemAdapter = jest.fn().mockImplementation(() => {
  let _path = "";
  return {
    constructor: () => {},
    write: (path: string, data: string) => { _path = path},
    getBasePath: () => { return _path; }
  }
});


export const normalizePath = jest.fn().mockImplementation((str: string) => { 
  const normalize = require('normalize-path');
  return normalize(str)
})