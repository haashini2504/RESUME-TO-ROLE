import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resume from '../models/Resume.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not set in backend/.env');
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node createResumeForUser.js <userId> <resumeText>');
    process.exit(1);
  }

  const [userId, ...textParts] = args;
  const extractedText = textParts.join(' ');

  await mongoose.connect(MONGO_URI);

  const resume = await Resume.create({
    userId,
    fileName: 'test-resume.txt',
    fileUrl: '',
    fileType: 'text/plain',
    fileSize: extractedText.length,
    extractedText,
    uploadedAt: new Date(),
  });

  console.log('Created resume:', resume._id.toString());
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});