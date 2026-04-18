type AccountAvatarProps = {
	name: string;
	avatarUrl?: string | null;
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizeClasses: Record<NonNullable<AccountAvatarProps["size"]>, string> = {
	sm: "h-10 w-10 text-sm",
	md: "h-12 w-12 text-base",
	lg: "h-16 w-16 text-lg",
};

function getInitials(name: string) {
	const letters = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");

	return letters || "A";
}

export default function AccountAvatar({ name, avatarUrl, size = "md", className = "" }: AccountAvatarProps) {
	const baseClassName = `inline-flex items-center justify-center overflow-hidden rounded-full border border-[#1A1A1A]/10 bg-[#E8D8A9] font-semibold text-[#1A1A1A] ${sizeClasses[size]} ${className}`.trim();

	if (avatarUrl) {
		return (
			<div className={baseClassName} aria-hidden="true">
				<div
					className="h-full w-full bg-cover bg-center"
					style={{ backgroundImage: `url(${avatarUrl})` }}
				/>
			</div>
		);
	}

	return (
		<div className={baseClassName} aria-hidden="true">
			<span>{getInitials(name)}</span>
		</div>
	);
}
