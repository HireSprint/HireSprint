import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import { ProductProvider } from "./context/productContext";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { CategoryProvider } from "@/app/context/categoryContext";
import { AuthProvider } from "./components/provider/authprovider";
import { RouteGuard } from "./components/provider/routeGuard";
import SendModal from "./components/sendModal";
import "./styles/fonts.css";

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
      <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
          <AuthProvider>
            <RouteGuard>
              <CategoryProvider>
                <ProductProvider>
                  <div className="grid grid-rows-[min-content_1fr] h-screen">
                    <Header />
                    <SendModal />
                    {children}
                  </div>
                </ProductProvider>
              </CategoryProvider>
            </RouteGuard>
          </AuthProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
