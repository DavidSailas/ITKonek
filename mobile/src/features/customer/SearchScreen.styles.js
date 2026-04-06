import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  userLocationContainer: { alignItems: 'center', justifyContent: 'center' },
  userDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#2ECC71', borderWidth: 2, borderColor: '#FFF', elevation: 5 },
  userPulse: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(46, 204, 113, 0.15)' },
  
  markerWrapper: { alignItems: 'center', justifyContent: 'center' },
  markerPin: { backgroundColor: '#004D4D', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', elevation: 4 },
  markerPinActive: { backgroundColor: '#111', borderColor: '#2ECC71', borderWidth: 3 },

  overlayHeader: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, width: '100%', paddingHorizontal: 20, zIndex: 10 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, height: 55, elevation: 10, shadowOpacity: 0.1, shadowRadius: 10 },
  searchInput: { flex: 1, paddingHorizontal: 15, fontSize: 14, color: '#111' },
  filterBtn: { backgroundColor: '#111', padding: 10, borderRadius: 10, marginRight: 8 },

  quickViewContainer: { position: 'absolute', bottom: 100, width: width, paddingHorizontal: 20, zIndex: 20 },
  quickViewCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 16, alignItems: 'center', elevation: 15, shadowOpacity: 0.1, shadowRadius: 15 },
  quickAvatar: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#F3F4F6' },
  quickTextGroup: { flex: 1, marginLeft: 16 },
  quickName: { fontSize: 16, fontWeight: '800', color: '#111' },
  quickService: { fontSize: 13, color: '#004D4D', fontWeight: '700', marginTop: 2 },
  quickStats: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  quickRating: { fontSize: 12, fontWeight: '800', color: '#111', marginLeft: 4 },
  quickDistance: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  quickAction: { backgroundColor: '#111', width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: height * 0.75, paddingHorizontal: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  closeBtn: { backgroundColor: '#F3F4F6', padding: 8, borderRadius: 12 },
  modalTitle: { fontSize: 14, fontWeight: '800', color: '#111', textTransform: 'uppercase', letterSpacing: 1 },
  
  profileHero: { alignItems: 'center', marginTop: 10, marginBottom: 24 },
  largeAvatar: { width: 100, height: 100, borderRadius: 30, backgroundColor: '#F3F4F6', marginBottom: 16 },
  heroName: { fontSize: 24, fontWeight: '800', color: '#111' },
  heroService: { fontSize: 14, color: '#004D4D', fontWeight: '700', marginTop: 4 },
  
  heroStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: '#F9FAFB', paddingVertical: 15, borderRadius: 20, width: '100%' },
  heroStatItem: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 18, fontWeight: '800', color: '#111' },
  heroStatLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },

  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 10 },
  sectionText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skillTag: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 8, marginBottom: 8 },
  skillTagText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  
  bookActionBtn: { backgroundColor: '#111', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 40 },
  bookActionText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});