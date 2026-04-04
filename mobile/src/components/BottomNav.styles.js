import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions from your phone
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
    // Higher container to account for the "popping" active circle
    height: verticalScale(100), 
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },

  contentHolder: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    // Add extra padding at bottom for iPhone "notches" (Safe Area)
    height: Platform.OS === 'ios' ? verticalScale(85) : verticalScale(70),
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(5),
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH / 4,
  },

  activeCircle: {
    position: 'absolute',
    // Moves the circle up proportionally
    top: verticalScale(-30),
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
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
    fontSize: moderateScale(11),
    color: '#fff',
    fontWeight: '600',
    // Ensures the label stays below the circle
    marginTop: verticalScale(40),
  },

  inactiveLabel: {
    fontSize: moderateScale(11),
    color: '#aaa',
    marginTop: verticalScale(4),
  },
});