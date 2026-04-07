import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Twitter, MessageCircle, Instagram, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

export default function ShareButtons({ title, url, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-[#25D366]',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-[#1DA1F2]',
    },
    {
      name: 'Instagram',
      icon: <Instagram size={20} />,
      href: 'https://www.instagram.com/',
      color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
      onClick: (e: React.MouseEvent) => {
        handleCopy();
        // We don't prevent default here so it also opens Instagram
      }
    }
  ];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Teilen</p>
      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.href}
            target={link.href === '#' ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={link.onClick}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`${link.color} text-white p-3 rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center transition-all`}
            title={`${link.name} teilen`}
          >
            {link.icon}
          </motion.a>
        ))}
        
        <motion.button
          onClick={handleCopy}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="bg-slate-100 text-slate-600 p-3 rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center transition-all relative"
          title="Link kopieren"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Check size={20} className="text-brand-teal" />
              </motion.div>
            ) : (
              <motion.div
                key="link"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <LinkIcon size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {copied && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-bold text-brand-teal uppercase tracking-widest"
          >
            Link kopiert! Teile ihn mit deinen Freunden.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
