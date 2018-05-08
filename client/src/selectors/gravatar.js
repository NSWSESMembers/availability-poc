import md5 from 'md5';

// eslint-disable-next-line import/prefer-default-export
const avatarForEmail = email => (
  `https://www.gravatar.com/avatar/${md5(email)}?d=mm`
);

export default { avatarForEmail };
