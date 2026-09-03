import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="NOBLE store logo" width={40} height={40} className="rounded-lg" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                NOBLE store
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover your unique style with our curated collection of trendy dresses and shoes for the modern woman.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-rose-400 transition-colors">Home</Link></li>
              <li><Link href="/collection" className="hover:text-rose-400 transition-colors">Collection</Link></li>
              <li><Link href="/services" className="hover:text-rose-400 transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-rose-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/collection?category=short-dresses" className="hover:text-rose-400 transition-colors">Short Dresses</Link></li>
              <li><Link href="/collection?category=long-dresses" className="hover:text-rose-400 transition-colors">Long Dresses</Link></li>
              <li><Link href="/collection?category=complete-clothes" className="hover:text-rose-400 transition-colors">Complete Clothes</Link></li>
              <li><Link href="/collection?category=tops" className="hover:text-rose-400 transition-colors">Tops</Link></li>
              <li><Link href="/collection?category=shorts" className="hover:text-rose-400 transition-colors">Shorts</Link></li>
              <li><Link href="/collection?category=skirts" className="hover:text-rose-400 transition-colors">Skirts</Link></li>
              <li><Link href="/collection?category=pants" className="hover:text-rose-400 transition-colors">Pants</Link></li>
              <li><Link href="/collection?category=shoes" className="hover:text-rose-400 transition-colors">Shoes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0788 626 555
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                noblestore252@gmail.com
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Remera (Car Parking), Kigali, Rwanda
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} NOBLE store. All rights reserved.
        </div>
        <div className="text-center text-xs text-gray-600 mt-4">
          Developed by <span className="text-gray-500">Nkusi Walter</span>
        </div>
      </div>
    </footer>
  )
}
