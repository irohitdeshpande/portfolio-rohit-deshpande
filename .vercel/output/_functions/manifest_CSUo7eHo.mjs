import 'kleur/colors';
import { p as decodeKey } from './chunks/astro/server_Bhp-EZF6.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CGNW9tGS.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/","cacheDir":"file:///C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/node_modules/.astro/","outDir":"file:///C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/dist/","srcDir":"file:///C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/","publicDir":"file:///C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/public/","buildClientDir":"file:///C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/dist/client/","buildServerDir":"file:///C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.12.8_@types+node@16_46c8101e03335ac246d81af3a183ddd0/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/chat","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/chat\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"chat","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/chat.ts","pathname":"/api/chat","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.12.8_@types+node@16_46c8101e03335ac246d81af3a183ddd0/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/chat@_@ts":"pages/api/chat.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CSUo7eHo.mjs","C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/node_modules/.pnpm/astro@5.12.8_@types+node@16_46c8101e03335ac246d81af3a183ddd0/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DR1xXIRW.mjs","C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/components/Hero.astro?astro&type=script&index=0&lang.ts":"_astro/Hero.astro_astro_type_script_index_0_lang.BfXKnfba.js","C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/components/Contact.astro?astro&type=script&index=0&lang.ts":"_astro/Contact.astro_astro_type_script_index_0_lang.CE3Oxgo5.js","C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/components/Chatbot.astro?astro&type=script&index=0&lang.ts":"_astro/Chatbot.astro_astro_type_script_index_0_lang.5XFUIXaT.js","C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/lib/localLLM.ts":"_astro/localLLM.BFCEGbvy.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/components/Hero.astro?astro&type=script&index=0&lang.ts","const f=\"नमस्कार! मी\",s=`\nरोहित देशपांडे`,l=`\nROHIT DESHPANDE`;let m=0,t=0,o=!0;const n=document.getElementById(\"typed-intro\"),e=document.getElementById(\"typed-name\");n&&(n.innerHTML=\"&nbsp;\");e&&(e.innerHTML=\"&nbsp;\");function i(){m<f.length?(n&&(n.textContent+=f[m++]),setTimeout(i,70)):o&&t<s.length?(e&&(s[t]===`\n`?e.appendChild(document.createElement(\"br\")):e.textContent+=s[t]),t++,setTimeout(i,70)):o?setTimeout(a,700):!o&&t<l.length?(e&&(l[t]===`\n`?e.appendChild(document.createElement(\"br\")):e.textContent+=l[t]),t++,setTimeout(i,70)):setTimeout(u,700)}function a(){e&&(e.textContent??\"\").length>0?(e.textContent=(e.textContent??\"\").slice(0,-1),setTimeout(a,40)):(t=0,o=!1,e&&(e.textContent=\"\"),setTimeout(i,200))}function u(){e&&(e.textContent=\"\"),m=0,t=0,o=!0,n&&(n.textContent=\"\"),setTimeout(i,200)}n&&e&&i();"],["C:/Users/RD/Projects/Portfolio/portfolio-rohit-deshpande/src/components/Contact.astro?astro&type=script&index=0&lang.ts","const m={_origin:\"https://api.emailjs.com\"},f=(t,e=\"https://api.emailjs.com\")=>{m._userID=t,m._origin=e},u=(t,e,i)=>{if(!t)throw\"The user ID is required. Visit https://dashboard.emailjs.com/admin/integration\";if(!e)throw\"The service ID is required. Visit https://dashboard.emailjs.com/admin\";if(!i)throw\"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates\";return!0};class l{constructor(e){this.status=e.status,this.text=e.responseText}}const p=(t,e,i={})=>new Promise((s,o)=>{const a=new XMLHttpRequest;a.addEventListener(\"load\",({target:n})=>{const d=new l(n);d.status===200||d.text===\"OK\"?s(d):o(d)}),a.addEventListener(\"error\",({target:n})=>{o(new l(n))}),a.open(\"POST\",m._origin+t,!0),Object.keys(i).forEach(n=>{a.setRequestHeader(n,i[n])}),a.send(e)}),y=(t,e,i,s)=>{const o=s||m._userID;return u(o,t,e),p(\"/api/v1.0/email/send\",JSON.stringify({lib_version:\"3.2.0\",user_id:o,service_id:t,template_id:e,template_params:i}),{\"Content-type\":\"application/json\"})},h=t=>{let e;if(typeof t==\"string\"?e=document.querySelector(t):e=t,!e||e.nodeName!==\"FORM\")throw\"The 3rd parameter is expected to be the HTML form element or the style selector of form\";return e},g=(t,e,i,s)=>{const o=s||m._userID,a=h(i);u(o,t,e);const n=new FormData(a);return n.append(\"lib_version\",\"3.2.0\"),n.append(\"service_id\",t),n.append(\"template_id\",e),n.append(\"user_id\",o),p(\"/api/v1.0/email/send-form\",n)},_={init:f,send:y,sendForm:g},c=document.getElementById(\"contact-form\"),r=document.getElementById(\"contact-toast\");c&&r&&c.addEventListener(\"submit\",async t=>{t.preventDefault();const e=c.querySelector('button[type=\"submit\"]'),i=e.innerHTML;e.innerHTML=`\n        <svg class=\"animate-spin w-4 h-4 mr-2\" fill=\"none\" viewBox=\"0 0 24 24\">\n          <circle class=\"opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"4\"></circle>\n          <path class=\"opacity-75\" fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\"></path>\n        </svg>\n        Sending...\n      `,e.disabled=!0,r.textContent=\"Sending your message...\",r.style.opacity=\"1\";try{const s=new FormData(c),o=await _.send(\"service_idnjelu\",\"template_z6dosgs\",{from_name:s.get(\"name\"),from_email:s.get(\"email\"),subject:s.get(\"subject\"),message:s.get(\"message\")},\"3uxXkNidPunCtPyph\");r.textContent=\"Message sent successfully! Thank you for reaching out.\",r.className=\"mt-4 text-center text-green-400 font-semibold opacity-100 transition-opacity duration-200\",c.reset()}catch(s){console.error(\"Email sending failed:\",s),r.textContent=\"Failed to send message. Please try again or contact me directly.\",r.className=\"mt-4 text-center text-red-400 font-semibold opacity-100 transition-opacity duration-200\"}finally{e.innerHTML=i,e.disabled=!1,setTimeout(()=>{r.style.opacity=\"0\",setTimeout(()=>{r.className=\"mt-4 text-center text-primary font-semibold opacity-0 transition-opacity duration-200\"},200)},5e3)}});"]],"assets":["/_astro/be-vietnam-pro-latin-ext-400-normal.0slToPcK.woff2","/_astro/gabarito-latin-wght-normal.DfmSH0O8.woff2","/_astro/gabarito-latin-ext-wght-normal.C3dQQfBQ.woff2","/_astro/be-vietnam-pro-latin-400-normal.b8ymZRaE.woff2","/_astro/be-vietnam-pro-vietnamese-400-normal.zlEY3-7j.woff2","/_astro/be-vietnam-pro-latin-ext-400-normal.CAV9EJEJ.woff","/_astro/be-vietnam-pro-latin-400-normal.yim3LC58.woff","/_astro/be-vietnam-pro-vietnamese-400-normal.BdPyuduI.woff","/_astro/index.CvfuQYEj.css","/arcon-logo.jpg","/chat-icon.svg","/check.svg","/csi-logo.jpg","/customer-churn.png","/dark-to-light-icon.svg","/email-icon.svg","/external.svg","/face-mask.png","/favicon.svg","/github-icon.svg","/hfs-campus.jpg","/light-to-dark-icon.svg","/linkedin-icon.svg","/menu.svg","/mock-interviewer.png","/portfolio-website.png","/quiz-app.png","/rohit-logo.png","/rohitdeshpande.jpg","/sentiment-analysis.png","/singhania-school.jpg","/somaiya-campus.jpg","/whatsapp-icon.svg","/_astro/Chatbot.astro_astro_type_script_index_0_lang.5XFUIXaT.js","/_astro/localLLM.BFCEGbvy.js","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"wbjLxGYVcbIWujz8ODmtAuqQLOVo6melZoNklkH4h8k="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
