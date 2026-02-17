import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = ({ loading }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          {loading ? (
            <div className="h-6 w-32 bg-gray-700 rounded mb-3 animate-pulse"></div>
          ) : (
            <h3 className="text-white font-bold text-lg mb-3">Cartify</h3>
          )}
          <p className="text-sm">
            {loading ? <span className="h-4 w-full bg-gray-700 rounded animate-pulse block"></span> :
              "Your one-stop shop for latest fashion, gadgets & lifestyle products."}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          {loading ? (
            <div className="h-6 w-28 bg-gray-700 rounded mb-3 animate-pulse"></div>
          ) : (
            <h3 className="text-white font-bold text-lg mb-3">Quick Links</h3>
          )}
          <ul className="space-y-2 text-sm">
            {(loading ? Array(4).fill(0) : ["Home","Shop","Cart","Contact"]).map((item, idx) => (
              <li key={idx}>
                {loading ? (
                  <span className="h-4 w-24 bg-gray-700 rounded animate-pulse block"></span>
                ) : (
                  <a href="/" className="hover:text-white transition">{item}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          {loading ? (
            <div className="h-6 w-32 bg-gray-700 rounded mb-3 animate-pulse"></div>
          ) : (
            <h3 className="text-white font-bold text-lg mb-3">Customer Care</h3>
          )}
          <ul className="space-y-2 text-sm">
            {(loading ? Array(4).fill(0) : ["FAQ","Shipping","Returns","Support"]).map((item, idx) => (
              <li key={idx}>
                {loading ? (
                  <span className="h-4 w-24 bg-gray-700 rounded animate-pulse block"></span>
                ) : (
                  <a href="#" className="hover:text-white transition">{item}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          {loading ? (
            <>
              <div className="h-6 w-32 bg-gray-700 rounded mb-3 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-700 rounded mb-3 animate-pulse"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-8 flex-1 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-3">
                {Array(4).fill(0).map((_, idx) => (
                  <div key={idx} className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-white font-bold text-lg mb-3">Newsletter</h3>
              <p className="text-sm mb-3">Subscribe for latest updates & offers.</p>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg text-black focus:outline-none w-full text-gray-400"
                />
                <button className="bg-black text-white px-4 py-2 rounded-lg w-full sm:w-auto">
                  Subscribe
                </button>
              </div>
              <div className="flex gap-3">
                <a href="#"><Facebook size={20} /></a>
                <a href="#"><Twitter size={20} /></a>
                <a href="#"><Instagram size={20} /></a>
                <a href="#"><Linkedin size={20} /></a>
              </div>
            </>
          )}
        </div>

      </div>

      <div className="border-t border-gray-700 mt-6 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Cartify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
