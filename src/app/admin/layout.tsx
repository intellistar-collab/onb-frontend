import AdminLayout from "@/components/admin/admin-layout";
import { ThemeProvider } from "@/contexts/theme-context";
import "@/styles/admin-theme.css";

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
