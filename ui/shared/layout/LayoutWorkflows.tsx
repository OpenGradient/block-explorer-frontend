import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutWorkflows = ({ children }: Props) => {
  return (
    <Layout.Container>
      <Layout.NavBar/>
      <HeaderMobile hideSearchBar/>
      <Layout.MainArea>
        <Layout.SideBar/>
        <Layout.MainColumn>
          <HeaderAlert/>
          <HeaderDesktop hideSearchBar/>
          <AppErrorBoundary>
            <Layout.Content>
              { children }
            </Layout.Content>
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutWorkflows;
