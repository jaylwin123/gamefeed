export default function SkeletonCard({ featured = false }) {
  return (
    <div
      className={`bg-bg-card border border-border-dark rounded-xl overflow-hidden animate-pulse${featured ? " md:col-span-2" : ""}`}
    >
      <div className={`bg-border-dark${featured ? " h-64" : " h-44"}`} />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="h-5 w-24 bg-border-dark rounded" />
          <div className="h-5 w-16 bg-border-dark rounded" />
        </div>
        <div
          className={`h-5 bg-border-dark rounded${featured ? " w-2/3" : " w-3/4"}`}
        />
        {featured && <div className="h-5 w-1/2 bg-border-dark rounded" />}
        <div className="h-4 w-full bg-border-dark rounded" />
        <div className="h-4 w-2/3 bg-border-dark rounded" />
        {featured && <div className="h-4 w-4/5 bg-border-dark rounded" />}
      </div>
    </div>
  );
}
