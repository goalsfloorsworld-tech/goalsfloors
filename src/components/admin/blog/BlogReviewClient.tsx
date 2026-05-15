"use client";

import React, { useState } from "react";
import { approveBlog, rejectBlog } from "@/actions/admin-blog";
import { Check, X, ArrowLeft, Loader2, Calendar, FileText } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured_image: string | null;
  content: string;
  created_at: string;
  author_id: string;
};

export default function BlogReviewClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    if (!selectedBlog) return;
    setIsApproving(true);
    try {
      await approveBlog(selectedBlog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
      setSelectedBlog(null);
    } catch (error) {
      console.error(error);
      alert("Failed to approve blog.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBlog) return;
    if (!window.confirm("Are you sure you want to permanently delete this blog?")) return;
    
    setIsRejecting(true);
    try {
      await rejectBlog(selectedBlog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
      setSelectedBlog(null);
    } catch (error) {
      console.error(error);
      alert("Failed to reject blog.");
    } finally {
      setIsRejecting(false);
    }
  };

  if (selectedBlog) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button 
          onClick={() => setSelectedBlog(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft size={16} /> Back to pending list
        </button>

        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
          {selectedBlog.featured_image && (
            <div className="w-full aspect-[21/9] bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
              <img 
                src={selectedBlog.featured_image} 
                alt={selectedBlog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-10 space-y-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                {selectedBlog.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(selectedBlog.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                  /blogs/{selectedBlog.slug}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-400">
              {selectedBlog.description}
            </div>

            <div className="py-6 border-t border-slate-100 dark:border-slate-800">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-img:mx-auto prose-headings:font-bold prose-a:text-green-600"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }} 
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-6 flex items-center justify-end gap-4 sticky bottom-0 z-10">
            <button
              onClick={handleReject}
              disabled={isApproving || isRejecting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 font-medium transition-colors disabled:opacity-50"
            >
              {isRejecting ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
              Reject & Delete
            </button>
            <button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              {isApproving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              Approve & Publish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pending Review</h2>
          <p className="text-slate-500">You have {blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'} waiting for approval.</p>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center p-16 rounded-2xl border border-dashed border-gray-300 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
          <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">All caught up!</h3>
          <p className="text-slate-500 mt-2">There are no pending blogs to review right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              {blog.featured_image ? (
                <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                  <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-medium text-sm">Review Blog</span>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  <FileText size={32} className="text-slate-300 dark:text-slate-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-medium text-sm">Review Blog</span>
                  </div>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {blog.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
