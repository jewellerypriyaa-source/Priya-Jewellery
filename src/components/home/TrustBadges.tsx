interface Badge {
  id: string;
  icon: string;
  text: string;
}

interface TrustBadgesProps {
  badges: Badge[];
}

export default function TrustBadges({ badges }: TrustBadgesProps) {
  return (
    <div
      className="py-6 px-4"
      style={{
        background: "linear-gradient(135deg, #3d0b15, #6b1a2a)",
        borderTop: "1px solid rgba(201,168,76,0.2)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center justify-center gap-3 text-center sm:text-left py-2 px-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <span className="text-gold-400 text-lg">✦</span>
              <span
                className="text-xs sm:text-sm font-medium tracking-wide text-white"
              >
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
