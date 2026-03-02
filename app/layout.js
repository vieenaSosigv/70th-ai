import "./globals.css";

export const metadata = {
  title: "이순자 여사님 칠순 잔치에 초대합니다",
  description:
    "이순자 여사님의 칠순을 맞이하여 축하 잔치에 초대합니다. 2026년 8월 16일, 채림웨딩홀",
  openGraph: {
    title: "이순자 여사님 칠순 잔치 초대장 🌸",
    description:
      "고운 세월 칠십 년, 감사와 축하의 자리에 여러분을 초대합니다.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
