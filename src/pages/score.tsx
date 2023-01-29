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
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>GrammarScoreAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
          The AI powered DJ
        </h1>
        <p className="text-2xl max-w-2xl text-slate-900 mt-5">
          GrammarScoreAI is an AI powered DJ that generates sets based on your
          desired mood.
        </p>
        <div className="max-w-xl">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
              priority
            />
            <p className="text-left font-medium">
              Enter your matches bio&nbsp;
              <span className="text-black">
                (or any topic you want to smoothtalk your way into)
              </span>
              .
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-black shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              'e.g. Love hiking. Avid movie watcher. I love to travel. I love to cook. Foodie. Book lover.'
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image
              src="/2-black.png"
              width={30}
              height={30}
              alt="1 icon"
              priority
            />
            <p className="text-left font-medium">
              Select your level of smoothness.
            </p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your pickuplines &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated pickup lines
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedBios
                      .substring(generatedBios.indexOf('1') + 3)
                      .split('2.')
                      .map((generatedBio) => {
                        return (
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-300 transition cursor-copy border border-black"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedBio);
                              toast('Bio copied to clipboard', {
                                icon: '✂️',
                                style: {
                                  border: '1px solid #000',
                                  padding: '16px',
                                },
                              });
                            }}
                            key={generatedBio}
                          >
                            <p>{generatedBio}</p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;