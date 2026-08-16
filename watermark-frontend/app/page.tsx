import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
 import { WatermarkForm } from "@/components/encodeform";
import { Button } from "@/components/ui/button";
import { WatermarkTabs } from "@/components/tabs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4 py-8">
      <Card size="sm" className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle>Watermark your blog posts 🧪</CardTitle>
          <CardDescription>
            Tired of AI Companies scraping your blogs? Poison your text that ruins LLM training
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <WatermarkTabs/>
        </CardContent>
      </Card>
    </div>
  );
}
