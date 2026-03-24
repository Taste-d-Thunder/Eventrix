/**
 * app/vendor/services/page.tsx — Redirect to vendor dashboard services
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VendorServicesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/vendor/dashboard/services");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-sm text-slate-500">Redirecting to vendor services…</p>
    </div>
  );
}
