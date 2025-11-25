// 这个根 layout 只是一个壳，真正的内容在 [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
