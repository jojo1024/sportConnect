import { Dimensions } from "react-native";
import { COLORS } from "./colors";
const { width, height } = Dimensions.get('screen');

export const SIZES = {
	fontLg: 16,
	font: 14,
	fontSm: 13,
	fontXs: 12,

	//radius
	radius_sm: 8,
	radius: 12,
	radius_md: 18,

	//space
	padding: 15,
	margin: 15,

	//Font Sizes
	h1: 40,
	h2: 28,
	h3: 24,
	h4: 20,
	h5: 18,
	h6: 16,

	//App dimensions
	width,
	height,

};
export const FONTS = {

	fontPoppins: { fontFamily: 'Poppins-SemiBold' },
	fontNunito: { fontFamily: 'NunitoSans-Regular' },

	fontLg: { fontSize: SIZES.fontLg, color: COLORS.text, lineHeight: 20, fontFamily: 'NunitoSans-Bold' },
	font: { fontSize: SIZES.font, color: COLORS.text, lineHeight: 20, fontFamily: 'NunitoSans-Regular' },
	fontSm: { fontSize: SIZES.fontSm, color: COLORS.text, lineHeight: 18, fontFamily: 'NunitoSans-Regular' },
	fontXs: { fontSize: SIZES.fontXs, color: COLORS.text, lineHeight: 14, fontFamily: 'NunitoSans-Regular' },
	h1: { fontSize: SIZES.h1, color: COLORS.title, fontFamily: 'Poppins-SemiBold' },
	h2: { fontSize: SIZES.h2, color: COLORS.title, fontFamily: 'Poppins-SemiBold' },
	h3: { fontSize: SIZES.h3, color: COLORS.title, fontFamily: 'Poppins-SemiBold' },
	h4: { fontSize: SIZES.h4, color: COLORS.title, fontFamily: 'Poppins-SemiBold' },
	h5: { fontSize: SIZES.h5, color: COLORS.title, fontFamily: 'Poppins-SemiBold' },
	h6: { fontSize: SIZES.h6, color: COLORS.title, fontFamily: 'Poppins-SemiBold' },
	fontBold: { fontFamily: 'NunitoSans-Bold' },

}