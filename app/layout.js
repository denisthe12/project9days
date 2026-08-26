import "./globals.css";

export const metadata = {
  title: "API Demo",
  description: "Gemini и погода",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
