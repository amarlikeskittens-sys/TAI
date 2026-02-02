import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function GlassCard({ children, className, hover = false, onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'bg-[#181b21] bg-opacity-80 backdrop-blur-md border border-white/5 rounded-xl shadow-xl',
                hover && 'transition-transform hover:scale-[1.01] cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
}
