"use client";
import { Field, FieldLabel, FieldDescription } from "./ui/field";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { FieldSeparator } from "./ui/field";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function WatermarkForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false)
    const [originalText, setOriginalText] = useState("");
    const [encodedText, setEncodedText] = useState("");
    const [watermarkText, setWatermarkText] = useState("");

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function handleEncode() {
        setIsLoading(true);
        try{
            const res = await fetch(`${backendURL}/api/watermark/encode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: originalText,
                    watermarkData: watermarkText
                }),
            });

            if (!res.ok) {
                return;
            }

            const data = await res.json();
            setEncodedText(data.encodedText);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCopy() {
        if (!encodedText) return;
        await navigator.clipboard.writeText(encodedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <>
        <Field>
            <FieldLabel>Your original text</FieldLabel>
            <Textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
            />
            <FieldSeparator/>
            <FieldLabel>The text you want to watermark into your text</FieldLabel>
            <Textarea
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
            />
        </Field>
        <Button
            size="sm"
            className="w-full"
            onClick={handleEncode}
            disabled={isLoading || !originalText.trim()}
            suppressHydrationWarning
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin"/>
                    Watermarking..
                </>
            ) : (
                "Watermark text"
            )}
        </Button>
        {encodedText && (
            <FieldDescription
                onClick={handleCopy}
                className="cursor-pointer select-all break-words whitespace-pre-wrap hover:underline"
                title="Click to copy"
            >
                {copied ? "Copied!" : "Click to copy your watermarked text."}
            </FieldDescription>
        )}
        </>
    );
}