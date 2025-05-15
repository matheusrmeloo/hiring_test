import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Box,
	Grid,
	Modal,
	Typography,
	useTheme,
	useMediaQuery,
	CircularProgress,
	Button,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";

import gameBackground from "../../assets/images/mode1.gif";
import gameBgMusic from "../../assets/audio/memory-bg.mp3";
import globalCongratsAudio from "/audio/congrats.mp3";

import apiClient from "../../api/axiosConfig";
import { shuffleArray } from "../../utils/cardUtils";
import { gameDifficulties } from "../../utils/gameConfigs";

const StyledGameContainer = styled(Box, {
	shouldForwardProp: (prop) => prop !== "mouseDisabled",
})(({ mouseDisabled }) => ({
	height: "100vh",
	width: "100vw",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	backgroundImage: `url(${gameBackground})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	position: "relative",
	pointerEvents: mouseDisabled ? "none" : "auto",
	padding: 0,
	margin: 0,
	overflow: "hidden",
	boxSizing: "border-box",
}));

const GameInfoButton = styled(Button)(({ theme }) => ({
	backgroundColor: "rgba(44, 44, 84, 0.8)",
	color: "#fff",
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.7rem",
	padding: "0.5rem 1rem",
	border: "2px solid #00d9ff",
	borderRadius: "8px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
	cursor: "pointer",
	textTransform: "none",
	backdropFilter: "blur(3px)",
	"&:hover": {
		backgroundColor: "rgba(64, 64, 122, 0.9)",
		borderColor: "#00aaff",
		boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
	},
	"&:active": {
		transform: "scale(0.95)",
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.6rem",
		padding: "0.4rem 0.8rem",
	},
}));

const InfoBar = styled(Box)(({ theme }) => ({
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	padding: "8px 16px",
	zIndex: 10,
	[theme.breakpoints.down("sm")]: {
		padding: "4px 8px",
	},
}));

const InfoBoxItem = styled(Box)(({ theme }) => ({
	backgroundColor: "rgba(255, 77, 79, 0.8)",
	color: "#fff",
	padding: "0.5rem 1rem",
	border: "2px solid #00d9ff",
	borderRadius: "8px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.7rem",
	textAlign: "center",
	backdropFilter: "blur(3px)",
	"&.timer": {
		backgroundColor: "rgba(44, 44, 84, 0.8)",
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.6rem",
		padding: "0.4rem 0.8rem",
	},
}));

const GameContent = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	height: "calc(100vh - 120px)",
	padding: "60px 16px 60px 16px",
	boxSizing: "border-box",
	overflow: "hidden",
	[theme.breakpoints.down("sm")]: {
		padding: "50px 8px 50px 8px",
	},
}));

const CardContainer = styled(Box, {
	shouldForwardProp: (prop) => !["cardwidth", "cardheight"].includes(prop),
})(({ theme, cardwidth, cardheight }) => ({
	perspective: "1000px",
	cursor: "pointer",
	width: cardwidth,
	height: cardheight,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	maxWidth: "100%",
	maxHeight: "100%",
}));

const CardInner = styled(animated.div)({
	position: "relative",
	width: "100%",
	height: "100%",
	transformStyle: "preserve-3d",
});

const CardFace = styled(Box)({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backfaceVisibility: "hidden",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	borderRadius: "8px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
	overflow: "hidden",
	"& img": {
		maxWidth: "100%",
		maxHeight: "100%",
		objectFit: "contain",
	},
});

const CardFrontFace = styled(CardFace)({
	transform: "rotateY(180deg)",
});

const CardBackFace = styled(CardFace)({
	transform: "rotateY(0deg)",
	backgroundColor: "#2c2c54",
	border: "2px solid #00aaff",
});

const StyledModalBox = styled(Box)(({ theme }) => ({
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	backgroundColor: "rgba(44, 44, 84, 0.95)",
	border: "2px solid #00d9ff",
	boxShadow: theme.shadows[10],
	padding: theme.spacing(3, 4),
	textAlign: "center",
	borderRadius: "15px",
	width: "90%",
	maxWidth: "400px",
	backdropFilter: "blur(5px)",
}));

const ModalButton = styled(Button)(({ theme }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.8rem",
	margin: theme.spacing(1),
	padding: theme.spacing(1, 2.5),
	border: "2px solid #00d9ff",
	color: "#fff",
	backgroundColor: "rgba(64, 64, 122, 0.9)",
	"&:hover": {
		backgroundColor: "rgba(80, 80, 150, 1)",
		borderColor: "#00aaff",
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.7rem",
		padding: theme.spacing(0.75, 2),
	},
}));

const FooterBar = styled(Box)(({ theme }) => ({
	position: "absolute",
	bottom: 0,
	left: 0,
	right: 0,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	padding: "8px 16px",
	zIndex: 10,
	[theme.breakpoints.down("sm")]: {
		padding: "4px 8px",
	},
}));

const saveGameDataToApi = async (gameData) => {
	try {
		const response = await apiClient.post("/api/memory/save", gameData);
		console.log("Game data saved successfully", response.data);
	} catch (error) {
		console.error(
			"Error saving game data:",
			error.response ? JSON.stringify(error.response.data) : error.message,
		);
	}
};

const capitalizeFirstLetter = (string) => {
	if (!string) return "";
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Card = ({
	card,
	handleClick,
	flipped,
	matched,
	cardImageStyle,
	cardFrontImageStyle,
}) => {
	const { transform } = useSpring({
		transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
		config: { mass: 1, tension: 400, friction: 30 },
	});

	return (
		<CardInner style={{ transform }} onClick={handleClick}>
			<CardFrontFace>
				<img
					src={card.image || "/placeholder.svg"}
					alt="Card front"
					style={cardFrontImageStyle}
				/>
			</CardFrontFace>
			<CardBackFace>
				<img src="/images/Back2.png" alt="Card back" style={cardImageStyle} />
			</CardBackFace>
		</CardInner>
	);
};

Card.propTypes = {
	card: PropTypes.shape({
		id: PropTypes.number.isRequired,
		image: PropTypes.string.isRequired,
	}).isRequired,
	handleClick: PropTypes.func.isRequired,
	flipped: PropTypes.bool.isRequired,
	matched: PropTypes.bool.isRequired,
	cardImageStyle: PropTypes.object.isRequired,
	cardFrontImageStyle: PropTypes.object.isRequired,
};

const MemoryCardGame = () => {
	const { difficultyKey } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const isExtraSmallScreen = useMediaQuery("(max-width:400px)");
	const isLandscape = useMediaQuery(
		"(orientation: landscape) and (max-height: 500px)",
	);

	const [difficultyConfig, setDifficultyConfig] = useState(null);
	const [currentCardImages, setCurrentCardImages] = useState([]);
	const [currentMatchAudioFiles, setCurrentMatchAudioFiles] = useState([]);
	const userID = localStorage.getItem("userID");
	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]);
	const [matchedCards, setMatchedCards] = useState([]);
	const [failedAttempts, setFailedAttempts] = useState(0);
	const [timer, setTimer] = useState(0);
	const [timerActive, setTimerActive] = useState(false);
	const [initialRevealActive, setInitialRevealActive] = useState(true);
	const [musicStarted, setMusicStarted] = useState(false);
	const [mouseDisabled, setMouseDisabled] = useState(true);
	const [bgVolume] = useState(
		Number.parseInt(localStorage.getItem("bgVolume"), 10) || 50,
	);
	const [sfxVolume] = useState(
		Number.parseInt(localStorage.getItem("sfxVolume"), 10) || 50,
	);
	const bgAudioRef = useRef(null);
	const sfxAudioRef = useRef(null);
	const [currentSfxAudioIndex, setCurrentSfxAudioIndex] = useState(0);
	const [exitModalOpen, setExitModalOpen] = useState(false);
	const [isSavingGame, setIsSavingGame] = useState(false);
	const [isLoadingConfig, setIsLoadingConfig] = useState(true);

	useEffect(() => {
		const config = gameDifficulties[difficultyKey];
		if (config) {
			setDifficultyConfig(config);
			setCurrentCardImages(config.cardImages || []);
			setCurrentMatchAudioFiles(config.matchAudioFiles || []);
			setIsLoadingConfig(false);
		} else {
			console.error(
				`Invalid difficulty key: ${difficultyKey}. Redirecting to play.`,
			);
			navigate("/play");
		}
	}, [difficultyKey, navigate]);

	const {
		cardDimensions,
		cardImageStyle,
		cardFrontImageStyle,
		gridItemSize,
		gridContainerSpacing,
	} = useMemo(() => {
		if (!difficultyConfig) {
			return {
				cardDimensions: { width: "80px", height: "80px" },
				cardImageStyle: { width: "80%", height: "80%" },
				cardFrontImageStyle: { width: "80%", height: "80%" },
				gridItemSize: 4,
				gridContainerSpacing: 2,
			};
		}

		const baseDimensions = {
			cardDimensions: { width: "100px", height: "100px" },
			cardImageStyle: { width: "100%", height: "100%" },
			cardFrontImageStyle: { width: "100%", height: "100%" },
			gridItemSize: difficultyConfig.gridProps?.xs || 4,
			gridContainerSpacing: difficultyConfig.gridProps?.spacing || 2,
		};

		if (isExtraSmallScreen) {
			baseDimensions.cardDimensions = { width: "60px", height: "60px" };
			baseDimensions.gridContainerSpacing = 1;
		} else if (isSmallScreen) {
			baseDimensions.cardDimensions = { width: "80px", height: "80px" };
			baseDimensions.gridContainerSpacing = 1.5;
		} else if (isLandscape) {
			baseDimensions.cardDimensions = { width: "70px", height: "70px" };
			baseDimensions.gridContainerSpacing = 1;
		}

		const cardCount = currentCardImages.length;
		if (cardCount <= 4) {
			baseDimensions.gridItemSize = isSmallScreen ? 6 : 6;
		} else if (cardCount <= 8) {
			baseDimensions.gridItemSize = isSmallScreen ? 6 : 4;
		} else {
			baseDimensions.gridItemSize = isSmallScreen ? 4 : 3;
		}

		return baseDimensions;
	}, [
		difficultyConfig,
		isSmallScreen,
		isExtraSmallScreen,
		isLandscape,
		currentCardImages.length,
	]);

	useEffect(() => {
		if (!userID) {
			console.error("Error: userID is missing. Redirecting to login.");
			navigate("/login");
		}
	}, [userID, navigate]);

	const handleNewGame = (isInitialSetup = false) => {
		if (!currentCardImages || currentCardImages.length === 0) {
			return;
		}
		setCards(shuffleArray([...currentCardImages]));
		setMatchedCards([]);
		setFlippedCards([]);
		setFailedAttempts(0);
		setTimer(0);
		setTimerActive(false);
		setInitialRevealActive(true);
		setCurrentSfxAudioIndex(0);
		setIsSavingGame(false);
		setMouseDisabled(true);

		const revealDuration = 1200;
		const flipBackDuration = 600;
		const totalInitialDelay = revealDuration + flipBackDuration;

		setTimeout(() => {
			setInitialRevealActive(false);
		}, revealDuration);

		setTimeout(() => {
			if (!isInitialSetup || (isInitialSetup && cards.length > 0)) {
				setTimerActive(true);
			}
			setMouseDisabled(false);
		}, totalInitialDelay);
	};

	const handleBackButton = () => {
		if (
			timerActive &&
			cards.length > 0 &&
			matchedCards.length < currentCardImages.length
		) {
			setExitModalOpen(true);
		} else {
			navigate("/play");
		}
	};

	const handleModalYes = async () => {
		setExitModalOpen(false);
		setTimerActive(false);
		if (
			userID &&
			!isSavingGame &&
			cards.length > 0 &&
			matchedCards.length < currentCardImages.length &&
			difficultyConfig
		) {
			setIsSavingGame(true);
			await saveGameDataToApi({
				userID,
				gameDate: new Date(),
				failed: failedAttempts,
				difficulty: capitalizeFirstLetter(difficultyConfig.name),
				completed: 0,
				timeTaken: timer,
			});
			setIsSavingGame(false);
		}
		navigate("/play");
	};

	const handleModalNo = () => setExitModalOpen(false);

	useEffect(() => {
		if (isLoadingConfig || !userID || !difficultyConfig) return;
		handleNewGame(true);

		if (!bgAudioRef.current) {
			bgAudioRef.current = new Audio(gameBgMusic);
			bgAudioRef.current.loop = true;
		}
		const audio = bgAudioRef.current;
		const playMusicOnInteraction = () => {
			if (audio.paused) {
				audio.volume = bgVolume / 100;
				audio
					.play()
					.catch((error) => console.error("BG Audio play error:", error));
				setMusicStarted(true);
			}
		};
		document.addEventListener("click", playMusicOnInteraction, { once: true });
		document.addEventListener("keydown", playMusicOnInteraction, {
			once: true,
		});
		return () => {
			document.removeEventListener("click", playMusicOnInteraction);
			document.removeEventListener("keydown", playMusicOnInteraction);
			if (bgAudioRef.current) {
				bgAudioRef.current.pause();
				bgAudioRef.current.currentTime = 0;
			}
		};
	}, [userID, difficultyKey, difficultyConfig, isLoadingConfig, bgVolume]);

	useEffect(() => {
		let intervalId;
		if (timerActive) {
			intervalId = setInterval(() => setTimer((prev) => prev + 1), 1000);
		}
		return () => clearInterval(intervalId);
	}, [timerActive]);

	useEffect(() => {
		if (
			isLoadingConfig ||
			!userID ||
			!difficultyConfig ||
			flippedCards.length !== 2
		)
			return;
		setMouseDisabled(true);
		const [card1, card2] = flippedCards;
		setTimeout(() => {
			if (card1.image === card2.image) {
				setMatchedCards((prev) => [...prev, card1.id, card2.id]);
				if (
					currentMatchAudioFiles &&
					currentSfxAudioIndex < currentMatchAudioFiles.length
				) {
					if (!sfxAudioRef.current) sfxAudioRef.current = new Audio();
					sfxAudioRef.current.src =
						currentMatchAudioFiles[currentSfxAudioIndex];
					sfxAudioRef.current.volume = sfxVolume / 100;
					sfxAudioRef.current
						.play()
						.catch((e) => console.error("SFX play error:", e));
					setCurrentSfxAudioIndex((prevIndex) => prevIndex + 1);
				}
			} else {
				setFailedAttempts((prev) => prev + 1);
			}
			setFlippedCards([]);
			setMouseDisabled(false);
		}, 800);
	}, [
		flippedCards,
		currentSfxAudioIndex,
		sfxVolume,
		userID,
		currentMatchAudioFiles,
		difficultyConfig,
		isLoadingConfig,
	]);

	useEffect(() => {
		if (
			isLoadingConfig ||
			!userID ||
			!difficultyConfig ||
			isSavingGame ||
			!currentCardImages ||
			currentCardImages.length === 0
		)
			return;

		if (matchedCards.length === currentCardImages.length) {
			setTimerActive(false);
			if (!sfxAudioRef.current) sfxAudioRef.current = new Audio();
			sfxAudioRef.current.src = globalCongratsAudio;
			sfxAudioRef.current.volume = sfxVolume / 100;
			sfxAudioRef.current
				.play()
				.catch((e) => console.error("Congrats audio error:", e));
			const saveDataAndNavigate = async () => {
				setIsSavingGame(true);
				try {
					await saveGameDataToApi({
						userID,
						gameDate: new Date(),
						failed: failedAttempts,
						difficulty: capitalizeFirstLetter(difficultyConfig.name),
						completed: 1,
						timeTaken: timer,
					});
					setTimeout(() => navigate(difficultyConfig.congratsRoute), 1200);
				} catch (error) {
					console.error("Error saving completed game data:", error);
					setIsSavingGame(false);
				}
			};
			saveDataAndNavigate();
		}
	}, [
		matchedCards,
		currentCardImages,
		cards.length,
		navigate,
		sfxVolume,
		failedAttempts,
		timer,
		userID,
		difficultyConfig,
		isSavingGame,
		isLoadingConfig,
	]);

	const handleCardClick = (card) => {
		if (
			mouseDisabled ||
			flippedCards.length === 2 ||
			matchedCards.includes(card.id) ||
			flippedCards.some((c) => c.id === card.id)
		) {
			return;
		}
		setFlippedCards((prev) => [...prev, card]);
	};

	if (isLoadingConfig || !userID || !difficultyConfig) {
		return (
			<StyledGameContainer>
				<CircularProgress color="secondary" size={60} />
				<Typography
					variant="h5"
					sx={{
						fontFamily: '"Press Start 2P", cursive',
						mt: 2,
						color: "white",
					}}
				>
					Loading Game...
				</Typography>
			</StyledGameContainer>
		);
	}

	return (
		<StyledGameContainer mouseDisabled={mouseDisabled}>
			<InfoBar>
				<GameInfoButton onClick={handleBackButton}>Back</GameInfoButton>
				<InfoBoxItem className="timer">Timer: {timer}s</InfoBoxItem>
				<InfoBoxItem>Learning: {failedAttempts}</InfoBoxItem>
			</InfoBar>

			<GameContent>
				<Grid
					container
					spacing={gridContainerSpacing}
					justifyContent="center"
					alignItems="center"
					sx={{
						width: "100%",
						maxWidth: isSmallScreen ? "95vw" : "90vw",
						margin: 0,
						padding: 0,
					}}
				>
					{cards.map((card) => (
						<Grid
							item
							xs={gridItemSize}
							key={card.id}
							display="flex"
							justifyContent="center"
							alignItems="center"
							sx={{ padding: isSmallScreen ? "4px" : "8px" }}
						>
							<CardContainer
								cardwidth={cardDimensions.width}
								cardheight={cardDimensions.height}
							>
								<Card
									card={card}
									handleClick={() => handleCardClick(card)}
									flipped={
										initialRevealActive ||
										flippedCards.some((c) => c.id === card.id) ||
										matchedCards.includes(card.id)
									}
									matched={matchedCards.includes(card.id)}
									cardImageStyle={cardImageStyle}
									cardFrontImageStyle={cardFrontImageStyle}
								/>
							</CardContainer>
						</Grid>
					))}
				</Grid>
			</GameContent>

			<FooterBar>
				<GameInfoButton
					onClick={() => handleNewGame(false)}
					variant="contained"
				>
					New Game
				</GameInfoButton>
			</FooterBar>

			<Modal
				open={exitModalOpen}
				onClose={handleModalNo}
				aria-labelledby="exit-game-modal-title"
			>
				<StyledModalBox>
					<Typography
						id="exit-game-modal-title"
						variant="h6"
						sx={{ fontFamily: '"Press Start 2P", cursive', mb: 2 }}
					>
						Quit Game?
					</Typography>
					<Typography
						variant="body2"
						sx={{
							fontFamily: '"Press Start 2P", cursive',
							fontSize: "0.7rem",
							mb: 3,
						}}
					>
						Progress will be saved as incomplete.
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "space-around", gap: 2 }}>
						<ModalButton onClick={handleModalYes}>Yes</ModalButton>
						<ModalButton onClick={handleModalNo}>No</ModalButton>
					</Box>
				</StyledModalBox>
			</Modal>
		</StyledGameContainer>
	);
};

export default MemoryCardGame;
