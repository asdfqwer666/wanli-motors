export type ImageKind = "demo" | "actual" | "placeholder";
export type MatchLevel = "category" | "exact" | "placeholder";

export interface ModelImage {
  id: string;
  src: string;
  alt: string;
  kind: ImageKind;
  matchLevel: MatchLevel;
  isCover: boolean;
  sortOrder: number;
  sourceId?: string;
  width?: number;
  height?: number;
  createdAt?: string;
}

export interface ModelMediaData {
  demoImages: ModelImage[];
  actualImages: ModelImage[];
}

/** key 为车型 slug */
export type MediaRegistry = Record<string, ModelMediaData>;
