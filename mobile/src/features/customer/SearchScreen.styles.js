import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = (size) => (SCREEN_WIDTH / 408) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / 906) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapWrapper: { ...StyleSheet.absoluteFillObject },
  mapImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },

  /* Pins & Markers */
  engineerMarkerContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  markerPin: {
    backgroundColor: '#004D4D',
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  markerPinActive: {
    backgroundColor: '#111', // Professional black switch
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    borderColor: '#2ECC71', // Subtle green active ring
    borderWidth: 3,
    elevation: 10,
  },
  pulseRing: { position: 'absolute', width: 0, height: 0 },
  pulseRingActive: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: 'rgba(46, 204, 113, 0.15)', // Soft green glow
  },
  markerLabel: {
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  markerLabelText: { fontSize: moderateScale(10), fontWeight: '800', color: '#333' },

  /* User Location */
  userLocation: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  userDot: { width: scale(16), height: scale(16), borderRadius: 8, backgroundColor: '#2ECC71', borderWidth: 3, borderColor: '#fff' },
  userPulse: { position: 'absolute', width: scale(44), height: scale(44), borderRadius: 22, backgroundColor: 'rgba(46, 204, 113, 0.2)' },

  /* Search Header */
  overlayHeader: { position: 'absolute', top: Platform.OS === 'ios' ? verticalScale(50) : StatusBar.currentHeight + 10, width: '100%', paddingHorizontal: scale(20), zIndex: 10 },
  searchBarContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    height: verticalScale(55), 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchInput: { flex: 1, paddingHorizontal: 15, fontSize: moderateScale(15), color: '#111' },
  filterBtn: { backgroundColor: '#111', padding: 10, borderRadius: 10, marginRight: 8 },

  /* Floating Card */
  quickViewContainer: { position: 'absolute', bottom: verticalScale(110), width: SCREEN_WIDTH, paddingHorizontal: scale(20), zIndex: 100 },
  quickViewCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: scale(20),
    padding: scale(15),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 12,
  },
  quickAvatar: { width: scale(60), height: scale(60), borderRadius: scale(12), backgroundColor: '#F8F9FA' },
  quickTextGroup: { flex: 1, marginLeft: scale(15) },
  quickName: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#111' },
  quickService: { fontSize: moderateScale(13), color: '#008080', fontWeight: '600', marginVertical: 2 },
  quickStats: { flexDirection: 'row', alignItems: 'center' },
  quickRating: { fontSize: moderateScale(12), fontWeight: 'bold', marginLeft: 4 },
  quickJobs: { fontSize: moderateScale(12), color: '#888', marginLeft: 5 },
  quickAction: { backgroundColor: '#111', width: scale(40), height: scale(40), borderRadius: scale(10), justifyContent: 'center', alignItems: 'center' },
});