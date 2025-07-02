'use Client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const CreateElectionSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const administered_Org = searchParams.get('administered_Org');
    return (
        <section className="w-full flex flex-col items-center justify-center gap-4 py-8">
            <b className="text-[20px] md:text-[26px] leading-[150%] text-center">
                No current elections in session...
            </b>
            <button
                onClick={() => router.push(`/dashboard/Admin/CreateElectionPage?administered_Org=${encodeURIComponent(administered_Org || '')}`)}
                className="w-full max-w-xs md:max-w-md h-14 md:h-[73px] bg-gradient-to-b from-[#5f1916] to-[#3b0e0c] border border-white text-white text-center px-6 py-3 rounded-[6px] shadow-md cursor-pointer hover:scale-[1.03] transition-transform text-[16px] md:text-[18px] font-bold"
            >
                Start new election <span className="text-[20px] md:text-[24px]">+</span>
            </button>
        </section>
    );
} 
export default CreateElectionSection;