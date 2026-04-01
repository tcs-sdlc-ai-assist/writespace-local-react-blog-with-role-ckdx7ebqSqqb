export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-white text-lg font-bold tracking-wide">
            ✍️ WriteSpace
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}