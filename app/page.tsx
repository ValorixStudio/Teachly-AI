"use client";

import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Activation Lab
        </h1>

        <p className="mt-3 text-2xl">
          Explore and visualize activation functions in neural networks. <Link href="/activation-lab">Go to /activation-lab</Link>
        </p>
      </main>
    </div>
  );
}