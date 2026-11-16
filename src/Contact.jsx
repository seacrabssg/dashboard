import React from "react";
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <div className="explain-contact">
                Do you have any news about happenings in your community? Or are you a local activist looking for regional collaborators? Drop us a message here!
            </div>
            
            <div className="contact-options">
                {/* Instagram Option */}
                <a href="https://www.instagram.com/crab._.sg/" target="_blank" rel="noopener noreferrer" className="contact-card instagram-card">
                    <div className="contact-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                    </div>
                    <div className="contact-info">
                        <h3>Instagram (preferred)</h3>
                        <p>Follow us and send a DM</p>
                        <span className="contact-detail">crab._.sg</span>
                    </div>
                </a>
                
                {/* Email Option */}
                <a href="mailto:seacrabs.sg@gmail.com" email-card className="contact-card email-card">
                    <div className="contact-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <path d="M22 4L12 13 2 4"/>
                        </svg>
                    </div>
                    <div className="contact-info">
                        <h3>Email Us</h3>
                        <p>Send us an email directly</p>
                        <span className="contact-detail">seacrabs.sg@gmail.com</span>
                    </div>
                </a>
            </div>
        </div>
    )
}

export default Contact;