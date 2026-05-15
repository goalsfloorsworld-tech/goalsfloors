import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { clerkClient } from "@clerk/nextjs/server";

import { createClient } from "@supabase/supabase-js";

const API_BASE_URL = "https://lime-hummingbird-549929.hostingersite.com/wp-json/wp/v2";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type NormalizedPost = {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt: string;
  date: string;
  authorId?: string;
};

async function getUniversalPostData(slug: string): Promise<NormalizedPost | null> {
  // 1. Try Supabase First
  const { data: supabaseBlog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (supabaseBlog && !error) {
    return {
      title: supabaseBlog.title,
      content: supabaseBlog.content,
      excerpt: supabaseBlog.description,
      imageUrl: supabaseBlog.featured_image || null,
      imageAlt: supabaseBlog.featured_image_alt || supabaseBlog.title,
      date: supabaseBlog.created_at || new Date().toISOString(),
      authorId: supabaseBlog.author_id,
    };
  }

  // 2. Fallback to WordPress
  const url = `${API_BASE_URL}/posts?slug=${slug}&_embed`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length > 0) {
      const post = data[0];
      const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
      return {
        title: post.title.rendered,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, ''),
        imageUrl: featuredMedia?.source_url || null,
        imageAlt: featuredMedia?.alt_text || post.title.rendered,
        date: post.date,
      };
    }
  } catch (err) {
    console.error("Error fetching individual post:", err);
  }
  
  return null;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getUniversalPostData(resolvedParams.slug);
  const canonical = `/blogs/${resolvedParams.slug}`;

  if (!post) {
    return {
      title: "Article Not Found | Goals Floors",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${post.title} | Goals Floors Insights`,
    description: post.excerpt,
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title: `${post.title} | Goals Floors Insights`,
      description: post.excerpt,
      images: post.imageUrl ? [
        {
          url: post.imageUrl,
          alt: post.imageAlt,
        },
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Goals Floors Insights`,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getUniversalPostData(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const { title, content, imageUrl, imageAlt, date, authorId } = post;

  // Extract author name
  let authorName = "Goals Floors Team";
  if (authorId) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(authorId);
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (name) {
        authorName = name;
      }
    } catch (e) {
      console.error("Failed to fetch author name", e);
    }
  }

  // Calculate read time
  const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Date formatting
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pb-24 selection:bg-amber-100 dark:selection:bg-amber-900/40">
      {/* Return to Blogs */}
      <div className="fixed top-24 left-4 z-50 hidden xl:block">
        <Link
          href="/blogs"
          className="flex items-center gap-2 p-3 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md rounded-full text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-900/5 hover:text-amber-600 dark:hover:text-amber-500 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="sr-only">Back to Insights</span>
        </Link>
      </div>

      {/* Hero Header */}
      <header className="relative w-full pt-10 pb-12 md:pt-5 md:pb-20 overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/blogs" className="inline-flex items-center text-sm font-semibold text-amber-600 uppercase tracking-widest mb-8 hover:text-amber-700 transition-colors xl:hidden">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>

          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white tracking-tight leading-tight mb-8"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              {authorName}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <time dateTime={date}>{formattedDate}</time>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-semibold bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 hidden sm:block">
        <div className="aspect-[21/9] md:aspect-[2.35/1] relative rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-900/10 border-4 border-white dark:border-slate-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-gray-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              <Image
                src="/images/goals floors logo.png"
                alt="Goals Floors"
                width={200}
                height={60}
                priority
                className="opacity-30 object-contain dark:invert"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Featured Image - Without border overlap for smaller screens */}
      <div className="w-full relative sm:hidden px-4 py-3">
        <div className="aspect-[16/9] relative overflow-hidden bg-gray-100 rounded-2xl">
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-gray-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center" />
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20">
        <div
          className="wp-content prose prose-lg md:prose-xl prose-stone dark:prose-invert max-w-none
                     prose-headings:font-bold prose-headings:tracking-tight prose-a:text-amber-600 hover:prose-a:text-amber-700
                     prose-h2:text-black dark:prose-h2:text-white prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight
                     [&_h2_strong]:text-inherit
                     prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:italic
                     prose-strong:text-black dark:prose-strong:text-amber-100"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Footer Actions */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Written By</p>
              <p className="font-semibold text-gray-900 dark:text-white">{authorName}</p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
