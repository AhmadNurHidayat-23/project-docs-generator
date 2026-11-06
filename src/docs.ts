import { paths, parseManifest, type Manifest } from './project';
export interface Input { files: string; packageText: string; composerText: string; packagePath?: string; composerPath?: string }
const safe = (s: string) => s.replace(/[\r\n]/g, ' ').replaceAll('\u0060', "'").replace(/[<>|]/g, '');
const tech: Record<string,string> = { react:'React', vue:'Vue.js', next:'Next.js', 'laravel/framework':'Laravel', '@inertiajs/react':'Inertia.js', typescript:'TypeScript', vite:'Vite', tailwindcss:'Tailwind CSS', express:'Express' };
export function generate(input: Input) {
  const files = paths(input.files); const pkg = input.packageText.trim() ? parseManifest(input.packageText) : null, composer = input.composerText.trim() ? parseManifest(input.composerText) : null;
  if (!files.length && !pkg && !composer) throw new Error('Impor struktur atau metadata terlebih dahulu.');
  const name = pkg?.name || composer?.name || 'Dokumentasi proyek'; const description = pkg?.description || composer?.description;
  const lines = ['# ' + safe(name), '', description ? safe(description) : '> Deskripsi belum tersedia dalam metadata. Lengkapi setelah meninjau proyek.', '', '## Teknologi', ''];
  const deps = [ ...Object.entries(pkg?.dependencies || {}), ...Object.entries(pkg?.devDependencies || {}), ...Object.entries(composer?.require || {}), ...Object.entries(composer?.['require-dev'] || {}) ];
  const found = [...new Set(deps.filter(([name]) => tech[name]).map(([name, version]) => '- ' + tech[name] + ' — deklarasi ' + safe(version)))];
  lines.push(...(found.length ? found : ['- Belum ada teknologi yang dapat dipastikan dari deklarasi dependensi.']));
  if (pkg?.engines) for (const [name,value] of Object.entries(pkg.engines)) lines.push('- Runtime ' + safe(name) + ': ' + safe(value) + ' (engines)');
  if (composer?.require?.php) lines.push('- PHP: ' + safe(composer.require.php) + ' (require.php)');
  lines.push('', 'Teknologi di atas dideteksi dari deklarasi metadata, bukan pembuktian penggunaan saat runtime.', '', '## Instalasi', '');
  if (pkg) { const prefix = (input.packagePath || 'package.json').replace(/package\.json$/, ''); const lock = files.includes(prefix + 'package-lock.json'); lines.push('Dari folder ' + safe(prefix || './') + ':', '', '\u0060\u0060\u0060sh', lock ? 'npm ci' : 'npm install'); if (pkg.scripts?.dev !== undefined) lines.push('npm run dev'); else if (pkg.scripts?.start !== undefined) lines.push('npm run start'); lines.push('\u0060\u0060\u0060', ''); }
  if (composer) { const prefix = (input.composerPath || 'composer.json').replace(/composer\.json$/, ''); lines.push('Dari folder ' + safe(prefix || './') + ':', '', '\u0060\u0060\u0060sh', 'composer install'); if (composer.require?.['laravel/framework'] && files.includes(prefix + 'artisan') && files.includes(prefix + '.env.example')) lines.push('cp .env.example .env', 'php artisan key:generate'); lines.push('\u0060\u0060\u0060', ''); }
  if (!pkg && !composer) lines.push('Belum ada manifest untuk menentukan langkah instalasi.', '');
  const scripts = Object.keys(pkg?.scripts || {}).filter(name => /^[a-zA-Z0-9:._-]+$/.test(name));
  if (scripts.length) { lines.push('## Script yang dideklarasikan', '', ...scripts.map(name => '- \u0060npm run ' + name + '\u0060'), ''); }
  lines.push('## Dependensi utama', '', '| Paket | Versi deklarasi | Sumber |', '| --- | --- | --- |');
  function table(manifest: Manifest | null, key: 'dependencies' | 'require', source: string) { for (const [name,version] of Object.entries(manifest?.[key] || {})) lines.push('| ' + safe(name) + ' | ' + safe(version) + ' | ' + safe(source) + ' |'); }
  table(pkg, 'dependencies', input.packagePath || 'package.json'); table(composer, 'require', input.composerPath || 'composer.json');
  if (!Object.keys(pkg?.dependencies || {}).length && !Object.keys(composer?.require || {}).length) lines.push('| Belum tersedia | — | — |');
  lines.push('', '## Struktur proyek', '', '\u0060\u0060\u0060text', ...(files.length ? files.slice(0, 150).map(safe) : ['Struktur belum diimpor.']), '\u0060\u0060\u0060', '');
  if (files.length > 150) lines.push('Menampilkan 150 dari ' + files.length + ' path.', '');
  lines.push('## Catatan verifikasi', '', '- Draft ini hanya memakai metadata dan nama file yang diimpor.', '- Fitur bisnis, API, dan konfigurasi deployment belum disimpulkan dari source code.', '- Perintah instalasi merupakan draft; script proyek tidak dijalankan oleh generator.', '- Tinjau dan lengkapi dokumentasi sebelum digunakan.');
  return lines.join('\n');
}
