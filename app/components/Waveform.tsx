const bars = [
  "animate-eq1",
  "animate-eq2",
  "animate-eq3",
  "animate-eq4",
  "animate-eq5",
];

export default function Waveform({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-end gap-[3px] h-4 ${className}`}
      aria-hidden="true"
    >
      {bars.map((anim, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-onair ${anim}`}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}
