import { Sidebar } from "@/components/dashboard/sidebar";
import { ChildrenProvider } from "@/components/dashboard/children-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChildrenProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ChildrenProvider>
  );
}
