'use Client';
import { useRouter } from 'next/navigation';

const CreateElectionSection = () => {
    const router = useRouter();
    return (
        <section>
            <b className="absolute top-[438px] left-[475px] text-[26px] leading-[150%] text-center">
            No current elections in session...
            </b>

            <button
                onClick={() => router.push('/dashboard/Admin/CreateElectionPage')}
                className="absolute top-[503px] left-[530px] w-[305px] h-[73px] 
                            bg-gradient-to-b from-[#5f1916] to-[#3b0e0c] 
                            border border-white text-white text-left 
                            px-[18.25px] py-[11.77px] rounded-[6px] 
                            shadow-[0px_6px_4px_rgba(0,0,0,0.25)] 
                            cursor-pointer hover:scale-[1.03] 
                            transition-transform"
                >
                <span className="flex items-center text-center leading-[150%] text-[18px] font-bold h-[45.9px] w-full">
                    <span className="w-full whitespace-pre-wrap">
                    Start new election <span className="text-[24px]">+</span>
                    </span>
                </span>
            </button>
        </section>
    );
} 
export default CreateElectionSection;