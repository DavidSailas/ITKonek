import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /* MAP STYLES */
  mapWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  mapImage: {
    width: width,
    height: height,
  },
  engineerDot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 128, 128, 0.2)',
  },
  /* USER LOCATION (GREEN) */
  userLocation: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2ECC71', // Professional Green
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
  },
  userPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.25)',
  },

  /* ENGINEER MARKER (PROFESSIONAL TEAL/DARK) */
  engineerMarkerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    backgroundColor: '#004D4D', // Deep Professional Teal
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 77, 77, 0.3)',
    // In a real app, use Animated API to scale this
  },
  markerLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },

  /* FLOATING SEARCH BAR */
  overlayHeader: {
    position: 'absolute',
    top: 50,
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 55,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  filterBtn: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
  },

  /* ZOOM BUTTONS (MATCHING IMAGE) */
  zoomControls: {
    position: 'absolute',
    right: 20,
    top: height * 0.35,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 5,
    shadowOpacity: 0.1,
  },
  zoomBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomSeparator: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

/* BOTTOM RESULTS AREA */
  bottomSheet: {
    position: 'absolute',
    bottom: 80, // Above BottomNav
    width: '100%',
    maxHeight: height * 0.4, // Limit height so map is still visible
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  resultsTitle: {
    paddingHorizontal: 20,
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    width: '100%', // Take full width of container
    borderRadius: 20,
    padding: 15,
    marginBottom: 12, // Space between cards in the column
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowOpacity: 0.05,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#f9f9f9',
  },
  textGroup: {
    marginLeft: 15,
    flex: 1,
  },
  engineerName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#111',
  },
  engineerService: {
    color: '#008080',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
  },
  engineerDistance: {
    color: '#999',
    fontSize: 12,
  },
  bookBtn: {
    backgroundColor: '#111', // Professional dark button
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});