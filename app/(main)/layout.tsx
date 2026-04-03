import TopBar from "@/components/ui/TopBar";
import BottomNav from "@/components/ui/BottomNav";
import { getCurrentUser } from "@/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const friendCoins = user?.friendCoins ?? 0;

  return (
    <div className="min-h-screen bg-bg-base">
      <TopBar friendCoins={friendCoins} />
      <main className="mx-auto max-w-[430px] min-h-screen pt-16 pb-24 px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
