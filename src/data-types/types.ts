import type { ReactNode } from "react";

type Str = string;
type Num = number;

interface NavListItem {
  id: Num;
  title: Str;
  to: Str;
}

type FeaturesListItem = Omit<NavListItem, "to"> & {
  paragraph: Str;
  icon: () => ReactNode;
};

export type { NavListItem, FeaturesListItem };
