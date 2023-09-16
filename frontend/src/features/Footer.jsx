import React from 'react'
import './Style/footer.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Facebook, GitHub, Youtube, Linkedin, Instagram, Twitter } from 'react-feather';

const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <h5 className='fw-light text-center p-3'>Stay connected</h5>
        <div className="container text-center">
          <div className="row">
            <div className="col-md-12">
              <div className="social-icons">
                {/* Replace '#' with the actual links */}
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <Facebook className='icon' size={45} />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                  <Twitter className='icon' size={45} />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <Instagram className='icon' size={45} />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className='icon' size={45} />
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                  <Youtube className='icon' size={45} />
                </a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                  <GitHub className='icon' size={45} />
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <p className="copyright">
                © {new Date().getFullYear()} Ciphers . All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
        <hr className='my-4' />
        <div className="container">
          
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
