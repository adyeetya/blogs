'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Dynamically import AdminBlogsList to avoid SSR issues with react-query
const AdminBlogsList = dynamic(() => import('@/components/AdminBlogsList'), { ssr: false });

const AdminBlogsPage = () => {
  return (
    <div className="min-h-screen mt-12 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="text-black bg-gray-200 py-1 rounded"
          passHref
        >
          <Button>Back to Admin</Button>
        </Link>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
          <Link
            href="/admin/create-blog"
            className="text-white bg-gray-600 rounded"
            passHref
          >
            <Button>Create Blog</Button>
          </Link>
        </div>
        <AdminBlogsList />
      </div>
    </div>
  );
};

export default AdminBlogsPage;