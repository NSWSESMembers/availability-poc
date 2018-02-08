import { DISTANT_FUTURE, DISTANT_PAST } from '../constants';
import { DEFAULT_USER_ID } from '../config';

const getMonday = () => {
  const now = new Date();
  const day = now.getDay() || 7;
  if (day !== 1) { now.setHours(-24 * (day - 1)); }
  return Math.floor(now.getTime() / 1000);
};

const minFromNow = (min) => {
  const now = new Date();
  return Math.floor(now.getTime() / 1000) + (60 * min);
};

const MONDAY = getMonday();

export const DEFAULT_USERNAME = 'test';
export const DEFAULT_GROUP = 'NSW SES';

export const ORG_NAME = 'NSW SES';

export const CAPABILITIES = [
  'Road Crash Rescue',
  'Vertical Rescue',
  'Flood Rescue',
  'Chainsaw',
];

export const TAGS = [
  'Tag1',
  'Tag2',
  'Tag3',
];

export const USERS = [
  {
    id: DEFAULT_USER_ID,
    username: DEFAULT_USERNAME,
    password: 'test',
    displayName: 'Paddy Platypus',
    email: 'test@example.com',
  },
  {
    id: 11,
    username: 'kiama1',
    password: 'test',
    displayName: 'Alex Alpha',
    email: 'kiama1@example.com',
  },
  {
    id: 12,
    username: 'kiama2',
    password: 'test',
    displayName: 'Bob Bravo',
    email: 'kiama2@example.com',
  },
  {
    id: 13,
    username: 'kiama3',
    password: 'test',
    displayName: 'Caroline Charlie',
    email: 'kiama3@example.com',
  },
  {
    id: 14,
    username: 'kiama4',
    password: 'test',
    displayName: 'David Delta',
    email: 'kiama4@example.com',
  },
  {
    id: 15,
    username: 'kiama5',
    password: 'test',
    displayName: 'Erin Echo',
    email: 'kiama4@example.com',
  },
  {
    id: 16,
    username: 'kiama6',
    password: 'test',
    displayName: 'Fabio Foxtrot',
    email: 'kiama6@example.com',
  },
  {
    id: 17,
    username: 'kiama7',
    password: 'test',
    displayName: 'Greg Golf',
    email: 'kiama7@example.com',
  },
  {
    id: 18,
    username: 'kiama8',
    password: 'test',
    displayName: 'Heather Hotel',
    email: 'kiama8@example.com',
  },
  {
    id: 21,
    username: 'parramatta1',
    password: 'test',
    displayName: 'Tim Dykes',
    email: 'paramatta1@example.com',
  },
  {
    id: 22,
    username: 'parramatta2',
    password: 'test',
    displayName: 'Ian India',
    email: 'parramatta2@example.com',
  },
  {
    id: 23,
    username: 'parramatta3',
    password: 'test',
    displayName: 'Jane Juliet',
    email: 'parramatta3@example.com',
  },
  {
    id: 24,
    username: 'parramatta4',
    password: 'test',
    displayName: 'Katt Kilo',
    email: 'parramatta4@example.com',
  },
  {
    id: 25,
    username: 'parramatta5',
    password: 'test',
    displayName: 'Luke Lima',
    email: 'parramatta5@example.com',
  },
];

export const GROUPS = [
  {
    name: 'Kiama',
    users: [
      'test',
      'kiama1',
      'kiama2',
      'kiama3',
      'kiama4',
      'kiama5',
      'kiama6',
      'kiama7',
      'kiama8',
    ],
  },
  {
    name: 'Parramatta',
    users: [
      'test',
      'parramatta1',
      'parramatta2',
      'parramatta3',
      'parramatta4',
      'parramatta5',
    ],
  },
  {
    name: DEFAULT_GROUP,
    users: [
      'test',
      'kiama1',
      'kiama2',
      'kiama3',
      'kiama4',
      'kiama5',
      'kiama6',
      'kiama7',
      'kiama8',
      'parramatta1',
      'parramatta2',
      'parramatta3',
      'parramatta4',
      'parramatta5',
    ],
  },
];

export const SCHEDULES = [
  {
    name: 'Wagga Wagga OOA',
    details: 'Flood Rescue operators required for Wednesday deployment to Wagga Wagga. Leave Monday return Thursday',
    startTime: MONDAY + (60 * 60 * 24 * 1),
    endTime: MONDAY + (60 * 60 * 24 * 3),
    group: 'NSW SES',
    timeSegmentUsers: [
      'kiama1',
      'kiama2',
      'parramatta1',
      'parramatta2',
    ],
  },
  {
    name: 'Kiama Rescue',
    details: 'Ongoing availability for RCR, VR, GLR',
    startTime: DISTANT_PAST,
    endTime: DISTANT_FUTURE,
    group: 'Kiama',
    timeSegmentUsers: [
      'kiama1',
      'kiama2',
      'kiama3',
    ],
  },
  {
    name: 'Kiama Storm Team',
    details: 'Non-urgent availability for storm jobs during this week',
    startTime: MONDAY,
    endTime: MONDAY + (60 * 60 * 24 * 6),
    group: 'Kiama',
    timeSegmentUsers: [
      'kiama3',
      'kiama4',
      'kiama5',
      'kiama8',
    ],
  },
  {
    name: 'Parramatta Storm Team',
    details: 'Non-urgent availability for storm jobs',
    startTime: DISTANT_PAST,
    endTime: DISTANT_FUTURE,
    group: 'Parramatta',
    timeSegmentUsers: [
      'parramatta1',
      'parramatta2',
      'parramatta3',
      'parramatta4',
      'parramatta5',
    ],
  },
];

export const EVENTS = [
  {
    name: 'VR at Gerringong Falls',
    details: '2 climbers stranded 50m from top of cliff.',
    group: 'Kiama',
    responses: [
      {
        user: 'test',
        status: 'responding',
        destination: 'HQ',
        eta: minFromNow(15),
        locationLatitude: -34.66828,
        locationLongitude: 150.85219,
        locationTime: minFromNow(-1),
      },
      {
        user: 'kiama1',
        status: 'responding',
        destination: 'HQ',
        eta: minFromNow(15),
        locationLatitude: -34.429685,
        locationLongitude: 150.8902689,
        locationTime: minFromNow(-1),
      },
      {
        user: 'kiama2',
        status: 'unavailable',
        detail: 'out of area',
      },
      {
        user: 'kiama3',
        status: 'unavailable',
        detail: 'at work',
      },
      {
        user: 'kiama4',
        status: 'responding',
        detail: 'coming from work',
        destination: 'HQ',
        eta: minFromNow(30),
        locationLatitude: -34.4499653,
        locationLongitude: 150.8507009,
        locationTime: minFromNow(-1),
      },
    ],
  },
  {
    name: 'RCR - Princes Highway, Gerringong',
    details: '2 car MVA. Head on collision. 3 people trapped.',
    group: 'Kiama',
    responses: [
      {
        user: 'kiama1',
        status: 'responding',
        destination: 'HQ',
        eta: minFromNow(13),
        locationLatitude: -34.3979983,
        locationLongitude: 150.8688112,
        locationTime: minFromNow(-1),
      },
      {
        user: 'kiama5',
        status: 'responding',
        destination: 'scene',
        eta: minFromNow(2),
        locationLatitude: -34.3929698,
        locationLongitude: 150.8688112,
        locationTime: minFromNow(-1),
      },
      {
        user: 'kiama6',
        status: 'unavailable',
        detail: 'at work',
      },
      {
        user: 'kiama7',
        status: 'responding',
        destination: 'scene',
        locationLatitude: -34.3929698,
        locationLongitude: 150.8688112,
        locationTime: minFromNow(-1),
      },
      {
        user: 'kiama8',
        status: 'responding',
        detail: '',
        destination: 'HQ',
        eta: minFromNow(6),
      },
    ],
  },
  {
    name: 'FR - WEBB STREET, NORTH PARRAMATTA NSW 2151',
    details: 'APPROX 2 VEH SUBMERGED IN STREET AA WHICH IS CURRENTLY FLOODED JUST OVER WHEEL HEIGHT ON A STANDARD VEH. UNKNOWN IF ANY PERSONS OB. TREE DOWN AND NO WIRES DOWN. NFI',
    group: 'Parramatta',
    responses: [
      {
        user: 'parramatta1',
        status: 'responding',
        destination: 'scene',
        eta: minFromNow(5),
        locationLatitude: -34.3731362,
        locationLongitude: 150.877051,
        locationTime: minFromNow(-5),
      },
      {
        user: 'parramatta2',
        status: 'responding',
        destination: 'scene',
        locationLatitude: -34.3796534,
        locationLongitude: 150.8484693,
        locationTime: minFromNow(5),
      },
      {
        user: 'parramatta3',
        status: 'unavailable',
        detail: 'at work',
      },
    ],
  },
];
