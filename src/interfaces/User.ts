import { Address } from './Address';

export class UserType {
  id: string;

  firstName: string;

  lastName: string;

  email?: string;

  mobileNumber?: string;

  experience?: string;

  userType?: string;

  address?: Address;

  minExp?: number;

  maxExp?: number;

  city?: string;

  state?: string;

  zipCode?: string;

  driverType?: [];

  privacyPolicy?: boolean;

  driverExp?: string;

  constructor(args?: any) {
    const props = args || {};

    this.id = props.id || '';
    this.firstName = props.firstName || '';
    this.lastName = props.lastName || '';
    this.email = props.email || '';
    this.mobileNumber = props.mobileNumber || '';
    this.experience = props.experience || '';
    this.userType = props.userType || '';
    this.address = new Address(props.address);
    this.minExp = props.minExp || 0;
    this.maxExp = props.maxExp || 0;
    this.city = props.city || '';
    this.state = props.state || '';
    this.zipCode = props.zipCode || '';
    this.driverType = props.driverType || [];
    this.privacyPolicy = props.privacyPolicy || false;
    this.driverExp = props.driverExp || '';
  }
}
