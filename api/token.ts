import { VercelRequest, VercelResponse } from '@vercel/node';
import Twilio from 'twilio';
const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID || '';
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET || '';
module.exports = (req: VercelRequest, res: VercelResponse) => {
  const { room_name, user_identity } = req.body;
  const token = new Twilio.jwt.AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
    identity: user_identity as string,
  });
  const videoGrant = new Twilio.jwt.AccessToken.VideoGrant({ room: room_name as string });
  token.addGrant(videoGrant);
  res.status(200).json({
      room_type: 'group',
      token: token.toJwt()
  });
  console.log(`issued token for ${user_identity} in room ${room_name}`);
};
