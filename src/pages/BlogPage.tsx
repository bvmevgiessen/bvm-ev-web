import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, Tag, Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import blogsData from '../data/blogs.json';
import { Link } from 'react-router-dom';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(blogsData.map(blog => blog.category)));

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogsData.filter(blog => {
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Sort by date (newest first)
  const sortedBlogs = [...filteredBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 border-b border-slate-100 bg-white">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 rounded-full text-brand-teal text-xs font-black uppercase tracking-[0.2em] mb-6">
              <Tag size={14} /> Blog & Insights
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-brand-navy mb-6 leading-tight">
              Blog & News
            </h1>
            <p className="text-slate-600 text-lg md:text-xl">
              Entdecken Sie die neuesten Beiträge, Insights und Geschichten von unseren Partnern aus Mittelhessen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-100 sticky top-[4rem] z-40">
        <div className="section-padding">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Beiträge durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === null
                    ? 'bg-brand-teal text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-teal'
                }`}
              >
                Alle Kategorien
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-brand-teal text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-teal'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-sm text-slate-600">
              {sortedBlogs.length} {sortedBlogs.length === 1 ? 'Beitrag' : 'Beiträge'} gefunden
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="section-padding">
          {sortedBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedBlogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
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

                    {/* Partner Link */}
                    <div className="text-xs text-slate-500 mb-4 pb-4 border-t border-slate-100">
                      von <a href={blog.partnerUrl} target="_blank" rel="noopener noreferrer" className="text-brand-teal font-semibold hover:underline">{blog.partnerName}</a>
                    </div>

                    {/* Read More Link */}
                    <Link
                      to={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-2 text-brand-teal font-black group/link hover:gap-3 transition-all"
                    >
                      Mehr lesen
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-slate-600 mb-4">Keine Beiträge gefunden</p>
              <p className="text-slate-500">Versuchen Sie, Ihre Suchkriterien anzupassen oder alle Kategorien anzuzeigen.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
