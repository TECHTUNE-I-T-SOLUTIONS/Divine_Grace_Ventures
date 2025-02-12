// app/about/page.tsx
import { FaWhatsapp } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Background container for added design */}
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-4 text-center">About Divine Grace Ventures</h2>
        <p className="mb-6 text-lg text-center">
          Divine Grace Ventures is committed to providing an excellent user experience while handling orders, payments, and notifications.
          We take orders and deliver all over Nigeria with speed and efficiency.
        </p>

        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center">Contact Information</h3>
          <div className="mt-4 text-center space-y-2">
            <p>
              <span className="font-bold">Mobile:</span> 07075217246
            </p>
            <p>
              <span className="font-bold">WhatsApp:</span> +234 814 440 9511
            </p>
            <p className="text-sm italic">
              We take orders and deliver all over Nigeria.
            </p>
          </div>
        </div>

        {/* WhatsApp Chat Link */}
        <div className="text-center">
          <a
            href="https://wa.me/2348144409511?text=Hello%20Divine%20Grace%20Ventures%2C%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition duration-300"
          >
            <FaWhatsapp className="mr-2" size={20} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
