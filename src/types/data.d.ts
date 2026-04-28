declare module '../data/topology.js' {
  export interface TopologyData {
    type: string;
    objects: {
      wb_countries: {
        type: string;
        geometries: Array<{
          type: string;
          arcs: number[][];
          properties: {
            ISO_A3: string;
          };
        }>;
      };
    };
    arcs: number[][][];
    transform: {
      scale: number[];
      translate: number[];
    };
    bbox: number[];
  }

  const topologyData: TopologyData;
  export default topologyData;
}

declare module '../data/shortcodes.js' {
  const shortcodesData: string[];
  export default shortcodesData;
}
