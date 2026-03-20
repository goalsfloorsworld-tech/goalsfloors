"use client";

import Image from "next/image";
import { ArrowRight, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 bg-white">
      {/* Hero Section */}
      <section className="bg-gray-950 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 max-w-xl mx-auto px-4">Have a project in mind? Get in touch with our experts for consultation, measurements, and a free quote.</p>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Our Location</h4>
                  <p className="text-gray-600 mt-1">Visit our showroom in Gurgaon for the complete experience and physical samples.</p>
                  <p className="text-gray-900 font-medium mt-2">Gurugram, Haryana, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Call Us</h4>
                  <p className="text-gray-600 mt-1">Available Mon-Sat, 10 AM to 7 PM for expert consultation.</p>
                  <a href="tel:+919999999999" className="text-amber-600 font-bold mt-2 inline-block hover:underline">+91 99999 99999</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Email Us</h4>
                  <p className="text-gray-600 mt-1">Send us your floor plans or project details for a custom estimate.</p>
                  <a href="mailto:info@goalsfloors.com" className="text-amber-600 font-bold mt-2 inline-block hover:underline">info@goalsfloors.com</a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-12 p-6 bg-gray-50 border border-gray-100 rounded-sm">
              <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">Business Hours</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between border-b pb-2"><span>Monday - Saturday</span> <span>10:00 AM - 7:00 PM</span></div>
                <div className="flex justify-between pt-2"><span>Sunday</span> <span className="text-amber-600 font-medium italic">Visits by Appointment Only</span></div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 shadow-2xl border border-gray-100 rounded-sm relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">FullName</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-amber-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                  <input type="tel" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-amber-500 transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Interested In</label>
                <select className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-amber-500 transition-all text-gray-600">
                  <option>Select Product...</option>
                  <option>WPC Louvers & Panels</option>
                  <option>Luxury Flooring</option>
                  <option>Baffle Ceilings</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-amber-500 transition-all resize-none"></textarea>
              </div>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest py-4 transition-all shadow-lg hover:shadow-amber-600/30 flex items-center justify-center gap-2">
                Send Message <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mt-4">
                <ShieldCheck className="w-3 h-3 text-amber-500" /> SECURE & PRIVATE CONSULTATION
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
