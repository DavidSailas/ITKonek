import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const horizontalScale = (size) => (width / 408) * size;
const verticalScale = (size) => (height / 906) * size;
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { marginTop: 15, fontSize: 14, color: '#666', fontWeight: '500' },
  
  headerOverlay: { position: 'absolute', top: verticalScale(50), left: horizontalScale(20), zIndex: 10 },
  backBtn: {
    backgroundColor: '#FFF', width: moderateScale(44), height: moderateScale(44),
    borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },

  userLocationContainer: { alignItems: 'center', justifyContent: 'center' },
  userDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#2196F3', borderWidth: 2, borderColor: '#FFF' },

  engineerMarkerWrapper: { alignItems: 'center' },
  engineerMarkerPin: {
    backgroundColor: '#111', width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF',
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5,
  },
  markerLabel: { backgroundColor: '#111', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  markerLabelText: { fontSize: 8, fontWeight: 'bold', color: '#FFF' },

  infoCard: {
    position: 'absolute', bottom: 0, width: width,
    backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 25,
  },
  pullBar: { width: 40, height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusLabel: { fontSize: 11, color: '#166534', fontWeight: '800', textTransform: 'uppercase' },
  etaBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  etaText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  
  mainTitle: { fontSize: 24, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  subTitle: { fontSize: 14, color: '#6B7280', marginTop: 6, lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },

  profileSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 20, marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#EEE' },
  profileText: { flex: 1, marginLeft: 12 },
  nameText: { fontSize: 16, fontWeight: '700', color: '#111' },
  specialtyText: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  callCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },

  actionGrid: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', flex: 1, height: 52, borderRadius: 16 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', flex: 1, height: 52, borderRadius: 16 },
  btnText: { marginLeft: 8, fontWeight: '700', color: '#1F2937' },
  
  messageBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', width: '100%', height: 58, borderRadius: 20 },
  messageBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16, marginLeft: 10 },

  // PROFESSIONAL MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  professionalModal: { backgroundColor: '#FFF', width: '100%', borderRadius: 28, padding: 30, alignItems: 'center' },
  noBookingIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 10 },
  modalSubText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  benefitList: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  benefitText: { fontSize: 11, fontWeight: '600', color: '#065F46', marginLeft: 5 },
  primaryActionBtn: { backgroundColor: '#111', width: '100%', height: 58, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  primaryActionText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 },
  textOnlyBtn: { marginTop: 20, padding: 10 },
  textOnlyBtnLabel: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },

  // CANCELLATION MODAL STYLES (Existing)
  modalContent: { backgroundColor: '#FFF', width: '100%', borderRadius: 32, padding: 28, alignItems: 'center' },
  modalIconBg: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  keepBtn: { backgroundColor: '#111', width: '100%', height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  keepBtnText: { color: '#FFF', fontWeight: '700' },
  confirmCancelBtn: { marginTop: 20, padding: 10 },
  confirmCancelText: { color: '#DC2626', fontWeight: '600' },
});