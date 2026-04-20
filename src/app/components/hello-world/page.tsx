import {
    SandpackCodeEditor,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
} from "@codesandbox/sandpack-react";
import { getRegistryItem } from "@/registry-system/lib/getRegistryItem";
import { getSandpackFiles } from "@/registry-system/lib/getSandpackFiles";
import { getRegistryUrl } from "@/registry-system/lib/getRegistryUrl";

export default async function HelloWorldPage() {
    const registryItem = await getRegistryItem("hello-world");
    const files = await getSandpackFiles({ registryItem });
    const installUrl = getRegistryUrl({ name: "hello-world" });

    const dependencies: Record<string, string> = {};
    registryItem.dependencies?.forEach((dep: string) => {
        dependencies[dep] = "latest";
    });

    return (
        <div>
            <div className="text-sm text-[var(--muted-foreground)] mb-2">
                <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="hover:text-[var(--foreground)]">Home</a>
                {" / "}
                <span>Hello World</span>
            </div>

            <h1 className="text-2xl font-bold">{registryItem.title}</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">{registryItem.description}</p>

            <div className="mt-6">
                <SandpackProvider
                    template="react-ts"
                    files={files}
                    customSetup={{ dependencies }}
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"],
                        initMode: "user-visible",
                    }}
                    style={{ ["--sp-layout-height" as string]: "380px" }}
                >
                    <SandpackPreview showOpenInCodeSandbox={false} />
                    <SandpackLayout className="mt-2" style={{ ["--sp-layout-height" as string]: "260px" }}>
                        <SandpackCodeEditor showLineNumbers showTabs closableTabs />
                    </SandpackLayout>
                </SandpackProvider>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-bold mb-3">Installation</h2>
                <pre className="bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-3 text-sm overflow-x-auto">
                    <code>npx shadcn@latest add {installUrl}</code>
                </pre>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-bold mb-3">Props</h2>
                <div className="border border-[var(--border)] rounded-md divide-y divide-[var(--border)] text-sm">
                    {[
                        { prop: "message", type: "string", default: '"Hello, World!"', desc: "Text to display" },
                        { prop: "className", type: "string", default: "—", desc: "Additional CSS classes" },
                    ].map(({ prop, type, default: def, desc }) => (
                        <div key={prop} className="px-4 py-3 grid grid-cols-4 gap-4">
                            <code className="font-medium">{prop}</code>
                            <code className="text-[var(--muted-foreground)]">{type}</code>
                            <code className="text-[var(--muted-foreground)]">{def}</code>
                            <span className="text-[var(--muted-foreground)]">{desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
