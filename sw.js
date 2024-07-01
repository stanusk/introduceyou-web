self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async function () {
      const response = await fetch(event.request);
      const newHeaders = new Headers(response.headers);
      newHeaders.set(
        "Permissions-Policy",
        "run-ad-auction=(), private-state-token-redemption=(), private-state-token-issuance=(), join-ad-interest-group=(), browsing-topics=()"
      );
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    })()
  );
});
