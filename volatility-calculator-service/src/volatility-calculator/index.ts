import {Level2Update} from "ccxws";
import * as v1 from "./v1";
import * as v2 from "./v2";

const calcV3 = require('calculator-v3');

const test = calcV3.test;
const updateBooks = calcV3.updateBooks;
const calculate = calcV3.calculate;
const update = (l2Update: Level2Update) => {
  return calcV3.update(
    l2Update.timestampMs,
    l2Update.bids,
    l2Update.asks,
  );
}
const v3 = {
  test,
  updateBooks,
  calculate,
  update,
};

export {
  v1,
  v2,
  v3,
};
