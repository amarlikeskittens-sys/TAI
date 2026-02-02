import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export function GlassSelect({ className, children, label, ...props }: GlassSelectProps) {
    return (
        <div className="relative group">
            {label && (
                <label className="text-xs text-gray-400 mb-1 block pl-1">{label}</label>
            )}
            <div className="relative">
                <select
                    className={clsx(
                        'w-full bg-[#202329] text-sm text-gray-200 border border-white/10 rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500/50 transition-colors',
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
        </div>
    );
}
