import Sidebar from "@/components/sidebar";

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen pl-72">
      <Sidebar />
      {props.children}
    </main>
  );
}
