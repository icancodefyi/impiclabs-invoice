import { SnifferShell } from "@/components/sniffer/sniffer-shell"

export default function SnifferMainLayout({ children }: { children: React.ReactNode }) {
  return <SnifferShell>{children}</SnifferShell>
}
