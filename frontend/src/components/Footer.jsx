// components/Footer.jsx

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/terms" className="hover:underline">
            Terms
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
