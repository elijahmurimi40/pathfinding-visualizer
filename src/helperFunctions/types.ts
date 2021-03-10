/**
 * START OF PF_GRID-TYPES
 */

// grid node type
export interface NodeType {
  col: number;
  row: number;
  isNodeInFirstCol: boolean;
  isNodeInLastRow: boolean;
  isStartNode: boolean;
  isTargetNode: boolean;
  isWallNode: boolean;
}

// a row in pf-grid
export interface RowType extends Array<NodeType> {}

// a row as nodes this is an array of rows
export interface RowsType extends Array<RowType> {}

/**
 * END OF PF-GRID-TYPES
 */
