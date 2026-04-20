"use client";

import { useState, useEffect } from "react";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

type Config = {
    packageManager: PackageManager;
};

const DEFAULT: Config = { packageManager: "pnpm" };
const KEY = "registry-system-config";

export function useConfig(): [Config, (c: Config) => void] {
    const [config, setConfigState] = useState<Config>(DEFAULT);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(KEY);
            if (stored) setConfigState(JSON.parse(stored));
        } catch {}
    }, []);

    const setConfig = (c: Config) => {
        setConfigState(c);
        try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {}
    };

    return [config, setConfig];
}
