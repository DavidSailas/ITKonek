import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions from your phone (408 x 906)
const guidelineBaseWidth = 408;
const guidelineBaseHeight = 906;

const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  /* FIXED HEADER */
  header: {
    backgroundColor: '#111',
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(25),
    // Use StatusBar height to ensure it fits notches/dynamic islands
    paddingTop: Platform.OS === 'ios' ? verticalScale(50) : (StatusBar.currentHeight || 0) + verticalScale(10),
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
  },
  notificationWrapper: {
    backgroundColor: '#fff',
    padding: scale(10),
    borderRadius: scale(12),
  },
  notificationDot: {
    position: 'absolute',
    top: scale(10),
    right: scale(12),
    width: scale(8),
    height: scale(8),
    backgroundColor: '#FF3B30',
    borderRadius: scale(4),
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: scale(15),
    marginTop: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    height: verticalScale(50),
  },
  searchInput: {
    marginLeft: scale(10),
    flex: 1,
    fontSize: moderateScale(14),
  },
  /* BODY */
  body: {
    padding: scale(20),
    paddingBottom: verticalScale(120),
  },
  /* CATEGORY CHIPS */
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    borderRadius: scale(12),
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryText: { 
    fontSize: moderateScale(13), 
    fontWeight: '600', 
    color: '#555' 
  },
  /* SERVICE CARD */
  serviceCard: {
    backgroundColor: '#111',
    borderRadius: scale(20),
    padding: scale(20),
    marginBottom: verticalScale(25),
  },
  serviceLabel: { color: '#888', fontSize: moderateScale(12), marginBottom: verticalScale(4) },
  ticket: { color: '#fff', fontWeight: 'bold', fontSize: moderateScale(14), marginBottom: verticalScale(15) },
  serviceRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: scale(45), height: scale(45), borderRadius: scale(22.5), marginRight: scale(12) },
  serviceTitle: { color: '#fff', fontWeight: 'bold', fontSize: moderateScale(16) },
  serviceSub: { color: '#aaa', fontSize: moderateScale(13) },
  /* QUICK ACTIONS */
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(25),
  },
  actionItem: { alignItems: 'center' },
  actionCircle: {
    width: scale(55),
    height: scale(55),
    backgroundColor: '#fff',
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: { fontSize: moderateScale(12), fontWeight: '500', color: '#333' },
  /* SECTIONS */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  sectionTitle: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#111' },
  seeAll: { color: '#888', fontSize: moderateScale(13) },
  /* CAROUSEL */
  gridItem: {
    width: SCREEN_WIDTH * 0.45,
    height: verticalScale(140),
    backgroundColor: '#000',
    borderRadius: scale(20),
    marginRight: scale(15),
    overflow: 'hidden',
  },
  gridImage: { width: '100%', height: '100%', position: 'absolute', opacity: 0.7 },
  gridOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'flex-end', padding: scale(15) },
  gridItemText: { color: '#fff', fontWeight: 'bold', fontSize: moderateScale(14) },
  /* TECH CARDS */
  techCard: {
    backgroundColor: '#fff',
    padding: scale(15),
    borderRadius: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    elevation: 1,
  },
  techImage: { width: scale(50), height: scale(50), borderRadius: scale(15), marginRight: scale(15) },
  techName: { fontSize: moderateScale(15), fontWeight: 'bold', color: '#111' },
  techSub: { fontSize: moderateScale(12), color: '#888' },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F0F0', 
    padding: scale(5), 
    borderRadius: scale(8) 
  },
  ratingText: { marginLeft: scale(4), fontSize: moderateScale(12), fontWeight: 'bold' },
  /* TRUST BANNER */
  trustBanner: {
    backgroundColor: '#E3F2FD',
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(20),
    borderRadius: scale(20),
    marginTop: verticalScale(10),
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  trustTitle: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#111' },
  trustSub: { fontSize: moderateScale(12), color: '#555' },
});

export default styles;