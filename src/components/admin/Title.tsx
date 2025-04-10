import React from 'react'

interface TitleProps {
    title: string;
    subtitle?: string;
}

function Title({ title, subtitle }: TitleProps) {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
                <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
            )}
        </div>
    );
}

export default Title