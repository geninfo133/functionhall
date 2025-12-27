"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Hero Section (match /home) */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg" style={{ background: '#0d316cff', minHeight: '7.5rem', height: '120px' }}>
          <div className="px-6 sm:px-8 lg:px-12 py-4">
            <div className="page-width mx-auto">
                <div className="text-center">
                  {/* First line: Title with icon */}
                  <h1 className="text-1xl sm:text-1xl font-extrabold mb-1 flex items-center justify-center gap-2" style={{ color: '#fff', fontFamily: 'Inter, Arial, sans-serif' }}>
                    <span className="text-2xl">🏛️</span>
                    GenS Services
                  </h1>
                  {/* Second line: Subtitle */}
                  <p className="text-lg max-w-2xl mx-auto mb-1" style={{ color: '#18c9e8ff', fontFamily: 'Inter, Arial, sans-serif' }}>
                    Your Premier Function Hall Booking Platform
                  </p>
                  <div className="w-16 h-1 mx-auto mb-2 rounded-full" style={{ background: '#0d316cff' }}></div>
                  <p className="text-sm italic mt-1" style={{ color: '#b3c7e6' }}>
                    (A wing of GenInfotech)
                  </p>
                </div>
            </div>
          </div>
        </div>
      </div>
  <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🏢</span>
            <div>
              <h2 className="text-2xl font-bold mb-0" style={{ color: '#0d316cff' }}>GenInfotech</h2>
              <p className="text-lg text-gray-600">Software Development and Training HUB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Training Excellence</h3>
              <p className="text-3xl font-bold" style={{ color: '#0d316cff' }}>20+</p>
              <p className="text-sm text-gray-600 mt-1">Years of Experience</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Software Development</h3>
              <p className="text-sm text-gray-600 mt-1">Innovative Solutions & Custom Applications</p>
            </div>
          </div>
        </div>

        {/* About GenS Services */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#0d316cff' }}>
            <span className="text-3xl mr-2">🏛️</span>
            About GenS Services
          </h2>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            GenS Services is a comprehensive function hall booking platform designed to simplify the process of finding and booking the perfect venue for your special occasions. Whether you're planning a wedding, corporate event, birthday celebration, or any other gathering, we connect you with the finest function halls in your area.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            Built on decades of technology expertise from GenInfotech, our platform combines user-friendly design with powerful features to make event planning seamless and stress-free.
          </p>
        </div>

        {/* Our Services */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0d316cff' }}>What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-2 rounded-lg p-4 hover:shadow-md transition" style={{ borderColor: '#b3c7e6' }}>
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Easy Search</h3>
              <p className="text-sm text-gray-600">Browse and search function halls by location, capacity, and price</p>
            </div>

            <div className="border-2 rounded-lg p-4 hover:shadow-md transition" style={{ borderColor: '#b3c7e6' }}>
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Real-time Availability</h3>
              <p className="text-sm text-gray-600">Check hall availability and book your preferred dates instantly</p>
            </div>

            <div className="border-2 rounded-lg p-4 hover:shadow-md transition" style={{ borderColor: '#b3c7e6' }}>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Transparent Pricing</h3>
              <p className="text-sm text-gray-600">View detailed packages and pricing with no hidden costs</p>
            </div>

            <div className="border-2 rounded-lg p-4 hover:shadow-md transition" style={{ borderColor: '#b3c7e6' }}>
              <div className="text-3xl mb-2">📸</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Photo Galleries</h3>
              <p className="text-sm text-gray-600">Explore high-quality photos of venues before you book</p>
            </div>

            <div className="border-2 rounded-lg p-4 hover:shadow-md transition" style={{ borderColor: '#b3c7e6' }}>
              <div className="text-3xl mb-2">💬</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Direct Communication</h3>
              <p className="text-sm text-gray-600">Send enquiries and communicate directly with hall owners</p>
            </div>

            <div className="border-2 rounded-lg p-4 hover:shadow-md transition" style={{ borderColor: '#b3c7e6' }}>
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0d316cff' }}>Secure Bookings</h3>
              <p className="text-sm text-gray-600">Safe and secure booking process with confirmed reservations</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0d316cff' }}>Why Choose GenS Services?</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-xl mr-3 text-green-500">✓</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Backed by Experience</h3>
                <p className="text-sm text-gray-600">Powered by GenInfotech with over 20 years of technology and training expertise</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-3 text-green-500">✓</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Curated Venues</h3>
                <p className="text-sm text-gray-600">Carefully selected function halls that meet our quality standards</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-3 text-green-500">✓</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">User-Friendly Platform</h3>
                <p className="text-sm text-gray-600">Intuitive interface designed for seamless booking experience</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-3 text-green-500">✓</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Customer Support</h3>
                <p className="text-sm text-gray-600">Dedicated support team to assist you throughout your booking journey</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-xl mr-3 text-green-500">✓</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Innovation & Reliability</h3>
                <p className="text-sm text-gray-600">Cutting-edge technology combined with proven reliability</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#0d316cff] to-[#0d316cff] rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Book Your Perfect Venue?</h2>
          <p className="text-base mb-6" style={{ color: '#b3c7e6' }}>
            Explore our collection of beautiful function halls and make your event unforgettable
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/halls"
              className="px-6 py-3 rounded-lg font-bold text-base hover:bg-blue-50 transition shadow-lg"
              style={{ background: 'white', color: '#0d316cff' }}
            >
              Browse Function Halls
            </a>
            <a
              href="/customer/register"
              className="text-white px-6 py-3 rounded-lg font-bold text-base transition shadow-lg"
              style={{ background: '#082451' }}
            >
              Register Now
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6 text-center">
          <h2 className="text-xl font-bold" style={{ color: '#0d316cff' }}>Get in Touch</h2>
          <p className="text-sm text-gray-600 mb-3">Have questions? We'd love to hear from you!</p>
          <a
            href="/customer/enquiry"
            className="inline-block bg-[#0d316cff] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
          >
            Send an Enquiry
          </a>
        </div>
      </div>
    </div>
  );
}
