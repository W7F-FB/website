import Link from "next/link";
import { BiDownArrowAlt } from "react-icons/bi";

import { cn } from "@/lib/utils";

interface GridCellScrollLinkProps {
    href: string;
    className?: string;
    iconClassName?: string;
}

export function GridCellScrollLink({ href, className, iconClassName }: GridCellScrollLinkProps) {
    return (
        <Link 
            href={href} 
            className={cn(
                "relative text-background block flex items-end justify-end hover:text-extra-muted transition-color duration-200 col-start-3",
                className
            )}
        >
            <div className="absolute inset-0 bg-lines-pattern flex items-end justify-end p-12 opacity-5"></div>
            <BiDownArrowAlt 
                className={cn(
                    "relative w-36 h-36 stroke-line-pattern stroke-[0.1]",
                    iconClassName
                )} 
            />
        </Link>
    );
}
