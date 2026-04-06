import { useCallback } from 'react';

// State stored outside the hook to persist across mounts
const preconnectedDomains = new Set<string>();
const prefetchedUrls = new Set<string>();

export function useIntentPrefetch() {
  const preconnectGateway = useCallback((urlStr: string) => {
    if (!urlStr || urlStr === "#" || urlStr.startsWith("/")) return;

    try {
      const url = new URL(urlStr);
      const origin = url.origin;
      
      // 1. Initial Domain Handshake (DNS/TLS)
      if (!preconnectedDomains.has(origin)) {
        const dns = document.createElement('link');
        dns.rel = 'dns-prefetch';
        dns.href = origin;
        document.head.appendChild(dns);
        
        const preconn = document.createElement('link');
        preconn.rel = 'preconnect';
        preconn.href = origin;
        document.head.appendChild(preconn);
        
        preconnectedDomains.add(origin);
      }

      // 2. High-Intent Document Prefetch
      if (!prefetchedUrls.has(urlStr)) {
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = urlStr;
        document.head.appendChild(prefetch);
        
        // Use prerender API if supported by the browser (Chrome 105+)
        if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) {
            if (!document.getElementById("monolith-speculation-rules")) {
                const specScript = document.createElement("script");
                specScript.id = "monolith-speculation-rules";
                specScript.type = "speculationrules";
                specScript.textContent = JSON.stringify({
                    prerender: [{
                        source: "list",
                        urls: [urlStr]
                    }]
                });
                document.head.appendChild(specScript);
            } else {
               // Append to existing rules safely if possible, but for now prefetch covers 90%
            }
        }

        prefetchedUrls.add(urlStr);
      }
    } catch (e) {
      // Silently ignore invalid URLs
    }
  }, []);

  return { preconnectGateway };
}
