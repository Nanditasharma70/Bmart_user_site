/* eslint-disable react-hooks/exhaustive-deps */
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PaidIcon from "@mui/icons-material/Paid";
import {
	Button,
	Grid,
	Popover,
	Typography,
	alpha,
	useMediaQuery,
	useTheme,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
// import axios from "axios"; // Or use fetch
import ReferralApi from "api-manage/referralApi";
// import { ReferralApi } from "../api/ReferralApi";
import { Stack } from "@mui/system";
import { t } from "i18next";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useGetLoyaltyPointTransactionsList from "../../api-manage/hooks/react-query/loyalty-points/useGetLoyaltyPointTransactionList";
import useGetProfile from "../../api-manage/hooks/react-query/profile/useGetProfile";
import { setUser } from "../../redux/slices/profileInfo";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import TransactionHistory from "../transaction-history";
import HowToUse from "../wallet/HowToUse";
import TransactionHistoryMobile from "../wallet/TransactionHistoryMobile";
import WalletBoxComponent from "../wallet/WalletBoxComponent";
import trophy from "./assets/loyaltyimg.png";
import LoyaltyModal from "./loyalty-modal";

const LoyaltyPoints = (props) => {
	const { configData } = props;
	const [offset, setOffset] = useState(1);
	const [openModal, setOpenModal] = useState(false);
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("md"));
	const dispatch = useDispatch();
	const [openPopover, setOpenPopover] = useState(false);
	const anchorRef = useRef(null);
	const userOnSuccessHandler = (res) => {
		dispatch(setUser(res));
	};
	const { data: userData, refetch: profileRefetch } =
		useGetProfile(userOnSuccessHandler);
	let pageParams = { offset: offset };
	const { data, refetch, isLoading, isFetching } =
		useGetLoyaltyPointTransactionsList(pageParams);
	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		refetch();
	}, [offset]);

	const fetchData = async () => {
		await profileRefetch();
		await refetch();
	};
	const handleConvertCurrency = () => {
		setOpenModal(true);
	};
	// referrals states.......
	// const getReferralsData = async () => {
	// 	try {
	// 	  const response = await ReferralApi.fetchReferrals();
	// 	  if (response) {
	// 		// Process the referral data
	// 		console.log(response.data);
	// 	  }
	// 	} catch (error) {
	// 	  console.error("Failed to fetch referrals:", error);
	// 	}
	//   };

	//   // Call the function where needed
	//   getReferralsData();

	const [referrals, setReferrals] = useState([]);

	// Fetch referral data from the backend
	const fetchReferralsData = async () => {
		try {
			const response = await ReferralApi.fetchReferrals();
			console.log(response.referrals);

			if (response) {
				setReferrals(response.referrals); // Make sure you're accessing the correct part of the response
			}
		} catch (error) {
			console.error("Failed to fetch referrals:", error);
		}
	};

	// Use the effect hook to fetch referrals on component mount
	useEffect(() => {
		fetchReferralsData();
	}, []);

	const steps = [
		{
			label: "Convert your loyalty point to wallet money.",
		},
		{
			label: "Minimum 200 points required to convert into currency",
		},
	];

	// Static data for the table
	// const tableData = [
	// 	{ name: "John Doe", points: 1200, date: "2024-08-15", status: "Converted", level: "1" },
	// 	{ name: "Jane Smith", points: 800, date: "2024-08-14", status: "Pending", level: "3" },
	// 	{ name: "Alice Johnson", points: 1500, date: "2024-08-13", status: "Converted", level: "2" },
	// 	{ name: "Bob Brown", points: 950, date: "2024-08-12", status: "Pending", level: "4" },
	// 	{ name: "John Doe", points: 1200, date: "2024-08-15", status: "Converted", level: "5" },
	// 	{ name: "Jane Smith", points: 800, date: "2024-08-14", status: "Pending", level: "6" },
	// 	{ name: "Alice Johnson", points: 1500, date: "2024-08-13", status: "Converted", level: "7" },
	// 	{ name: "Bob Brown", points: 950, date: "2024-08-12", status: "Pending", level: "8" },
	// 	{ name: "John Doe", points: 1200, date: "2024-08-15", status: "Converted", level: "9" },
	// 	{ name: "Jane Smith", points: 800, date: "2024-08-14", status: "Pending", level: "10" }
	// ];

	return (
		<CustomStackFullWidth
			my={{ xs: "1rem", md: "2rem" }}
			alignItems="center"
			justifyContent="space-between"
			sx={{ height: "100%", minHeight: "60vh", alignItems: "center" }}
		>
			<Grid
				container
				pl={{ xs: "10px", md: "20px" }}
				pr={{ xs: "10px", md: "20px" }}
				justifyContent="space-between"
			>
				<Grid
					xs={12}
					md={4.5}
					align="left"
					borderRight={{
						xs: "none",
						md: `2px solid ${alpha(theme.palette.neutral[400], 0.3)}`,
					}}
				>
					<Stack spacing={{ xs: 2, md: 5 }}>
						{isSmall && (
							<Stack direction="row" justifyContent="space-between">
								<Typography
									textTransform="capitalize"
									fontWeight="700"
									fontSize="16px"
								>
									{t("Loyalty point")}
								</Typography>
								<InfoOutlinedIcon
									onClick={() => setOpenPopover(true)}
								/>
							</Stack>
						)}
						<WalletBoxComponent
							balance={userData?.loyalty_point}
							title={t("Total points")}
							image={trophy}
							handleConvertCurrency={handleConvertCurrency}
							isSmall={isSmall}
						/>
						{!isSmall && <HowToUse steps={steps} />}
						{isSmall && (
							<Stack alignItems="center">
								<Button
									variant="contained"
									startIcon={<PaidIcon />}
									// style={{ color: textColor }}

									sx={{
										borderRadius: "10px",
										width: "186px",
										fontSize: "12px",
									}}
									onClick={() => handleConvertCurrency()}
								>
									{t("Convert to Currency")}
								</Button>
							</Stack>
						)}
					</Stack>
				</Grid>

				<Grid
					item
					xs={12}
					md={7.5}
					paddingLeft={{ xs: "0px", sm: "30px", md: "60px" }}
				>
					{isSmall ? (
						<TransactionHistoryMobile
							data={data}
							isLoading={isLoading}
							page="loyalty"
							isFetching={isFetching}
							offset={offset}
							setOffset={setOffset}
						/>
					) : (
						<TransactionHistory
							data={data}
							isLoading={isLoading}
							page="loyalty"
							isFetching={isFetching}
							offset={offset}
							setOffset={setOffset}
						/>
					)}
				</Grid>
			</Grid>

			{/* Static Data Table */}
			{/* <TableContainer component={Paper} sx={{ marginTop: "1rem", boxShadow: 3 }}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow sx={{ backgroundColor: '#eda00c' }}>
						<TableCell sx={{ color: '#333', fontWeight: 'bold' }}>Referral Name</TableCell>
						<TableCell align="right" sx={{ color: '#333', fontWeight: 'bold' }}>Level</TableCell>
						<TableCell align="right" sx={{ color: '#333', fontWeight: 'bold' }}>Date</TableCell>
						<TableCell align="right" sx={{ color: '#333', fontWeight: 'bold' }}>Status</TableCell>
						<TableCell align="right" sx={{ color: '#333', fontWeight: 'bold' }}>Amounts</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{tableData.map((row, index) => (
						<TableRow
							key={index}
							sx={{
								'&:nth-of-type(odd)': { backgroundColor: '#FFF4E3' },
								'&:hover': { backgroundColor: '#ecd547' },
							}}
						>
							<TableCell component="th" scope="row" sx={{ color: '#555' }}>
								{row.name}
							</TableCell>
							<TableCell align="right" sx={{ color: '#555' }}>{row.level}</TableCell>
							<TableCell align="right" sx={{ color: '#555' }}>{new Date(row.date).toLocaleDateString()}</TableCell>
							<TableCell
								align="right"
								sx={{
									color: row.status === 'Pending' ? '#333' : '#FFF',
									fontWeight: 'bold',
									backgroundColor:
										row.status === 'Pending'
											? '#FFEB3B'
											: row.status === 'Converted'
											? '#4CAF50'
											: '#F44336', // Default for any other status (e.g., Rejected)
									borderRadius: '4px',
									padding: '4px 8px',
								}}
							>
								{row.status}
							</TableCell>
							<TableCell align="right" sx={{ color: '#555' }}>{row.points}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
 */}
 <TableContainer component={Paper} sx={{ marginTop: "1rem", boxShadow: 3 }}>
	<Table sx={{ minWidth: 650 }} aria-label="referral table">
		<TableHead>
			<TableRow sx={{ backgroundColor: '#4CAF50' }}>
				<TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Referral Name</TableCell>
				<TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Level</TableCell>
				<TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
				<TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
				<TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Amounts</TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{referrals.length > 0 ? (
				referrals.map((referral, index) => (
					<TableRow
						key={index}
						sx={{
							'&:nth-of-type(odd)': { backgroundColor: '#E8F5E9' },
							'&:hover': { backgroundColor: '#81C784' },
						}}
					>
						<TableCell component="th" scope="row" sx={{ color: '#2E7D32' }}>
							{referral.referral_name}
						</TableCell>
						<TableCell align="right" sx={{ color: '#2E7D32' }}>{referral.level}</TableCell>
						<TableCell align="right" sx={{ color: '#2E7D32' }}>{referral.date}</TableCell>
						<TableCell align="right" sx={{ color: '#2E7D32' }}>{referral.referral_status}</TableCell>
						<TableCell align="right" sx={{ color: '#2E7D32' }}>{referral.amount_received}</TableCell>
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell colSpan="5" align="center">
						No referrals found
					</TableCell>
				</TableRow>
			)}
		</TableBody>
	</Table>
</TableContainer>


			{openModal && (
				<LoyaltyModal
					configData={configData}
					theme={theme}
					t={t}
					openModal={openModal}
					handleClose={() => setOpenModal(false)}
					loyalitydata={userData?.loyalty_point}
					refetch={refetch}
					profileRefetch={profileRefetch}
				/>
			)}
			<Popover
				disableScrollLock={true}
				anchorEl={anchorRef}
				onClose={() => setOpenPopover(false)}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				keepMounted
				open={openPopover}
				PaperProps={{
					sx: {
						borderRadius: "0px",
						top: "244px !important",
						padding: "20px",
					},
				}}
				transitionDuration={2}
			>
				<Stack>
					<HowToUse steps={steps} />
				</Stack>
			</Popover>
		</CustomStackFullWidth>
	);
};

export default LoyaltyPoints;
