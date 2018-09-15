import {
  CONFIG_DEFAULT,
  CONFIG_EASY,
  CONFIG_INTERMEDIATE,
  CONFIG_EXPERT,
  CELL_STATE,
  CONFIGURE_BOARD,
  defaultState,
  mainReducer
} from "./board";

it("should return the default state if `state` is undefined", () => {
  const result = mainReducer(undefined, {});
  expect(result).toBe(defaultState);
});

it("should return the current state if action type is unrecognized", () => {
  const stateBefore = {
    ...defaultState
  };
  const action = {
    type: "bogus_action"
  };
  const result = mainReducer(stateBefore, action);
  expect(result).toBe(stateBefore);
});

describe("CONFIGURE_BOARD", () => {
  it("should configure for CONFIG_DEFAULT", () => {
    const stateBefore = {
      ...defaultState
    };
    const action = {
      type: CONFIGURE_BOARD,
      configuration: CONFIG_DEFAULT
    };
    const result = mainReducer(stateBefore, action);
    expect(result).toEqual({
      ...stateBefore,
      config: CONFIG_DEFAULT,
      board: []
    });
  });

  it("should configure for CONFIG_EASY", () => {
    const stateBefore = {
      ...defaultState
    };
    const action = {
      type: CONFIGURE_BOARD,
      configuration: CONFIG_EASY
    };
    const result = mainReducer(stateBefore, action);
    expect(result).toMatchSnapshot();
  });

  it("should configure for CONFIG_INTERMEDIATE", () => {
    const stateBefore = {
      ...defaultState
    };
    const action = {
      type: CONFIGURE_BOARD,
      configuration: CONFIG_INTERMEDIATE
    };
    const result = mainReducer(stateBefore, action);
    expect(result).toMatchSnapshot();
  });

  it("should configure for CONFIG_EXPERT", () => {
    const stateBefore = {
      ...defaultState
    };
    const action = {
      type: CONFIGURE_BOARD,
      configuration: CONFIG_EXPERT
    };
    const result = mainReducer(stateBefore, action);
    expect(result).toMatchSnapshot();
  });

  // TODO: REVEAL_CELL
  // TODO: TURN_CELL_STATE
});
