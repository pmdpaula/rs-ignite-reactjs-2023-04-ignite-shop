import { useRouter } from 'next/router';

const Product = () => {
  const { query } = useRouter();

  return (
    <>
      <main>
        <h1>Produto</h1>
      </main>
    </>
  );
};

export default Product;
