import { apnProvider, apn, topic } from '../src/push/apns';

const deviceToken = process.argv[2];

const note = new apn.Notification()
note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 3;
note.sound = 'ping.aiff';
note.alert = '\uD83D\uDCE7 \u2709 You have a new message';
note.payload = {'messageFrom': 'John Appleseed'};
note.topic = topic;

apnProvider.send(note, deviceToken).then((result) => {
  console.log(result);
  process.exit();
});
