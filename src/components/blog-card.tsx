"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useTheme } from "next-themes";

export interface BlogPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
    }>;
    "wp:term"?: Array<Array<{
      name: string;
    }>>;
  };
}

export default function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredMedia?.source_url;
  const imageAlt = featuredMedia?.alt_text || "Goals Floors Blog Image";

  // Calculate approximate reading time (assume 200 words per min)
  const wordCount = post.content.rendered.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Date formatting
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/5 dark:hover:shadow-amber-500/5 hover:-translate-y-2 transition-all duration-500 h-full"
    >
      <Link href={`/blogs/${post.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read {post.title.rendered}</span>
      </Link>

      <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-700 ease-out">
             {/* Light Mode Logo */}
             <Image
                src="/images/goals floors logo.svg"
                alt="Goals Floors"
                width={120}
                height={40}
                priority
                className="opacity-40 block dark:hidden object-contain"
              />
             {/* Dark Mode Logo */}
             <Image
                src="/images/goals-floors-logo-white.svg"
                alt="Goals Floors"
                width={120}
                height={40}
                priority
                className="opacity-20 hidden dark:block object-contain"
              />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6 md:p-8">
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        <h3 
          className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <div 
          className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 text-ellipsis flex-1"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-sm font-semibold text-amber-600 group-hover:text-amber-700 dark:text-amber-500 dark:group-hover:text-amber-400 transition-colors uppercase tracking-widest">
          Read Article
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
}
