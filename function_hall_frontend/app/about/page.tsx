"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-xl p-8 mb-12 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative z-10">
            <div className="inline-block mb-3">
              <div className="text-4xl mb-2">🏛️</div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              GenS Services
            </h1>
            <div className="w-16 h-1 bg-blue-300 mx-auto mb-3 rounded-full"></div>
            <p className="text-lg text-blue-50 mb-2 font-light">
              Your Premier Function Hall Booking Platform
            </p>
            <p className="text-sm text-blue-200 italic">
              (A wing of GenInfotech)
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🏢</span>
            <div>
              <h2 className="text-2xl font-bold text-blue-700">GenInfotech</h2>
              <p className="text-lg text-gray-600">Software Development and Training HUB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="text-lg font-bold text-blue-700 mb-1">Training Excellence</h3>
              <p className="text-3xl font-bold text-blue-600">20+</p>
              <p className="text-sm text-gray-600 mt-1">Years of Experience</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="text-lg font-bold text-blue-700 mb-1">Software Development</h3>
              <p className="text-sm text-gray-600 mt-1">Innovative Solutions & Custom Applications</p>
            </div>
          </div>
        </div>

        {/* About GenS Services */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
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
          <h2 className="text-2xl font-bold text-blue-700 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="text-lg font-bold text-blue-600 mb-1">Easy Search</h3>
              <p className="text-sm text-gray-600">Browse and search function halls by location, capacity, and price</p>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="text-lg font-bold text-blue-600 mb-1">Real-time Availability</h3>
              <p className="text-sm text-gray-600">Check hall availability and book your preferred dates instantly</p>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-lg font-bold text-blue-600 mb-1">Transparent Pricing</h3>
              <p className="text-sm text-gray-600">View detailed packages and pricing with no hidden costs</p>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
              <div className="text-3xl mb-2">📸</div>
              <h3 className="text-lg font-bold text-blue-600 mb-1">Photo Galleries</h3>
              <p className="text-sm text-gray-600">Explore high-quality photos of venues before you book</p>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="text-lg font-bold text-blue-600 mb-1">Direct Communication</h3>
              <p className="text-sm text-gray-600">Send enquiries and communicate directly with hall owners</p>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="text-lg font-bold text-blue-600 mb-1">Secure Bookings</h3>
              <p className="text-sm text-gray-600">Safe and secure booking process with confirmed reservations</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Why Choose GenS Services?</h2>
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Book Your Perfect Venue?</h2>
          <p className="text-base text-blue-100 mb-6">
            Explore our collection of beautiful function halls and make your event unforgettable
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/halls"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-base hover:bg-blue-50 transition shadow-lg"
            >
              Browse Function Halls
            </a>
            <a
              href="/customer/register"
              className="bg-blue-800 text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-blue-900 transition shadow-lg"
            >
              Register Now
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6 text-center">
          <h2 className="text-xl font-bold text-blue-700 mb-3">Get in Touch</h2>
          <p className="text-sm text-gray-600 mb-3">Have questions? We'd love to hear from you!</p>
          <a
            href="/customer/enquiry"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
          >
            Send an Enquiry
          </a>
        </div>
      </div>
    </div>
  );
}
