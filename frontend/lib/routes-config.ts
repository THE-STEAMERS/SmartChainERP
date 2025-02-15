// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true; // noLink will create a route segment (section) but cannot be navigated
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
      title: "Dashboard",
      href: "/DashBoard",
      noLink: true,
      items: [],
  },
  {
      title: "Authentication",
      href: "/authentication",
      items: [],
  },
  {
      title: "Accounting",
      href: "/accounting",
      items: [],
  },
  {
      title: "StockCount",
      href: "/stockCount",
      items: [],
  },
];

type Page = { title: string; href: string };

function getRecursiveAllLinks(node: EachRoute): Page[] {
  const ans: Page[] = [];
  if (!node.noLink) {
      ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
      const temp = { ...subNode, href: new URL(subNode.href, node.href).pathname };
      ans.push(...getRecursiveAllLinks(temp));
  });
  return ans;
}
