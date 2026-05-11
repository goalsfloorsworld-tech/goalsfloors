'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { getOnboardingStatus } from '@/app/actions/onboarding';
import OnboardingModal from './OnboardingModal';
import { Loader2 } from 'lucide-react';

export default function OnboardingCheck() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function checkStatus() {
      if (!isSignedIn || !user) return;

      const result = await getOnboardingStatus();
      
      if (result.retry) {
        // Webhook might be slow, retry after 3 seconds
        setIsRetrying(true);
        timeoutId = setTimeout(checkStatus, 3000);
        return;
      }

      setIsRetrying(false);
      if (result.needsOnboarding !== undefined) {
        setNeedsOnboarding(result.needsOnboarding);
      }
    }

    if (isLoaded && isSignedIn) {
      checkStatus();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoaded, isSignedIn, user]);

  // Don't show anything while Clerk is loading or if user is logged out
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // Show a gentle loader if we are waiting for the profile to be created in DB
  if (isRetrying && needsOnboarding === null) {
    return (
      <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Initializing your premium experience...
        </p>
      </div>
    );
  }

  // Only show modal if status is explicitly true (needs onboarding)
  if (needsOnboarding === true) {
    return <OnboardingModal />;
  }

  return null;
}
