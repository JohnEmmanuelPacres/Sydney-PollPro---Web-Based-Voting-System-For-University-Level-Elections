import { AdminOrgProvider } from './AdminedOrgContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminOrgProvider>{children}</AdminOrgProvider>;
}