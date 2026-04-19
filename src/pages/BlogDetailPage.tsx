import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import blogsData from '../data/blogs.json';

export default function BlogDetailPage() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const blog = blogsData.find(b => b.id === blogId);

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 pb-16 section-padding">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-brand-navy mb-4">Beitrag nicht gefunden</h1>
            <p className="text-slate-600 mb-8">Der angeforderte Blogbeitrag existiert nicht.</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white font-bold rounded-xl hover:bg-brand-navy transition-all"
            >
              <ArrowLeft size={18} />
              Zurück zum Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get related posts (same category, different post)
  const relatedPosts = blogsData
    .filter(b => b.category === blog.category && b.id !== blog.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section with Image */}
      <section className="relative h-96 md:h-[500px] overflow-hidden bg-slate-200 pt-20">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-[0.15em]">
              <Tag size={14} />
              {blog.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-4xl">
              {blog.title}
            </h1>
          </motion.div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="absolute top-24 left-8 md:left-12 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all font-semibold text-sm"
        >
          <ArrowLeft size={16} />
          Zurück
        </button>
      </section>

      {/* Article Content */}
      <section className="py-16 md:py-24 section-padding">
        <div className="max-w-3xl mx-auto">
          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-8 mb-12 pb-8 border-b border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <User size={20} className="text-brand-teal" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Autor</p>
                <p className="font-semibold text-brand-navy">{blog.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <Calendar size={20} className="text-brand-teal" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Datum</p>
                <p className="font-semibold text-brand-navy">
                  {new Date(blog.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              {blog.excerpt}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              {blog.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 my-8">
              {blog.tags.map((tag) => (
                <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-semibold hover:bg-brand-teal hover:text-white transition-all cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Partner Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-brand-teal/10 to-brand-navy/10 p-8 rounded-2xl border border-brand-teal/20 mb-16"
          >
            <p className="text-sm text-slate-600 mb-2">Dieser Beitrag stammt von</p>
            <a
              href={blog.partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-extrabold text-brand-navy hover:text-brand-teal transition-colors"
            >
              {blog.partnerName} ↗
            </a>
            <p className="text-slate-600 mt-4 text-sm">
              Besuchen Sie die Website unseres Partners, um mehr über ihre Arbeit und Projekte zu erfahren.
            </p>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 py-8 border-y border-slate-200"
          >
            <span className="font-semibold text-slate-600">Teilen:</span>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-all" title="Share on Twitter">
              <Share2 size={20} className="text-slate-600 hover:text-brand-teal" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-white border-t border-slate-100">
          <div className="section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl font-extrabold text-brand-navy mb-4">
                Weitere Beiträge aus der Kategorie <span className="text-brand-teal">{blog.category}</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-brand-teal hover:shadow-lg transition-all"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="relative h-48 overflow-hidden bg-slate-200">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-extrabold text-brand-navy mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-brand-teal font-bold group-hover:gap-3 transition-all">
                        Lesen <span>→</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
