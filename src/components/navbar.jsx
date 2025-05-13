import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-4">
            <div className="absolute w-8 h-4 bg-red-500 rounded-full"></div>
            <div className="absolute w-4 h-4 right-0 bg-yellow-400 rounded-full"></div>
          </div>
          <span className="font-bold text-xl text-blue-600">MedRem</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/features" className="text-gray-600 hover:text-blue-600">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-gray-600 hover:text-blue-600">
            Login
          </Link>
          <Link
            href="/get-started"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
