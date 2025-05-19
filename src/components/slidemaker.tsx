"use client";

import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { SlidePreview } from "@/components/preview/slide-preview";
import { Button } from "@/components/ui/button";
import { exampleSlides } from "@/lib/constants/example-slides";
import { exportToPDF, exportToPPTX } from "@/lib/utils/exports";
import type { SlideTheme } from "@/types/theme";
import { Download, Moon, Presentation, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SlideMaker() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [markdown, setMarkdown] = useState(exampleSlides);
	const [slides, setSlides] = useState<string[]>([]);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [currentTheme, setCurrentTheme] = useState<SlideTheme>();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const newSlides = markdown
			.split(/^---$/m)
			.map((slide) => slide.trim())
			.filter(Boolean);
		setSlides(newSlides);
	}, [markdown]);

	function handleMarkdownChange(value: string) {
		setMarkdown(value);
	}

	function prevSlide() {
		setCurrentSlide((prev) => Math.max(0, prev - 1));
	}

	function nextSlide() {
		setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
	}

	function toggleFullscreen() {
		setIsFullscreen((prev) => !prev);
	}

	async function handleExportPDF() {
		await exportToPDF(slides, currentTheme);
	}

	async function handleExportPPTX() {
		await exportToPPTX(slides, currentTheme);
	}

	function handleThemeChange(theme: SlideTheme) {
		setCurrentTheme(theme);
	}

	if (!mounted) {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 container mx-auto p-4">
				<div className="flex justify-end gap-2 mb-4">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						suppressHydrationWarning
					>
						{theme === "dark" ? (
							<Sun className="h-4 w-4" />
						) : (
							<Moon className="h-4 w-4" />
						)}
					</Button>
					<Button variant="outline" onClick={handleExportPDF}>
						<Download className="mr-2 h-4 w-4" />
						PDF
					</Button>
					<Button variant="outline" onClick={handleExportPPTX}>
						<Presentation className="mr-2 h-4 w-4" />
						PPTX
					</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[600px]">
					<div className="h-full md:col-span-2">
						<MarkdownEditor
							value={markdown}
							onChange={handleMarkdownChange}
							onThemeChange={handleThemeChange}
						/>
					</div>
					<div className="h-full md:col-span-3">
						<SlidePreview
							currentSlide={currentSlide}
							slides={slides}
							isFullscreen={isFullscreen}
							theme={currentTheme}
							onPrevSlide={prevSlide}
							onNextSlide={nextSlide}
							onToggleFullscreen={toggleFullscreen}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
