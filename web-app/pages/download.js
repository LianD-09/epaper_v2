import Image from 'next/image'
import Header from "@/components/header";
import Layout from '@/components/layout';
import Link from 'next/link';
import Abstract from "@/assets/imgs/abstract.jpg";
import { instanceCoreApi } from '../services/setupAxios';
import { useEffect } from 'react';

export default function Download() {
    const startDownload = async () => {
        try {
            await instanceCoreApi.get(`${process.env.NEXT_PUBLIC_API}/download-apk`);
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        startDownload();
    }, [])

    return (
        <Layout pageTitle="Download | Epaper">
            <Header currentPath={"Download"} />
            <main className="bg-[#111111] max-h-screen items-center justify-between homepage">
                <div className='heading pt-[40rem] md:pt-[50rem]'>

                    <Image
                        src={Abstract}
                        alt="an abstract image"
                        style={{
                            position: "absolute",
                            right: '0px',
                            bottom: '0px',
                            width: "100%",
                            transform: "rotate(180deg)",
                        }}
                        className='md:h-auto object-cover'
                    />
                    <div className='absolute top-1/2 flex flex-col gap-8 -translate-y-1/2'>
                        <h1 className='mx-12'>
                            Mobile app has been started to download.
                        </h1>
                        <div className='flex flex-col gap-4'>
                            <p className='mx-12'> If nothing happens, press the button below.</p>
                            <div className='w-full z-100 relative flex-col md:flex-row flex gap-5 pl-12 pr-12'>
                                <button
                                    className='w-auto text-center flex items-center justify-center md:text-xl text-base font-extralight border-[#565656] border-[1px] border-opacity-75 px-7 py-2 rounded-xl bg-[#212121] bg-opacity-65 hover:bg-[#616161] hover:shadow-none'
                                    onClick={startDownload}
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}