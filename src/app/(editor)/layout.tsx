export const metadata = {
  title: "Editor"
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col w-screen h-screen">{children}</div>;
}
