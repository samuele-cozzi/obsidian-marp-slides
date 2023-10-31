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
    adapter: new FileSystemAdapter,
    getConfig: () => { return "relative"; }
  }
});

export const FileSystemAdapter = jest.fn().mockImplementation(() => {
  let _path = "";
  return {
    constructor: () => {},
    write: (path: string, data: string) => { _path = path},
    getBasePath: () => { return _path; },
    getResourcePath: () => { return  `app://local/${normalizePath(_path)}?aaaa`; }
  }
});


export const normalizePath = jest.fn().mockImplementation((str: string) => { 
  return normalize(str)
})

function normalize (path: string) {
  if (typeof path !== 'string') {
    console.log(path);
    throw new TypeError('expected path to be a string');
  }

  if (path === '\\' || path === '/') return '/';

  const len = path.length;
  if (len <= 1) return path;

  // ensure that win32 namespaces has two leading slashes, so that the path is
  // handled properly by the win32 version of path.parse() after being normalized
  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
  let prefix = '';
  if (len > 4 && path[3] === '\\') {
    const ch = path[2];
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2);
      prefix = '//';
    }
  }

  const segs = path.split(/[/\\]+/);
  return prefix + segs.join('/');
}