import { cn } from "@/lib/utils";

export type HelloWorldProps = {
    message?: string;
    className?: string;
};

export function HelloWorld({ message = "Hello, World!", className }: HelloWorldProps) {
    return (
        <div className={cn("flex items-center justify-center p-8 rounded-lg bg-accent", className)}>
            <p className="text-2xl font-mono font-semibold">{message}</p>
        </div>
    );
}
