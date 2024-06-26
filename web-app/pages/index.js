import Image from 'next/image'
import Header from "@/components/header";
import Layout from '@/components/layout';
import Link from 'next/link';
import { projects } from '@/assets/data/projects';
import Abstract from "@/assets/imgs/abstract.jpg";
import Filter from "@/assets/imgs/filter.svg";
import Project from "@/assets/imgs/github-project.png";

export default function Home() {
  return (
    <Layout pageTitle="Home | Epaper">
      <Header currentPath={"Home"} />
      <main className="bg-[#111111] min-h-screen items-center justify-between homepage">
        <div className='heading pt-[40rem] md:pt-[50rem]'>

          <Image
            src={Abstract}
            alt="an abstract image"
            style={{
              position: "absolute",
              right: '0px',
              bottom: '0px',
              width: "90%",
              transform: "rotate(180deg)",
            }}
            className='top-1/3'
          />
          <div className='absolute top-1/2 flex flex-col gap-8 -translate-y-1/2'>
            <h1 className='mx-12'>
              Manage your EPD devices in an easiest way ever
            </h1>
            <div className='w-full z-100 relative flex-col md:flex-row flex gap-5 pl-12 pr-12'>
              <Link href="/dashboard" className='w-auto md:text-xl text-base'>
                Go to Dashboard
              </Link>
              <Link href="/download" className='w-auto md:text-xl text-base'>
                Download Mobile app
              </Link>
            </div>
          </div>
        </div>

        <div className='how-it-works anchor flex flex-col gap-8' id="how-it-works">
          <h1 className='mx-12 mt-12 self-start z-10'>How It Works</h1>
          <p className='md:text-xl text-base md:max-w-[40%] mx-12'>
            You can manage the data and EPD devices via Dashboard UI.
            The EPD device is connected to the server via MQTT protocol to receive display and other requests.
            <br />
            <br />
            All communication between users, devices and the server are encrypted and secured with TLS/SSL, protected the system from attacks.          </p>
        </div>
      </main>
    </Layout>
  );
}