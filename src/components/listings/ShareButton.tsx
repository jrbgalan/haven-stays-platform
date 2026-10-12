import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  url?: string;
  className?: string;
  size?: number;
}

export default function ShareButton({
  title,
  url,
  className,
  size = 16,
}: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = url || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${title} on Haven Luxury Stays`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if native share was dismissed or failed
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied to clipboard",
        description: `Share link for "${title}" is ready.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Share stay"
      aria-label="Share stay"
      className={cn(
        "grid place-items-center rounded-full p-2 transition-all hover:bg-black/10 dark:hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {copied ? (
        <Check size={size} className="text-emerald-500 animate-scale-in" />
      ) : (
        <Share2 size={size} className="text-foreground transition-transform hover:scale-110" />
      )}
    </button>
  );
}
