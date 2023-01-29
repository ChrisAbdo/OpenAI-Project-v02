import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DropDown, { VibeType } from '../components/DropDown';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import ResizablePanel from '../components/ResizablePanel';
import Lottie from 'react-lottie-player';
import lottieJson from '../../public/lottie.json';
import Link from 'next/link';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [vibe, setVibe] = useState<VibeType>('Standard');
  const [generatedBios, setGeneratedBios] = useState<String>('');

  console.log('Streamed response: ', generatedBios);

  const prompt =
    vibe === 'Rizzlord'
      ? `Generate 2 funny pickup lines and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated pickup line is at max 20 words and base it on this context: ${bio}${
          bio.slice(-1) === '.' ? '' : '.'
        }`
      : `Generate 2 ${vibe} pickup lines and clearly labeled "1." and "2.". Make sure each generated pickup line is at least 14 words and at max 20 words and base them on this context: ${bio}${
          bio.slice(-1) === '.' ? '' : '.'
        }`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios('');
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log('Edge function returned.');

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex  mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>GrammarScoreAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 ">
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <Lottie
              loop
              animationData={lottieJson}
              play
              style={{ width: 300, height: 300 }}
            />
            <div>
              <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
                Your AI powered grammar checker and grader
              </h1>
              <p className="text-2xl max-w-2xl text-slate-900 mt-5">
                GrammarScoreAI is a grammar checker that uses OpenAI to{' '}
                <span className="font-bold">check your grammar &</span>
                <span className="font-bold">&nbsp;grade your writing.</span>
              </p>
              <Link href="/score" className="btn btn-secondary mt-6 rounded-xl">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
