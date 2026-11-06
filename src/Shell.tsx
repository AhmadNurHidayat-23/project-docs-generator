'use client';
import { useEffect, useState, type ReactNode } from 'react';
export default function Shell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(localStorage.getItem('theme') === 'dark'); }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  return <><header><span className="brand"><b>09</b>DEVELOPER / TOOLS</span><div className="row"><span className="pill">RUANG KERJA LOKAL</span><button onClick={() => { localStorage.setItem('theme', dark ? 'light' : 'dark'); setDark(!dark); }} aria-label="Ganti tema">{dark ? 'Terang' : 'Gelap'}</button></div></header><main><div className="intro"><div><div className="eyebrow">Alat pengembangan · 09 / 10</div><h1>Project Docs Generator</h1><p>Ubah struktur file dan metadata proyek menjadi draft dokumentasi teknis yang dapat ditelusuri sumbernya.</p></div><span className="tag">DIBUAT UNTUK BEKERJA.</span></div>{children}<footer className="note"><span>Project Docs Generator / AhmadNurHidayat-23</span><span>File tidak diunggah dan script proyek tidak dieksekusi.</span></footer></main></>;
}
