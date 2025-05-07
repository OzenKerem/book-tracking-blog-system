'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getFeaturedPosts, BlogPost } from '@/lib/blogService';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getFeaturedPosts();
        setFeaturedPosts(posts);
      } catch (error) {
        console.error('Error loading featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Merhaba, Ben Kerem Özen Çifçi</h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Python, Next.js, React ve diğer teknolojilerle modern web uygulamaları geliştiriyorum.
              Projelerimi ve düşüncelerimi paylaştığım portfolyo ve blog sayfama hoş geldiniz.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
              >
                Projeleri Görüntüle
              </Link>
              <Link
                href="/blog"
                className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full border border-white transition-colors"
              >
                Blogumu Oku
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Son Blog Yazılarım</h2>
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {featuredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                          {post.category}
                        </div>
                        <span className="text-gray-400 text-sm ml-2">
                          {post.date} • {post.readingTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-300 mb-4">{post.summary}</p>
                      <Link 
                        href={`/blog/${post.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center transition-colors"
                      >
                        Devamını oku
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link 
                href="/blog"
                className="inline-block bg-transparent hover:bg-gray-700 text-white font-medium py-2 px-6 border border-gray-600 rounded-md transition-colors"
              >
                Tüm yazıları görüntüle
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Frontend Geliştirme</h3>
            <p className="text-gray-300">
              React, Next.js, TypeScript, Tailwind CSS, Framer Motion
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Backend Geliştirme</h3>
            <p className="text-gray-300">
              Node.js, Express, MongoDB, PostgreSQL, REST API'ler
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Diğer Beceriler</h3>
            <p className="text-gray-300">
              Python, Git, Docker, AWS, Test Yazımı
            </p>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-8">İletişime Geçelim</h2>
          <p className="text-xl text-gray-300 mb-8">
            Yeni projeler ve fırsatlar için her zaman görüşmeye açığım.
          </p>
          <a
            href="mailto:keremazencifci@gmail.com"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Mesaj Gönder
          </a>
        </motion.div>
      </section>
    </main>
  );
}