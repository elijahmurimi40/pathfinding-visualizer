import React, { ForwardedRef, RefObject } from 'react';
import { RowsType, RowType, NodeType } from '../helperFunctions/types';
import './PathFindingGrid.css';

interface Props {
  pfGridHeight: number;
  marginTop: number;
  pfGridRows: RowsType | undefined;
  startNodeRef: RefObject<HTMLElement>;
  targetNodeRef: RefObject<HTMLElement>;
}

const PathFindingGrid = React.forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    pfGridHeight,
    marginTop,
    pfGridRows,
    startNodeRef,
    targetNodeRef,
  } = props;

  return (
    <div
      ref={ref}
      className="pf-grid"
      style={{
        border: '1px solid #007bff',
        height: `${pfGridHeight}px`,
        marginLeft: '60px',
      }}
    >
      <div style={{ marginTop }}>
        {
          pfGridRows === undefined ? ''
            : pfGridRows.map((row: RowType, idxC: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="pf-grid-nodes-row" key={idxC}>
                {
                  row.map((node: NodeType, idxR: number) => {
                    const {
                      isNodeInFirstCol, isNodeInLastRow, isStartNode, isTargetNode, isWallNode,
                    } = node;
                    const firstColNode = isNodeInFirstCol ? 'first-col-node' : '';
                    const lastRowNode = isNodeInLastRow ? 'last-row-node' : '';
                    const wallNode = isWallNode ? 'wall-node' : '';

                    return (
                      <div
                        className={`pf-grid-node ${firstColNode} ${lastRowNode} ${wallNode}`}
                        // eslint-disable-next-line react/no-array-index-key
                        key={idxR}
                      >
                        {
                          isStartNode
                            ? <i ref={startNodeRef} className="large chevron right icon" />
                            : ''
                        }

                        {
                          isTargetNode
                            ? <i ref={targetNodeRef} className="large bullseye icon" />
                            : ''
                        }
                      </div>
                    );
                  })
                }
              </div>
            ))
        }
      </div>
    </div>
  );
});

export default PathFindingGrid;
