const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

function CodeBlock({ code }: { code: string }) {
    return (
        <pre className="bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-3 text-sm overflow-x-auto">
            <code>{code}</code>
        </pre>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mt-12">
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            {children}
        </section>
    );
}

export default function Home() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Registry System</h1>
            <p className="mt-3 text-[var(--muted-foreground)] text-lg">
                Add a shadcn-compatible component registry to any Next.js project —
                live Sandpack demos, <code className="text-sm">shadcn add</code> install commands, and a Claude plugin.
            </p>

            <div className="mt-6">
                <a href={`${base}/components/hello-world`}
                   className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                    View live demo →
                </a>
            </div>

            <Section title="Prerequisites">
                <ul className="text-sm text-[var(--muted-foreground)] space-y-1 list-disc list-inside">
                    <li>Next.js (app router)</li>
                    <li>Tailwind v4</li>
                    <li>shadcn CLI</li>
                </ul>
            </Section>

            <Section title="Install">
                <div className="space-y-3">
                    <p className="text-sm text-[var(--muted-foreground)]">Copy the engine into your project:</p>
                    <CodeBlock code="npx degit phucbm/registry-system/src/registry-system src/registry-system" />

                    <p className="text-sm text-[var(--muted-foreground)]">Copy the starter component (rename <code>example</code> to your namespace):</p>
                    <CodeBlock code="npx degit phucbm/registry-system/registry/example registry/yourname" />
                </div>
            </Section>

            <Section title="Setup">
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="text-[var(--muted-foreground)] mb-2">Add to your <code>package.json</code> scripts:</p>
                        <CodeBlock code={`"build:registry": "pnpm index-registry && pnpm shadcn build && pnpm clean-registry",
"index-registry": "tsx src/registry-system/scripts/index-registry.ts",
"clean-registry": "tsx src/registry-system/scripts/clean-example-registry.ts"`} />
                    </div>

                    <div>
                        <p className="text-[var(--muted-foreground)] mb-2">Set env vars:</p>
                        <CodeBlock code={`NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_REGISTRY_NAMESPACE=yourname
NEXT_PUBLIC_REGISTRY_FOLDER=r`} />
                    </div>

                    <div>
                        <p className="text-[var(--muted-foreground)] mb-2">Build the registry:</p>
                        <CodeBlock code="pnpm build:registry" />
                    </div>
                </div>
            </Section>

            <Section title="Claude Plugin">
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="text-[var(--muted-foreground)] mb-2">Install:</p>
                        <CodeBlock code="/plugin install registry-system@phucbm" />
                    </div>

                    <div className="space-y-3">
                        <p className="text-[var(--muted-foreground)]">Available skills:</p>

                        <div className="border border-[var(--border)] rounded-md divide-y divide-[var(--border)]">
                            {[
                                {
                                    skill: "create-component",
                                    desc: "Scaffold all required files for a new component",
                                    example: "create registry component my-button",
                                },
                                {
                                    skill: "validate-component",
                                    desc: "Check a component passes all registry rules before publishing",
                                    example: "validate my-button",
                                },
                                {
                                    skill: "push-to-registry",
                                    desc: "Validate and open a PR adding the component to another repo's registry",
                                    example: "push my-button to phucbm/my-site",
                                },
                            ].map(({ skill, desc, example }) => (
                                <div key={skill} className="px-4 py-3">
                                    <div className="font-medium">{skill}</div>
                                    <div className="text-[var(--muted-foreground)] mt-0.5">{desc}</div>
                                    <div className="mt-1.5 text-[var(--muted-foreground)]">
                                        Example: <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded text-xs">{example}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Rules">
                <p className="text-sm text-[var(--muted-foreground)]">
                    See{" "}
                    <a href="https://github.com/phucbm/registry-system/blob/main/REGISTRY_RULES.md"
                       target="_blank" rel="noreferrer"
                       className="text-[var(--brand)] hover:underline">
                        REGISTRY_RULES.md
                    </a>{" "}
                    for the full component spec used by the Claude plugin validator.
                </p>
            </Section>
        </div>
    );
}
