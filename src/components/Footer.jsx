import React from 'react';
import styles from '../styles/Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Section */}
        <div className={styles.section}>
          <h3 className={styles.brand}>ZARSS</h3>
          <p className={styles.tagline}>
            Your destination for premium quality products and exceptional shopping experience.
          </p>
          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaLinkedinIn />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div className={styles.section}>
          <h4 className={styles.heading}>Shop</h4>
          <ul className={styles.links}>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
            <li><Link to="/shop">Best Sellers</Link></li>
            <li><Link to="/my-orders">Track Order</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className={styles.section}>
          <h4 className={styles.heading}>Customer Service</h4>
          <ul className={styles.links}>
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/my-orders">Order History</Link></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className={styles.section}>
          <h4 className={styles.heading}>Company</h4>
          <ul className={styles.links}>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {currentYear} ZARSS. All rights reserved.
        </p>
        <p className={styles.madeWith}>
          Made with <span className={styles.heart}>♥</span> for great shopping
        </p>
      </div>
    </footer>
  );
};

export default Footer;