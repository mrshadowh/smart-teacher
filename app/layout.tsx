import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'المعلم الذكي',
  description: 'منصة ذكية لمساعدة الطلاب على حل المسائل من خلال الصور والذكاء الاصطناعي',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
