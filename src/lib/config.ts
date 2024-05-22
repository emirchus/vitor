export const siteConfig = {
  name: "Vitor",
  url: process.env.NEXT_PUBLIC_VERCEL_URL || "https://vitor.app",
  ogImage: `${process.env.NEXT_PUBLIC_VERCEL_URL}/og.png`,
  description: "Vitor beautifully Vitor is and accessible and beautiful video editor made with NextJs. Accessible. Customizable. Open Source.",
  links: {
    twitter: "https://twitter.com/emirchus",
    github: "https://github.com/emirchus/vitor"
  }
};

export type SiteConfig = typeof siteConfig;
