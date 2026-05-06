export default function SkeletonCard({ featured = false }) {
  return (
    <div
      className={`rounded-[14px] overflow-hidden border border-white/[0.08] animate-pulse ${
        featured ? "md:col-span-6" : "md:col-span-3"
      }`}
      style={{ background: "linear-gradient(180deg, rgba(26,26,46,0.8), rgba(21,21,42,0.6))" }}
    >
      <div
        className={featured ? "aspect-[21/9]" : "aspect-video"}
        style={{ background: "rgba(45,45,78,0.6)" }}
      />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="h-4 w-20 rounded-full" style={{ background: "rgba(45,45,78,0.8)" }} />
          <div className="h-4 w-12 rounded-full" style={{ background: "rgba(45,45,78,0.8)" }} />
        </div>
        <div
          className={`h-5 rounded-lg ${featured ? "w-2/3" : "w-3/4"}`}
          style={{ background: "rgba(45,45,78,0.8)" }}
        />
        {featured && (
          <div className="h-4 w-1/2 rounded-lg" style={{ background: "rgba(45,45,78,0.6)" }} />
        )}
        <div className="h-3.5 w-full rounded" style={{ background: "rgba(45,45,78,0.5)" }} />
        <div className="h-3.5 w-2/3 rounded" style={{ background: "rgba(45,45,78,0.4)" }} />
      </div>
    </div>
  );
}
