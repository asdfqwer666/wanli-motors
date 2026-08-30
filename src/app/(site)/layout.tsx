import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TruckMatcher from "@/components/common/TruckMatcher";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <TruckMatcher />
    </div>
  );
}
