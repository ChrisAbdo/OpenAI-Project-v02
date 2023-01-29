import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    // <header className="bg-base-100 flex justify-between items-center w-full border-b-2 border-black p-6 sm:px-4 px-2 ">
    //   <Link href="/" className="flex space-x-3">
    //     <h1 className="sm:text-4xl text-2xl font-bold tracking-tight">
    //       NeuralDJ
    //     </h1>
    //   </Link>
    //   <a
    //     href="https://www.github.com/ChrisAbdo"
    //     target="_blank"
    //     rel="noreferrer"
    //     className="bg-black rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80"
    //   >
    //     See my projects!
    //   </a>
    // </header>
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-4xl">NeuralDJ</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-secondary rounded-xl">
          see my projects!
        </button>
      </div>
    </div>
  );
}
