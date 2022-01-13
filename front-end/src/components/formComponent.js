import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextareaAutosize } from '@material-ui/core';
import {insertMessage,insertMessageToTarget,insertBroadcastMessage} from '../services/messages';

export default function FormDialog(props) {
  const {idSend}=props;
const {urlTarget}=props
  const [open, setOpen] = React.useState(false);



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
   const message=document.getElementById('nameTextArea').value;
  // console.log(message);
    insertBroadcastMessage(message);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Envoyer broadcast
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Broadcast</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            autoFocus
            margin="dense"
            id="nameTextArea"
            label="message"
            rowsMin={6}
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleClose} color="primary">
            Envoyer message
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
