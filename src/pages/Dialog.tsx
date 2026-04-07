import React from 'react';
import { motion } from 'motion/react';
import { Globe, Coffee, Users, ArrowLeft, Heart, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import PuzzleBackground from '../components/PuzzleBackground';

export default function Dialog() {
  return (
    <div className="min-h-screen bg-white">
      <PuzzleBackground color="#F97316" />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/dialog-cafe/1920/1080" 
            alt="Sprachcafé" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-orange font-bold mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={20} /> Zurück zur Startseite
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-sm mb-6">
              <Globe size={16} /> Dialogplattform
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-brand-navy mb-6 leading-tight">
              Respekt & <span className="text-brand-orange">Verständnis</span> schaffen
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Die Dialogplattform ist der zentrale Ort für Begegnung, Austausch und interkulturelles Lernen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Encounter Spaces */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">Begegnungsräume</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Informelle Lernzonen für den Austausch auf Augenhöhe.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8">
                <Users className="text-brand-orange" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Tandem-Programm</h3>
              <p className="text-slate-600 leading-relaxed">
                Gezielte Partnerschaften für den informellen Austausch und das Sprachenlernen.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8">
                <Coffee className="text-brand-orange" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-4">Regelmäßige Sprachcafés</h3>
              <p className="text-slate-600 leading-relaxed">
                Entspanntes Lernen bei Kaffee und Kuchen in einer lockeren Atmosphäre.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deep Learning */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-8">Tiefgehendes Lernen</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                Wir bieten interkulturelle Seminare und interreligiöse Veranstaltungen an, um Wissen zu vertiefen und den respektvollen Diskurs zu stärken.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <MessageSquare className="text-brand-orange shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Interreligiöse Events</h4>
                    <p className="text-sm text-slate-500">Dialog zwischen den Religionen fördern.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <Calendar className="text-brand-orange shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Seminare & Workshops</h4>
                    <p className="text-sm text-slate-500">Vorurteile abbauen durch gezielte Bildung.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/dialog-learning/800/1000" 
                alt="Learning" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shared Experiences */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">Gemeinsames Erleben</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Sport, Spiel und Kultur als Brückenbauer.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm flex items-center gap-8">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                <Heart className="text-brand-orange" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Sportliche Aktivitäten</h3>
                <p className="text-slate-500">Zusammenhalt durch Bewegung und Teamgeist.</p>
              </div>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm flex items-center gap-8">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                <Users className="text-brand-orange" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Internationaler Spieleabend</h3>
                <p className="text-slate-500">Begegnung für Jugendliche und Studierende.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
