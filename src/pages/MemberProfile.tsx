import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ArrowLeft, User, Briefcase, MapPin, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sanitizePayloadForViewer } from "@/lib/publicBiodata";

type Row = {
  user_id: string;
  payload: Record<string, unknown>;
  private_fields: Record<string, boolean>;
  profile_picture_url: string | null;
};

const MemberProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [row, setRow] = useState<Row | null>(null);
  const [profile, setProfile] = useState<{ first_name?: string | null; last_name?: string | null; gender?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [recommended, setRecommended] = useState(false);
  const [interestStatus, setInterestStatus] = useState<string | null>(null);
  const [incomingInterestStatus, setIncomingInterestStatus] = useState<string | null>(null);
  const [interactionLoading, setInteractionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        navigate("/active-members");
        return;
      }

      setLoading(true);
      try {
        const [{ data: { user } }, { data: bio, error: bioErr }, { data: prof }] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from("biodatas")
            .select("user_id, payload, private_fields, profile_picture_url")
            .eq("user_id", userId)
            .maybeSingle(),
          supabase.from("profiles").select("first_name, last_name, gender").eq("id", userId).maybeSingle(),
        ]);

        if (bioErr) throw bioErr;
        if (!bio) {
          toast.error("Profile not found or biodata not completed.");
          navigate("/active-members");
          return;
        }

        setRow(bio as Row);
        setProfile(prof);
        setCurrentUserId(user?.id ?? null);

        const [{ count: recommendationCountResult }, { data: ownRecommendation }, { data: interest }, { data: incomingInterest }] = await Promise.all([
          supabase.from("profile_recommendations").select("id", { count: "exact", head: true }).eq("profile_user_id", userId),
          user ? supabase.from("profile_recommendations").select("id").eq("profile_user_id", userId).eq("recommender_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
          user ? supabase.from("profile_interests").select("status").eq("sender_id", user.id).eq("recipient_id", userId).maybeSingle() : Promise.resolve({ data: null }),
          user ? supabase.from("profile_interests").select("status").eq("sender_id", userId).eq("recipient_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
        ]);
        setRecommendationCount(recommendationCountResult ?? 0);
        setRecommended(Boolean(ownRecommendation));
        setInterestStatus(interest?.status ?? null);
        setIncomingInterestStatus(incomingInterest?.status ?? null);
      } catch (e: unknown) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : "Could not load profile");
        navigate("/active-members");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!row) return null;

  const canInteract = Boolean(currentUserId && currentUserId !== userId);
  const toggleRecommendation = async () => {
    if (!currentUserId || !userId) return;
    setInteractionLoading(true);
    const result = recommended
      ? await supabase.from("profile_recommendations").delete().eq("recommender_id", currentUserId).eq("profile_user_id", userId)
      : await supabase.from("profile_recommendations").insert({ recommender_id: currentUserId, profile_user_id: userId });
    setInteractionLoading(false);
    if (result.error) {
      toast.error("Could not update recommendation");
      return;
    }
    setRecommended(!recommended);
    setRecommendationCount((count) => count + (recommended ? -1 : 1));
  };

  const sendInterest = async () => {
    if (!currentUserId || !userId) return;
    setInteractionLoading(true);
    const { error } = await supabase.from("profile_interests").insert({ sender_id: currentUserId, recipient_id: userId });
    setInteractionLoading(false);
    if (error) {
      toast.error(error.code === "23505" ? "Interest already sent" : "Could not send interest");
      return;
    }
    setInterestStatus("pending");
    toast.success("Interest sent");
  };

  const respondToInterest = async (status: "accepted" | "declined") => {
    if (!currentUserId || !userId) return;
    setInteractionLoading(true);
    const { error } = await supabase.from("profile_interests").update({ status, updated_at: new Date().toISOString() }).eq("sender_id", userId).eq("recipient_id", currentUserId);
    setInteractionLoading(false);
    if (error) {
      toast.error("Could not update interest");
      return;
    }
    setIncomingInterestStatus(status);
    toast.success(status === "accepted" ? "Interest accepted" : "Interest declined");
  };

  const publicPayload = sanitizePayloadForViewer(row.payload, row.private_fields) as Record<string, string>;
  const displayName =
    publicPayload.fullName?.trim() ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    "Member";
  const gender = publicPayload.gender || profile?.gender || "";

  const detail = (label: string, value: string | undefined) => (
    <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-bold text-right">{value?.trim() || "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b">
        <div className="container px-4 py-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/active-members" aria-label="Back to members">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold">Member profile</h1>
            <p className="text-sm text-muted-foreground">Public details respect privacy settings.</p>
          </div>
        </div>
      </div>

      <div className="container px-4 mt-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-3xl shadow-lg overflow-hidden p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <Avatar className="h-36 w-36 border-4 border-background shadow-xl">
              <AvatarImage src={row.profile_picture_url ?? undefined} alt={displayName} />
              <AvatarFallback className="text-3xl">{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-3xl font-heading font-bold">{displayName}</h2>
              {gender && <p className="text-muted-foreground capitalize">{gender}</p>}
              {(publicPayload.areaOfResidence || publicPayload.country) && (
                <p className="text-sm flex items-center gap-2 justify-center md:justify-start text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {[publicPayload.areaOfResidence, publicPayload.country].filter(Boolean).join(", ")}
                </p>
              )}
              {(publicPayload.occupation || publicPayload.education) && (
                <p className="text-sm flex items-center gap-2 justify-center md:justify-start text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {[publicPayload.occupation, publicPayload.education].filter(Boolean).join(" · ")}
                </p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-3">
                {canInteract && (
                  <>
                    <Button variant={recommended ? "default" : "outline"} size="sm" onClick={toggleRecommendation} disabled={interactionLoading}>
                      <Heart className={`h-4 w-4 mr-1.5 ${recommended ? "fill-current" : ""}`} />
                      {recommended ? "Recommended" : "Recommend Profile"}
                    </Button>
                    <Button size="sm" onClick={sendInterest} disabled={interactionLoading || Boolean(interestStatus)}>
                      <Send className="h-4 w-4 mr-1.5" />
                      {interestStatus === "pending" ? "Interest Sent" : interestStatus === "accepted" ? "Interest Accepted" : "Send Interest"}
                    </Button>
                    {incomingInterestStatus === "pending" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => respondToInterest("accepted")} disabled={interactionLoading}>Accept Interest</Button>
                        <Button variant="ghost" size="sm" onClick={() => respondToInterest("declined")} disabled={interactionLoading}>Decline</Button>
                      </>
                    )}
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Recommended by {recommendationCount} members</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {detail("Age", publicPayload.age)}
            {detail("Height", publicPayload.height)}
            {detail("Religion", publicPayload.religion)}
            {detail("Marital status", publicPayload.maritalStatus)}
            {detail("Education", publicPayload.education)}
            {detail("Profession", publicPayload.occupation)}
          </div>

          {publicPayload.bio && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-primary" /> About
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{publicPayload.bio}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MemberProfile;
