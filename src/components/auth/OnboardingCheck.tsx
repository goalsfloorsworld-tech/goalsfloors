'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { getOnboardingStatus } from '@/app/actions/onboarding';
import OnboardingModal from './OnboardingModal';
import { Loader2 } from 'lucide-react';

export default function OnboardingCheck() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  useEffect(() => {

    async function checkStatus() {
      if (!isSignedIn || !user) return;

      // Check cache first to avoid slow network request on every page load
      const cacheKey = `onboarding_completed_${user.id}`;
      const isCached = localStorage.getItem(cacheKey);

      if (isCached === 'true') {
        setNeedsOnboarding(false);
        return;
      }

      const result = await getOnboardingStatus();
      
      if ('error' in result) {
        console.error('Onboarding check error:', result.error);
        return;
      }

      if (result.needsOnboarding !== undefined) {
        setNeedsOnboarding(result.needsOnboarding);
        if (result.needsOnboarding === false) {
          localStorage.setItem(cacheKey, 'true');
        }
      }
    }

    if (isLoaded && isSignedIn) {
      checkStatus();
    }
  }, [isLoaded, isSignedIn, user]);

  // Don't show anything while Clerk is loading or if user is logged out
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // Only show modal if status is explicitly true (needs onboarding)
  if (needsOnboarding === true) {
    return <OnboardingModal />;
  }

  return null;
}
