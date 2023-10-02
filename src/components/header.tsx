import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="pb-[3vh] pt-[3vh] bg-[#3c153d] border-b border-[#cccccc]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
        <p>
  {session ? (
    <>
    <span className=" pl-3 text-[15px] text-zinc-400"> Welcome, </span>  <span className="text-white text-[12px] ml-[5px]">{session.user.name}!</span> 
    </>
  ) : null}
</p>          <p className="inline-flex items-center space-x-3">
            <Link
              href="https://astrumstellar.com"
              target="_blank"
              rel="noopener noreferrer"
            >
<Image className="h-5px w-5px ml-1   " src="/astrumlogowhite.png" width={35} height={35} alt="logo" />
            </Link>
            <span className="text-white font-bold text-[15px] sm:text-red">Astrumstellar </span>
            <span className=" lg:gap-x-[20px] md:gap-x-[10px] sm:gap-x-[5px]" >
              <span className="grid grid-rows-2 ml-2 mr-2">
            <span className=" font-bold text-[13px] mb-[-5px] text-lime-500 opacity-70 whitespace-nowrap ">Chat APP</span>
            <span className="text-gray-400 font-bold text-[5px] mt-1 whitespace-nowrap">Google Authenticated Model</span>
            </span>
            </span>
          </p>
          {session ? (
            <div className="flex space-x-1">
              {session?.user?.image && (
                <div className="w-12 h-12 rounded overflow-hidden">
                  <Image
                    width={50}
                    height={50}
                    src={session?.user?.image}
                    alt={session?.user?.name || "User profile picture"}
                    title={session?.user?.name || "User profile picture"}
                  />
                </div>
              )}
              <button
                onClick={() => signOut()}
                className="bg-white/5 rounded h-12 pl-1 pr-3 sm:px-5 md:px-7 lg:px-9 font-medium text-white border border-transparent whitespace-nowrap"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={() => signIn("google")}
                className="bg-white/5 rounded pt-1 pb-1 pl-1 pr-1 mr-1 font-medium text-white lg:text-[15px] md:text-[13px] sm:text-[12px] text-[10px] border border-transparent inline-flex items-center whitespace-nowrap"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
