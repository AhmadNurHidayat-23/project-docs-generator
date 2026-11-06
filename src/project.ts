export interface Manifest { name?: string; description?: string; dependencies?: Record<string,string>; devDependencies?: Record<string,string>; require?: Record<string,string>; 'require-dev'?: Record<string,string>; scripts?: Record<string,unknown>; engines?: Record<string,string> }
export function parseManifest(text: string): Manifest {
  if (text.length > 1000000) throw new Error('Metadata maksimal 1 MB.');
  const data = JSON.parse(text); if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Metadata harus berupa object JSON.');
  for (const key of ['name','description']) if (data[key] !== undefined && typeof data[key] !== 'string') throw new Error(key + ' harus berupa string.');
  for (const key of ['dependencies','devDependencies','require','require-dev','engines']) if (data[key] !== undefined && (!data[key] || typeof data[key] !== 'object' || Array.isArray(data[key]) || Object.values(data[key]).some(v => typeof v !== 'string'))) throw new Error('Deklarasi ' + key + ' tidak valid.');
  if (data.scripts !== undefined && (!data.scripts || typeof data.scripts !== 'object' || Array.isArray(data.scripts))) throw new Error('scripts harus berupa object.');
  return { name: data.name, description: data.description, dependencies: data.dependencies, devDependencies: data.devDependencies, require: data.require, 'require-dev': data['require-dev'], scripts: data.scripts, engines: data.engines };
}
const ignored = new Set(['node_modules','vendor','.git','.next','dist','build','coverage']);
export function paths(text: string): string[] {
  const list = text.split(/\r?\n/).map(s => s.trim().replaceAll('\\', '/')).filter(Boolean);
  const kept = list.filter(p => !p.split('/').some(x => ignored.has(x) || x.startsWith('.env') && x !== '.env.example'));
  if (kept.length > 10000) throw new Error('Struktur maksimal 10.000 path setelah penyaringan.');
  if (list.some(p => p.length > 500 || p.includes('..') || /[\x00-\x1f]/.test(p) || p.startsWith('/') || /^[A-Za-z]:/.test(p))) throw new Error('Gunakan path relatif proyek yang valid.');
  return [...new Set(kept)].sort();
}
export async function readFolder(files: File[]) {
  if (files.length > 100000) throw new Error('Folder maksimal 100.000 file sebelum penyaringan.');
  const relative = (f: File) => (f.webkitRelativePath || f.name).split('/').slice(1).join('/') || f.name;
  const list = paths(files.map(relative).join('\n'));
  const pick = (name: string) => files.filter(f => f.name === name && list.includes(relative(f))).sort((a,b) => relative(a).split('/').length - relative(b).split('/').length)[0];
  const read = async (f?: File) => { if (!f) return ''; if (f.size > 1000000) throw new Error('Metadata maksimal 1 MB.'); return f.text(); };
  const pkg = pick('package.json'), composer = pick('composer.json');
  return { files: list, packageText: await read(pkg), composerText: await read(composer), packagePath: pkg ? relative(pkg) : '', composerPath: composer ? relative(composer) : '' };
}
