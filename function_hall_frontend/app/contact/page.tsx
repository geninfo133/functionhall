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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div>
        {/* Hero Section */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-12 relative" style={{ backgroundColor: '#0d316c' }}>
          <div className="px-6 sm:px-8 lg:px-12 py-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
                  <span className="text-3xl">📞</span>
                  Contact Us
                </h1>
                <p className="text-base text-blue-50 mb-1 font-light">
                  Get in Touch with GenS Services
                </p>
                <p className="text-sm text-blue-200 italic">
                  We're here to help you plan the perfect event
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            {/* Company Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#20056a] mb-4 flex items-center">
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
                  <FaMapMarkerAlt className="text-[#20056a] text-xl mr-3 mt-1 flex-shrink-0" />
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
                  <FaPhone className="text-[#20056a] text-xl mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Call Us</h3>
                    <a href="tel:+919866168995" className="text-[#20056a] hover:text-[#20056a] font-medium">
                      +91 9866168995
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start">
                  <FaGlobe className="text-[#20056a] text-xl mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Website</h3>
                    <a 
                      href="https://www.geninfotech.netlify.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#20056a] hover:text-[#20056a] break-all"
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
                      href="https://www.youtube.com/@GENINFOCOMPUTEREDUCATIONCENTRE" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                    >
                      <FaYoutube className="text-xl" />
                      <span className="text-sm font-medium">geninfotech</span>
                    </a>
                    <a 
                      href="https://www.instagram.com/geninfotech_official/?next=%2F&hl=en" 
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
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-[#20056a] mb-3">Business Hours</h3>
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

            {/* Google Map */}
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-[#20056a] mb-3">Find Us on Map</h3>
              <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.7!2d81.7!3d16.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37b7f01ae272ed%3A0x2d67bba4c589ac5a!2sRastrapathi%20Road%2C%20Opp.%20Canara%20Bank%2C%20Tanuku!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GenInfotech Location - Opp. Canara Bank, Rastrapathi Road, Tanuku"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#20056a] mb-4 flex items-center">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#20056a] text-white py-3 rounded-lg font-bold hover:bg-[#150442] transition shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 rounded-xl shadow-lg p-6 text-center" style={{ backgroundColor: '#0d316c' }}>
          <h2 className="text-2xl font-bold text-white mb-3">Looking for Function Halls?</h2>
          <p className="text-base text-blue-100 mb-4">
            Browse our collection of beautiful venues for your special occasions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/halls"
              className="text-white px-6 py-3 rounded-lg font-bold text-base transition shadow-lg inline-block"
              style={{ backgroundColor: '#20056a' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#150442'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#20056a'}
            >
              Browse Function Halls
            </a>
            <a
              href="/customer/enquiry"
              className="bg-white text-[#0d316c] px-6 py-3 rounded-lg font-bold text-base hover:bg-blue-50 transition shadow-lg inline-block"
            >
              Send Enquiry
            </a>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
