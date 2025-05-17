import { SlideMaker } from "@/components/slidemaker";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Slide Maker",
	description: "Convert your markdown to beautiful slides",
};

export default function Home() {
	return <SlideMaker />;
}
