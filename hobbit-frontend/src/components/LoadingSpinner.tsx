import { useLottie } from 'lottie-react';
import animationData from '../assets/Loading/animations/12345.json';

interface LoadingSpinnerProps {
    size?: number;
    message?: string;
    fullHeight?: boolean;
}

export function LoadingSpinner({ size = 120, message, fullHeight = true }: LoadingSpinnerProps) {
    const { View } = useLottie({
        animationData,
        loop: true,
        autoplay: true,
        style: { width: size, height: size },
    });

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${fullHeight ? 'min-h-[60vh]' : ''}`}>
            {View}
            {message && (
                <p className="text-base font-medium text-slate-400">{message}</p>
            )}
        </div>
    );
}
