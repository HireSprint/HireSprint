import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import { ProductProvider } from "./context/productContext";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from 'primereact/passthrough/tailwind';


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
      <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <ProductProvider>
          <Header />
          {children}
        </ProductProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
