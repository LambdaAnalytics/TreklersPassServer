import { ConstantSetsModal } from '../models/constants.model';
/**
 * Create a Constant Set
 * @param {string} key
 * @param {Object} value
 * @returns {Promise<unkown>}
 */
export const createConstantSet = async (key: string, value: unknown) => {
  const constantSet = await ConstantSetsModal.create({ _id: key, value });
  return { [key]: constantSet.value };
};

/**
 * get a Constant Set
 * @param {string} key
 * @returns {Promise<unkown>}
 */
export const getConstantSet = async (key: string) => {
  const constantSet = await ConstantSetsModal.getConstantSet(key);
  return constantSet;
};

/**
 * get a Constant Set
 * @param {string} key
 * @returns {Promise<unkown>}
 */
export const removeConstantSet = async (key: string) => {
  const constantSet = await ConstantSetsModal.removeConstantSet(key);
  return constantSet;
};
/*
export const sendMassApplicationToClients = async (massLeadsBody) => {
  const massLeadInfo = await MassLeadsModal.create(massLeadsBody);
  for (let i = 0; i < massLeadsBody.massLeadsToClients.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const leadBody: LeadType = {};
    console.log(' massLeadsBody ', massLeadsBody);
    leadBody.firstName = massLeadsBody.firstName;
    leadBody.lastName = massLeadsBody.lastName;
    leadBody.email = massLeadsBody.email;
    leadBody.mobileNumber = massLeadsBody.mobileNumber;
    leadBody.experience = massLeadsBody.experience;
    leadBody.driverType = massLeadsBody.driverType;
    leadBody.minExp = massLeadsBody.minExp;
    leadBody.maxExp = massLeadsBody.maxExp;
    leadBody.ClientID = massLeadsBody.massLeadsToClients[i];
    leadBody.source = 'Mass or Individual Client Application';
    leadBody.state = massLeadsBody.state;
    leadBody.zipCode = massLeadsBody.zipCode;
    leadBody.city = massLeadsBody.city;
    leadBody.companyName = massLeadsBody.companyName;
    leadBody.timeStamp = new Date();

    // eslint-disable-next-line no-await-in-loop
    const result = await LeadDetails.create(leadBody);
  }
  return massLeadInfo;
};  */
