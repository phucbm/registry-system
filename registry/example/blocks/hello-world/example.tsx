import { HelloWorld } from "@/components/example/hello-world";

export default function HelloWorldExample() {
    return (
        <div className="p-8 space-y-4">
            <HelloWorld />
            <HelloWorld message="Custom message!" className="bg-blue-500/10" />
        </div>
    );
}
