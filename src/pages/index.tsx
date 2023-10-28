import { useKeenSlider } from 'keen-slider/react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Stripe from 'stripe';

import { ProductDTO } from '@/dtos/ProductDTO';
import { stripe } from '@/lib/stripe';
import { HomeContainer, Product } from '@/styles/pages/home';

import 'keen-slider/keen-slider.min.css';

interface HomeProps {
  products: ProductDTO[];
}

const Home = ({ products }: HomeProps) => {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer
      ref={sliderRef}
      className="keen-slider"
    >
      {products.map((product) => (
    <HomeContainer ref={sliderRef} className="keen-slider">
          <Product className="keen-slider__slide">
            <Image
              src={product.imageUrl}
              width={520}
              height={480}
              alt=""
            />

            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </Product>

      <Product className="keen-slider__slide">
        <Image src={camiseta2} width={520} height={480} alt="" />

        <footer>
          <strong>Camiseta 2</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>

      <Product className="keen-slider__slide">
        <Image src={camiseta3} width={520} height={480} alt="" />

        <footer>
          <strong>Camiseta 3</strong>
          <span>R$ 84,90</span>
        </footer>
      </Product>
      ))}
    </HomeContainer>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: price.currency,
      }).format(Number(price.unit_amount) / 100),
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
