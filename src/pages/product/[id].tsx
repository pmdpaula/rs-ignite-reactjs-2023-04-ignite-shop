import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Stripe from 'stripe';

import { ProductStripeDTO } from '@/dtos/ProductStripeDTO';
import { stripe } from '@/lib/stripe';
import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product';

interface ProductProps {
  product: ProductStripeDTO;
}

const Product = ({ product }: ProductProps) => {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
  }

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      // TODO: conectar com alguma ferramenta de observabilidade (Datadog, Sentry, etc)
      setIsCreatingCheckoutSession(false);

      alert('Erro ao realizar a compra, tente novamente.');
    }
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image
          src={product.imageUrl}
          width={520}
          height={480}
          alt=""
        />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>

        <span>{product.price}</span>

        <p>{product.description}</p>

        <button
          type="button"
          onClick={handleBuyProduct}
          disabled={isCreatingCheckoutSession}
        >
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  );
};

export default Product;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id;

  const product = await stripe.products.retrieve(productId as string, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: price.currency,
        }).format(Number(price.unit_amount) / 100),
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // o retorno como feito abaixo, faz com que não gere nenhuma página estática
  // no momento da build e sim, apenas quando o usuário acessar a página
  return {
    paths: [],
    fallback: true,
  };
};
