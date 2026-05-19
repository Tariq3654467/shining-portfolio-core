import { Link } from "react-router-dom";
import { ShieldAlert, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerification } from "@/hooks/useVerification";

type VerificationRequiredBannerProps = {
  feature?: string;
};

export function VerificationRequiredBanner({
  feature = "browse members and appear in search results",
}: VerificationRequiredBannerProps) {
  const { loading, isFullyVerified, emailVerified, phoneVerified } = useVerification();

  if (loading || isFullyVerified) return null;

  return (
    <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-6 text-center">
      <ShieldAlert className="h-10 w-10 text-amber-600 mx-auto mb-3" />
      <h2 className="text-lg font-heading font-semibold text-amber-950 dark:text-amber-100">
        Verification required
      </h2>
      <p className="text-sm text-amber-900/80 dark:text-amber-200/80 mt-2">
        Complete email and phone verification to {feature}.
      </p>
      <ul className="flex flex-wrap justify-center gap-3 mt-4 text-xs font-medium">
        <li className={emailVerified ? "text-green-700" : "text-amber-800"}>
          <Mail className="inline h-3.5 w-3.5 mr-1" />
          Email {emailVerified ? "✓" : "pending"}
        </li>
        <li className={phoneVerified ? "text-green-700" : "text-amber-800"}>
          <Phone className="inline h-3.5 w-3.5 mr-1" />
          Phone {phoneVerified ? "✓" : "pending"}
        </li>
      </ul>
      <Button asChild className="mt-5 gradient-primary text-primary-foreground">
        <Link to="/verification">Complete verification</Link>
      </Button>
    </div>
  );
}
