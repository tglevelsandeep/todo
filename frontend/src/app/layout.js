import "./globals.css";

export const metadata = {
  title: "Taskflow — Modern Todo App",
  description:
    "A beautiful, full-stack todo application with authentication. Organize your tasks with style.",
  keywords: ["todo", "task manager", "productivity", "nextjs"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
