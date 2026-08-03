import { Toaster } from "react-hot-toast";
import GmcDashboardClient from "@/components/admin/gmc/GmcDashboardClient";

export const metadata = {
  title: "Merchant Center | Goals Floors Admin",
  description: "Manage Google Shopping product listings directly.",
};

export default async function GmcPage() {
  // SET THIS TO TRUE ONCE PAYMENT GATEWAY IS INTEGRATED
  const isPaymentGatewayActive = false;

  if (!isPaymentGatewayActive) {
    return (
      <div className="w-full h-[calc(100vh-100px)] overflow-hidden relative bg-slate-50 dark:bg-slate-900 rounded-xl">
        <Toaster position="top-right" />
        
        {/* Fake Static Dashboard Background (No API calls, no scroll) */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none select-none blur-sm p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="h-8 w-64 bg-slate-300 rounded-md"></div>
            <div className="h-10 w-32 bg-blue-300 rounded-md"></div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="flex-1 bg-slate-200 rounded-xl mt-4"></div>
        </div>

        {/* Actual Overlay Content (Google Style) */}
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center max-w-lg text-center px-6">
             
             {/* Detailed SVG Illustration (Looks like an image) */}
             <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-8 drop-shadow-xl">
               <rect x="30" y="40" width="180" height="110" rx="12" fill="#E8F0FE" className="dark:fill-slate-800" />
               <path d="M30 52C30 45.3726 35.3726 40 42 40H198C204.627 40 210 45.3726 210 52V70H30V52Z" fill="#4285F4" />
               <circle cx="50" cy="55" r="4" fill="white" fillOpacity="0.8" />
               <circle cx="65" cy="55" r="4" fill="white" fillOpacity="0.8" />
               <circle cx="80" cy="55" r="4" fill="white" fillOpacity="0.8" />
               <rect x="55" y="90" width="130" height="12" rx="6" fill="#D2E3FC" className="dark:fill-slate-600" />
               <rect x="55" y="115" width="90" height="12" rx="6" fill="#D2E3FC" className="dark:fill-slate-600" />
               
               {/* Credit Card Graphic */}
               <g transform="translate(130, 85)">
                 <rect x="0" y="0" width="65" height="45" rx="6" fill="#FABB05" />
                 <rect x="0" y="10" width="65" height="8" fill="#E37400" />
                 <rect x="10" y="30" width="15" height="5" rx="2" fill="#FFE3A8" />
                 <circle cx="50" cy="32" r="5" fill="#EA4335" fillOpacity="0.9" />
                 <circle cx="43" cy="32" r="5" fill="#34A853" fillOpacity="0.9" />
               </g>

               {/* Lock Icon */}
               <g transform="translate(100, 15)">
                 <rect x="10" y="18" width="20" height="16" rx="3" fill="#EA4335" />
                 <path d="M14 18V13C14 9.68629 16.6863 7 20 7V7C23.3137 7 26 9.68629 26 13V18" stroke="#EA4335" strokeWidth="4" strokeLinecap="round" />
                 <circle cx="20" cy="26" r="2" fill="white" />
               </g>
             </svg>

             <h2 className="text-3xl font-normal text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
               Payment gateway required
             </h2>
             <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8">
               To activate Google Merchant Center and sync your products, a verified payment gateway must be active on your website. Google automatically rejects listings from stores without checkout capabilities.
             </p>
             
             <div className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-6 py-3 rounded-full">
               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               This dashboard will be unlocked once gateway integration is complete
             </div>
          </div>
        </div>
      </div>
    );
  }

  // THIS WILL RENDER WHEN THE GATEWAY IS ACTIVE
  return (
    <div className="w-full">
      <Toaster position="top-right" />
      <GmcDashboardClient />
    </div>
  );
}
