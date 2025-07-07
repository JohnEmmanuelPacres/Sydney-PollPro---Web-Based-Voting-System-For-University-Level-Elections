import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { usePathname, useSearchParams } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const departmentOrg = searchParams.get('department_org') || '';
  const administeredOrg = searchParams.get('administered_Org') || '';

  let homeLink = '#';
  let resultsLink = '/Election_Results';
  if (pathname.includes('/Voterdashboard')) {
    homeLink = `/Voterdashboard?email=${encodeURIComponent(email)}&department_org=${encodeURIComponent(departmentOrg)}`;
    resultsLink = `/Election_Results?department_org=${encodeURIComponent(departmentOrg)}`;
  } else if (pathname.includes('/dashboard/Admin')) {
    homeLink = `/dashboard/Admin?email=${encodeURIComponent(email)}&administered_Org=${encodeURIComponent(administeredOrg)}`;
    resultsLink = `/Election_Results?administered_Org=${encodeURIComponent(administeredOrg)}`;
  }

  // Hide Quick Links and Connect With Us on certain pages
  const hideFooterSections =
    pathname.includes('/Candidates') ||
    pathname.includes('/Election_Results') ||
    pathname.includes('/Update_Section') ||
    pathname.includes('/dashboard/Admin/AdminUpdate_Section');

  return (
    <footer className="w-full bg-red-950 shadow-[0px_-5px_4px_0px_rgba(0,0,0,0.50)] py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Footer content sections */}
          {!hideFooterSections && (
            <>
              <div className="text-white text-center md:text-center w-full md:w-auto">
                <h3 className="text-lg font-bold mb-2 md:mb-3">Quick Links</h3>
                <ul className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-sm">
                  <li><a href={homeLink} className="hover:underline transition duration-200">Home</a></li>
                  <li><a href={resultsLink} className="hover:underline transition duration-200">Results</a></li>
                  <li><a href="/About" className="hover:underline transition duration-200">About</a></li>
                </ul>
              </div>
              <div className="text-white text-center md:text-right w-full md:w-auto">
                <h3 className="text-lg font-bold mb-2 md:mb-3">Connect With Us</h3>
                <div className="flex justify-center md:justify-end gap-4">
                  <a href="https://www.facebook.com/michaeljordan.ebesa" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition duration-200">
                    <span className="sr-only">Facebook</span>
                    <FaFacebook className="w-6 h-6" />
                  </a>
                  <a href="https://x.com/sydney_sweeney?lang=en" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition duration-200">
                    <span className="sr-only">Twitter</span>
                    <FaTwitter className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/sydney_sweeney/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition duration-200">
                    <span className="sr-only">Instagram</span>
                    <FaInstagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-red-800 text-white text-sm text-center">
          <p>&copy; {new Date().getFullYear()} SydneyPolls. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;