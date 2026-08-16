"use client";
import { Field, FieldLabel, FieldDescription } from "./ui/field";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { FieldSeparator } from "./ui/field";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function DecodeForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [decodedText, setDecodedText] = useState("");
    const [watermarkText, setWatermarkText] = useState("");
    const [hasDecoded, setHasDecoded] = useState(false);

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function handleDecode() {
        setIsLoading(true);
        try{
            const res = await fetch(`${backendURL}/api/watermark/decode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: watermarkText
                }),
            });

            if (!res.ok) {
                return;
            }

            const data = await res.json();
            setDecodedText(data.decodedMessage);
            setHasDecoded(true)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
        <Field>
            <FieldLabel>Your watermarked text</FieldLabel>
            <Textarea
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
            />
            <FieldSeparator/>
        </Field>
        <Button
            size="sm"
            className="w-full"
            onClick={handleDecode}
            disabled={isLoading || !watermarkText.trim()}
            suppressHydrationWarning
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin"/>
                    Decoding..
                </>
            ) : (
                "Decode text"
            )}
        </Button>
        {hasDecoded && (
            decodedText ? (
            <Field>
                <FieldLabel>The hidden message contained</FieldLabel>
                <Textarea
                    value={decodedText}
                    readOnly
                >
                </Textarea>
            </Field>
            ) : (
                <FieldDescription className="italic">
                    No hidden messages were detected.
                </FieldDescription>
            )
        )}
        </>
    );
}