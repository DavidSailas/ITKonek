import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = (size) => (SCREEN_WIDTH / 408) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / 906) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  
  // HEADER
  header: {
    backgroundColor: '#0D0D0D',
    paddingTop: Platform.OS === 'ios' ? verticalScale(60) : (StatusBar.currentHeight || 0) + verticalScale(10),
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
    paddingBottom: verticalScale(30),
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: scale(25) 
  },
  userInfoRow: { flexDirection: 'row', alignItems: 'center' },
  profilePicWrapper: { position: 'relative' },
  profilePic: { width: scale(46), height: scale(46), borderRadius: scale(23), borderWidth: 1, borderColor: '#333' },
  profilePlaceholder: { 
    width: scale(46), height: scale(46), borderRadius: scale(23), 
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333'
  },
  profileLetter: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  onlineDot: { 
    width: 10, height: 10, borderRadius: 5, borderWidth: 2, 
    borderColor: '#0D0D0D', position: 'absolute', bottom: 0, right: 0 
  },
  nameContainer: { marginLeft: 12 },
  greeting: { color: '#666', fontSize: 8, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  engName: { color: '#FFF', fontSize: moderateScale(19), fontWeight: 'bold' },
  
  statusToggleContainer: { alignItems: 'center' },
  statusToggleText: { fontSize: 8, fontWeight: '900', marginTop: 4, letterSpacing: 1 },

  // SYSTEM BAR
  systemStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(25),
    marginTop: 15,
  },
  pulseDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 8 },
  systemStatusText: { color: '#4CAF50', fontSize: 10, fontWeight: '700', opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5 },

  // PERFORMANCE GRID (No Scroll)
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(25),
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#161616',
    width: (SCREEN_WIDTH - scale(50) - 20) / 3, // Perfect split for 3 cards
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'flex-start'
  },
  statHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statLabel: { color: '#555', fontSize: 8, fontWeight: '900', marginLeft: 4, letterSpacing: 0.5 },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  statSub: { color: '#333', fontSize: 8, fontWeight: '700', marginTop: 2, textTransform: 'uppercase' },

  // BODY
  body: { padding: scale(25), paddingBottom: verticalScale(120) },
  
  activeServiceWrapper: { 
    backgroundColor: '#FFF', borderRadius: 28, padding: 22, marginBottom: 25, 
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10 
  },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  liveText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  ticketId: { fontSize: 12, color: '#CCC', fontWeight: '700' },
  serviceMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  serviceInfo: { flex: 1 },
  mainServiceTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  techStatus: { fontSize: 13, color: '#777', marginTop: 4 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  locationText: { fontSize: 12, color: '#999', marginLeft: 8 },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusTagText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  trackButton: { backgroundColor: '#111', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: 20 },
  trackButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginRight: 10 },

  sectionHeader: { marginBottom: verticalScale(15) },
  sectionTitle: { fontSize: moderateScale(22), fontWeight: '900', color: '#111' },
  sectionSub: { fontSize: 13, color: '#999', marginTop: 4 },

  jobCard: { backgroundColor: '#FFF', borderRadius: scale(24), padding: scale(22), marginBottom: verticalScale(15), borderWidth: 1, borderColor: '#F0F0F0' },
  jobCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  jobCardTitle: { color: '#111', fontSize: 18, fontWeight: '800' },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  miniTag: { backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  miniTagText: { fontSize: 9, fontWeight: '800', color: '#888' },
  jobCardPrice: { color: '#111', fontSize: 14, fontWeight: '900', opacity: 0.5 }, // Changed from price to status
  jobDetailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 15 },
  jobDetailText: { fontSize: 13, color: '#777', marginLeft: 8 },
  jobCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { color: '#CCC', fontSize: 12 },
  acceptBtn: { backgroundColor: '#111', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 14 },
  acceptBtnText: { color: '#FFF', fontWeight: '900', fontSize: 13 },

  emptyHistory: { padding: scale(60), alignItems: 'center', backgroundColor: '#FFF', borderRadius: scale(24), borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD' },
  emptyHistoryText: { color: '#CCC', fontSize: moderateScale(14), marginTop: 15, fontWeight: '600' },
});