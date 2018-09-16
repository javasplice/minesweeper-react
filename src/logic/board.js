import { cascadeCells, getBoard, modifyCell, placeMines } from "../lib/utils";
import { CELL_STATE, CONFIG_DEFAULT } from "../lib/constants";

/**
 * @typedef {Object} BoardState
 * @property {Config} config
 * @property {boolean} seeded
 * @property {Board} board
 */

/** @type {BoardState} */
export const defaultState = {
  config: CONFIG_DEFAULT,
  seeded: false,
  board: [[]]
};

export const CONFIGURE_BOARD = "CONFIGURE_BOARD";
export const REVEAL_CELL = "REVEAL_CELL";
export const TURN_CELL_STATE = "TURN_CELL_STATE";

/**
 * Action creator for `CONFIGURE_BOARD`.
 * @param {Config} configuration
 * @returns {{type: string, configuration: Config}}
 */
export const configureBoard = configuration => {
  return {
    type: CONFIGURE_BOARD,
    configuration
  };
};

/**
 * Action creator for `REVEAL_CELL`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export const revealCell = (x, y) => {
  return {
    type: REVEAL_CELL,
    x,
    y
  };
};

/**
 * Action creator for `TURN_CELL_STATE`.
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, x: number, y: number}}
 */
export const turnCellState = (x, y) => {
  return {
    type: TURN_CELL_STATE,
    x,
    y
  };
};

export function mainReducer(state = defaultState, action) {
  switch (action.type) {
    case CONFIGURE_BOARD:
      return {
        seeded: false,
        config: action.configuration,
        board: getBoard(action.configuration)
      };

    case REVEAL_CELL: {
      const { x, y } = action;

      let newBoard = modifyCell(state.board, x, y, {
        state: CELL_STATE.REVEALED
      });
      if (!state.seeded) {
        // TODO: Split this out into a different action so this action is idempotent.
        placeMines(state.config, newBoard, x, y);
      }

      const cell = newBoard[y][x];
      if (cell.mineCount === 0 && !cell.hasMine) {
        // Cell cascade.
        cascadeCells(state.config, newBoard, x, y);
        return {
          ...state,
          seeded: true,
          board: newBoard
        };
      } else {
        return {
          ...state,
          seeded: true,
          board: newBoard
        };
      }
    }

    case TURN_CELL_STATE: {
      const { x, y } = action;
      const cell = state.board[y][x];

      if (cell.state === CELL_STATE.REVEALED) return state;

      let newState = CELL_STATE.DEFAULT;

      switch (cell.state) {
        case CELL_STATE.DEFAULT:
          newState = CELL_STATE.FLAGGED;
          break;
        case CELL_STATE.FLAGGED:
          // Check if question is enabled.
          newState = CELL_STATE.QUESTIONED;
          break;
        case CELL_STATE.QUESTIONED:
          newState = CELL_STATE.DEFAULT;
          break;
        case CELL_STATE.REVEALED:
        default:
          break;
      }

      return {
        ...state,
        board: modifyCell(state.board, action.x, action.y, { state: newState })
      };
    }

    default:
      return state;
  }
}
