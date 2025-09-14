import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import { MdCreateNewFolder } from "react-icons/md";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);
	const { totalItems } = useSelector((state) => state.cart);
	const location = useLocation();

	const [subLinks, setSubLinks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isCatalogOpen, setIsCatalogOpen] = useState(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await apiConnector("GET", categories.CATEGORIES_API);
				const safeData =
					res?.data?.data?.map((cat) => ({
						...cat,
						courses: Array.isArray(cat?.courses) ? cat.courses : [],
					})) || [];

				console.log("res ", res);
				setSubLinks(safeData);
			} catch (error) {
				console.log("Could not fetch Categories.", error);
			}
			setLoading(false);
		})();
	}, []);

	const matchRoute = (route) => {
		return matchPath({ path: route }, location.pathname);
	};

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMobileMenuOpen(false);
		setIsCatalogOpen(false);
	}, [location.pathname]);

	return (
		<div
			className={`flex flex-col border-b border-b-richblack-700 ${
				location.pathname !== "/" ? "bg-richblack-800" : ""
			} transition-all duration-200`}
		>
			{/* Navbar Top Row */}
			<div className="flex h-14 w-11/12 max-w-maxContent items-center justify-between mx-auto">
				{/* Logo */}
				<div>
					<Link to="/">
						<img
							src={logo}
							alt="Logo"
							width={160}
							height={32}
							loading="lazy"
						/>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:block">
					<ul className="flex gap-x-6 text-richblack-25">
						{NavbarLinks.map((link, index) => (
							<li key={index}>
								{link.title === "Catalog" ? (
									<div
										className={`group relative flex cursor-pointer items-center gap-1 ${
											matchRoute("/catalog/:catalogName")
												? "text-yellow-25"
												: "text-richblack-25"
										}`}
									>
										<p>{link.title}</p>
										<BsChevronDown />
										{/* Dropdown */}
										<div className="invisible absolute left-1/2 top-[50%] z-[1000] flex w-[200px] -translate-x-1/2 translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
											{loading ? (
												<p className="text-center">Loading...</p>
											) : subLinks?.length > 0 ? (
												subLinks
													.filter(
														(subLink) =>
															subLink?.courses?.length > 0
													)
													.map((subLink, i) => (
														<Link
															to={`/catalog/${subLink.name
																.split(" ")
																.join("-")
																.toLowerCase()}`}
															className="rounded-lg bg-transparent py-2 pl-2 hover:bg-richblack-50"
															key={i}
														>
															{subLink.name}
														</Link>
													))
											) : (
												<p className="text-center">
													No Courses Found
												</p>
											)}
										</div>
									</div>
								) : (
									<Link to={link?.path}>
										<p
											className={`${
												matchRoute(link?.path)
													? "text-yellow-25"
													: "text-richblack-25"
											}`}
										>
											{link.title}
										</p>
									</Link>
								)}
							</li>
						))}
					</ul>
				</nav>

				{/* Desktop Right Side */}
				<div className="hidden items-center gap-x-4 md:flex">
					{user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
						<Link to="/dashboard/cart" className="relative">
							<AiOutlineShoppingCart className="text-2xl text-richblack-100" />
							{totalItems > 0 && (
								<span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
									{totalItems}
								</span>
							)}
						</Link>
					)}

					{user && user?.accountType === ACCOUNT_TYPE.ADMIN && (
						<Link to="/dashboard/createCategory" className="relative">
							<span className="text-white flex gap-1 justify-center items-center">
								<MdCreateNewFolder size={20} /> create category
							</span>
						</Link>
					)}

					{token === null && (
						<>
							<Link to="/login">
								<button className="rounded border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
									Log in
								</button>
							</Link>
							<Link to="/signup">
								<button className="rounded border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100">
									Sign up
								</button>
							</Link>
						</>
					)}
					{token !== null && <ProfileDropdown />}
				</div>

				{/* Mobile Menu Button */}
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="md:hidden text-richblack-100"
				>
					<AiOutlineMenu fontSize={24} />
				</button>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMobileMenuOpen && (
				<div className="flex flex-col gap-4 bg-richblack-900 p-4 text-richblack-25 md:hidden">
					{NavbarLinks.map((link, index) => (
						<div key={index}>
							{link.title === "Catalog" ? (
								<div>
									{/* Catalog toggle button */}
									<button
										onClick={() => setIsCatalogOpen(!isCatalogOpen)}
										className="flex w-full items-center justify-between font-semibold"
									>
										<span>Catalog</span>
										<BsChevronDown
											className={`transition-transform ${
												isCatalogOpen ? "rotate-180" : "rotate-0"
											}`}
										/>
									</button>

									{/* Catalog dropdown */}
									{isCatalogOpen && (
										<div className="ml-4 mt-2 flex flex-col gap-2">
											{loading ? (
												<p>Loading...</p>
											) : subLinks?.length > 0 ? (
												subLinks
													.filter(
														(subLink) =>
															subLink?.courses?.length > 0
													)
													.map((subLink, i) => (
														<Link
															key={i}
															to={`/catalog/${subLink.name
																.split(" ")
																.join("-")
																.toLowerCase()}`}
															className="hover:text-yellow-25"
														>
															{subLink.name}
														</Link>
													))
											) : (
												<p>No Courses Found</p>
											)}
										</div>
									)}
								</div>
							) : (
								<Link to={link.path} className="hover:text-yellow-25">
									{link.title}
								</Link>
							)}
						</div>
					))}

					{/* Auth / Cart Section */}
					<div className="mt-4 flex flex-col gap-3">
						{user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
							<Link
								to="/dashboard/cart"
								className="flex items-center gap-2"
							>
								<AiOutlineShoppingCart className="text-xl" />
								<span>Cart ({totalItems})</span>
							</Link>
						)}

						{user && user?.accountType === ACCOUNT_TYPE.ADMIN && (
							<Link
								to="/dashboard/createCategory"
								className="flex items-center gap-2"
							>
								<span className="text-white flex gap-1 justify-center items-center">
									<MdCreateNewFolder size={20} /> create category
								</span>
							</Link>
						)}

						{token === null && (
							<>
								<Link to="/login" className="hover:text-yellow-25">
									Log in
								</Link>
								<Link to="/signup" className="hover:text-yellow-25">
									Sign up
								</Link>
							</>
						)}
						{token !== null && <ProfileDropdown />}
					</div>
				</div>
			)}
		</div>
	);
}

export default Navbar;
