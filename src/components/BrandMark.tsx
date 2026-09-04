// innoveX logosundaki renk ayrımını yansıtır: "innove" ink renginde,
// kapanış X'i marka kırmızısında.
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight text-ink-900 ${className}`}>
      innove
      <span className="text-accent">X</span>
    </span>
  );
}
