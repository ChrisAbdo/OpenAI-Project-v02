import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import ResizablePanel from '../components/ResizablePanel';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [generatedBios, setGeneratedBios] = useState<String>('');

  const prompt = `Generate a grade and some improvements for this passage: ${bio}. Clearly state the grade on one line and the feedback on the other.`;

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

    const bios = generatedBios.split('\n');
    const grade = bios[0];
    const feedback = bios[1];
  };

  const handleChange = (e: any) => {
    setBio(e.target.value);
    if (e.target.value.length >= 500) {
      toast.error('You have reached the maximum character limit.');
    }
  };

  return (
    <div className="flex mx-auto flex-col items-center justify-center py-2 min-h-screen bg-grid-[#0d0d0d]">
      <Head>
        <title>GrammarScoreAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 ">
        {/* component goes here */}
        <h1 className="text-3xl font-bold mb-5 text-white">
          Check your grammar and get a score
        </h1>
        <div className="max-w-xl">
          <div className="flex items-center space-x-3">
            <p className="text-left font-medium">
              <span className="font-bold text-white">Enter a text passage</span>{' '}
              to check for grammar, spelling, and punctuation errors. You will
              get a score and some suggestions to improve your writing.
            </p>
          </div>
          <textarea
            value={bio}
            onChange={handleChange}
            rows={5}
            maxLength={600}
            className="w-full rounded-xl border-black shadow-sm focus:border-black focus:ring-black my-5 overflow-auto resize-none text-black"
            placeholder={
              'Opera refers to a dramatic art form, originating in Europe, in which the emotional content is conveyed to the audience as much through music, both vocal and instrumental, as it is through the lyrics. By contrast, in musical theater an actors dramatic performance is primary, and the music plays a lesser role. The drama in opera is presented using the primary elements of theater such as scenery, costumes, and acting. However, the words of the opera, or libretto, are sung rather than spoken. The singers are accompanied by a musical ensemble ranging from a small instrumental ensemble to a full symphonic orchestra.'
            }
          />

          {!loading && (
            <button
              className="btn bg-[#5de5d9] text-black rounded-xl mt-6 w-full hover:bg-[#5de5d9]/80"
              onClick={(e) => generateBio(e)}
            >
              Grade my writing
            </button>
          )}
          {loading && (
            <button
              className="btn btn-secondary rounded-xl mt-6 w-full bg-black"
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
            <motion.div className="space-y-10 my-10 bg-base-200 rounded-xl">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-white mx-auto">
                      Feedback
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto ">
                    {generatedBios
                      .split('\n')
                      .filter((line) => line !== '')
                      .map((line, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center justify-center space-y-2 bg-white rounded-xl shadow-md p-4 hover:bg-gray-300 transition border border-black"
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-xl font-medium text-slate-900">
                              {line}
                            </p>
                          </div>
                        </div>
                      ))}
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
