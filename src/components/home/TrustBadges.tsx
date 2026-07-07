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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left"
            >
              <span className="text-2xl">{badge.icon}</span>
              <span
                className="text-xs sm:text-sm font-medium"
                style={{ color: "#fadadd" }}
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
