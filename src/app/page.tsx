"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white gap-12 font-[poppins]">
      <div className="flex items-center justify-center w-full max-w-lg">
        <Image
          src='/logos/logo-dark-full.png'
          alt='kacamatakoe logo'
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-90"
        />
      </div>
      <div
        className="
          p-6 rounded-md
          flex flex-col
          w-full max-w-md
          shadow-lg gap-4
          items-start
        "
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-wide">
            Login Admin
          </h1>
          <p className="text-muted-foreground text-base">
            Gunakan akun google anda untuk login ke akun admin KacamataKoe
          </p>
        </div>
        <Button
          onClick={() => signIn('google', {
            redirectTo: '/dashboard',
          })}
          className='
            border border-black
            bg-transparent hover:bg-black
            rounded-sm
            text-black hover:text-white
            flex items-center
            w-full gap-2
            py-5 text-base
            cursor-pointer
          '
        >
          <Image
            src='/login-page/google.png'
            alt='Google logo'
            width={0}
            height={0}
            sizes="100vw"
            className="h-5 w-5"
          />
          Login dengan Google
        </Button>
      </div>
    </main>
  );
}
