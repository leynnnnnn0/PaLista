interface ModuleHeadingProps {
    children?: React.ReactNode;
    title: string;
    description: string;
}
export default function ModuleHeading({
    children,
    title,
    description,
}: ModuleHeadingProps) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="mt-1 text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
                {children}
            </div>
        </div>
    );
}
 