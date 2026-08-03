"use client";

import React from "react";

interface RoleBadgeProps {
  role: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export default function RoleBadge({ role, size = "md", className = "", showText = true }: RoleBadgeProps) {
  const normalizedRole = role?.toLowerCase() || "";
  const isStaff = ["administrator", "admin", "team", "accountant"].includes(normalizedRole);
  if (!isStaff) return null;

  const isAdmin = ["administrator", "admin"].includes(normalizedRole);
  const isAccountant = normalizedRole === "accountant";
  
  const badgeImg = isAdmin ? "/images/admin-badge.png" : "/images/team-badge.png";
  
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  let textLabel = "Team";
  if (isAdmin) textLabel = "Admin";
  if (isAccountant) textLabel = "Accountant";

  let bgClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (isAdmin) bgClass = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (isAccountant) bgClass = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

  return (
    <span className={`inline-flex items-center gap-1.5 ${showText ? `${bgClass} px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest` : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={badgeImg} 
        alt={textLabel} 
        className={`${sizeClasses[size]} rounded-full object-cover shadow-sm`}
      />
      {showText && <span>{textLabel}</span>}
    </span>
  );
}
