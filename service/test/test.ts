import _ from "lodash";
import { Level2Update } from "ccxws";
import { expect } from 'chai';

import { v1, v2, v3 } from '../src/volatility-calculator';

import { l2Updates } from './assets';

describe('Volatility calculation', () => {

  describe('correctness', () => {
    const books = [
      [200, 19960, 20000, 19960],
      [132, 19990, 20110, 20050],
      [66, 20050, 20060, 20055],
      [1, 20000, 20010, 20005],
    ];
    describe('v1', () => {
      it('should calculate correctly', () => {
        expect(v1.calculate(books)).equal(0.36147860256782666);
      });
      it('should return correct version', async () => {
        expect(
          (await v1.update(l2Updates[0] as unknown as Level2Update)).version
        ).equal('1');
      });
      it('should return correct volatility with rolling window', async () => {
        // TODO: make tests stateless (this should not depend on above test)
        (await v1.update(l2Updates[1] as unknown as Level2Update)).volatility;
        (await v1.update(l2Updates[2] as unknown as Level2Update)).volatility;
        (await v1.update(l2Updates[3] as unknown as Level2Update)).volatility;
        expect(
          (await v1.update(l2Updates[4] as unknown as Level2Update)).volatility
        ).equal(0.17699841196990795);
        expect(
          (await v1.update(l2Updates[5] as unknown as Level2Update)).volatility
        ).equal(0.16003151392510687);
      });
    });
    describe('v2', () => {
      it('should calculate correctly', () => {
        expect(v2.calculate(books)).equal(0.36147860256782666);
      });
      it('should return correct version', async () => {
        expect(
          (await v2.update(l2Updates[0] as unknown as Level2Update)).version
        ).equal('2');
      });
      it('should return null if 200ms has not passed since first book', async () => {
        expect(
          (await v2.update(l2Updates[0] as unknown as Level2Update)).volatility
        ).to.be.null;
        expect(
          (await v2.update(l2Updates[3] as unknown as Level2Update)).volatility
        ).to.be.null;
      });
      it('should return volatility if 200ms has passed since first book', async () => {
        // TODO: make tests stateless (this should not depend on above test)
        expect(
          (await v2.update(l2Updates[5] as unknown as Level2Update)).volatility
        ).equal(0.05542931450061898);
      });
    });
    describe('v3', () => {
      // TODO:
      // it('should calculate correctly', () => {
      //   expect(v3.calculate(books)).equal(0.36147860256782666);
      // });
      it('should return correct version', async () => {
        expect(
          (await v3.update(l2Updates[0] as unknown as Level2Update)).version
        ).equal('3');
      });
      it('should return correct volatility with rolling window', async () => {
        // TODO: make tests stateless (this should not depend on above test)
        (await v3.update(l2Updates[1] as unknown as Level2Update)).volatility;
        (await v3.update(l2Updates[2] as unknown as Level2Update)).volatility;
        (await v3.update(l2Updates[3] as unknown as Level2Update)).volatility;
        expect(
          (await v3.update(l2Updates[4] as unknown as Level2Update)).volatility
        ).equal(0.17699841196990795);
        expect(
          (await v3.update(l2Updates[5] as unknown as Level2Update)).volatility
        ).equal(0.16003151392510687);
      });
    });
  });

  describe('speed', () => {
    describe('v1', () => {
      it('should be reasonably fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          v1.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff / l2Updates.length).below(1_000_000);
      });
      it('should be blazingly fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          v1.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff).below(1_000_000);
      });
    });
    describe('v2', () => {
      it('should be reasonably fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          v2.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff / l2Updates.length).below(1_000_000);
      });
      it('should be blazingly fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          v2.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff).below(1_000_000);
      });
    });
    describe('v3', () => {
      it('should be reasonably fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          v3.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff / l2Updates.length).below(1_000_000);
      });
      it('should be blazingly fast', () => {
        const start = process.hrtime();

        _.each(l2Updates, upd => {
          v3.update(upd as unknown as Level2Update);
        });

        const [secondsDiff, nanosecondsDiff] = process.hrtime(start);
        expect(secondsDiff).equal(0);
        expect(nanosecondsDiff).below(1_000_000);
      });
    });
  });
});