import { useEffect } from "react";

// Internal React navigation hands off to the same standalone document served
// by Netlify. Keep campaign attribution and section links across that handoff.
export default function SunsetsEventRedirect() {
  useEffect(() => {
    window.location.replace(
      `/sunsets/index.html${window.location.search}${window.location.hash}`
    );
  }, []);

  return <a href="/sunsets/index.html">Open the Chasing Sun(Sets) event page</a>;
}
