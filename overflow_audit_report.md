# Mobile Horizontal Overflow Audit Report

This report identifies elements causing horizontal overflow on mobile viewports (320px, 375px, 390px, 430px) using actual DOM inspection.

## Homepage

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<section class="relative min-h-[500px] sm:min-h-[600px] md:min-h-[85vh] flex items-center justify-center overflow-hidden w-full max-w-full box-border">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-20 md:pt-24 md:pb-40 min-w-0">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<h1 class="text-3xl sm:text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl px-2 relative">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `288px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<span class="relative inline-block mt-2">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `272px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### HeroSection
- **File:** `HeroSection.tsx`
- **Element:** `<span class="absolute -inset-x-20 inset-y-0 bg-amber-500/40 blur-[100px] rounded-full -z-10 animate-pulse">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `432px`
- **Reason Overflow Happens:** Negative inset/margins on absolute positioned element pushes it outside the parent bounds.
- **Overflow Source:** absolute positioning, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<span class="absolute -inset-x-10 inset-y-0 bg-yellow-400/20 blur-[40px] rounded-full -z-10 animate-pulse delay-700">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `352px`
- **Reason Overflow Happens:** Negative inset/margins on absolute positioned element pushes it outside the parent bounds.
- **Overflow Source:** absolute positioning, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `272px`
- **Reason Overflow Happens:** Translate/Transform applied (matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)) moving it outside viewport.
- **Overflow Source:** translate, framer-motion transform, animation
- **Risk Level:** **RISKY FIX** (Involves complex animations or transforms. Check logic before changing.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<section class="pt-8 pb-24 bg-white dark:bg-slate-900 transition-colors duration-300">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### HeroSection
- **File:** `HeroSection.tsx`
- **Element:** `<div class="absolute -inset-6 bg-amber-500/30 blur-[60px] rounded-full opacity-60 animate-pulse">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `344px`
- **Reason Overflow Happens:** CSS animation forces element wider than viewport.
- **Overflow Source:** animation
- **Risk Level:** **RISKY FIX** (Involves complex animations or transforms. Check logic before changing.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-12 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### BrandMarquee
- **File:** `BrandMarquee.tsx`
- **Element:** `<div class="animate-marquee flex items-center gap-12 md:gap-24 px-12">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `3216px`
- **Reason Overflow Happens:** Translate/Transform applied (matrix(1, 0, 0, 1, -387.246, 0)) moving it outside viewport.
- **Overflow Source:** translate, framer-motion transform, animation
- **Risk Level:** **RISKY FIX** (Involves complex animations or transforms. Check logic before changing.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="absolute inset-0 pointer-events-none overflow-hidden">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="absolute h-px bg-amber-600 w-96 origin-left">`
- **Breaks at Viewports:** 320px, 375px
- **Computed Width:** `384px`
- **Reason Overflow Happens:** Translate/Transform applied (matrix(1, 0, 0, 1, 57.9467, -28.9733)) moving it outside viewport.
- **Overflow Source:** translate, framer-motion transform, animation
- **Risk Level:** **RISKY FIX** (Involves complex animations or transforms. Check logic before changing.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<a class="group shine-btn relative z-10 flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl shadow-amber-600/20 active:scale-95 w-fit overflow-hidden">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `236px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="border border-white/10 rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm w-full lg:max-w-none text-center lg:text-left relative overflow-hidden group">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `288px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<a class="inline-flex w-full lg:w-auto shine-btn justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/20 active:scale-95 uppercase tracking-widest">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `238px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

## Product Page

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased transition-colors duration-300 overflow-x-hidden max-w-full min-w-0">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-2 md:pb-0">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `288px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `286px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="bg-white dark:bg-slate-950 py-16 lg:py-24 transition-colors duration-300 overflow-hidden relative">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `288px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="relative h-[450px] md:h-[550px] w-full max-w-[500px] mx-auto lg:ml-auto translate-y-4">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `288px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="bg-white dark:bg-slate-950 py-8 lg:py-12 transition-colors duration-300 overflow-x-hidden">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="bg-gradient-to-br from-gray-900 to-slate-900 dark:from-slate-900 dark:to-black rounded-lg p-8 shadow-xl border border-gray-800 relative overflow-hidden group">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `288px`
- **Reason Overflow Happens:** Translate/Transform applied (matrix(0.9, 0, 0, 0.9, 0, 30)) moving it outside viewport.
- **Overflow Source:** translate, framer-motion transform, animation
- **Risk Level:** **RISKY FIX** (Involves complex animations or transforms. Check logic before changing.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="bg-gray-900 dark:bg-black py-10 lg:py-16 text-white transition-colors duration-300">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `320px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<div class="border border-white/10 rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm w-full lg:max-w-none text-center lg:text-left relative overflow-hidden group">`
- **Breaks at Viewports:** 320px, 375px, 390px, 430px
- **Computed Width:** `288px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

### Unknown Component (check classes)
- **File:** `Unknown`
- **Element:** `<a class="inline-flex w-full lg:w-auto shine-btn justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/20 active:scale-95 uppercase tracking-widest">`
- **Breaks at Viewports:** 390px, 430px
- **Computed Width:** `308px`
- **Reason Overflow Happens:** Content or padding pushes bounds past viewport width.
- **Overflow Source:** content, margin/padding
- **Risk Level:** **SAFE FIX** (Likely safe to add overflow-hidden or adjust max-width/padding.)

