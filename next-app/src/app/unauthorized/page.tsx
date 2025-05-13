export default function UnauthorizedPage() {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h1 className="text-4xl font-bold text-red-600">🚫 Нямате достъп</h1>
          <p className="mt-4 text-lg">Тази страница е защитена и изисква специални права.</p>
          <a href="/login" className="mt-6 inline-block text-blue-600 underline">
            🔐 Върни се към вход
          </a>
        </div>
      </div>
    );
  }
  