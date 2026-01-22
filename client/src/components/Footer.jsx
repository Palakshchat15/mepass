import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="mt-auto">
            {/* Organizer CTA */}
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] py-6 border-t border-[#2a2a2a]">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-center sm:text-left">
                        Hosting a show, event, or exhibition? Partner with us and get featured on Mepass!
                    </p>
                    <Link
                        to="/register?role=organizer"
                        className="bg-gradient-to-r from-[#c41e3a] to-[#9a1830] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#e63946] hover:to-[#c41e3a] transition-all whitespace-nowrap"
                    >
                        Join as an Organiser
                    </Link>
                </div>
            </div>

            {/* Main Footer */}
            <div className="bg-[#121212] py-12">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="text-3xl font-bold tracking-tight mb-4">
                            <span className="text-white">me</span>
                            <span className="text-[#c41e3a]">pass</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Revolutionising Ticketing with Tech for Entire Entertainment Ecosystem
                        </p>
                        <div className="flex gap-3">
                            {['facebook', 'twitter', 'instagram', 'youtube'].map(social => (
                                <a
                                    key={social}
                                    href={`https://${social}.com`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#c41e3a] hover:-translate-y-1 transition-all"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        {social === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                                        {social === 'twitter' && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                                        {social === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" /></>}
                                        {social === 'youtube' && <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#121212" /></>}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Menu */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Quick Menu</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-500 hover:text-[#c41e3a] transition-colors text-sm">Events</Link></li>
                            <li><Link to="/register?role=organizer" className="text-gray-500 hover:text-[#c41e3a] transition-colors text-sm">Business</Link></li>
                            <li><Link to="/contact" className="text-gray-500 hover:text-[#c41e3a] transition-colors text-sm">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/privacy-policy" className="text-gray-500 hover:text-[#c41e3a] transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link to="/refund-policy" className="text-gray-500 hover:text-[#c41e3a] transition-colors text-sm">Refund Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-500 hover:text-[#c41e3a] transition-colors text-sm">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* App Download */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Get the App</h4>
                        <p className="text-gray-500 text-sm mb-4">Download the Mepass app to stay updated with the best events around you!</p>
                        <div className="flex flex-col gap-3">
                            <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#252525] hover:border-[#c41e3a] transition-all">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div>
                                    <span className="block text-[10px] text-gray-500">Download on the</span>
                                    <span className="block text-sm font-semibold">App Store</span>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#252525] hover:border-[#c41e3a] transition-all">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                                </svg>
                                <div>
                                    <span className="block text-[10px] text-gray-500">GET IT ON</span>
                                    <span className="block text-sm font-semibold">Google Play</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="bg-[#0a0a0a] py-4 border-t border-[#2a2a2a] text-center">
                <p className="text-gray-500 text-sm">© 2026 Copyright and all rights reserved by MePass Clone</p>
            </div>
        </footer>
    );
};

export default Footer;
