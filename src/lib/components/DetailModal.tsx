import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	icon?: string;
	children?: ReactNode;
};

export function DetailModal({ isOpen, onClose, title, icon, children }: Props) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [isOpen, onClose]);

	if (!mounted || !isOpen) return null;

	return (
		<div
			className="modal-backdrop"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			role="presentation"
		>
			<div
				className="modal-content"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
			>
				<div className="modal-header">
					<div className="modal-header-content">
						{icon ? <img src={icon} alt="" className="modal-icon" /> : null}
						<h2 id="modal-title">{title}</h2>
					</div>
					<button
						type="button"
						className="close-button"
						onClick={onClose}
						aria-label="閉じる"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
						>
							<title>閉じる</title>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
}
