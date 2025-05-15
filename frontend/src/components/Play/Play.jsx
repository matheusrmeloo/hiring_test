import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
	Box,
	Button,
	Typography,
	Modal,
	Paper,
	Grid,
	Switch,
	Slider,
	IconButton,
	Tooltip,
	Zoom,
	Fade,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimerIcon from "@mui/icons-material/Timer";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import backgroundGif from "../../assets/images/play.gif";
import calmBackground from "../../assets/images/calm-wallpaper.jpg";
import backgroundMusic from "../../assets/audio/background-music.mp3";
import buttonHoverSound from "../../assets/audio/button-hover.mp3";
import buttonClickSound from "../../assets/audio/button-click.mp3";

const BackgroundContainer = styled(Box)(({ theme, iscalmmode }) => ({
	minHeight: "100vh",
	width: "100%",
	backgroundImage: `url(${
		iscalmmode === "true" ? calmBackground : backgroundGif
	})`,
	backgroundPosition: "center",
	backgroundSize: "cover",
	backgroundRepeat: "no-repeat",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "space-around",
	padding: theme.spacing(2),
	overflow: "hidden",
	transition: "background-image 0.5s ease-in-out",
}));

const GameTitle = styled(Typography)(({ iscalmmode }) => ({
	fontFamily: '"Orbitron", sans-serif',
	fontSize: "clamp(3rem, 10vw, 6rem)",
	color: iscalmmode === "true" ? "#a6e0a6" : "#ffcc00",
	textShadow:
		iscalmmode === "true"
			? "0 0 10px #a6e0a6"
			: "0 0 10px #ffcc00, 0 0 20px #ffaa00",
	animation: iscalmmode === "true" ? "none" : "pulseTitle 3s infinite",
	textAlign: "center",
	marginTop: "5vh",
	"@keyframes pulseTitle": {
		"0%": { textShadow: "0 0 10px #ffcc00, 0 0 20px #ffaa00" },
		"50%": {
			textShadow: "0 0 15px #ffcc00, 0 0 30px #ffaa00, 0 0 40px #ff8800",
		},
		"100%": { textShadow: "0 0 10px #ffcc00, 0 0 20px #ffaa00" },
	},
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	width: "100%",
	maxWidth: "400px",
	margin: "auto",
	padding: theme.spacing(2),
	borderRadius: "15px",
	backdropFilter: "blur(5px)",
	backgroundColor: "rgba(0, 0, 0, 0.2)",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
}));

const ActionButton = styled(Button)(({ theme, iscalmmode, variant }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
	color: "#ffffff",
	minWidth: "200px",
	width: "100%",
	maxWidth: "300px",
	margin: theme.spacing(1.5, 0),
	padding: theme.spacing(1.8, 2),
	background:
		variant === "danger"
			? iscalmmode === "true"
				? "#c2707b"
				: "#a32a36"
			: iscalmmode === "true"
			? "linear-gradient(90deg, #9fae9b, #7f9f7c)"
			: "linear-gradient(90deg, #4a4e69, #22223b)",
	border: `2px solid ${
		variant === "danger"
			? iscalmmode === "true"
				? "#b56370"
				: "#8a2530"
			: iscalmmode === "true"
			? "#8b8f80"
			: "#9a8c98"
	}`,
	borderRadius: "10px",
	boxShadow: "0 0 10px rgba(255, 255, 255, 0.3), 0 6px 12px rgba(0, 0, 0, 0.5)",
	transition: "all 0.3s ease",
	"&:hover": {
		background:
			variant === "danger"
				? iscalmmode === "true"
					? "#d1808a"
					: "#b7303f"
				: iscalmmode === "true"
				? "linear-gradient(90deg, #a0b79d, #8ba982)"
				: "linear-gradient(90deg, #6c757d, #343a40)",
		transform: "translateY(-3px) scale(1.03)",
		boxShadow:
			"0 0 15px rgba(255, 255, 255, 0.4), 0 8px 15px rgba(0, 0, 0, 0.6)",
	},
	"&:active": {
		transform: "translateY(1px)",
	},
	"& .MuiButton-startIcon": {
		marginRight: theme.spacing(1.5),
	},
}));

const ModalPaper = styled(Paper)(({ theme, iscalmmode }) => ({
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "90%",
	maxWidth: "500px",
	backgroundColor: iscalmmode === "true" ? "#86a17d" : theme.palette.grey[900],
	color: "#fff",
	border: `2px solid ${
		iscalmmode === "true" ? "#708a67" : theme.palette.grey[700]
	}`,
	borderRadius: "15px",
	boxShadow: theme.shadows[10],
	padding: theme.spacing(3, 4),
	textAlign: "center",
	[theme.breakpoints.down("sm")]: {
		padding: theme.spacing(2, 2),
		width: "95%",
	},
	overflow: "hidden",
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
	fontFamily: '"Press Start 2P", cursive',
	marginBottom: theme.spacing(3),
	position: "relative",
	"&:after": {
		content: '""',
		position: "absolute",
		bottom: "-10px",
		left: "50%",
		transform: "translateX(-50%)",
		width: "60%",
		height: "2px",
		background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
	},
}));

const DifficultyButton = styled(Button)(
	({ theme, colorvariant, selected }) => ({
		fontFamily: '"Press Start 2P", cursive',
		fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
		margin: theme.spacing(1),
		padding: theme.spacing(1.5, 2),
		border: `2px solid ${
			selected ? theme.palette.common.white : theme.palette.grey[600]
		}`,
		transform: selected ? "scale(1.1)" : "scale(1)",
		boxShadow: selected ? `0 0 15px ${theme.palette.common.white}` : "none",
		transition: "all 0.3s ease",
		...(colorvariant === "green" && {
			background: "linear-gradient(90deg, #85e085, #4caf50)",
		}),
		...(colorvariant === "yellow" && {
			background: "linear-gradient(90deg, #ffeb3b, #fbc02d)",
		}),
		...(colorvariant === "red" && {
			background: "linear-gradient(90deg, #ff4444, #e53935)",
		}),
		color: theme.palette.common.white,
		"&:hover": {
			opacity: 0.9,
			transform: selected ? "scale(1.15)" : "scale(1.05)",
			boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
		},
	}),
);

const SliderContainer = styled(Grid)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	padding: theme.spacing(1.5),
	borderRadius: "10px",
	backgroundColor: "rgba(0, 0, 0, 0.2)",
}));

const InstructionList = styled(List)(({ theme }) => ({
	backgroundColor: "rgba(0, 0, 0, 0.2)",
	borderRadius: "10px",
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
	textAlign: "left",
}));

const InstructionListItem = styled(ListItem)(({ theme }) => ({
	padding: theme.spacing(1, 0),
}));

const InstructionListItemText = styled(ListItemText)(({ theme }) => ({
	"& .MuiListItemText-primary": {
		fontFamily: '"Press Start 2P", cursive',
		fontSize: "0.7rem",
		color: "#fff",
		[theme.breakpoints.down("sm")]: {
			fontSize: "0.6rem",
		},
	},
}));

const InstructionIcon = styled(ListItemIcon)(({ theme, iscalmmode }) => ({
	minWidth: "36px",
	color: iscalmmode === "true" ? "#a6e0a6" : "#ffcc00",
}));

const Play = ({ onLogout }) => {
	const navigate = useNavigate();
	const [settingsModalOpen, setSettingsModalOpen] = useState(false);
	const [playModalOpen, setPlayModalOpen] = useState(false);
	const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
	const [difficulty, setDifficulty] = useState(null);
	const [isCalmMode, setIsCalmMode] = useState(() => {
		const savedMode = localStorage.getItem("isCalmMode");
		return savedMode ? JSON.parse(savedMode) : false;
	});

	const [bgVolume, setBgVolume] = useState(
		localStorage.getItem("bgVolume") !== null
			? Number.parseInt(localStorage.getItem("bgVolume"), 10)
			: 50,
	);
	const [sfxVolume, setSfxVolume] = useState(
		localStorage.getItem("sfxVolume") !== null
			? Number.parseInt(localStorage.getItem("sfxVolume"), 10)
			: 50,
	);

	const [mutedBg, setMutedBg] = useState(bgVolume === 0);
	const [mutedSfx, setMutedSfx] = useState(sfxVolume === 0);

	const bgAudioRef = useRef(null);
	const hoverAudioRef = useRef(null);
	const clickAudioRef = useRef(null);

	useEffect(() => {
		if (!bgAudioRef.current) bgAudioRef.current = new Audio(backgroundMusic);
		if (!hoverAudioRef.current)
			hoverAudioRef.current = new Audio(buttonHoverSound);
		if (!clickAudioRef.current)
			clickAudioRef.current = new Audio(buttonClickSound);

		const bgAudio = bgAudioRef.current;
		bgAudio.loop = true;
		bgAudio.volume = mutedBg ? 0 : bgVolume / 100;

		const startMusic = () => {
			if (bgAudio.paused) {
				bgAudio
					.play()
					.catch((error) => console.error("Autoplay failed:", error));
			}
		};
		document.addEventListener("click", startMusic, { once: true });

		return () => {
			document.removeEventListener("click", startMusic);
			if (bgAudioRef.current) bgAudioRef.current.pause();
		};
	}, []);

	useEffect(() => {
		localStorage.setItem("isCalmMode", JSON.stringify(isCalmMode));
	}, [isCalmMode]);

	useEffect(() => {
		if (bgAudioRef.current) {
			bgAudioRef.current.volume = mutedBg ? 0 : bgVolume / 100;
		}
		localStorage.setItem("bgVolume", bgVolume);
	}, [bgVolume, mutedBg]);

	useEffect(() => {
		if (hoverAudioRef.current)
			hoverAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
		if (clickAudioRef.current)
			clickAudioRef.current.volume = mutedSfx ? 0 : sfxVolume / 100;
		localStorage.setItem("sfxVolume", sfxVolume);
	}, [sfxVolume, mutedSfx]);

	const handleBgVolumeChange = (event, newValue) => {
		setBgVolume(newValue);
		if (newValue === 0 && !mutedBg) setMutedBg(true);
		if (newValue > 0 && mutedBg) setMutedBg(false);
	};

	const handleSfxVolumeChange = (event, newValue) => {
		setSfxVolume(newValue);
		if (newValue === 0 && !mutedSfx) setMutedSfx(true);
		if (newValue > 0 && mutedSfx) setMutedSfx(false);
	};

	const toggleCalmMode = (event) => {
		setIsCalmMode(event.target.checked);
		playClickSound();
	};

	const playHoverSound = () => {
		if (hoverAudioRef.current && !mutedSfx) {
			hoverAudioRef.current.currentTime = 0;
			hoverAudioRef.current
				.play()
				.catch((error) => console.error("Hover sound playback failed:", error));
		}
	};

	const playClickSound = () => {
		if (clickAudioRef.current && !mutedSfx) {
			clickAudioRef.current.currentTime = 0;
			clickAudioRef.current
				.play()
				.catch((error) => console.error("Click sound playback failed:", error));
		}
	};

	const openSettingsModal = () => {
		setSettingsModalOpen(true);
		playClickSound();
	};

	const closeSettingsModal = () => {
		setSettingsModalOpen(false);
		playClickSound();
	};

	const openPlayModal = () => {
		setPlayModalOpen(true);
		playClickSound();
	};

	const closePlayModal = () => {
		setPlayModalOpen(false);
		playClickSound();
	};

	const openInstructionsModal = () => {
		setInstructionsModalOpen(true);
		playClickSound();
	};

	const closeInstructionsModal = () => {
		setInstructionsModalOpen(false);
		playClickSound();
	};

	const handleDifficultySelect = (level) => {
		setDifficulty(level);
		playClickSound();
	};

	const handleLogoutClick = () => {
		playClickSound();
		if (onLogout) onLogout();
	};

	const handlePlay = () => {
		playClickSound();
		const userID = localStorage.getItem("userID");
		if (!userID) {
			alert("UserID is missing. Please log in again.");
			navigate("/login");
			return;
		}

		if (!difficulty) {
			alert("Please select a difficulty level.");
			return;
		}

		let difficultyKey;
		if (difficulty === "green") difficultyKey = "easy";
		else if (difficulty === "yellow") difficultyKey = "normal";
		else if (difficulty === "red") difficultyKey = "hard";
		else {
			alert("Invalid difficulty selection.");
			return;
		}

		navigate(`/game/${difficultyKey}`);
	};

	return (
		<BackgroundContainer iscalmmode={isCalmMode.toString()}>
			<Fade in={true} timeout={1000}>
				<GameTitle variant="h1" iscalmmode={isCalmMode.toString()}>
					WonderCards
				</GameTitle>
			</Fade>

			<Zoom in={true} style={{ transitionDelay: "300ms" }}>
				<ButtonsContainer>
					<ActionButton
						iscalmmode={isCalmMode.toString()}
						onClick={openPlayModal}
						onMouseEnter={playHoverSound}
						startIcon={<SportsEsportsIcon />}
					>
						Play
					</ActionButton>

					<ActionButton
						iscalmmode={isCalmMode.toString()}
						onClick={openInstructionsModal}
						onMouseEnter={playHoverSound}
						startIcon={<HelpOutlineIcon />}
					>
						Instructions
					</ActionButton>

					<ActionButton
						iscalmmode={isCalmMode.toString()}
						onClick={() => navigate("/history")}
						onMouseEnter={playHoverSound}
						startIcon={<HistoryIcon />}
					>
						Game History
					</ActionButton>

					<ActionButton
						iscalmmode={isCalmMode.toString()}
						onClick={openSettingsModal}
						onMouseEnter={playHoverSound}
						startIcon={<SettingsIcon />}
					>
						Settings
					</ActionButton>

					<ActionButton
						iscalmmode={isCalmMode.toString()}
						onClick={handleLogoutClick}
						onMouseEnter={playHoverSound}
						variant="danger"
						startIcon={<LogoutIcon />}
					>
						Logout
					</ActionButton>
				</ButtonsContainer>
			</Zoom>

			<Modal
				open={settingsModalOpen}
				onClose={closeSettingsModal}
				aria-labelledby="settings-modal-title"
				closeAfterTransition
			>
				<Fade in={settingsModalOpen}>
					<ModalPaper iscalmmode={isCalmMode.toString()}>
						<Tooltip title="Close">
							<IconButton
								onClick={closeSettingsModal}
								sx={{
									position: "absolute",
									top: 8,
									right: 8,
									color: "common.white",
								}}
								aria-label="close settings"
							>
								<CloseIcon />
							</IconButton>
						</Tooltip>

						<ModalTitle id="settings-modal-title" variant="h5" component="h2">
							Settings
						</ModalTitle>

						<SliderContainer
							container
							spacing={2}
							alignItems="center"
							justifyContent="center"
						>
							<Grid item xs={12}>
								<Typography
									gutterBottom
									sx={{ fontFamily: '"Orbitron", sans-serif' }}
								>
									Background Music
								</Typography>
							</Grid>
							<Grid item>
								<Tooltip title={mutedBg ? "Unmute" : "Mute"}>
									<IconButton
										onClick={() => {
											setMutedBg((prev) => !prev);
											playClickSound();
										}}
										sx={{ color: "common.white" }}
										aria-label={
											mutedBg
												? "unmute background music"
												: "mute background music"
										}
									>
										{mutedBg || bgVolume === 0 ? (
											<VolumeOffIcon />
										) : (
											<VolumeDownIcon />
										)}
									</IconButton>
								</Tooltip>
							</Grid>
							<Grid item xs>
								<Slider
									value={mutedBg ? 0 : bgVolume}
									onChange={handleBgVolumeChange}
									aria-labelledby="bg-volume-slider"
									disabled={mutedBg}
									sx={{
										color: isCalmMode ? "#a6e0a6" : "#ffcc00",
										"& .MuiSlider-thumb": {
											width: 16,
											height: 16,
											"&:hover, &.Mui-focusVisible": {
												boxShadow: `0px 0px 0px 8px ${
													isCalmMode
														? "rgba(166, 224, 166, 0.16)"
														: "rgba(255, 204, 0, 0.16)"
												}`,
											},
										},
									}}
								/>
							</Grid>
						</SliderContainer>

						<SliderContainer
							container
							spacing={2}
							alignItems="center"
							justifyContent="center"
						>
							<Grid item xs={12}>
								<Typography
									gutterBottom
									sx={{ fontFamily: '"Orbitron", sans-serif' }}
								>
									Sound Effects
								</Typography>
							</Grid>
							<Grid item>
								<Tooltip title={mutedSfx ? "Unmute" : "Mute"}>
									<IconButton
										onClick={() => {
											setMutedSfx((prev) => !prev);
											playClickSound();
										}}
										sx={{ color: "common.white" }}
										aria-label={
											mutedSfx ? "unmute sound effects" : "mute sound effects"
										}
									>
										{mutedSfx || sfxVolume === 0 ? (
											<VolumeOffIcon />
										) : (
											<VolumeDownIcon />
										)}
									</IconButton>
								</Tooltip>
							</Grid>
							<Grid item xs>
								<Slider
									value={mutedSfx ? 0 : sfxVolume}
									onChange={handleSfxVolumeChange}
									aria-labelledby="sfx-volume-slider"
									disabled={mutedSfx}
									sx={{
										color: isCalmMode ? "#a6e0a6" : "#ffcc00",
										"& .MuiSlider-thumb": {
											width: 16,
											height: 16,
											"&:hover, &.Mui-focusVisible": {
												boxShadow: `0px 0px 0px 8px ${
													isCalmMode
														? "rgba(166, 224, 166, 0.16)"
														: "rgba(255, 204, 0, 0.16)"
												}`,
											},
										},
									}}
								/>
							</Grid>
						</SliderContainer>

						<Box
							sx={{
								mt: 2,
								p: 2,
								borderRadius: "10px",
								backgroundColor: "rgba(0, 0, 0, 0.2)",
							}}
						>
							<Grid
								container
								spacing={1}
								alignItems="center"
								justifyContent="center"
							>
								<Grid item>
									<Typography sx={{ fontFamily: '"Orbitron", sans-serif' }}>
										Calm Mode
									</Typography>
								</Grid>
								<Grid item>
									<Switch
										checked={isCalmMode}
										onChange={toggleCalmMode}
										sx={{
											"& .MuiSwitch-switchBase.Mui-checked": {
												color: isCalmMode ? "#a6e0a6" : "#ffcc00",
											},
											"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
												{
													backgroundColor: isCalmMode ? "#86a17d" : "#ffaa00",
												},
										}}
									/>
								</Grid>
							</Grid>
						</Box>
					</ModalPaper>
				</Fade>
			</Modal>

			<Modal
				open={playModalOpen}
				onClose={closePlayModal}
				aria-labelledby="play-modal-title"
				closeAfterTransition
			>
				<Fade in={playModalOpen}>
					<ModalPaper iscalmmode={isCalmMode.toString()}>
						<Tooltip title="Close">
							<IconButton
								onClick={closePlayModal}
								sx={{
									position: "absolute",
									top: 8,
									right: 8,
									color: "common.white",
								}}
								aria-label="close difficulty selection"
							>
								<CloseIcon />
							</IconButton>
						</Tooltip>

						<ModalTitle id="play-modal-title" variant="h5" component="h2">
							Select Difficulty
						</ModalTitle>

						<Box
							display="flex"
							flexDirection={{ xs: "column", sm: "row" }}
							justifyContent="center"
							alignItems="center"
							gap={2}
						>
							<Tooltip title="2x2 grid - Fewer cards to match">
								<DifficultyButton
									colorvariant="green"
									selected={difficulty === "green"}
									onClick={() => handleDifficultySelect("green")}
									onMouseEnter={playHoverSound}
									aria-label="Easy difficulty"
								>
									Easy
								</DifficultyButton>
							</Tooltip>

							<Tooltip title="3x2 grid - More cards to match">
								<DifficultyButton
									colorvariant="yellow"
									selected={difficulty === "yellow"}
									onClick={() => handleDifficultySelect("yellow")}
									onMouseEnter={playHoverSound}
									aria-label="Normal difficulty"
								>
									Normal
								</DifficultyButton>
							</Tooltip>

							<Tooltip title="4x3 grid - Many cards to match">
								<DifficultyButton
									colorvariant="red"
									selected={difficulty === "red"}
									onClick={() => handleDifficultySelect("red")}
									onMouseEnter={playHoverSound}
									aria-label="Hard difficulty"
								>
									Hard
								</DifficultyButton>
							</Tooltip>
						</Box>

						<Button
							variant="contained"
							onClick={handlePlay}
							disabled={!difficulty}
							sx={{
								mt: 4,
								fontFamily: '"Press Start 2P", cursive',
								py: 1.5,
								px: 4,
								fontSize: "1rem",
								background: isCalmMode ? "#a6e0a6" : "#ffcc00",
								color: isCalmMode ? "#333" : "#000",
								"&:hover": {
									background: isCalmMode ? "#86c186" : "#ffaa00",
								},
								"&.Mui-disabled": {
									background: "#555",
									color: "#aaa",
								},
								transition: "all 0.3s ease",
							}}
							onMouseEnter={playHoverSound}
						>
							Start Game
						</Button>
					</ModalPaper>
				</Fade>
			</Modal>

			<Modal
				open={instructionsModalOpen}
				onClose={closeInstructionsModal}
				aria-labelledby="instructions-modal-title"
				closeAfterTransition
			>
				<Fade in={instructionsModalOpen}>
					<ModalPaper iscalmmode={isCalmMode.toString()}>
						<Tooltip title="Close">
							<IconButton
								onClick={closeInstructionsModal}
								sx={{
									position: "absolute",
									top: 8,
									right: 8,
									color: "common.white",
								}}
								aria-label="close instructions"
							>
								<CloseIcon />
							</IconButton>
						</Tooltip>

						<ModalTitle
							id="instructions-modal-title"
							variant="h5"
							component="h2"
						>
							How To Play
						</ModalTitle>

						<InstructionList>
							<InstructionListItem>
								<InstructionIcon iscalmmode={isCalmMode.toString()}>
									<LooksOneIcon />
								</InstructionIcon>
								<InstructionListItemText primary="Select a difficulty level (Easy, Normal, or Hard)" />
							</InstructionListItem>

							<InstructionListItem>
								<InstructionIcon iscalmmode={isCalmMode.toString()}>
									<LooksTwoIcon />
								</InstructionIcon>
								<InstructionListItemText primary="Memorize the cards during the initial reveal" />
							</InstructionListItem>

							<InstructionListItem>
								<InstructionIcon iscalmmode={isCalmMode.toString()}>
									<Looks3Icon />
								</InstructionIcon>
								<InstructionListItemText primary="Click on cards to flip them and find matching pairs" />
							</InstructionListItem>

							<InstructionListItem>
								<InstructionIcon iscalmmode={isCalmMode.toString()}>
									<Looks4Icon />
								</InstructionIcon>
								<InstructionListItemText primary="Match all pairs to complete the level" />
							</InstructionListItem>
						</InstructionList>

						<Typography
							variant="body2"
							sx={{
								fontFamily: '"Orbitron", sans-serif',
								fontSize: "0.9rem",
								mb: 2,
								color: isCalmMode ? "#a6e0a6" : "#ffcc00",
							}}
						>
							Game Features
						</Typography>

						<InstructionList>
							<InstructionListItem>
								<InstructionIcon iscalmmode={isCalmMode.toString()}>
									<TimerIcon />
								</InstructionIcon>
								<InstructionListItemText primary="Timer tracks how long you take to complete the level" />
							</InstructionListItem>

							<InstructionListItem>
								<InstructionIcon iscalmmode={isCalmMode.toString()}>
									<TouchAppIcon />
								</InstructionIcon>
								<InstructionListItemText primary="Failed attempts are counted as 'Learning' points" />
							</InstructionListItem>

							<InstructionListItem>
								<InstructionIcon iscalmmode={isCalmMode.toString()}>
									<EmojiEventsIcon />
								</InstructionIcon>
								<InstructionListItemText primary="Complete levels faster with fewer mistakes for better scores" />
							</InstructionListItem>
						</InstructionList>

						<Button
							variant="contained"
							onClick={closeInstructionsModal}
							sx={{
								mt: 2,
								fontFamily: '"Press Start 2P", cursive',
								py: 1.5,
								px: 4,
								fontSize: "0.8rem",
								background: isCalmMode ? "#a6e0a6" : "#ffcc00",
								color: isCalmMode ? "#333" : "#000",
								"&:hover": {
									background: isCalmMode ? "#86c186" : "#ffaa00",
								},
								transition: "all 0.3s ease",
							}}
							onMouseEnter={playHoverSound}
						>
							Got It!
						</Button>
					</ModalPaper>
				</Fade>
			</Modal>
		</BackgroundContainer>
	);
};

Play.propTypes = {
	onLogout: PropTypes.func,
};

export default Play;
