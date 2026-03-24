'use client';

import { useEffect } from 'react';

import { recordViewHistory } from '@/utils/view-history';

type NewsViewTrackerProps = {
  slug: string;
  title: string;
};

export function NewsViewTracker({ slug, title }: NewsViewTrackerProps) {
  useEffect(() => {
    recordViewHistory({ slug, title, viewedAt: new Date().toISOString() });
  }, [slug, title]);

  return null;
}