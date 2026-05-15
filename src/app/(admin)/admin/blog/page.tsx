import { Metadata } from "next";
import { getPendingBlogs } from "@/actions/admin-blog";
import BlogReviewClient from "@/components/admin/blog/BlogReviewClient";

export const metadata: Metadata = {
  title: "Blog Review | Admin",
  description: "Review and approve pending user-submitted blogs.",
};

export default async function AdminBlogReviewPage() {
  const pendingBlogs = await getPendingBlogs();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Content Review
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Review, approve, and publish user-submitted articles.
        </p>
      </div>

      <BlogReviewClient initialBlogs={pendingBlogs} />
    </div>
  );
}
