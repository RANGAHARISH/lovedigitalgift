import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { getCurrentUser } from "@/lib/auth";

// Every page in this group reads the session cookie for the navbar, so render
// them per request rather than trying to prerender them at build time.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
