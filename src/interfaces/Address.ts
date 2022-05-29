export class Address {
  street: string;

  city: string;

  state: string;

  zip: string;

  type: 'Point';

  coordinates: [number, number];

  constructor(args) {
    const props = args || {};

    this.street = props.street || '';
    this.city = props.city || '';
    this.state = props.state || '';
    this.zip = props.zip || '';
    this.type = 'Point';
    this.coordinates = props.coordinates || [0, 0];
  }
}
