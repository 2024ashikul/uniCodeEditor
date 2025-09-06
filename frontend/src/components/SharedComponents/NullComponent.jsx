import { Plus } from 'lucide-react';

export default function NullComponent({ text }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
            {/* You could add an icon here to make it more visually appealing. */}
            <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>

            <h2 className="text-xl font-semibold mb-2">{text}</h2>


            

        </div>
    );
}
