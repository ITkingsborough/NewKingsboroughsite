import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import { Play, Youtube, Share2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
}

const LIFE_EVER_AFTER_CHANNEL_ID = "UClrk3wKBN-M5Y-NNXpdeNaA";
const LIFE_EVER_AFTER_URL = "https://www.youtube.com/@lifeverafterm";

const getThumbnailUrl = (video: YouTubeVideo): string => {
  const thumbnails = video.thumbnails;
  if (thumbnails?.maxres?.url) return thumbnails.maxres.url;
  if (thumbnails?.standard?.url) return thumbnails.standard.url;
  if (thumbnails?.high?.url) return thumbnails.high.url;
  if (thumbnails?.medium?.url) return thumbnails.medium.url;
  if (thumbnails?.default?.url) return thumbnails.default.url;
  return `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
};

interface VideoSlideProps {
  isLoading: boolean;
  video?: YouTubeVideo;
  emptyLabel: string;
}

const VideoSlide = ({ isLoading, video, emptyLabel }: VideoSlideProps) => {
  if (isLoading) {
    return <Skeleton className="w-full aspect-video rounded-xl" />;
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center aspect-video rounded-xl bg-gray-100 text-center px-8">
        <Youtube className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-montserrat">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
    >
      <img
        src={getThumbnailUrl(video)}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/50" />

      {/* Top title bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-3">
        <div className="w-7 h-7 shrink-0 rounded-full bg-white/15 flex items-center justify-center">
          <Youtube className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">{video.title}</p>
          <p className="text-white/60 text-[10px] truncate">{video.channelTitle}</p>
        </div>
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
          <Play className="w-7 h-7 text-white fill-white ml-0.5" />
        </span>
      </div>

      {/* Bottom-left icons */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
          <Share2 className="w-3.5 h-3.5 text-white" />
        </span>
        <span className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-white" />
        </span>
      </div>

      {/* Watch on YouTube badge */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 rounded px-2 py-1">
        <span className="text-white text-[11px] font-medium">Watch on</span>
        <Youtube className="w-4 h-4 text-white" />
        <span className="text-white text-[11px] font-semibold">YouTube</span>
      </div>
    </a>
  );
};

const Sermons = () => {
  const { data: sermonData, isLoading: sermonLoading } = useQuery<{
    success: boolean;
    data: YouTubeVideo[];
  }>({
    queryKey: ["/api/youtube/videos", "UCGYKC04rR0F7ajcuVQqupRQ", "home"],
    queryFn: async () => {
      const response = await fetch(
        `/api/youtube/videos?channelId=UCGYKC04rR0F7ajcuVQqupRQ&type=video&eventType=live&order=date&maxResults=1`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch YouTube videos");
      }
      return response.json();
    },
  });

  const { data: leaData, isLoading: leaLoading } = useQuery<{
    success: boolean;
    data: YouTubeVideo[];
  }>({
    queryKey: ["/api/youtube/videos", LIFE_EVER_AFTER_CHANNEL_ID, "lea"],
    queryFn: async () => {
      const response = await fetch(
        `/api/youtube/videos?channelId=${LIFE_EVER_AFTER_CHANNEL_ID}&maxResults=1&order=date`,
      );
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const latestSermon = sermonData?.data?.[0];
  const latestLeaVideo = leaData?.data?.[0];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  // Auto-advance between the two slides so the section doesn't take extra space
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 7000);
    return () => clearInterval(interval);
  }, [api]);

  const slides = [
    {
      key: "sermons",
      heading: (
        <>
          Check Out
          <br />
          Our Sermons
        </>
      ),
      copy: "Catch up on the latest messages from Kingsborough Church. From Sunday services to Spirit-filled midweek gatherings, dive into teaching that will feed and edify your spirit.",
      cta: (
        <Link
          href="/sermons"
          className="inline-flex items-center justify-center bg-deepPurple hover:bg-deepPurple/90 text-white font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-lg transition-colors duration-300"
        >
          Watch More Sermons
        </Link>
      ),
      video: latestSermon,
      isLoading: sermonLoading,
      emptyLabel: "Could not load the latest sermon.",
    },
    {
      key: "life-ever-after",
      heading: (
        <>
          Check Out
          <br />
          Life Ever After
        </>
      ),
      copy: "Subscribe to Life Ever After Marriage for all our latest content. From candid marriage talks to Spirit-filled conversations, we have content that will feed and edify your spirit.",
      cta: (
        <a
          href={LIFE_EVER_AFTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-lg transition-colors duration-300"
        >
          Watch More on Life Ever After
        </a>
      ),
      video: latestLeaVideo,
      isLoading: leaLoading,
      emptyLabel: "Could not load the latest video.",
    },
  ];

  return (
    <section id="sermons" data-nav-theme="light" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={slideUp()}
        >
          <Carousel setApi={setApi} opts={{ loop: true }} className="relative">
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.key}>
                  <div className="grid lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16 items-center">
                    <div>
                      <h2 className="text-5xl md:text-6xl xl:text-7xl font-montserrat font-extrabold uppercase leading-[0.95] text-black mb-8">
                        {slide.heading}
                      </h2>
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                        {slide.copy}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">{slide.cta}</div>
                    </div>
                    <VideoSlide
                      isLoading={slide.isLoading}
                      video={slide.video}
                      emptyLabel={slide.emptyLabel}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-6" />
            <CarouselNext className="hidden lg:flex -right-6" />
          </Carousel>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === index ? "w-8 bg-deepPurple" : "w-2.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sermons;

