import {getRegistryItem} from "@/registry-system/lib/getRegistryItem";

export async function RegistryPropsTable({name}: { name: string }) {
    const registryItem = await getRegistryItem(name);
    if (!registryItem) return null;
    return (
        <p className="text-sm text-[var(--muted-foreground)]">
            See <code>{registryItem.files?.[0]?.path}</code> for the full props definition.
        </p>
    );
}
