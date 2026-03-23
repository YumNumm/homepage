import { useEffect, useState } from "react";

type Props = {
	message: string;
	duration?: number;
};

export function Snackbar({ message, duration = 1500 }: Props) {
	const [fading, setFading] = useState(false);

	useEffect(() => {
		const fadeTimer = setTimeout(() => setFading(true), duration);
		return () => clearTimeout(fadeTimer);
	}, [duration]);

	return (
		<div
			className="snackbar"
			style={{
				position: "fixed",
				bottom: fading ? "-100px" : "2rem",
				left: "50%",
				transform: "translateX(-50%)",
				background: "var(--color-surface)",
				color: "var(--color-text)",
				padding: "1rem 1.5rem",
				borderRadius: "8px",
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
				zIndex: 1000,
				opacity: fading ? 0 : 1,
				transition: "opacity 0.3s ease, bottom 0.3s ease",
				pointerEvents: "none",
			}}
		>
			{message}
		</div>
	);
}
