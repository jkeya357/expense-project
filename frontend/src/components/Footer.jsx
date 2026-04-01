const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

        <p>
          &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>

        <div className="flex gap-6 mt-3 md:mt-0">
          <a href="/terms" className="hover:text-gray-900 transition">
            Terms
          </a>
          <a href="/privacy" className="hover:text-gray-900 transition">
            Privacy
          </a>
          <a href="/contact" className="hover:text-gray-900 transition">
            Contact
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;