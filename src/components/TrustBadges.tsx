import { Package, MessageSquare, ShieldCheck, Award } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TrustBadgesProps {
  content?: Record<string, string>;
  features?: any[];
  className?: string;
}

export function TrustBadges({ content = {}, features, className }: TrustBadgesProps) {
  // Mapping of icons based on default list
  const iconMap: Record<string, React.ReactNode> = {
    "trust_1": <Package size={32} strokeWidth={1} />,
    "trust_2": <MessageSquare size={32} strokeWidth={1} />,
    "trust_3": <ShieldCheck size={32} strokeWidth={1} />,
    "trust_4": <Award size={32} strokeWidth={1} />
  };

  const defaultIcons = [
    <Package size={32} strokeWidth={1} />,
    <MessageSquare size={32} strokeWidth={1} />,
    <ShieldCheck size={32} strokeWidth={1} />,
    <Award size={32} strokeWidth={1} />
  ];

  let badges = [];

  if (features && features.length > 0) {
    badges = features
      .filter((f: any) => f.enabled !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((f: any, idx: number) => ({
        icon: iconMap[f.id] || defaultIcons[idx] || <Package size={32} strokeWidth={1} />,
        iconUrl: f.iconUrl || null,   // uploaded image (takes priority)
        customIcon: f.icon,           // emoji fallback
        title: f.title,
        subtitle: f.subtitle || f.desc
      }));
  } else {
    badges = [
      {
        icon: <Package size={32} strokeWidth={1} />,
        customIcon: content["home.trust_1_icon"],
        title: content["home.trust_1_title"] || "Delivery",
        subtitle: content["home.trust_1_subtitle"] || "Available"
      },
      {
        icon: <MessageSquare size={32} strokeWidth={1} />,
        customIcon: content["home.trust_2_icon"],
        title: content["home.trust_2_title"] || "99 % Customer",
        subtitle: content["home.trust_2_subtitle"] || "Feedbacks"
      },
      {
        icon: <ShieldCheck size={32} strokeWidth={1} />,
        customIcon: content["home.trust_3_icon"],
        title: content["home.trust_3_title"] || "Payment",
        subtitle: content["home.trust_3_subtitle"] || "Secure System"
      },
      {
        icon: <Award size={32} strokeWidth={1} />,
        customIcon: content["home.trust_4_icon"],
        title: content["home.trust_4_title"] || "Only Best",
        subtitle: content["home.trust_4_subtitle"] || "Brands"
      }
    ];
  }

  if (badges.length === 0) return null;

  return (
    <div className={cn("w-full bg-transparent py-8 md:py-10 lg:py-16", className)}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-y-10 gap-x-4 md:gap-4">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center gap-3">
              <div className="text-[#5d5f61]">
                {badge.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={badge.iconUrl} alt={badge.title} className="w-8 h-8 object-contain" />
                ) : badge.customIcon ? (
                  <span className="text-3xl leading-none">{badge.customIcon}</span>
                ) : (
                  badge.icon
                )}
              </div>
              <p className="text-[14px] md:text-[15px] font-normal text-[#5d5f61] leading-tight">
                {badge.title}<br />
                {badge.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
