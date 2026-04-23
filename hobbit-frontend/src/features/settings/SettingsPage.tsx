import soonSvg from '../../assets/soon.svg';

export default function SettingsPage() {
    return (
        <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-100px)] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-6">
            <img src={soonSvg} alt="Coming soon" className="w-56 h-56 md:w-[400px] md:h-[400px] mb-6 md:mb-10 opacity-80" />
            <p className="text-center text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-md">
                Counting down to something epic!{' '}
                <span className="font-bold text-slate-900 block md:inline mt-1 md:mt-0">Stay tuned...</span>
            </p>
        </div>
    );
}
