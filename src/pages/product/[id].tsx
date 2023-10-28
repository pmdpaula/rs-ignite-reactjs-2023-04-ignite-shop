import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Stripe from 'stripe';

import { ProductDTO } from '@/dtos/ProductDTO';
import { stripe } from '@/lib/stripe';
import { ImageContainer, ProductContainer, ProductDetails } from '@/styles/pages/product';

interface ProductProps {
  product: ProductDTO;
}

const Product = ({ product }: ProductProps) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
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

        <button type="button">Adicionar ao carrinho</button>
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
