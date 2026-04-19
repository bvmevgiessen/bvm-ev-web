import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import blogsData from '../data/blogs.json';

export default function Blog() {
  // Get the latest 3 blog posts
  const latestBlogs = [...blogsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section id="blog" className="bg-slate-50 py-32 overflow-hidden border-t border-slate-100">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 rounded-full text-brand-teal text-xs font-black uppercase tracking-[0.2em] mb-6"
            >
              <Tag size={14} /> Blog & Insights
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-brand-navy mb-6 leading-tight">
              Neueste Beiträge von unseren <span className="text-brand-teal">Partnern</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Lesen Sie die aktuellsten Perspektiven, Insights und Geschichten von unseren Partnern aus der Mittelhessen-Region.
            </p>
          </div>
          <Link 
            to="/blog"
            className="group flex items-center gap-3 font-black text-brand-navy hover:text-brand-teal transition-all text-lg"
          >
            Alle Beiträge 
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all">
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl border border-slate-100 transition-all duration-500 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm text-brand-teal text-xs font-black uppercase tracking-[0.15em] rounded-full border border-white/50">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex-1 flex flex-col">
                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 mb-4 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-teal" />
                    <span>{new Date(blog.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-brand-teal" />
                    <span className="font-medium">{blog.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-brand-navy mb-3 leading-tight line-clamp-2 group-hover:text-brand-teal transition-colors">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Read More Link */}
                <Link
                  to={`/blog/${blog.id}`}
                  className="inline-flex items-center gap-2 text-brand-teal font-black group/link hover:gap-3 transition-all"
                >
                  Mehr lesen
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
