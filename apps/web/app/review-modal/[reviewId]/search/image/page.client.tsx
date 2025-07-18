'use client';

import { useQueryClient } from '@tanstack/react-query';
import ReviewOnboardingModal from 'app/review-modal/components/ReviewOnboardingModal';
import LoadingSvg from 'components/loading/loading-svg';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type {
  ApiResponseImageReviewDetailResponse,
  ImageReviewDetailResponse,
} from '../../../../../api/data-contracts';
import { ApiResponse } from '../../../../../app/api/api-response';
import {
  ApiReviewItem,
  ApiReviewSearchResponse,
  ImageReviewResponse,
} from '../../../../../app/api/review-response';
import { REVIEW_KEYS } from '../../../../../constants/query-key';
import {
  CategoryNameEng,
  CategoryOptionEng,
} from '../../../../../types/category';
import {
  isValidCategoryKey,
  isValidCategoryOption,
} from '../../../../../utils/category';
import ReviewModalSwiper from '../../../components/review-modal-swiper';
import { useAllImageReviewDetails } from '../../../hooks/review-api';
import type { ReviewDetail } from '../../../types';

const formatDateToJapanese = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
};

interface ImageReviewClientPageProps {
  userStatus: boolean;
}

export default function ClientPage({ userStatus }: ImageReviewClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');
  const middleCategory = searchParams.get('middleCategory');
  const subCategory = searchParams.get('subCategory');
  const queryClient = useQueryClient();

  const validMiddleCategory: CategoryNameEng | '' = isValidCategoryKey(
    middleCategory || ''
  )
    ? (middleCategory as CategoryNameEng)
    : '';
  const validSubCategory: CategoryOptionEng | '' =
    validMiddleCategory &&
    isValidCategoryOption(subCategory || '', validMiddleCategory)
      ? (subCategory as CategoryOptionEng)
      : '';

  let reviewData: ImageReviewResponse[] | ApiReviewItem[] = [];

  if (keyword) {
    const searchCacheData = queryClient.getQueryData<
      ApiResponse<ApiReviewSearchResponse>
    >([...REVIEW_KEYS.IMAGE_LIST({ page: 0, size: 8 }), 'search', keyword]);
    reviewData = searchCacheData?.data?.reviews || [];
  } else if (validMiddleCategory) {
    const categoryCacheData = queryClient.getQueryData<
      ApiResponse<ApiReviewSearchResponse>
    >([
      ...REVIEW_KEYS.IMAGE_LIST({ page: 0, size: 8 }),
      'category',
      validMiddleCategory,
      validSubCategory,
      'IMAGE',
    ]);
    reviewData = categoryCacheData?.data?.reviews || [];
  }

  const { reviewId: reviewIdParam } = useParams() as { reviewId: string };
  const currentReviewId = Number(reviewIdParam);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(true);
  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
  };

  const detailQueries = useAllImageReviewDetails(reviewData);
  const currentIndex = reviewData.findIndex(
    (review) => review.reviewId === currentReviewId
  );

  useEffect(() => {
    if (currentIndex === -1) {
      router.back();
    }
  }, [currentIndex]);

  if (detailQueries.some((q) => q.isLoading)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black">
        <LoadingSvg />
      </div>
    );
  }

  const detailMap = new Map<number, ImageReviewDetailResponse>();
  reviewData.forEach((review, index) => {
    const dq = detailQueries[index];
    if (dq?.isSuccess && dq.data) {
      const response = dq.data as ApiResponseImageReviewDetailResponse;
      if (response.data) {
        detailMap.set(review.reviewId, response.data);
      }
    }
  });
  console.log('detailQueriesfirst' + detailQueries);
  console.log('reviewData' + reviewData);

  // if (currentIndex === -1) {
  //   router.back();
  // }

  const allReviews: ReviewDetail[] = reviewData
    .filter((review) => {
      const detail = detailMap.get(review.reviewId);
      return !!detail && detail.images.length > 0;
    })
    .map((review) => {
      const detail = detailMap.get(review.reviewId)!;
      return {
        reviewId: detail.reviewId,
        productId: detail.productId,
        writtenTime: formatDateToJapanese(detail.writtenTime),
        receiptUploaded: detail.receiptUploaded,
        positiveComment: detail.positiveComment,
        negativeComment: detail.negativeComment,
        authorName: detail.authorName,
        profileImageUrl: detail.profileImageUrl ?? null,
        rating: detail.rating,
        option: detail.option || '',
        likeCount: detail.likeCount,
        isLiked: detail.isLiked,
        brandName: detail.brandName,
        productName: detail.productName,
        productImageUrl: detail.productImageUrl,
        mediaList: detail.images.map((url, index) => ({
          id: index,
          type: 'image' as const,
          url,
        })),
      };
    });

  return (
    <>
      {isOnboardingOpen && (
        <ReviewOnboardingModal handleCloseOnboarding={handleCloseOnboarding} />
      )}
      <ReviewModalSwiper
        userStatus={userStatus}
        currentIndex={currentIndex}
        reviews={allReviews}
        onClose={() => router.back()}
      />
    </>
  );
}
