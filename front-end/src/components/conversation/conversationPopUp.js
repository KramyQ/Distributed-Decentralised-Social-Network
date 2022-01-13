import Button from "@material-ui/core/Button";
import SendIcon from '@material-ui/icons/Send';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import "../../App.css";
import { insertMessage, insertMessageToTarget, retrieveMessage } from "../../services/messages";


const useStyles = makeStyles((theme) => ({
	text: {
		padding: theme.spacing(2, 2, 0),
	},
	paper: {
		paddingBottom: 100,
	},
	list: {
		marginBottom: theme.spacing(2),
	},
	subheader: {
		backgroundColor: theme.palette.background.paper,
	},
	appBar: {
		top: 'auto',
		bottom: 0,
	},
	grow: {
		flexGrow: 1,
	},
	fabButton: {
		position: 'absolute',
		zIndex: 1,
		top: -30,
		left: 0,
		right: 0,
		margin: '0 auto',
	},
	messenger: {
		zIndex: 3,
		display: "inline",
		position: 'absolute',
		bottom: 0,
		right: 80,
		width: 400,
		height: 500,
		minHeight: 500,
		maxHeight: 500,
		overflowY: 'scroll',
	},
}));


export function MessageList(props) {
	const { urlSend } = props;
	const { urlTarget } = props;
	const { name } = props;



	// console.log/(message);
	function sendMessage() {

		const message = document.getElementById('newMessage').value;
		if (message !== '') {
			insertMessage(urlTarget, message)
			insertMessageToTarget(urlTarget, message)
		}
	}
	function closeMessage() {
	}


	const [listMessage, setListMessage] = useState([]);
	//Update the friend list
	function updateMessages() {
		let mounted = true;
		retrieveMessage(urlSend)
			.then(items => {
				if (mounted) {
					setListMessage(items)

				}

			})
		return () => mounted = false;
	}
	useEffect(() => {
		const interval = setInterval(() => {
			updateMessages();

		}, 5000);

		return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
	}, [])

	useEffect(() => {
		updateMessages();
	}, [])

	const classes = useStyles();

	return (
		<div className="messenger">
			<React.Fragment>
				<CssBaseline />
				<div className="message">
					<Paper square className={classes.paper}>
						<List className={classes.list}>
							<React.Fragment>
								<ListSubheader className={classes.subheader}><h1>{name}</h1></ListSubheader>

								{listMessage.map((item, index) => {
									if (item.url_sender.includes(':' + process.env.REACT_APP_API)) {
										item.url_sender = "moi";
									} else if (item.url_sender !== 'moi') {
										item.url_sender = name
									}
									return (
										<ListItem button>
											<ListItemText
												primary={item.url_sender + ':'}
												secondary={item.content}
											/>
										</ListItem>
									)
								}
								)}
							</React.Fragment>
						</List>
					</Paper>
					<CssBaseline />
				</div>
				<div className="sendMessage">
					<form className={classes.root} action="/my-friends" autoComplete="off">
						<TextField id="newMessage" label="Nouveau message..." variant="filled" fullWidth />
						<Button
							onClick={sendMessage}
							color="primary"
							startIcon={<SendIcon />}
						>
							Envoyer
						</Button>
					</form>
				</div>
			</React.Fragment>
		</div>
	);
}

class Comment extends React.Component {

	render() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<p className="actualComment"> : {this.props.children}</p>
			</div>
		);
	}
}
