export default function PageHeader({ children, title, subtitle }) {
    return (
        <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
            <div className="w-full md:w-auto">
                <h2 className="text-lg font-bold tracking-tight md:text-3xl">
                    {title}
                </h2>
                <p className="text-xs text-muted-foreground md:text-base">
                    {subtitle}
                </p>
            </div>
            <div className="mt-3 flex items-center space-x-2 md:mt-0">
                {children}
            </div>
        </div>
    );
}
