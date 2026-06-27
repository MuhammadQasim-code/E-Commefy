import React from 'react';
import { HiSparkles, HiShieldCheck, HiOutlineHandThumbUp, HiFaceSmile } from 'react-icons/hi2';

const About = () => {
  const stats = [
    { label: 'Happy Customers', value: '100K+' },
    { label: 'Products Available', value: '5K+' },
    { label: 'Global Offices', value: '12' },
    { label: 'Years of Service', value: '5+' },
  ];

  const values = [
    { name: 'Customer Obsession', desc: 'We start with the customer and work backwards.', icon: HiFaceSmile },
    { name: 'Uncompromising Quality', desc: 'We source only from top manufacturers.', icon: HiShieldCheck },
    { name: 'Innovation & Trust', desc: 'We continually refine the shopping experience.', icon: HiSparkles },
    { name: 'Commitment to Values', desc: 'We practice sustainable, fair trade sourcing.', icon: HiOutlineHandThumbUp },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden py-24 px-8 text-center text-white bg-slate-900 border border-slate-800">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 to-slate-950 z-10" />
        
        <div className="relative z-20 max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            We are <span className="gradient-text font-black">E-Commefy</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Reimagining online shopping from the ground up. Delivering premium quality, unbeatable convenience, and modern aesthetics to your doorstep.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
            Our Story & Mission
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Founded in 2021, E-Commefy began with a simple idea: creating an elegant, secure, and blazing fast interface to browse the best products worldwide. We value authenticity and only host vetted brands.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Today, we serve hundreds of thousands of shoppers across borders. Our mission is to make online shopping delightful, intuitive, and secure for everyone, everywhere.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden h-96 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
            alt="Store Storefront"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="text-center p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 shadow-sm">
            <h3 className="text-4xl font-extrabold text-primary-500 dark:text-primary-400">{s.value}</h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Values Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Our Values</h2>
          <p className="text-slate-500 dark:text-slate-400">What guides E-Commefy forward</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="flex space-x-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 shadow-sm">
                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl h-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{v.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default About;
