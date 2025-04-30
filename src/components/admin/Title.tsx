import React from 'react'

interface TitleProps {
    title: string;
    subtitle?: string;
}

function Title({ title, subtitle }: TitleProps) {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && (
                <p className="mt-1.5 text-sm text-gray-600 max-w-2xl">{subtitle}</p>
            )}
        </div>
    );
}

export default Title