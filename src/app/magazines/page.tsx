'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMagazines } from '@/lib/magazinesApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Magazine = {
  _id: string;
  title: string;
  slug: string;
  dateOfPublish?: string;
  author?: string;
  publisher?: string;
  coverSummary?: string;
  keywords?: string[];
  coverImageUrl?: string;
};

type MagazineApiResponse = {
  success: boolean;
  data: Magazine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

const PAGE_SIZE = 12;

export default function MagazinesPage() {
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isError
  } = useQuery<MagazineApiResponse>({
    queryKey: ['magazines', page],
    queryFn: () => fetchMagazines({ page, limit: PAGE_SIZE }),
  });

  const magazines: Magazine[] = (data && 'data' in data ? data.data : []) || [];
  const pagination = (data && 'pagination' in data ? data.pagination : { page: 1, totalPages: 1, hasNextPage: false });

  return (
    <main className="min-h-screen mt-16  py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600  mb-4 font-poppins">
            Middle East Magazines
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our latest and past magazine issues, curated for the Middle East&apos;s new narrative.
          </p>
        </div>
        
        <Separator className="mb-8 bg-orange-500 " />

        {/* Magazine Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-orange-500">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <div className="text-destructive text-xl font-medium mb-2">Failed to load magazines</div>
            <p className="text-muted-foreground mb-4">Please try again later</p>
            <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600">
              Retry
            </Button>
          </div>
        ) : magazines.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl text-orange-300 dark:text-orange-700 mb-4">📚</div>
            <h3 className="text-xl font-medium text-foreground mb-2">No magazines found</h3>
            <p className="text-muted-foreground">Check back later for new issues</p>
          </div>
        ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
  {magazines.map((mag) => (
    <Card 
      key={mag._id} 
      className="group relative overflow-hidden transition-all duration-500 bg-white border-0 shadow-md hover:shadow-xl rounded-xl"
    >
      {/* Image Container with Gradient Overlay */}
      <CardHeader className="p-0 relative overflow-hidden">
        {mag.coverImageUrl ? (
          <div className="overflow-hidden relative">
            <img
              src={mag.coverImageUrl}
              alt={mag.title}
              width={320}
              height={192}
              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <div className="text-5xl text-white opacity-90">📖</div>
          </div>
        )}
        
        {/* Badge positioned on image */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white text-orange-600 border-0 font-semibold px-3 py-1 hover:bg-white/90 shadow-md">
            Issue
          </Badge>
        </div>
        
        {/* Title on image for visual impact */}
        <div className="absolute bottom-4 left-4 right-4">
          <CardTitle className="text-lg font-bold text-white line-clamp-2 drop-shadow-md">
            {mag.title}
          </CardTitle>
        </div>
      </CardHeader>
      
      {/* Content Area */}
      <CardContent className="p-5">
        {/* Summary */}
        <CardDescription className="mb-4 line-clamp-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
          {mag.coverSummary || 'No summary available.'}
        </CardDescription>
        
        {/* Keywords */}
        {mag.keywords && mag.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {mag.keywords.slice(0, 3).map((kw) => (
              <Badge 
                key={kw} 
                variant="outline" 
                className="text-xs bg-orange-50 text-orange-600 border-orange-200 px-2 py-1 rounded-full"
              >
                {kw}
              </Badge>
            ))}
            {mag.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 border-gray-200 px-2 py-1 rounded-full">
                +{mag.keywords.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Metadata with icons */}
        <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-3">
          {mag.dateOfPublish && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-orange-500" />
              <span>{new Date(mag.dateOfPublish).toLocaleDateString()}</span>
            </div>
          )}
          {mag.author && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-orange-500" />
              <span className="truncate">{mag.author}</span>
            </div>
          )}
          {mag.publisher && (
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-orange-500" />
              <span className="truncate">{mag.publisher}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* CTA Button */}
      <div className="px-5 pb-5">
        <Button 
          asChild 
          size="sm" 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <a href={`/magazine/${mag.slug}`}>
            Read Issue
          </a>
        </Button>
      </div>
      
      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-300 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </Card>
  ))}
</div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 border-orange-200 dark:border-orange-800 text-orange-500 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 p-0 ${
                      page === pageNum 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : 'border-orange-200 dark:border-orange-800 text-orange-500 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/50'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              {pagination.totalPages > 5 && page < pagination.totalPages - 2 && (
                <span className="text-muted-foreground mx-1">...</span>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="flex items-center gap-1 border-orange-200 dark:border-orange-800 text-orange-500 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}