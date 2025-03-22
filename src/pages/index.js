import Head from 'next/head';
import FileUploader from '@/components/FileUploader';

export default function Home() {
  return (
    <>
      <Head>
        <title>Shubham Mishra TypeFace project</title>
        <meta name="description" content=" Shubham Mishra TypeFace project file management application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <FileUploader />
      </main>
    </>
  );
}