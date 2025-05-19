import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SlideTheme } from "@/types/theme";
import "katex/dist/katex.min.css";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface SlidePreviewProps {
	currentSlide: number;
	slides: string[];
	isFullscreen: boolean;
	theme?: SlideTheme;
	onPrevSlide: () => void;
	onNextSlide: () => void;
	onToggleFullscreen: () => void;
}

export function SlidePreview({
	currentSlide,
	slides,
	isFullscreen,
	theme,
	onPrevSlide,
	onNextSlide,
	onToggleFullscreen,
}: SlidePreviewProps) {
	const { theme: colorMode } = useTheme();
	const currentSlideContent = slides[currentSlide] || "";

	return (
		<Card
			className={cn(
				"relative flex flex-col overflow-hidden min-h-[600px]",
				isFullscreen && "fixed inset-0 z-50",
			)}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5 border-b">
				<CardTitle className="text-lg">Slide Preview</CardTitle>
				<div className="flex items-center gap-2">
					<div className="text-sm text-muted-foreground">
						{slides.length > 0
							? `${currentSlide + 1} / ${slides.length}`
							: "0 / 0"}
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={onToggleFullscreen}
						className="ml-2"
					>
						<Maximize2 className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-auto px-0 relative">
				<div
					className={cn(
						"absolute inset-0 transition-colors duration-200",
						colorMode === "dark" ? "bg-white" : "bg-black",
						"flex items-center justify-center",
					)}
				>
					<div
						className={cn(
							"mx-auto aspect-[16/9] w-full max-w-4xl",
							"flex items-center justify-center",
							"overflow-hidden"
						)}
						style={{
							maxHeight: "70vh",
							backgroundColor: theme?.styles.background || "white",
							color: theme?.styles.text,
						}}
					>
						<div
							className="w-full prose prose-sm md:prose-base lg:prose-lg max-w-none text-center transition-all duration-200"
							style={{
								"--tw-prose-headings": theme?.styles.heading,
								"--tw-prose-body": theme?.styles.text,
								"--tw-prose-code": theme?.styles.code,
								"--tw-prose-links": theme?.styles.link,
								"--tw-prose-quotes": theme?.styles.blockquote,
								"--tw-prose-quote-borders": theme?.styles.accent,
								fontFamily: theme?.fonts.body,
								transform: "scale(var(--content-scale, 1))",
								transformOrigin: "center center",
							} as React.CSSProperties}
						>
							<ReactMarkdown
								remarkPlugins={[remarkGfm, remarkMath]}
								rehypePlugins={[rehypeKatex]}
								components={{
									h1: ({ children }) => (
										<h1 style={{ fontFamily: theme?.fonts.heading }}>
											{children}
										</h1>
									),
									h2: ({ children }) => (
										<h2 style={{ fontFamily: theme?.fonts.heading }}>
											{children}
										</h2>
									),
									h3: ({ children }) => (
										<h3 style={{ fontFamily: theme?.fonts.heading }}>
											{children}
										</h3>
									),
									p: ({ children }) => (
										<p style={{ fontFamily: theme?.fonts.body }}>{children}</p>
									),
									code: ({ inline, children }) =>
										inline ? (
											<code style={{ fontFamily: theme?.fonts.code }}>
												{children}
											</code>
										) : (
											<pre>
												<code style={{ fontFamily: theme?.fonts.code }}>
													{children}
												</code>
											</pre>
										),
								}}
							>
								{currentSlideContent}
							</ReactMarkdown>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="border-t bg-card p-2">
				<div className="flex justify-between items-center w-full gap-2">
					<Button
						variant="outline"
						onClick={onPrevSlide}
						disabled={currentSlide === 0}
						className="w-[50px]"
					>
						<ChevronLeft className="mx-2 h-4 w-4" />
					</Button>
					<div className="flex-1 flex justify-center">
						<div className="flex gap-1">
							{slides.map((_, index) => (
								<div
									key={index}
									className={cn(
										"w-2 h-2 rounded-full transition-colors",
										index === currentSlide
											? "bg-primary"
											: "bg-muted hover:bg-muted-foreground/50",
									)}
								/>
							))}
						</div>
					</div>
					<Button
						variant="outline"
						onClick={onNextSlide}
						disabled={currentSlide === slides.length - 1}
						className="w-[50px]"
					>
						<ChevronRight className="mx-2 h-4 w-4" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
