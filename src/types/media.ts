export type ImageKind = "demo" | "reference" | "actual" | "placeholder";
export type MatchLevel = "category" | "series" | "exact" | "placeholder";

export interface ModelImage {
  id: string;
  src: string;
  alt: string;
  kind: ImageKind;
  matchLevel: MatchLevel;
  isCover: boolean;
  sortOrder: number;
  sourceId?: string;
  sourceType?: "official" | "media";
  storageKey?: string;
  note?: string;
  width?: number;
  height?: number;
  createdAt?: string;
}

export interface ModelMediaData {
  demoImages: ModelImage[];
  referenceImages: ModelImage[];
  actualImages: ModelImage[];
}

/** key 为车型 slug */
export type MediaRegistry = Record<string, ModelMediaData>;
