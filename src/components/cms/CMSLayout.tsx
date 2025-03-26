import { CMSUser } from "@/types/cms";
import Header from "./Header";

interface CMSLayoutProps {
  children: React.ReactNode;
  user: CMSUser | null;
  onLogout: () => void;
}

export default function CMSLayout({
  children,
  user,
  onLogout,
}: CMSLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </main>
    </div>
  );
}
