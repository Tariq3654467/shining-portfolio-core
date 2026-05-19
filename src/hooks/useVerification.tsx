import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  type VerificationRecord,
  fetchVerificationRecord,
  ensureVerificationRecord,
  syncEmailConfirmedFromAuth,
  isEmailVerified,
  isPhoneVerified,
  isFullyVerified,
} from "@/lib/verification";

export function useVerification() {
  const { user, loading: authLoading } = useAuth();
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setRecord(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await ensureVerificationRecord(user.id);
      await syncEmailConfirmedFromAuth(user);
      const row = await fetchVerificationRecord(user.id);
      setRecord(row);
    } catch (e) {
      console.error("Verification refresh failed:", e);
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const emailVerified = isEmailVerified(user, record);
  const phoneVerified = isPhoneVerified(record);
  const fullyVerified = isFullyVerified(user, record);

  return {
    record,
    loading: authLoading || loading,
    emailVerified,
    phoneVerified,
    isFullyVerified: fullyVerified,
    refresh,
  };
}
