"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import CountryCodeSelector from "../../../components/CountryCodeSelector";

export default function PhoneVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("return") || "/booking";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const sendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, country_code: countryCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("OTP sent successfully! Check your phone.");
        setStep("otp");
        setResendTimer(60); // 60 seconds cooldown
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, country_code: countryCode }),
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setSuccess("Phone verified successfully!");
        
        // Store verification data
        sessionStorage.setItem("verifiedPhone", `${countryCode}${phone}`);
        sessionStorage.setItem("countryCode", countryCode);
        sessionStorage.setItem("phoneNumber", phone);
        
        // Redirect to customer details form
        setTimeout(() => {
          router.push(`/auth/customer-details?return=${returnPath}`);
        }, 1000);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {step === "phone" ? "Verify Your Phone" : "Enter OTP"}
          </h1>
          <p className="text-gray-600">
            {step === "phone"
              ? "We'll send you a verification code"
              : `Code sent to ${countryCode} ${phone}`}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Phone Number Step */}
        {step === "phone" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Code
              </label>
              <CountryCodeSelector value={countryCode} onChange={setCountryCode} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your 10-digit mobile number
              </p>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading || !phone || phone.length < 10}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={6}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Valid for 10 minutes
              </p>
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading || !otp || otp.length !== 6}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Change Phone Number or Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
