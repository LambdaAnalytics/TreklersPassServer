import { Schema, model, Model } from 'mongoose';
import { PaginateFn } from '../interfaces/PaginateFn';

type ConstantSetsType = { _id: string; value: unknown };

interface ConstantSetsModelType extends Model<ConstantSetsType> {
  getConstantSet(key: string): Promise<Record<string, unknown>>;
  setConstantSet(key: string, value?: unknown): Promise<void>;
  removeConstantSet(key: string): Promise<boolean>;
  paginate: PaginateFn<ConstantSetsType>;
}

const ConstantSetsSchema = new Schema<ConstantSetsType, ConstantSetsModelType>({
  _id: {
    type: String,
  },
  value: {
    type: Object,
  },
});

ConstantSetsSchema.statics.getConstantSet = async function (key) {
  const data = await this.findOne({ _id: key });
  return data;
} as ConstantSetsModelType['getConstantSet'];

ConstantSetsSchema.statics.setConstantSet = async function (key, value) {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        upsert: true,
      };
      await ConstantSetsModal.update({ _id: key }, { _id: key, value }, options, (err, raw) => {
        // console.log(err, raw)
        // console.log('client', client);
        resolve(raw);
      });
    } catch (error) {
      reject(error);
    }
  });
} as ConstantSetsModelType['setConstantSet'];

ConstantSetsSchema.statics.removeConstantSet = async function (key) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await ConstantSetsModal.remove({ _id: key }).then(
        (data) => {
          resolve(true);
        },
        (err) => {
          if (err) throw new Error(err);
          resolve(false);
        },
      );
    } catch (error) {
      reject(error);
    }
  });
} as ConstantSetsModelType['removeConstantSet'];

export const ConstantSetsModal = model<ConstantSetsType, ConstantSetsModelType>('constantSets', ConstantSetsSchema);
