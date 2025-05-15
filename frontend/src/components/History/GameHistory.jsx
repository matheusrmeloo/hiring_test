import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	CircularProgress,
	Chip,
	IconButton,
	TablePagination,
	useMediaQuery,
	useTheme,
	Card,
	CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import RefreshIcon from "@mui/icons-material/Refresh";
import apiClient from "../../api/axiosConfig";
import gameBackground from "../../assets/images/mode1.gif";

const StyledGameContainer = styled(Box)(({ theme }) => ({
	height: "100vh",
	width: "100vw",
	display: "flex",
	flexDirection: "column",
	backgroundImage: `url(${gameBackground})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	position: "relative",
	padding: 0,
	margin: 0,
	overflow: "hidden",
	boxSizing: "border-box",
}));

const GameHeader = styled(Box)(({ theme }) => ({
	position: "relative",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	padding: "16px",
	zIndex: 10,
	[theme.breakpoints.down("sm")]: {
		padding: "8px",
	},
}));

const GameTitle = styled(Typography)(({ theme }) => ({
	fontFamily: '"Orbitron", sans-serif',
	fontSize: "clamp(2rem, 5vw, 3rem)",
	color: "#ffcc00",
	textShadow: "0 0 10px #ffcc00, 0 0 20px #ffaa00",
	textAlign: "center",
	marginBottom: theme.spacing(2),
	[theme.breakpoints.down("sm")]: {
		fontSize: "clamp(1.5rem, 5vw, 2rem)",
		marginBottom: theme.spacing(1),
	},
}));

const GameContent = styled(Box)(({ theme }) => ({
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: theme.spacing(2),
	overflow: "hidden",
	[theme.breakpoints.down("sm")]: {
		padding: theme.spacing(1),
	},
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	maxHeight: "calc(100vh - 220px)",
	backgroundColor: "rgba(44, 44, 84, 0.85)",
	backdropFilter: "blur(5px)",
	borderRadius: "15px",
	border: "2px solid #00d9ff",
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
	"&::-webkit-scrollbar": {
		width: "8px",
	},
	"&::-webkit-scrollbar-track": {
		background: "rgba(0, 0, 0, 0.2)",
		borderRadius: "4px",
	},
	"&::-webkit-scrollbar-thumb": {
		background: "#00d9ff",
		borderRadius: "4px",
	},
	[theme.breakpoints.down("sm")]: {
		maxHeight: "calc(100vh - 180px)",
	},
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.7rem",
	color: "#fff",
	borderBottom: "1px solid rgba(0, 217, 255, 0.3)",
	padding: "8px 16px",
	[theme.breakpoints.down("sm")]: {
		padding: "6px 8px",
		fontSize: "0.6rem",
	},
}));

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
	backgroundColor: "rgba(0, 0, 0, 0.4)",
	color: "#00d9ff",
	fontWeight: "bold",
	textTransform: "uppercase",
	fontSize: "0.7rem",
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.6rem",
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
	},
	"&:hover": {
		backgroundColor: "rgba(0, 217, 255, 0.1)",
		cursor: "pointer",
	},
	transition: "background-color 0.2s",
}));

const StyledChip = styled(Chip)(({ theme, difficulty }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.6rem",
	fontWeight: "bold",
	color: "#fff",
	backgroundColor:
		difficulty === "Easy"
			? "rgba(76, 175, 80, 0.8)"
			: difficulty === "Normal"
			? "rgba(255, 152, 0, 0.8)"
			: "rgba(244, 67, 54, 0.8)",
	border: "1px solid",
	borderColor:
		difficulty === "Easy"
			? "#4caf50"
			: difficulty === "Normal"
			? "#ff9800"
			: "#f44336",
	boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.5rem",
		height: "24px",
	},
}));

const StyledButton = styled(Button)(({ theme }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.7rem",
	backgroundColor: "rgba(44, 44, 84, 0.8)",
	color: "#fff",
	border: "2px solid #00d9ff",
	borderRadius: "8px",
	padding: "8px 16px",
	margin: theme.spacing(1),
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
	"&:hover": {
		backgroundColor: "rgba(64, 64, 122, 0.9)",
		borderColor: "#00aaff",
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.6rem",
		padding: "6px 12px",
	},
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	backgroundColor: "rgba(44, 44, 84, 0.8)",
	color: "#fff",
	border: "2px solid #00d9ff",
	margin: theme.spacing(0.5),
	"&:hover": {
		backgroundColor: "rgba(64, 64, 122, 0.9)",
		borderColor: "#00aaff",
	},
}));

const StatsCard = styled(Card)(({ theme }) => ({
	backgroundColor: "rgba(44, 44, 84, 0.85)",
	backdropFilter: "blur(5px)",
	borderRadius: "15px",
	border: "2px solid #00d9ff",
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
	color: "#fff",
	margin: theme.spacing(1),
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		width: "calc(50% - 16px)",
	},
	[theme.breakpoints.up("md")]: {
		width: "calc(25% - 16px)",
	},
}));

const StatsCardContent = styled(CardContent)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: theme.spacing(2),
	"&:last-child": {
		paddingBottom: theme.spacing(2),
	},
}));

const StatsValue = styled(Typography)(({ theme }) => ({
	fontFamily: '"Orbitron", sans-serif',
	fontSize: "1.5rem",
	fontWeight: "bold",
	color: "#00d9ff",
	marginTop: theme.spacing(1),
	[theme.breakpoints.down("sm")]: {
		fontSize: "1.2rem",
	},
}));

const StatsLabel = styled(Typography)(({ theme }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.7rem",
	color: "#fff",
	marginTop: theme.spacing(1),
	textAlign: "center",
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.6rem",
	},
}));

const GameHistory = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const [gameHistory, setGameHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [stats, setStats] = useState({
		totalGames: 0,
		completedGames: 0,
		bestTime: Number.POSITIVE_INFINITY,
		winRate: 0,
	});

	const fetchGameHistory = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await apiClient.get("/api/memory/history");
			setGameHistory(response.data);
			calculateStats(response.data);
		} catch (err) {
			console.error("Error fetching game history:", err);
			setError("Failed to load game history. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const calculateStats = (data) => {
		if (!data || data.length === 0) {
			setStats({
				totalGames: 0,
				completedGames: 0,
				bestTime: 0,
				winRate: 0,
			});
			return;
		}

		const completedGames = data.filter((game) => game.completed === 1);
		const completedWithTime = completedGames.filter(
			(game) => game.timeTaken > 0,
		);
		const bestTime =
			completedWithTime.length > 0
				? Math.min(...completedWithTime.map((game) => game.timeTaken))
				: 0;

		setStats({
			totalGames: data.length,
			completedGames: completedGames.length,
			bestTime: bestTime === Number.POSITIVE_INFINITY ? 0 : bestTime,
			winRate:
				data.length > 0
					? Math.round((completedGames.length / data.length) * 100)
					: 0,
		});
	};

	useEffect(() => {
		fetchGameHistory();
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(Number.parseInt(event.target.value, 10));
		setPage(0);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	const formatTime = (seconds) => {
		if (!seconds || seconds === 0) return "N/A";
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<StyledGameContainer>
			<GameHeader>
				<StyledIconButton
					onClick={() => navigate("/play")}
					aria-label="Back to menu"
				>
					<HomeIcon />
				</StyledIconButton>
				<GameTitle>Game History</GameTitle>
				<StyledIconButton onClick={fetchGameHistory} aria-label="Refresh">
					<RefreshIcon />
				</StyledIconButton>
			</GameHeader>

			<GameContent>
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						width: "100%",
						mb: 2,
					}}
				>
					<StatsCard>
						<StatsCardContent>
							<SportsEsportsIcon sx={{ fontSize: 36, color: "#00d9ff" }} />
							<StatsValue>{stats.totalGames}</StatsValue>
							<StatsLabel>Total Games</StatsLabel>
						</StatsCardContent>
					</StatsCard>

					<StatsCard>
						<StatsCardContent>
							<EmojiEventsIcon sx={{ fontSize: 36, color: "#ffcc00" }} />
							<StatsValue>{stats.completedGames}</StatsValue>
							<StatsLabel>Completed</StatsLabel>
						</StatsCardContent>
					</StatsCard>

					<StatsCard>
						<StatsCardContent>
							<AccessTimeIcon sx={{ fontSize: 36, color: "#00d9ff" }} />
							<StatsValue>{formatTime(stats.bestTime)}</StatsValue>
							<StatsLabel>Best Time</StatsLabel>
						</StatsCardContent>
					</StatsCard>

					<StatsCard>
						<StatsCardContent>
							<EmojiEventsIcon sx={{ fontSize: 36, color: "#ffcc00" }} />
							<StatsValue>{stats.winRate}%</StatsValue>
							<StatsLabel>Win Rate</StatsLabel>
						</StatsCardContent>
					</StatsCard>
				</Box>

				{loading ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "50vh",
						}}
					>
						<CircularProgress size={60} sx={{ color: "#00d9ff" }} />
					</Box>
				) : error ? (
					<Box
						sx={{
							backgroundColor: "rgba(244, 67, 54, 0.8)",
							padding: 2,
							borderRadius: 2,
							textAlign: "center",
							maxWidth: "80%",
						}}
					>
						<Typography
							sx={{
								fontFamily: '"Press Start 2P", cursive',
								fontSize: "0.8rem",
								color: "#fff",
							}}
						>
							{error}
						</Typography>
						<StyledButton onClick={fetchGameHistory} sx={{ mt: 2 }}>
							Try Again
						</StyledButton>
					</Box>
				) : gameHistory.length === 0 ? (
					<Box
						sx={{
							backgroundColor: "rgba(44, 44, 84, 0.85)",
							padding: 3,
							borderRadius: 2,
							textAlign: "center",
							maxWidth: "80%",
							border: "2px solid #00d9ff",
						}}
					>
						<Typography
							sx={{
								fontFamily: '"Press Start 2P", cursive',
								fontSize: "0.8rem",
								color: "#fff",
							}}
						>
							No game history found. Start playing to see your results here!
						</Typography>
						<StyledButton onClick={() => navigate("/play")} sx={{ mt: 2 }}>
							Play Now
						</StyledButton>
					</Box>
				) : (
					<>
						<StyledTableContainer component={Paper}>
							<Table
								stickyHeader
								aria-label="game history table"
								size={isSmallScreen ? "small" : "medium"}
							>
								<TableHead>
									<TableRow>
										<StyledTableHeadCell>Date</StyledTableHeadCell>
										<StyledTableHeadCell>Difficulty</StyledTableHeadCell>
										<StyledTableHeadCell>Status</StyledTableHeadCell>
										<StyledTableHeadCell>Time</StyledTableHeadCell>
										<StyledTableHeadCell>Mistakes</StyledTableHeadCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{gameHistory
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((game) => (
											<StyledTableRow key={game._id}>
												<StyledTableCell>
													{formatDate(game.gameDate)}
												</StyledTableCell>
												<StyledTableCell>
													<StyledChip
														label={game.difficulty}
														difficulty={game.difficulty}
														size={isSmallScreen ? "small" : "medium"}
													/>
												</StyledTableCell>
												<StyledTableCell>
													<Chip
														label={
															game.completed === 1 ? "Completed" : "Abandoned"
														}
														size={isSmallScreen ? "small" : "medium"}
														sx={{
															backgroundColor:
																game.completed === 1
																	? "rgba(76, 175, 80, 0.8)"
																	: "rgba(158, 158, 158, 0.8)",
															color: "#fff",
															fontFamily: '"Press Start 2P", cursive',
															fontSize: isSmallScreen ? "0.5rem" : "0.6rem",
														}}
													/>
												</StyledTableCell>
												<StyledTableCell>
													{formatTime(game.timeTaken)}
												</StyledTableCell>
												<StyledTableCell>{game.failed}</StyledTableCell>
											</StyledTableRow>
										))}
								</TableBody>
							</Table>
						</StyledTableContainer>

						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={gameHistory.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							sx={{
								fontFamily: '"Press Start 2P", cursive',
								color: "#fff",
								"& .MuiTablePagination-selectIcon": { color: "#00d9ff" },
								"& .MuiTablePagination-select": { color: "#fff" },
								"& .MuiTablePagination-selectLabel": { color: "#fff" },
								"& .MuiTablePagination-displayedRows": { color: "#fff" },
								"& .MuiIconButton-root": {
									color: "#00d9ff",
									"&.Mui-disabled": { color: "rgba(0, 217, 255, 0.3)" },
								},
							}}
						/>
					</>
				)}
			</GameContent>
		</StyledGameContainer>
	);
};

export default GameHistory;
