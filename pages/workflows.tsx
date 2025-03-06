import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Workflows = dynamic(() => import('ui/pages/opengradient/Workflows'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/workflows">
      <Workflows/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
