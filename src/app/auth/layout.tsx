export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome to Drizzle Dummy E-commerce
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your one-stop shop for all your needs
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
