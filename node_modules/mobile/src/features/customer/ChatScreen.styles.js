import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const guidelineBaseWidth = 408;
const guidelineBaseHeight = 906;

export const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// The Dynamic Status Bar Fix
export const STATUSBAR_HEIGHT = Platform.OS === 'ios' 
  ? (SCREEN_HEIGHT > 736 ? 44 : 20) 
  : StatusBar.currentHeight || 0;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(12),
    // FIXED: This ensures the header is always exactly under the time/battery bar
    paddingTop: STATUSBAR_HEIGHT + verticalScale(8), 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    // Professional shadow for depth
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 100,
  },
  headerInfo: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: scale(12) 
  },
  avatar: { 
    width: scale(40), 
    height: scale(40), 
    borderRadius: scale(10), 
    marginRight: scale(12), 
    backgroundColor: '#EEE' 
  },
  userName: { 
    fontSize: moderateScale(16), 
    fontWeight: '800', 
    color: '#111' 
  },
  statusText: { 
    fontSize: moderateScale(11), 
    color: '#16A34A', 
    fontWeight: '700',
    marginTop: 2
  }, 
  callIcon: { 
    padding: scale(10), 
    backgroundColor: '#F9F9F9', 
    borderRadius: scale(20) 
  },
  listPadding: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  msgWrapper: { 
    marginBottom: verticalScale(15), 
    maxWidth: '85%' 
  },
  msgLeft: { alignSelf: 'flex-start' },
  msgRight: { alignSelf: 'flex-end' },
  bubble: { 
    padding: scale(14), 
    borderRadius: scale(20) 
  },
  customerBubble: { 
    backgroundColor: '#111', 
    borderBottomRightRadius: scale(4) 
  },
  engineerBubble: { 
    backgroundColor: '#F2F2F2', 
    borderBottomLeftRadius: scale(4) 
  },
  textWhite: { 
    color: '#FFF', 
    fontSize: moderateScale(15) 
  },
  textBlack: { 
    color: '#111', 
    fontSize: moderateScale(15) 
  },
  timeText: { 
    fontSize: moderateScale(10), 
    color: '#AAA', 
    marginTop: verticalScale(4) 
  },
  inputArea: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputAreaWithNav: {
    // This value ensures the text bar sits perfectly above your BottomNav
    paddingBottom: Platform.OS === 'ios' ? verticalScale(85) : verticalScale(90), 
  },
  searchStyleInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    height: verticalScale(52),
  },
  inputField: {
    flex: 1,
    fontSize: moderateScale(15),
    color: '#111',
    paddingVertical: Platform.OS === 'android' ? verticalScale(8) : 0,
  },
  actionBtn: {
    marginRight: scale(10)
  }
});