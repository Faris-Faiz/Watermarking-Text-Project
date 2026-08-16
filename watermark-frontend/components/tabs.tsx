"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { WatermarkForm } from "./encodeform";
import { DecodeForm } from "./decodeform";

export function WatermarkTabs() {
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    return (
        <>
            <div className="flex gap-2">
                <Button
                    className="flex-1"
                    variant={mode === "encode" ? "default" : "outline"}
                    onClick={() => setMode("encode")}
                >
                    Encode
                </Button>
                <Button
                    className="flex-1"
                    variant={mode === "decode" ? "default" : "outline"}
                    onClick={() => setMode("decode")}
                >
                    Decode
                </Button>
            </div>
            {mode === "encode" ? <WatermarkForm/> : <DecodeForm/>}
        </>
    )
}