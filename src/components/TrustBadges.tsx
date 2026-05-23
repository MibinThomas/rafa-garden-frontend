import { Package, MessageSquare, ShieldCheck, Award } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: <Package size={32} strokeWidth={1} />,
      title: "Delivery",
      subtitle: "Available"
    },
    {
      icon: <MessageSquare size={32} strokeWidth={1} />,
      title: "99 % Customer",
      subtitle: "Feedbacks"
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1} />,
      title: "Payment",
      subtitle: "Secure System"
    },
    {
      icon: <Award size={32} strokeWidth={1} />,
      title: "Only Best",
      subtitle: "Brands"
    }
  ];

  return (
    <div className="w-full bg-transparent py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-8 sm:gap-12 md:gap-4">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center gap-3">
              <div className="text-[#5d5f61]">
                {badge.icon}
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
