export type ComponentParts = {
  [key: string]: SubComponents | AnatomyItem[];
  anatomy: AnatomyItem[];
};

export type SubComponent = {
  types?: PublicType[];
  dataAttributes?: Array<{
    name: string;
    type: string;
    comment?: string;
  }>;
  inheritsFrom?: string;
};

export type ComponentEntry = {
  [key: string]: SubComponent;
};

export type SubComponents = ComponentEntry[];

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
