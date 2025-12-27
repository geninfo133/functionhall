"use client";
import { useState } from "react";
import { FaPhone, FaMapMarkerAlt, FaGlobe, FaYoutube, FaInstagram, FaEnvelope, FaBuilding } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with unified navbar gap */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative rounded-2xl shadow-xl p-4 mb-0 text-center overflow-hidden flex items-center justify-center" style={{ background: '#0d316cff', minHeight: '7.5rem', height: '120px' }}>
          <div className="page-width">
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              {/* First line: Icon and Heading */}
              <div className="flex flex-col sm:flex-row items-center justify-center w-full">
                <span className="text-3xl text-white mb-1 sm:mb-0 sm:mr-3">📞</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Contact Us</h1>
              </div>
              {/* Second line: Subtext and Tagline */}
              <div className="flex flex-col sm:flex-row items-center justify-center w-full mt-1">
                <span className="text-base text-white font-light sm:mr-3">Get in Touch with GenS Services</span>
                <span className="text-xs text-white italic">We're here to help you plan the perfect event</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            {/* Company Info Card */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6 w-full mx-auto">
              <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#0d316cff' }}>
                <FaBuilding className="mr-3" />
                GenS Services
              </h2>
              <p className="text-gray-600 mb-4 italic">A wing of GenInfotech</p>
              <p className="text-sm text-gray-600 mb-6">
                Use AI Tools to Build Web & Mobile-Based Applications
              </p>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-xl mr-3 mt-1 flex-shrink-0" style={{ color: '#0d316cff' }} />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Visit Us</h3>
                    <p className="text-gray-600 text-sm">
                      RamaLakshmi Complex<br />
                      Opp. Canara Bank<br />
                      Tanuku - 534211
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <FaPhone className="text-xl mr-3 mt-1 flex-shrink-0" style={{ color: '#0d316cff' }} />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Call Us</h3>
                    <a href="tel:+919866168995" className="font-medium" style={{ color: '#0d316cff' }}>
                      +91 9866168995
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start">
                  <FaGlobe className="text-xl mr-3 mt-1 flex-shrink-0" style={{ color: '#0d316cff' }} />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Website</h3>
                    <a 
                      href="https://www.geninfotech.netlify.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="break-all"
                      style={{ color: '#0d316cff' }}
                    >
                      www.geninfotech.netlify.app
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.youtube.com/@geninfotech" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                    >
                      <FaYoutube className="text-xl" />
                      <span className="text-sm font-medium">geninfotech</span>
                    </a>
                    <a 
                      href="https://www.instagram.com/geninfotech_official" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
                    >
                      <FaInstagram className="text-xl" />
                      <span className="text-sm font-medium">geninfotech_official</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map or Additional Info */}
            <div className="rounded-xl p-6 border-2" style={{ background: '#e8f0fe', borderColor: '#b3c7e6' }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#0d316cff' }}>Business Hours</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-8 w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#0d316cff' }}>
              <FaEnvelope className="mr-3" />
              Send Us a Message
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {submitted && (
              <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-lg mb-6 text-center">
                <p className="font-semibold">✓ Message Sent Successfully!</p>
                <p className="text-sm">We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none"
                  style={{ focusVisible: { ringColor: '#0d316cff', borderColor: '#0d316cff' } }}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none"
                  style={{ focusVisible: { ringColor: '#0d316cff', borderColor: '#0d316cff' } }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none"
                  style={{ focusVisible: { ringColor: '#0d316cff', borderColor: '#0d316cff' } }}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none resize-none"
                  style={{ focusVisible: { ringColor: '#0d316cff', borderColor: '#0d316cff' } }}
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-3 rounded-lg font-bold transition shadow-lg"
                style={{ background: '#0d316cff' }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 rounded-xl shadow-lg p-6 text-center" style={{ background: '#0d316cff' }}>
          <h2 className="text-2xl font-bold text-white mb-3">Looking for Function Halls?</h2>
          <p className="text-base mb-4" style={{ color: '#b3c7e6' }}>
            Browse our collection of beautiful venues for your special occasions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/halls"
              className="bg-white px-6 py-3 rounded-lg font-bold text-base transition shadow-lg inline-block"
              style={{ color: '#0d316cff' }}
            >
              Browse Function Halls
            </a>
            <a
              href="/customer/enquiry"
              className="text-white px-6 py-3 rounded-lg font-bold text-base transition shadow-lg inline-block"
              style={{ background: '#082451' }}
            >
              Send Enquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
