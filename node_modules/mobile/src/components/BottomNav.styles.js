import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const guidelineBaseWidth = 408;
const guidelineBaseHeight = 906;

export const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: verticalScale(100),
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  contentHolder: {
    flexDirection: 'row',
    width: SCREEN_WIDTH, // Strictly use the screen width
    height: Platform.OS === 'ios' ? verticalScale(85) : verticalScale(75),
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    // 'space-evenly' ensures Home and Profile aren't pushed against the screen edges
    justifyContent: 'space-evenly', 
    paddingHorizontal: scale(5), // Small buffer so icons don't touch the very edge
    paddingBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(5),
  },

  iconWrapper: {
    // We use a percentage-based width to ensure 5 items always fit (100 / 5 = 20)
    width: SCREEN_WIDTH / 5.2, 
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  activeCircle: {
    position: 'absolute',
    top: verticalScale(-25),
    width: scale(50), // Reduced from 54 to 50 for better 5-tab fit
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },

  label: {
    fontSize: moderateScale(8.5), // Slightly smaller font
    fontWeight: '700',
    marginTop: verticalScale(35),
    textAlign: 'center',
    width: '100%',
  },

  inactiveLabel: {
    fontSize: moderateScale(8.5),
    marginTop: verticalScale(4),
    textAlign: 'center',
    width: '100%',
  },
});