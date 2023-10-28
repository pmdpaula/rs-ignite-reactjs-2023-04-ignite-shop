import type { AppProps } from 'next/app';
import Image from 'next/image';

import logoImg from '@/assets/logo.svg';
import { globalStyles } from '@/styles/global';
import { Container, Header } from '@/styles/pages/app';

globalStyles();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Container>
      <Header>
        <Image
          src={logoImg.src}
          alt=""
          width={100}
          height={100}
        />
      </Header>

      <Component {...pageProps} />
    </Container>
  );
};

export default App;
