import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Grade and check your writing in seconds."
          />
          <meta property="og:site_name" />
          <meta
            property="og:description"
            content="Grade and check your writing in seconds."
          />
          <meta property="og:title" content="GrammarScoreAI" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="GrammarScoreAI" />
          <meta
            name="twitter:description"
            content="Grade and check your writing in seconds."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
