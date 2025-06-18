export default function AboutCard({
  className = '',
  title
}: {
  className?: string;
  title: string;
}) {
  return (
    <div className={`absolute w-[963px] h-96 p-8 shadow-lg ${className}`}>
      <h3 className="text-black text-4xl font-black">
        {title}
      </h3>
    </div>
  );
}