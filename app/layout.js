import "./globals.css";

export const metadata = {
  title: "心欣然 · AI个性化减肥冥想",
  description: "AI personalized meditation MVP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
