import type { FeaturesListItem, NavListItem } from "./types";

import {
  BookBookmarkIcon,
  BookOpenIcon,
  PaletteIcon,
  ChartColumnIncreasingIcon,
} from "../component/icons/Icons";

const navList: NavListItem[] = [
  {
    id: 1,
    title: "Home",
    to: "/",
  },
  {
    id: 2,
    title: "Library",
    to: "/library",
  },
  {
    id: 3,
    title: "About",
    to: "/about",
  },
  {
    id: 4,
    title: "Contact",
    to: "/contact",
  },
];

export { navList };

const featuresList: FeaturesListItem[] = [
  {
    id: 1,
    title: "Capture Your Thoughts",
    paragraph: "Jot down questions & reflections in margins.",
    icon: BookBookmarkIcon,
  },
  {
    id: 2,
    title: "Read at Your Own Pace",
    paragraph: "Effortlessly track pages & let the smart calculator work.",
    icon: ChartColumnIncreasingIcon,
  },
  {
    id: 3,
    title: "Organize Your Library",
    paragraph: " Keep tabs on current reads and wishlist.",
    icon: BookOpenIcon,
  },
  {
    id: 4,
    title: "Read Day or Night",
    paragraph: "Calming light and dark themes tailored for your eyes.",
    icon: PaletteIcon,
  },
];

export { featuresList };
