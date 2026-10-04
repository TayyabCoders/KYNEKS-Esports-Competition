import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Kynexs
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-gray-600">
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
