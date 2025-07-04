import { ElectionProvider } from '../components/election-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ElectionProvider>
      {children} {/* Now ALL child pages can use useElection() */}
    </ElectionProvider>
  );
}