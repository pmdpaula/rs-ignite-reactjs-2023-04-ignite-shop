import { useRouter } from "next/router";

export const Product = () => {
  const { query } = useRouter();
  console.log("🚀 ~ file: index.tsx:5 ~ Product ~ query:", query);

  return (
    <>
      <main>
        <h1>Produto</h1>
      </main>
    </>
  );
};
