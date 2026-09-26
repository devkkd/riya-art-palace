"use client";
import { useState } from "react";
import logo from "../assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "./CatalogContext";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";

const companyLinks = [
  { name: "About Us",           href: "/about" },
  { name: "Our Process",        href: "/about" },
  { name: "Contact Us",         href: "/contact" },
];

const quickLinks = [
  { name: "Inquiry List",       href: "/enquiry?type=india" },
  { name: "Privacy Policy",     href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Refund Policy",      href: "/refund-policy" },
  { name: "Shipping Policy",    href: "/shipping-policy" },
];

export default function Footer() {
  const { categories, loading } = useCatalog();

  // Split categories into two columns for layout
  const midPoint = Math.ceil(categories.length / 2);
  const catCol1 = categories.slice(0, midPoint);
  const catCol2 = categories.slice(midPoint);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ fontFamily: "'Manrope', sans-serif", backgroundColor: "#FAF8F4", color: "#333", borderTop: "1px solid #EAE6DF" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        
        .ft-container { max-width: 1360px; margin: 0 auto; padding: 60px 40px 20px; }

        /* Top Section */
        .ft-top { display: grid; grid-template-columns: 300px 1fr; gap: 60px; border-bottom: 1px solid #EAE6DF; padding-bottom: 50px; }
        
        .ft-brand-col { display: flex; flex-direction: column; align-items: flex-start; }
        .ft-brand-title { font-size: 13px; font-weight: 800; text-transform: uppercase; margin: 24px 0 12px; letter-spacing: 0.05em; color: #1a1a1a; }
        .ft-brand-desc { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 24px; }
        .ft-about-btn { 
          display: inline-flex; align-items: center; justify-content: center;
          padding: 10px 24px; background-color: #f85700; color: #fff;
          border-radius: 20px; font-size: 12px; font-weight: 600; 
          text-decoration: none; transition: background-color 0.2s;
        }
        .ft-about-btn:hover { background-color: #524a3c; }

        .ft-links-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
        .ft-link-col h4 { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 20px; }
        .ft-link-col ul { list-style: none; padding: 0; margin: 0; }
        .ft-link-col li { margin-bottom: 12px; }
        .ft-link-col a { font-size: 13px; color: #555; text-decoration: none; transition: color 0.2s; }
        .ft-link-col a:hover { color: #F85700; }

        /* Middle Section */
        .ft-mid { display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 40px; padding: 40px 0; border-bottom: 1px solid #EAE6DF; }
        
        .ft-info-head { font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
        .ft-info-text { font-size: 13px; color: #333; line-height: 1.6; margin-bottom: 10px; }
        .ft-info-text a { color: #333; text-decoration: none; transition: color 0.2s; }
        .ft-info-text a:hover { color: #F85700; }

        .ft-social-wrap { display: flex; flex-direction: column; align-items: flex-start; }
        .ft-socials { display: flex; gap: 12px; margin-bottom: 30px; }
        .ft-social-icon { 
          width: 36px; height: 36px; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 15px; text-decoration: none; transition: transform 0.2s;
        }
        .ft-social-icon:hover { transform: translateY(-2px); }
        .ft-social-ig { background-color: #C13584; }
        .ft-social-fb { background-color: #1877F2; }
        .ft-social-wa { background-color: #25D366; }
        
        .ft-top-btn { 
          background: none; border: none; font-size: 12px; font-weight: 700; 
          color: #6C6250; cursor: pointer; display: flex; align-items: center; gap: 6px; 
          padding: 0;
        }
        .ft-top-btn:hover { color: #1a1a1a; }

        /* Quote Section */
        .ft-quote-sec { padding: 40px 0; border-bottom: 1px solid #EAE6DF; text-align: left; }
        .ft-quote-text { 
          font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 300; 
          color: #6C6250; line-height: 1.5; margin: 0 0 16px; max-width: 1000px;
        }
        .ft-quote-author { font-size: 14px; color: #555; }

        /* Bottom Section */
        .ft-bot { padding: 24px 0 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .ft-copy { font-size: 11px; color: #888; margin: 0; }
        .ft-copy a { color: #888; text-decoration: none; font-weight: 600; }
        .ft-copy a:hover { color: #F85700; }
        .ft-certs { font-size: 11px; color: #888; }
        
        @media(max-width: 1024px) {
          .ft-top { grid-template-columns: 1fr; }
          .ft-mid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 768px) {
          .ft-links-grid { grid-template-columns: repeat(2, 1fr); }
          .ft-mid { grid-template-columns: 1fr; }
          .ft-quote-text { font-size: 18px; }
          .ft-bot { flex-direction: column; align-items: flex-start; }
        }
        @media(max-width: 480px) {
          .ft-links-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ft-container">
        
        {/* TOP SECTION */}
        <div className="ft-top">
          <div className="ft-brand-col">
            <Image src={logo} alt="Riya Art Palace" style={{ height: 60, width: "auto", objectFit: "contain" }} />
            <h3 className="ft-brand-title">RIYA ART PALACE</h3>
            <p className="ft-brand-desc">
              Exquisitely handcrafted Indian crafts that honor heritage, empower artisans, and cherish our roots. Proudly family-owned since 1995, delivering authentic Rajasthani art to the world.
            </p>
            <Link href="/about" className="ft-about-btn">
              More About Us &rarr;
            </Link>
          </div>

          <div className="ft-links-grid">
            <div className="ft-link-col">
              <h4>About us</h4>
              <ul>
                {companyLinks.map(link => (
                  <li key={link.name}><Link href={link.href}>{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="ft-link-col">
              <h4>Quick Links</h4>
              <ul>
                {quickLinks.map(link => (
                  <li key={link.name}><Link href={link.href}>{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="ft-link-col">
              <h4>Categories</h4>
              <ul>
                {!loading && catCol1.map(cat => (
                  <li key={cat.id}><Link href={`/products?category=${encodeURIComponent(cat.slug)}`}>{cat.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="ft-link-col">
              <h4>More Collections</h4>
              <ul>
                {!loading && catCol2.map(cat => (
                  <li key={cat.id}><Link href={`/products?category=${encodeURIComponent(cat.slug)}`}>{cat.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="ft-mid">
          <div>
            <div className="ft-info-head">Head Office</div>
            <p className="ft-info-text">
              C-143, 1st Phase, New Lohamandi,<br/>
              Macheda, Jaipur – 302013<br/>
              Rajasthan (INDIA)
            </p>
            <p className="ft-info-text" style={{ marginTop: 12 }}>
              Ph: <a href="tel:+918385007350">+91-8385007350</a><br/>
              Email: <a href="mailto:riya_art_palace@yahoo.com">riya_art_palace@yahoo.com</a>
            </p>
          </div>

          <div>
            <div className="ft-info-head">Business Info</div>
            <p className="ft-info-text">
              GST: 08AIBPM9441J1ZZ<br/>
              Established: 1995<br/>
              Nature of Business: Manufacturer & Exporter
            </p>
          </div>

          <div className="ft-social-wrap">
            <div className="ft-info-head">Follow Us</div>
            <div className="ft-socials">
              <a href="#" className="ft-social-icon ft-social-ig"><FaInstagram /></a>
              <a href="#" className="ft-social-icon ft-social-fb"><FaFacebookF /></a>
              <a href="https://wa.me/918385007350" className="ft-social-icon ft-social-wa"><FaWhatsapp /></a>
            </div>
            <button className="ft-top-btn" onClick={scrollToTop}>
              &uarr; TOP
            </button>
          </div>
        </div>

        {/* QUOTE SECTION */}
        <div className="ft-quote-sec">
          <p className="ft-quote-text">
            "Preserving the authentic heritage of Rajasthan, one handcrafted piece at a time. Every creation tells a story of tradition, skill, and the timeless beauty of Indian art."
          </p>
          <div className="ft-quote-author">&mdash; Founders, Riya Art Palace</div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="ft-bot">
          <p className="ft-copy">
            &copy; 2026 Riya Art Palace. All rights reserved. Lovingly handcrafted in India ♥ since 1995 &nbsp;|&nbsp; Crafted and Powered by <a href="https://www.kontentkraftdigital.com/" target="_blank" rel="noopener noreferrer">Kontent Kraft Digital</a>
          </p>
          <div className="ft-certs">
            Secure Payments &bull; Pan India Shipping &bull; Global Exports
          </div>
        </div>

      </div>
    </footer>
  );
}
