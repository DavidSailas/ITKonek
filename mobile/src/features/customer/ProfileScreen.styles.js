import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subViewContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  saveText: { color: '#000', fontWeight: '800', fontSize: 16 },
  
  profileHero: { alignItems: 'center', paddingVertical: 30 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#EEE' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#000', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#FFF' },
  userName: { fontSize: 24, fontWeight: '900', marginTop: 15, letterSpacing: -0.8 },
  userEmail: { fontSize: 14, color: '#888', marginTop: 4, fontWeight: '500' },

  statsContainer: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F0F0F0', elevation: 4, shadowColor: '#000', shadowOffset: {width:0, height:4}, shadowOpacity: 0.05, shadowRadius: 10 },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F0F0F0' },
  statNum: { fontSize: 22, fontWeight: '900', color: '#000' },
  statLabel: { fontSize: 11, color: '#AAA', fontWeight: '800', textTransform: 'uppercase', marginTop: 4, letterSpacing: 0.5 },

  section: { marginTop: 35, paddingHorizontal: 25 },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#BBB', textTransform: 'uppercase', marginBottom: 20, letterSpacing: 1.2 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F9F9F9', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  menuLabel: { fontSize: 16, fontWeight: '700', color: '#000' },
  menuSubLabel: { fontSize: 12, color: '#AAA', marginTop: 3, fontWeight: '500' },

  formContainer: { padding: 25 },
  inputLabel: { fontSize: 11, fontWeight: '900', color: '#000', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#FBFBFB', borderRadius: 14, padding: 18, fontSize: 15, borderWidth: 1, borderColor: '#F0F0F0', color: '#000' },
  
  genderRow: { flexDirection: 'row', gap: 12, marginTop: 5, marginBottom: 20 },
  genderBtn: { flex: 1, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', backgroundColor: '#FBFBFB' },
  genderActive: { backgroundColor: '#000', borderColor: '#000' },
  genderBtnText: { fontWeight: '800', color: '#AAA' },
  genderTextActive: { color: '#FFF' },

  // MODAL OVERLAYS
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  
  // CENTER MODAL (SECURITY)
  modalContainer: { width: '100%' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 30, padding: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  modalSub: { fontSize: 13, color: '#888', marginTop: 2, fontWeight: '500' },
  primaryBtnFull: { backgroundColor: '#000', padding: 20, borderRadius: 18, alignItems: 'center', marginTop: 10, width: '100%' },
  primaryBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },

  // PROFESSIONAL BOTTOM SHEET
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, paddingBottom: Platform.OS === 'ios' ? 50 : 30, width: '100%' },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#EEE', borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
  sheetTitleCenter: { fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 25, letterSpacing: -0.5 },
  sheetActionContainer: { width: '100%' },
  sheetActionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 8, backgroundColor: '#FAFAFA' },
  sheetActionIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: '#F0F0F0' },
  sheetActionText: { fontSize: 16, fontWeight: '700', color: '#000' },
  sheetDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10, marginHorizontal: 10 },

  // SUCCESS STATE
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '900' },
  successSub: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 8 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, backgroundColor: '#FFF4F4', marginHorizontal: 25, padding: 20, borderRadius: 18 },
  logoutText: { color: '#FF3B30', fontWeight: '900', marginLeft: 10, fontSize: 16 },
  versionText: { textAlign: 'center', color: '#EEE', fontSize: 12, marginTop: 30, fontWeight: '800' },
  signOutHeader: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  signOutIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  signOutTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  signOutSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 30,
  },
  signOutActionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 10,
  },
  signOutCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutCancelText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 15,
  },
  signOutConfirmBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutConfirmText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },
});