import axios from "axios";
import * as dotenv from "dotenv-safe";
import YoutubeTranscript from "youtube-transcript";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);


start();

async function start() {
  const youtubeLink = `https://www.youtube.com/watch?v=ltkHzzfEU8g`;
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = youtubeLink.match(regExp);
  try {
    if (match && match[2].length == 11) {
      const youtubeId = match[2];
      const transcriptItems = await YoutubeTranscript.fetchTranscript(
        youtubeId
      );
      // console.log('transcriptItems', transcriptItems);
      let fullText = ``;
      for (const item of transcriptItems) {
        fullText += `starttime: ${millisToMinutesAndSeconds(item.offset)} text: ${item.text} `;
      }
      console.log('fullText', fullText);
      /*const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 2047,
        messages: [{role: "system", content: 'You are an AI that can write YouTube Video Timestamp and Chapters for a YouTube Video Description. The user will provide you with the transcript of the Video. Create the Timestamps / Chapters about important Topics short. Show only the Starttime of the Topic. In German.'}, {role: "user", content: fullText}],
      });
    
      const answer = completion.data.choices[0].message?.content;


      console.log(answer);*/
    }
  } catch (error) {
    console.log(error);
  }

  


}

function millisToMinutesAndSeconds(millis: number) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (+seconds < 10 ? '0' : '') + seconds;
}
