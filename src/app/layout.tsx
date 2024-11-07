import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import { ProductProvider } from "./context/productContext";


export const metadata: Metadata = {
  title: "Hire Sprint",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <ProductProvider>
          <Header />
          {children}
        </ProductProvider>
      </body>
    </html>
  );
}
