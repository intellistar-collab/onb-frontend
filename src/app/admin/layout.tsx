import AdminLayout from "@/components/admin/admin-layout";
import { ThemeProvider } from "@/contexts/theme-context";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  );
}
