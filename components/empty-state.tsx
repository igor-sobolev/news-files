type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-8 text-center">
      <h2 className="font-(family-name:--font-display) text-3xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-(--muted)">{description}</p>
    </div>
  );
}
