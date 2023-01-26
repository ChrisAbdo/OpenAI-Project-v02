import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your next pickup line in seconds."
          />
          <meta property="og:site_name" />
          <meta
            property="og:description"
            content="Generate your next pickup line in seconds."
          />
          <meta property="og:title" content="SmoothTalker" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="SmoothTalker" />
          <meta
            name="twitter:description"
            content="Generate your next pickup line in seconds."
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
