import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Loader as Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  userId: string;
  currentImageUrl?: string;
  onImageUpload: (url: string) => void;
  displayName?: string;
}

const ProfilePictureUpload = ({
  userId,
  currentImageUrl,
  onImageUpload,
  displayName = "User",
}: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("biodata-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("biodata-images")
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      setPreview(imageUrl);
      onImageUpload(imageUrl);
      toast.success("Profile picture uploaded successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentImageUrl) {
      setPreview(null);
      return;
    }

    setUploading(true);
    try {
      const fileName = currentImageUrl.split("/").pop();
      if (fileName) {
        await supabase.storage
          .from("biodata-images")
          .remove([`profile-pictures/${fileName}`]);
      }
      setPreview(null);
      onImageUpload("");
      toast.success("Profile picture removed");
    } catch (e: any) {
      toast.error(e.message || "Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={preview || undefined} />
        <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <Button
            asChild
            disabled={uploading}
            className="cursor-pointer"
            variant="outline"
            size="sm"
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </>
              )}
            </span>
          </Button>
        </label>

        {preview && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or GIF (max 5MB)
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
