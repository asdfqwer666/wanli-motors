import ImageFallback from "@/components/common/ImageFallback";
import DisclaimerBadge from "@/components/common/DisclaimerBadge";
import type { ModelImage } from "@/types/media";
import { cn } from "@/lib/utils";

interface CinemaStageProps {
  name: string;
  image: ModelImage;
  isDemo: boolean;
  className?: string;
}

export default function CinemaStage({ name, image, isDemo, className }: CinemaStageProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-4xl border border-white/60 bg-gradient-to-b from-[#F5F5F7] to-[#ECECED] p-6 shadow-cinemaStage md:p-10",
        className
      )}
    >
      <div className="relative mx-auto aspect-[16/10] w-full max-w-4xl">
        <ImageFallback
          src={image.src}
          alt={image.alt || name}
          className="h-full w-full object-contain"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-1/2 h-10 w-2/3 -translate-x-1/2 rounded-[100%] bg-black/10 blur-2xl"
        />
      </div>
      {isDemo ? <DisclaimerBadge className="absolute bottom-4 left-4 max-w-[85%]" /> : null}
    </section>
  );
}
