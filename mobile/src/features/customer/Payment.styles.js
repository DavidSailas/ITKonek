import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20
  },
  headerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 2, color: '#666' },
  scrollBody: { padding: 25 },
  
  // Processing State
  processingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  processingText: { fontSize: 18, fontWeight: '700', marginTop: 20, color: '#111' },
  subProcessingText: { fontSize: 12, color: '#888', marginTop: 5 },

  // GCash UI
  gcashBanner: { backgroundColor: '#007DFF', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  gcashLogo: { color: '#FFF', fontSize: 22, fontWeight: '900', italic: 'italic' },
  
  amountCard: { alignItems: 'center', marginBottom: 25, padding: 25, backgroundColor: '#F0F7FF', borderRadius: 20, borderWidth: 1, borderColor: '#D0E4FF' },
  label: { fontSize: 10, color: '#007DFF', fontWeight: '800', marginBottom: 8 },
  amount: { fontSize: 40, fontWeight: '900', color: '#111' },
  refText: { fontSize: 11, color: '#888', marginTop: 5, fontWeight: '600' },

  instructionCard: { flexDirection: 'row', gap: 12, padding: 15, backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 30 },
  instructionText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 18 },

  qrContainer: { alignItems: 'center' },
  qrFrame: { padding: 15, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 2, borderColor: '#007DFF' },
  qrHint: { fontSize: 12, color: '#AAA', marginTop: 15, fontWeight: '700' },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  gcashButton: { backgroundColor: '#007DFF', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  gcashButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});