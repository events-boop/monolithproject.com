import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  id?: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <Helmet prioritizeSeoTags>
      <script id={id} type="application/ld+json">
        {JSON.stringify(data).replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
}
