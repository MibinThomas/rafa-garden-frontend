import { Package, MessageSquare, ShieldCheck, Award } from "lucide-react";

interface TrustBadgesProps {
  content?: Record<string, string>;
}

export function TrustBadges({ content = {} }: TrustBadgesProps) {
  const badges = [
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

  return (
    <div className="w-full bg-transparent py-8 md:py-10 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-items-center gap-y-10 gap-x-4 md:gap-4">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center gap-3">
              <div className="text-[#5d5f61]">
                {badge.customIcon ? (
                  <img src={badge.customIcon} alt={badge.title} className="w-8 h-8 object-contain" />
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
