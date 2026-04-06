import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileX } from "lucide-react";
import SearchBar from "@/components/search-bar";
import BlogCard, { BlogPost } from "@/components/blog-card";

export const metadata: Metadata = {
  title: "Insights & Industry News | Goals Floors",
  description: "Explore the latest trends, insights, and expert knowledge in premium flooring, architectural ceilings, and facade solutions.",
};

const API_BASE_URL = "https://lime-hummingbird-549929.hostingersite.com/wp-json/wp/v2";

async function getPosts(page: number, query: string) {
  const url = new URL(`${API_BASE_URL}/posts`);
  url.searchParams.append("_embed", "true");
  url.searchParams.append("per_page", "9");
  url.searchParams.append("page", page.toString());
  
  if (query) {
    url.searchParams.append("search", query);
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!res.ok) {
      if (res.status === 400 && page > 1) {
         // Page out of bounds
         return { posts: [], totalPages: 0, error: false };
      }
      throw new Error(`Failed to fetch posts: ${res.statusText}`);
    }

    const totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    const posts = await res.json();

    return { posts, totalPages, error: false };
  } catch (error) {
    console.error("Error fetching WP posts:", error);
    return { posts: [], totalPages: 0, error: true };
  }
}

// NextJS 15+ compatible typing for page props
export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const searchQuery = typeof params.q === "string" ? params.q : "";

  const { posts, totalPages, error } = await getPosts(currentPage, searchQuery);

  const prevPage = currentPage - 1 > 0 ? currentPage - 1 : null;
  const nextPage = currentPage + 1 <= totalPages ? currentPage + 1 : null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 selection:bg-amber-100 dark:selection:bg-amber-900/40">
      {/* Hero Header Section */}
      <section className="relative pt-12 pb-12 md:pt-20 md:pb-20 overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-500 opacity-20 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight mb-6">
            Architectural <span className="text-amber-600 italic">Journal</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
            Explore our curated thoughts, industry trends, and deep dives into the world of premium flooring and architectural finishes.
          </p>

          <SearchBar />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-8 rounded-2xl text-center border border-red-100 dark:border-red-900/50">
            <FileX className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Failed to load journal entries</h2>
            <p>Please check your connection or try again later.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-16 rounded-3xl text-center border border-gray-100 dark:border-gray-800 shadow-xl">
            <SearchIcon className="w-16 h-16 mx-auto mb-6 text-gray-300 dark:text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">No articles found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? `We couldn't find anything matching "${searchQuery}". Try different keywords.` : "There are currently no articles published."}
            </p>
            {searchQuery && (
              <Link href="/blogs" className="inline-flex items-center justify-center mt-8 px-6 py-3 bg-gray-900 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors">
                Clear Search Results
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: BlogPost, index: number) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <PaginationLink
              page={prevPage}
              query={searchQuery}
              disabled={!prevPage}
              direction="prev"
            />
            
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mx-4">
              Page {currentPage} of {totalPages}
            </span>

            <PaginationLink
              page={nextPage}
              query={searchQuery}
              disabled={!nextPage}
              direction="next"
            />
          </div>
        )}
      </section>
    </main>
  );
}

// Helper components
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function PaginationLink({ 
  page, 
  query, 
  disabled, 
  direction 
}: { 
  page: number | null; 
  query: string; 
  disabled: boolean;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  
  if (disabled || !page) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-slate-900/50">
        {isPrev && <ChevronLeft className="w-4 h-4" />}
        {isPrev ? "Previous" : "Next"}
        {!isPrev && <ChevronRight className="w-4 h-4" />}
      </button>
    );
  }

  const url = `/blogs?page=${page}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

  return (
    <Link 
      href={url}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900/50 transition-all font-medium"
    >
      {isPrev && <ChevronLeft className="w-4 h-4" />}
      {isPrev ? "Previous" : "Next"}
      {!isPrev && <ChevronRight className="w-4 h-4" />}
    </Link>
  );
}
