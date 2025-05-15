import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosConfig";
import {
	TextField,
	Button,
	Typography,
	Paper,
	Link as MuiLink,
	Box,
	Avatar,
	InputAdornment,
	CircularProgress,
	Divider,
	Alert,
	Fade,
	LinearProgress,
	IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import {
	PersonAddOutlined,
	Person,
	Lock,
	HowToReg,
	CheckCircle,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import backgroundGif from "../../assets/images/play.gif";

const BackgroundContainer = styled(Box)(({ theme }) => ({
	minHeight: "100vh",
	width: "100%",
	backgroundImage: `url(${backgroundGif})`,
	backgroundPosition: "center",
	backgroundSize: "cover",
	backgroundRepeat: "no-repeat",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: theme.spacing(2),
	overflow: "hidden",
}));

const GameTitle = styled(Typography)(() => ({
	fontFamily: '"Orbitron", sans-serif',
	fontSize: "clamp(2.5rem, 8vw, 4rem)",
	color: "#ffcc00",
	textShadow: "0 0 10px #ffcc00, 0 0 20px #ffaa00",
	animation: "pulseTitle 3s infinite",
	textAlign: "center",
	marginBottom: "2rem",
	"@keyframes pulseTitle": {
		"0%": { textShadow: "0 0 10px #ffcc00, 0 0 20px #ffaa00" },
		"50%": {
			textShadow: "0 0 15px #ffcc00, 0 0 30px #ffaa00, 0 0 40px #ff8800",
		},
		"100%": { textShadow: "0 0 10px #ffcc00, 0 0 20px #ffaa00" },
	},
}));

const FormContainer = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3, 4),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	width: "100%",
	maxWidth: "450px",
	borderRadius: "15px",
	backgroundColor: "rgba(44, 44, 84, 0.85)",
	backdropFilter: "blur(5px)",
	border: "2px solid #00d9ff",
	boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
	[theme.breakpoints.down("sm")]: {
		padding: theme.spacing(2, 2),
	},
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
	margin: theme.spacing(1),
	width: 70,
	height: 70,
	backgroundColor: "rgba(0, 217, 255, 0.2)",
	border: "2px solid #00d9ff",
	boxShadow: "0 0 15px rgba(0, 217, 255, 0.5)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	"& .MuiInputBase-root": {
		borderRadius: "10px",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		border: "1px solid rgba(0, 217, 255, 0.3)",
		color: "#fff",
		transition: "all 0.3s ease",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.1)",
			borderColor: "rgba(0, 217, 255, 0.5)",
		},
		"&.Mui-focused": {
			borderColor: "#00d9ff",
			boxShadow: "0 0 10px rgba(0, 217, 255, 0.3)",
		},
	},
	"& .MuiInputLabel-root": {
		color: "rgba(255, 255, 255, 0.7)",
		fontFamily: '"Orbitron", sans-serif',
		"&.Mui-focused": {
			color: "#00d9ff",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		borderColor: "transparent",
	},
	"& .MuiInputAdornment-root .MuiSvgIcon-root": {
		color: "rgba(0, 217, 255, 0.7)",
	},
	"& .MuiFormHelperText-root": {
		color: "#ff6b6b",
		fontFamily: '"Press Start 2P", cursive',
		fontSize: "0.6rem",
		marginTop: "4px",
	},
}));

const SubmitButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(3),
	marginBottom: theme.spacing(2),
	padding: theme.spacing(1.5, 2),
	borderRadius: "10px",
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.9rem",
	textTransform: "none",
	background: "linear-gradient(90deg, #4a4e69, #22223b)",
	border: "2px solid #00d9ff",
	color: "#fff",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 217, 255, 0.3)",
	transition: "all 0.3s ease",
	"&:hover": {
		background: "linear-gradient(90deg, #6c757d, #343a40)",
		transform: "translateY(-3px)",
		boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 217, 255, 0.4)",
	},
	"&:active": {
		transform: "translateY(1px)",
	},
	"&.Mui-disabled": {
		backgroundColor: "rgba(44, 44, 84, 0.5)",
		borderColor: "rgba(0, 217, 255, 0.3)",
		color: "rgba(255, 255, 255, 0.5)",
	},
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
	margin: theme.spacing(2, 0),
	"&::before, &::after": {
		borderColor: "rgba(0, 217, 255, 0.3)",
	},
	"& .MuiDivider-wrapper": {
		color: "rgba(255, 255, 255, 0.7)",
		fontFamily: '"Press Start 2P", cursive',
		fontSize: "0.7rem",
	},
}));

const StyledLink = styled(MuiLink)(({ theme }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.7rem",
	color: "#00d9ff",
	textDecoration: "none",
	transition: "all 0.3s ease",
	"&:hover": {
		color: "#ffffff",
		textShadow: "0 0 8px rgba(0, 217, 255, 0.8)",
	},
}));

const FooterText = styled(Typography)(({ theme }) => ({
	marginTop: theme.spacing(4),
	color: "rgba(255, 255, 255, 0.7)",
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.6rem",
	textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
}));

const PasswordStrengthContainer = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(1),
	marginBottom: theme.spacing(2),
	padding: theme.spacing(1.5),
	borderRadius: "10px",
	backgroundColor: "rgba(0, 0, 0, 0.2)",
	border: "1px solid rgba(0, 217, 255, 0.2)",
}));

const PasswordStrengthLabel = styled(Typography)(({ color }) => ({
	fontFamily: '"Press Start 2P", cursive',
	fontSize: "0.6rem",
	color:
		color === "error" ? "#ff6b6b" : color === "warning" ? "#ffcc00" : "#4caf50",
}));

const StyledLinearProgress = styled(LinearProgress)(({ color }) => ({
	height: 8,
	borderRadius: 4,
	backgroundColor: "rgba(255, 255, 255, 0.1)",
	"& .MuiLinearProgress-bar": {
		borderRadius: 4,
		backgroundColor:
			color === "error"
				? "#ff6b6b"
				: color === "warning"
				? "#ffcc00"
				: "#4caf50",
	},
}));

const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [touched, setTouched] = useState({
		username: false,
		password: false,
		confirmPassword: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();

	const hoverSoundRef = useRef(null);
	const clickSoundRef = useRef(null);

	useEffect(() => {
		hoverSoundRef.current = new Audio("/audio/button-hover.mp3");
		clickSoundRef.current = new Audio("/audio/button-click.mp3");

		if (hoverSoundRef.current) hoverSoundRef.current.volume = 0.3;
		if (clickSoundRef.current) clickSoundRef.current.volume = 0.3;

		return () => {
			if (hoverSoundRef.current) hoverSoundRef.current.pause();
			if (clickSoundRef.current) clickSoundRef.current.pause();
		};
	}, []);

	const playHoverSound = () => {
		if (hoverSoundRef.current) {
			hoverSoundRef.current.currentTime = 0;
			hoverSoundRef.current
				.play()
				.catch((error) => console.error("Hover sound playback failed:", error));
		}
	};

	const playClickSound = () => {
		if (clickSoundRef.current) {
			clickSoundRef.current.currentTime = 0;
			clickSoundRef.current
				.play()
				.catch((error) => console.error("Click sound playback failed:", error));
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (error) setError("");
		if (message) setMessage("");
	};

	const handleBlur = (field) => {
		setTouched({ ...touched, [field]: true });
	};

	const calculatePasswordStrength = (password) => {
		if (!password) return 0;

		let strength = 0;

		if (password.length >= 6) strength += 25;
		if (password.length >= 10) strength += 15;

		if (/[A-Z]/.test(password)) strength += 15;
		if (/[0-9]/.test(password)) strength += 15;
		if (/[^A-Za-z0-9]/.test(password)) strength += 15;
		if (/[a-z]/.test(password)) strength += 15;

		return Math.min(100, strength);
	};

	const getPasswordStrengthColor = (strength) => {
		if (strength < 30) return "error";
		if (strength < 60) return "warning";
		return "success";
	};

	const getPasswordStrengthLabel = (strength) => {
		if (strength < 30) return "Weak";
		if (strength < 60) return "Fair";
		if (strength < 80) return "Good";
		return "Strong";
	};

	const passwordStrength = calculatePasswordStrength(formData.password);
	const passwordStrengthColor = getPasswordStrengthColor(passwordStrength);
	const passwordStrengthLabel = getPasswordStrengthLabel(passwordStrength);

	const getFieldError = (field) => {
		if (!touched[field]) return false;

		if (field === "username" && !formData.username) {
			return "Username is required";
		}

		if (field === "password") {
			if (!formData.password) return "Password is required";
			if (formData.password.length < 6)
				return "Password must be at least 6 characters";
		}

		if (field === "confirmPassword") {
			if (!formData.confirmPassword) return "Please confirm your password";
			if (formData.password !== formData.confirmPassword)
				return "Passwords do not match";
		}

		return false;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		playClickSound();
		setMessage("");
		setError("");

		setTouched({
			username: true,
			password: true,
			confirmPassword: true,
		});

		if (!formData.username || !formData.password || !formData.confirmPassword) {
			setError("All fields are required.");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}

		setLoading(true);
		try {
			const response = await apiClient.post("/api/users/register", {
				username: formData.username,
				password: formData.password,
			});

			setMessage(response.data.message + " You can now log in.");
			setFormData({ username: "", password: "", confirmPassword: "" });
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (err) {
			if (err.response && err.response.data && err.response.data.errors) {
				const messages = err.response.data.errors.map((e) => e.msg).join(" ");
				setError(messages || "Registration failed. Please try again.");
			} else if (
				err.response &&
				err.response.data &&
				err.response.data.message
			) {
				setError(err.response.data.message);
			} else {
				setError("Registration failed. An unexpected error occurred.");
				console.error("Registration error:", err);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleTogglePasswordVisibility = () => {
		playClickSound();
		setShowPassword((prev) => !prev);
	};

	const handleToggleConfirmPasswordVisibility = () => {
		playClickSound();
		setShowConfirmPassword((prev) => !prev);
	};

	const handleLoginClick = () => {
		playClickSound();
		navigate("/login");
	};

	return (
		<BackgroundContainer>
			<GameTitle variant="h1">WonderCards</GameTitle>

			<FormContainer elevation={6}>
				<StyledAvatar>
					<PersonAddOutlined fontSize="large" sx={{ color: "#00d9ff" }} />
				</StyledAvatar>

				<Typography
					component="h1"
					variant="h5"
					sx={{
						fontFamily: '"Orbitron", sans-serif',
						fontWeight: 600,
						color: "#fff",
						mb: 1,
						textShadow: "0 0 10px rgba(0, 217, 255, 0.5)",
					}}
				>
					Create Account
				</Typography>

				<Typography
					variant="body2"
					sx={{
						fontFamily: '"Press Start 2P", cursive',
						fontSize: "0.7rem",
						color: "rgba(255, 255, 255, 0.7)",
						mb: 3,
						textAlign: "center",
					}}
				>
					Join the WonderCards adventure
				</Typography>

				{error && (
					<Fade in={!!error}>
						<Alert
							severity="error"
							sx={{
								width: "100%",
								mb: 2,
								backgroundColor: "rgba(211, 47, 47, 0.2)",
								color: "#ff6b6b",
								border: "1px solid #ff6b6b",
								"& .MuiAlert-icon": {
									color: "#ff6b6b",
								},
								fontFamily: '"Press Start 2P", cursive',
								fontSize: "0.7rem",
							}}
							onClose={() => setError("")}
						>
							{error}
						</Alert>
					</Fade>
				)}

				{message && (
					<Fade in={!!message}>
						<Alert
							severity="success"
							sx={{
								width: "100%",
								mb: 2,
								backgroundColor: "rgba(76, 175, 80, 0.2)",
								color: "#4caf50",
								border: "1px solid #4caf50",
								"& .MuiAlert-icon": {
									color: "#4caf50",
								},
								fontFamily: '"Press Start 2P", cursive',
								fontSize: "0.7rem",
							}}
							icon={<CheckCircle fontSize="inherit" />}
						>
							{message}
						</Alert>
					</Fade>
				)}

				<Box
					component="form"
					onSubmit={handleSubmit}
					noValidate
					sx={{ width: "100%" }}
				>
					<StyledTextField
						variant="outlined"
						required
						fullWidth
						id="username"
						label="Username"
						name="username"
						autoComplete="username"
						autoFocus
						value={formData.username}
						onChange={handleChange}
						onBlur={() => handleBlur("username")}
						error={!!getFieldError("username")}
						helperText={getFieldError("username") || ""}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Person />
								</InputAdornment>
							),
						}}
					/>

					<StyledTextField
						variant="outlined"
						required
						fullWidth
						name="password"
						label="Password"
						type={showPassword ? "text" : "password"}
						id="password"
						autoComplete="new-password"
						value={formData.password}
						onChange={handleChange}
						onBlur={() => handleBlur("password")}
						error={!!getFieldError("password")}
						helperText={getFieldError("password") || ""}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleTogglePasswordVisibility}
										onMouseEnter={playHoverSound}
										edge="end"
										sx={{ color: "rgba(0, 217, 255, 0.7)" }}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					{formData.password && (
						<PasswordStrengthContainer>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									mb: 1,
								}}
							>
								<Typography
									variant="caption"
									sx={{
										fontFamily: '"Press Start 2P", cursive',
										fontSize: "0.6rem",
										color: "rgba(255, 255, 255, 0.7)",
									}}
								>
									Password Strength
								</Typography>
								<PasswordStrengthLabel color={passwordStrengthColor}>
									{passwordStrengthLabel}
								</PasswordStrengthLabel>
							</Box>
							<StyledLinearProgress
								variant="determinate"
								value={passwordStrength}
								color={passwordStrengthColor}
							/>
						</PasswordStrengthContainer>
					)}

					<StyledTextField
						variant="outlined"
						required
						fullWidth
						name="confirmPassword"
						label="Confirm Password"
						type={showConfirmPassword ? "text" : "password"}
						id="confirmPassword"
						autoComplete="new-password"
						value={formData.confirmPassword}
						onChange={handleChange}
						onBlur={() => handleBlur("confirmPassword")}
						error={!!getFieldError("confirmPassword")}
						helperText={getFieldError("confirmPassword") || ""}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle confirm password visibility"
										onClick={handleToggleConfirmPasswordVisibility}
										onMouseEnter={playHoverSound}
										edge="end"
										sx={{ color: "rgba(0, 217, 255, 0.7)" }}
									>
										{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<SubmitButton
						type="submit"
						fullWidth
						disabled={loading}
						onMouseEnter={playHoverSound}
						endIcon={!loading && <HowToReg />}
					>
						{loading ? (
							<CircularProgress size={24} sx={{ color: "#00d9ff" }} />
						) : (
							"Create Account"
						)}
					</SubmitButton>

					<StyledDivider>OR</StyledDivider>

					<Box sx={{ textAlign: "center", mt: 1 }}>
						<StyledLink
							component="button"
							onClick={handleLoginClick}
							onMouseEnter={playHoverSound}
						>
							Already have an account? Sign in
						</StyledLink>
					</Box>
				</Box>
			</FormContainer>

			<FooterText>
				© {new Date().getFullYear()} WonderCards. All rights reserved.
			</FooterText>
		</BackgroundContainer>
	);
};

export default Register;
