import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface SocialShareProps {
  productName: string;
  productUrl: string;
}

export const SocialShare = ({ productName, productUrl }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(`¡Mira esta increíble joya: ${productName}!`);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    showSuccess("Enlace copiado al portapapeles");
  };

  return (
    <div className="mt-6 pt-4 border-t">
        <p className="text-sm font-medium mb-2">Compartir:</p>
        <div className="flex items-center gap-2">
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                </Button>
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                </Button>
            </a>
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                    <FaWhatsapp className="h-4 w-4" />
                </Button>
            </a>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <LinkIcon className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );
};