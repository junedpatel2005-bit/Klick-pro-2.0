export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background">
      <main>
        <section className="gradient-hero">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{description}</p>
          </div>
        </section>
        <article className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6">
          {sections.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No rules have been added yet by platform administrators.
              </p>
            </section>
          ) : (
            sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-soft"
              >
                <h2 className="font-display text-xl font-semibold">{section.title}</h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground break-words">
                  {section.body}
                </p>
              </section>
            ))
          )}
        </article>
      </main>
    </div>
  );
}
