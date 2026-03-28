import React from "react";
import "./footer.css";

export default function Footer() {
  return (
   <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">Humancare</div>
            <p className="footer-desc">
              Making quality healthcare accessible and affordable for every
              American, wherever they are.
            </p>
            <div className="footer-socials">
              <div className="soc-btn">𝕏</div>
              <div className="soc-btn">in</div>
              <div className="soc-btn">▶</div>
              <div className="soc-btn">f</div>
            </div>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <a href="#">Find Doctors</a>
            <a href="#">Video Visits</a>
            <a href="#">Prescriptions</a>
            <a href="#">Mental Health</a>
            <a href="#">Chronic Care</a>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Blog</a>
            <a href="#">Investors</a>
          </div>
          <div className="footer-col">
            <h5>Support</h5>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">HIPAA Notice</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Humancare Technologies Inc. All rights reserved.</span>
          <span>Made with care in the United States 🇺🇸</span>
        </div>
      </footer>
  );
}