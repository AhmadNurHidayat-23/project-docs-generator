import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../style.css';
export const metadata: Metadata = { title: 'Project Docs Generator', description: 'Dokumentasi teknis dari metadata dan struktur proyek.' };
export default function Layout({ children }: { children: ReactNode }) { return <html lang="id"><body>{children}</body></html>; }
