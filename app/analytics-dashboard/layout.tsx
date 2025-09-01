export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  )
}
