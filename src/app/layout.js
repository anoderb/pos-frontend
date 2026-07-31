import "./globals.css";

export const metadata = {
  title: "Tokiva — Kasir Cerdas untuk UMKM Modern",
  description: "SaaS POS UMKM dengan AI Visual Scanner",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16A34A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('SW registered:', reg.scope); },
                    function(err) { console.log('SW registration failed:', err); }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
