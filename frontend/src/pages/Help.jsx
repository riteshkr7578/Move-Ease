import React, { useState } from "react";

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click the 'Sign Up' button and fill in your details. You're all set!",
    },
    {
      question: "Can I reschedule my move?",
      answer:
        "Yes, you can reschedule anytime from your dashboard.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Email us at support@moveease.com or use our live chat.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>

      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen px-4 py-16 transition-colors duration-300">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Help & Support
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Everything you need to get the most out of MoveEase.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  onClick={() => toggle(index)}
                >
                  {faq.question}
                  <span className="text-xl font-bold">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="p-4 text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold mb-2 dark:text-white">
            Still need help?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Reach out to us directly, we’re here 24/7.
          </p>
          <a
            href="tel:+91 9661141005"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
          >
            Contact Support
          </a>
        </div>

        {/* Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 mt-20 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <div className="text-blue-500 text-3xl mb-3">📖</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">User Guides</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Step-by-step tutorials to walk you through every feature.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <div className="text-yellow-500 text-3xl mb-3">💡</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Tips & Tricks</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Power-user tips to make your move smarter and easier.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <div className="text-green-500 text-3xl mb-3">🛠️</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Support Center</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Talk to our support team or browse troubleshooting topics.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
