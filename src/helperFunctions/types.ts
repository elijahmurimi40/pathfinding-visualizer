/**
 * START OF PF_GRID-TYPES
 */

// grid node type
export interface NodeType {
  col: number;
  row: number;
  isNodeInFirstCol: boolean;
  isNodeInLastCol: boolean;
  isNodeInFirstRow: boolean;
  isNodeInLastRow: boolean;
  isStartNode: boolean;
  isTargetNode: boolean;
  isWallNode: boolean;
  isBombNode: boolean;
  idx: number;
}

// a row in pf-grid
export interface RowType extends Array<NodeType> {}

// a row as nodes this is an array of rows
export interface RowsType extends Array<RowType> {}

/**
 * END OF PF-GRID-TYPES
 */

/**
 * START OF APP.FUNCTIONS
 */

export interface NodeInfoType {
  index: number;
  isWallNode: string | null;
  x: number;
  y: number;
}

/**
 * START OF APP.FUNCTIONS
 */
