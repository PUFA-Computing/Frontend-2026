import React from "react";
import Link from "next/link";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { Version } from "@/models/version";

export default function Footer({ version }: { version: Version }) {
    return (
        <footer className="relative bg-[#0D1B3E] overflow-hidden">
            {/* Top rule */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9A84A]/50 to-transparent" />

            {/* Subtle corner glow */}
            <div className="absolute bottom-0 left-0 w-64 h-32 bg-[#B8841E]/6 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-24 bg-[#B8841E]/4 rounded-full blur-3xl pointer-events-none" />

            <div className="relative container mx-auto px-6 py-12 max-w-7xl">
                {/* Newsletter */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-10">
                    <div className="max-w-xs">
                        <p className="font-display italic text-[#D9A84A] text-lg mb-1">Subscribe to our Newsletter</p>
                        <p className="font-serif text-sm text-[#F5EDD0]/45 leading-relaxed">
                            Latest news, events, and updates delivered to your inbox.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                        <input id="footer-email" type="email" disabled title="Coming soon" placeholder="Email address"
                            className="cursor-not-allowed rounded-md px-4 py-2 text-sm bg-[#152347]/60 border border-[#B8841E]/20 text-[#F5EDD0]/30 placeholder:text-[#F5EDD0]/25 outline-none font-serif" />
                        <button disabled title="Coming soon"
                            className="cursor-not-allowed rounded-md px-5 py-2 text-sm font-serif font-medium text-[#D9A84A] border border-[#B8841E]/30 bg-[#B8841E]/8 opacity-60 whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Divider rule with ornament */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#B8841E]/30" />
                    <span className="text-[#B8841E]/50 text-xs">✦</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#B8841E]/30" />
                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="font-serif text-sm text-[#F5EDD0]/35 mb-0.5">
                            © {new Date().getFullYear()} PUFA Computer Science · President University
                        </p>
                        <p className="font-serif text-xs text-[#F5EDD0]/25">
                            Research &amp; Technology ·{" "}
                            <Link href="/change-log" className="text-[#D9A84A]/70 hover:text-[#D9A84A] transition-colors duration-200">
                                Latest Version
                            </Link>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {[
                            { href: "https://www.linkedin.com/company/pufa-computerscience/", Icon: FaLinkedin, label: "LinkedIn" },
                            { href: "https://www.instagram.com/pucompsci",                   Icon: FaInstagram, label: "Instagram" },
                            { href: "https://github.com/PUFA-Computing",                     Icon: FaGithub,    label: "GitHub" },
                        ].map(({ href, Icon, label }) => (
                            <Link key={label} href={href} aria-label={label}
                                className="text-[#F5EDD0]/25 hover:text-[#D9A84A] transition-colors duration-250">
                                <Icon size={18} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
