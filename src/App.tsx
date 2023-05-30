import React, { useState } from 'react';
import './App.css';
import { Autocomplete, Button, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { tenses } from './tenses';
import { useSpeechSynthesis } from "react-speech-kit";
import axios from 'axios';

function App() {
  const [word, setWord] = useState<any>("");
  const [answer, setAnswer] = useState<any>("");
  const [color, setColor] = useState<any>("black");
  const [tense, setTense] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>("");
  const [sentenceOn, setSentenceOn] = useState<any>(false);
  const { speak } = useSpeechSynthesis();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      height: '100vh',
      flexDirection: "column"
    }}>
      <div>
        <TextField
          value={word}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setWord(event.target.value);
          }}
          sx={{ width: 300 }}
          id="outlined-basic"
          label="Word"
          variant="outlined"
        />
      </div>
      <div>
        <Autocomplete
          onKeyDown={(event: any) => {
            if (event.key === 'Enter') {
              event.defaultMuiPrevented = true;
            }
          }}
          onChange={(event, value: any) => setTense(value?.value)} // 
          disablePortal
          id="combo-box-demo"
          options={tenses}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Tense" />}
        />
      </div>
      <div style={{flexDirection: "row"}}>
      <LoadingButton variant="contained"
        loading={loading}
        onClick={() => {
          setLoading(true)
          axios.post('http://192.168.88.58:8080/getSentence', {
            word: word,
            time: tense.toLowerCase()
          })
          .then((res)=>{
            console.log(res)
            setResponse(res.data)
            speak({ text: res.data })
            setLoading(false)
          })
        }}>New Sentence</LoadingButton>
        {response !== "" ?
        <Button variant="contained" onClick={()=>{ speak({ text: response })}} style={{marginLeft: 20}}>Repeat the Sentence</Button> : null}
      </div>


      {response !== "" ?
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
       
        <TextField
          value={answer}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAnswer(event.target.value);
          }}
          sx={{
            width: 300,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: color },
            },
          }}
          id="outlined-basic"
          label="Please Write the Sentence"
          variant="outlined"
        />
        <div style={{marginTop: 30, flexDirection: "row"}}  >
         <Button variant="contained" onClick={()=>{ 
          console.log(response)
          if(answer.toLowerCase() === response.toLowerCase() || answer.toLowerCase() === response.substring(0,response.length-1).toLowerCase()) {
            setColor("lightgreen")
          } else {
            setColor("red")
          }
         }}>Check</Button> 
          <Button style={{marginLeft: 20}} variant="contained" onClick={()=>{ 
          setSentenceOn(true)
         }}>See the Sentence</Button> 
         </div>

         { sentenceOn ? <div style={{marginTop: 30, paddingLeft: 20, paddingRight: 20}}><span style={{fontWeight: "bold"}}>Sentence: </span> {response}</div>: null}
      </div>
        : null}

    </div>
  );
}

export default App;
