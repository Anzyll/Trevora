import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-white mb-4">Our Commitment</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <p className="font-medium text-white">
                  We guarantee everything we make.
                </p>
              </div>
              <div>
                <p className="font-medium text-white">
                  We take responsibility for our impact.
                </p>
              </div>
              <div>
                <p className="font-medium text-white">
                  We give our profits to the planet.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter Signup</h3>
            <p className="text-sm text-gray-300 mb-3">
              Sign up for exclusive offers, original stories, and updates.
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                placeholder="E-Mail"
                className="flex-1 px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded text-sm placeholder-gray-400"
              />
              <button className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                Sign Up
              </button>
            </div>
            <p className="text-xs text-gray-400">
              By signing up, you agree to our Privacy Notice and terms.
            </p>
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
