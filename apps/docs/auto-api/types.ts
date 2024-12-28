export type ComponentParts = {
  [key: string]: SubComponents | AnatomyItem[];
  anatomy: AnatomyItem[];
};

export type SubComponents = SubComponent[];

export type SubComponent = {
  [key: string]: PublicType[] | Array<{ name: string; type: string }>;
} & {
  dataAttributes?: Array<{
    name: string;
    type: string;
  }>;
};

export type PublicType = Record<string, ParsedProps[]>;

export type ParsedProps = {
  comment: string;
  prop: string;
  type: string;
  defaultValue?: string;
};

export type AnatomyItem = {
  name: string;
  description?: string;
};
