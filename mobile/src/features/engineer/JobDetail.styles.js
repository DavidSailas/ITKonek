import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  headerTitle: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },

  scrollBody: { padding: 20, paddingBottom: 100 },

  statusBanner: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E9ECEF'
  },
  statusLabel: { fontSize: 10, color: '#888', fontWeight: '700', marginBottom: 5 },
  statusValue: { fontSize: 20, fontWeight: '900', color: '#111' },

  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#AAA', marginBottom: 15, letterSpacing: 0.5 },

  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  clientAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '700', color: '#111' },
  clientAddress: { fontSize: 13, color: '#666', marginTop: 2 },
  callButton: {
    backgroundColor: '#111',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  detailBox: { backgroundColor: '#FBFBFB', padding: 20, borderRadius: 15 },
  serviceTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 10 },
  descriptionText: { fontSize: 14, color: '#444', lineHeight: 20 },
  issueImage: { width: '100%', height: 200, borderRadius: 12, marginTop: 15 },

  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paymentText: { fontSize: 14, color: '#666', flex: 1 },
  urgencyTag: { 
    fontSize: 10, 
    fontWeight: '800', 
    backgroundColor: '#FEE2E2', 
    color: '#EF4444', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  mainActionBtn: {
    backgroundColor: '#1565C0',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  
  completedBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    height: 55 
  },
  completedText: { fontSize: 16, fontWeight: '700', color: '#4CAF50' },
  terminalContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  terminalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#666',
    marginBottom: 20,
    letterSpacing: 2
  },
  qrCard: {
    backgroundColor: '#F9F9F9',
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  terminalAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111',
    marginTop: 20
  },
  terminalSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  priceModal: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center'
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#111',
    paddingBottom: 5,
    marginBottom: 30
  },
  currencyLabel: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 10
  },
  priceInput: {
    fontSize: 32,
    fontWeight: '800',
    width: '60%',
    color: '#111'
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15
  },
  cancelBtn: {
    flex: 1,
    padding: 15,
    alignItems: 'center'
  },
  cancelBtnText: {
    fontWeight: '700',
    color: '#666'
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  confirmBtnText: {
    color: '#FFF',
    fontWeight: '700'
  }
});