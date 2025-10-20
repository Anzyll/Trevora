
import React from "react";
const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex  md:grid-cols-2 gap-8 mb-8 justify-between  h-40 items-center">
          <div>
            <h3 className="font-semibold  text-gray-400 mb-4">Our Commitment</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <p className="font-medium text-gray-400">
                  We guarantee everything we make.
                </p>
              </div>
              <div>
                <p className="font-medium  text-gray-400">
                  We take responsibility for our impact.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-400">
                  We give our profits to the planet.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Only */}
          <div>
            <h3 className="font-semibold  text-gray-400 mb-4">Get In Touch</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <p className="font-medium text-gray-400">Email</p>
                <p>hello@trevora.com</p>
              </div>
              <div>
                <p className="font-medium  text-gray-400">Phone</p>
                <p>+91 98765 43210</p>
              </div>
              <div>
                <p className="font-medium  text-gray-400">Address</p>
                <p>123 Outdoor Gear Plaza</p>
                <p>Bangalore, India 560001</p>
              </div>
          
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2025 trevora. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;